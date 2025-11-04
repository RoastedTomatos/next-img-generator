import { NextRequest, NextResponse } from 'next/server'
import { InferenceClient } from '@huggingface/inference'
import { createServerClient } from "@/lib/supabase/server";
import { GenerateImageRequest, GenerateImageResponse } from '@/lib/types'

const supabase = createServerClient();

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { prompt, width = 1024, height = 1024 } = body

    if (!prompt || !prompt.trim()) {
      return NextResponse.json<GenerateImageResponse>(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let imageUrl: string

    try {
      const client = new InferenceClient(process.env.HF_TOKEN)

      const imageResult = (await client.textToImage({
        provider: 'auto',
        model: 'black-forest-labs/FLUX.1-dev',
        inputs: prompt,
        parameters: { num_inference_steps: 8 },
      })) as Blob | string

      if (typeof imageResult === 'string') {
        imageUrl = imageResult.startsWith('data:')
          ? imageResult
          : `data:image/png;base64,${imageResult}`
      } else {
        const arrayBuffer = await imageResult.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        imageUrl = `data:image/png;base64,${base64}`
      }
    } catch (err) {
      console.error('Image generation failed, fallback used:', err)
      imageUrl = `https://placehold.co/${width}x${height}.png?text=${encodeURIComponent(
        'AI unavailable'
      )}`
    }

    const { data, error } = await supabase
      .from('generated_images')
      .insert({
        prompt,
        image_url: imageUrl,
        width,
        height,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json<GenerateImageResponse>(
        { success: false, error: 'Failed to save image' },
        { status: 500 }
      )
    }

    return NextResponse.json<GenerateImageResponse>({
      success: true,
      image: data,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json<GenerateImageResponse>(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

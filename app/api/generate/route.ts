import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { GenerateImageRequest, GenerateImageResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { prompt, width = 1024, height = 1024 } = body

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json<GenerateImageResponse>(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // TODO: Integrate with your AI image generation API (e.g., OpenAI DALL-E, Stability AI, etc.)
    // This is a placeholder that should be replaced with actual API call
    const imageUrl = `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(prompt)}`

    // Save to Supabase
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
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}


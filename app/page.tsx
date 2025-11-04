// app/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImageGenerator } from '@/components/image-generator'
import { GeneratedImage } from '@/lib/types'

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)

  const handleImageGenerated = (image: GeneratedImage) => {
    setGeneratedImage(image)
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
        <p className="text-muted-foreground">
          Create stunning AI-generated images
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col space-y-6">
          <ImageGenerator onImageGenerated={handleImageGenerated} />

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-white">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <h2 className="text-lg font-semibold mb-4">Generated Image</h2>
              {generatedImage ? (
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={generatedImage.image_url}
                    alt={generatedImage.prompt}
                    width={800}
                    height={800}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex w-full items-center justify-center h-48 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">
                    Your image will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GeneratedImage } from '@/lib/types'
import Image from 'next/image'

export function Gallery() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/images')
      
      if (!response.ok) {
        throw new Error('Failed to fetch images')
      }

      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
          <CardDescription>Your generated images</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
          <CardDescription>Your generated images</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
        <CardDescription>
          {images.length === 0 
            ? 'No images yet. Generate your first image!' 
            : `${images.length} image${images.length !== 1 ? 's' : ''}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Your generated images will appear here
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <Image
                    src={image.image_url}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium">{image.prompt}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


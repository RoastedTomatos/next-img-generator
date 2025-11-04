'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GeneratedImage } from '@/lib/types'
import ImageCard from '@/components/ImageCard'
import { deleteImage } from '@/utils/api'

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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    const prev = images
    setImages((s) => s.filter((img) => img.id !== id))
    try {
      await deleteImage(id)
    } catch (e) {
      setImages(prev)
      alert(e instanceof Error ? e.message : 'Delete failed')
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
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                id={image.id}
                prompt={image.prompt}
                imageUrl={image.image_url}
                onDelete={handleDelete}
                ratio="4:3"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


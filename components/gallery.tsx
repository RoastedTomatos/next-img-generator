'use client'

import { useEffect, useState } from 'react'
import { GeneratedImage } from '@/lib/types'
import ImageCard from '@/components/ImageCard'
import { deleteImage } from '@/utils/api'
import { motion } from 'framer-motion'
import { ImageIcon, Loader2 } from 'lucide-react'

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
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 className="h-8 w-8 text-purple-600" />
          </motion.div>
          <p className="text-muted-foreground">Loading your images...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border/50 bg-white">
              <div className="aspect-square animate-pulse bg-gradient-to-br from-purple-100 to-blue-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">Your Gallery</h2>
          <p className="text-muted-foreground mt-1">
            {images.length === 0 
              ? 'No images yet. Generate your first image!' 
              : `${images.length} image${images.length !== 1 ? 's' : ''} in your collection`
            }
          </p>
        </div>
      </motion.div>

      {images.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-purple-50/50 to-blue-50/50"
        >
          <div className="w-20 h-20 rounded-full gradient-soft flex items-center justify-center mb-6">
            <ImageIcon className="h-10 w-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your gallery is empty</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Start creating amazing AI-generated images and they'll appear here
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ImageCard
                id={image.id}
                prompt={image.prompt}
                imageUrl={image.image_url}
                onDelete={handleDelete}
                ratio="square"
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}


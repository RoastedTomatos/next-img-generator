'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GenerateImageRequest, GenerateImageResponse, GeneratedImage } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

type ImageGeneratorProps = {
  onImageGenerated?: (image: GeneratedImage) => void
}

export function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const requestBody: GenerateImageRequest = { prompt: prompt.trim() }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      const data: GenerateImageResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setSuccess(true)
      setPrompt('')

      if (onImageGenerated && data.image) {
        onImageGenerated(data.image)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative rounded-2xl border border-border/50 bg-white/80 blur-backdrop shadow-xl shadow-purple-500/10 p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-foreground">Describe your vision</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter a detailed prompt to generate stunning AI images
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="e.g., A beautiful sunset over mountains with a serene lake reflecting the colors..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) handleGenerate()
              }}
              disabled={loading}
              className="h-14 text-base pr-12 border-2 focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
            />
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-green-600 bg-green-50 p-3 rounded-lg"
              >
                Image generated successfully!
              </motion.p>
            )}
          </AnimatePresence>

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full h-12 gradient-primary hover:opacity-90 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                />
                Generating...
              </span>
            ) : (
              'Generate Image'
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

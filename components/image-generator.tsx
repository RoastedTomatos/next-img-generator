'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GenerateImageRequest, GenerateImageResponse } from '@/lib/types'

export function ImageGenerator() {
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
      const requestBody: GenerateImageRequest = {
        prompt: prompt.trim(),
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data: GenerateImageResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setSuccess(true)
      setPrompt('')
      
      // Refresh gallery after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Image</CardTitle>
        <CardDescription>
          Enter a prompt to generate an AI image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="e.g., A beautiful sunset over mountains"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleGenerate()
              }
            }}
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600">Image generated successfully!</p>
          )}
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </Button>
      </CardContent>
    </Card>
  )
}


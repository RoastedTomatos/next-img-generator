'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ImageGenerator } from '@/components/image-generator'
import { GeneratedImage } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, ImageIcon } from 'lucide-react'

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)

  const handleImageGenerated = (image: GeneratedImage) => {
    setGeneratedImage(image)
  }

  return (
    <main className="min-h-screen pt-16">
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full gradient-primary opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-60 -left-40 w-96 h-96 rounded-full bg-gray-500 dark:bg-gray-400 opacity-20 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_ease-in-out_infinite]">
                Create AI Images Instantly
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Transform your ideas into stunning visuals with the power of artificial intelligence. 
              Generate, explore, and share your creations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                asChild
                size="lg"
                className="gradient-primary hover:opacity-90 text-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/10 text-base px-8 h-12"
              >
                <Link href="#generate" className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Generate Image
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-border hover:bg-accent text-base px-8 h-12"
              >
                <Link href="/gallery" className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  View Gallery
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="generate" className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start max-w-7xl mx-auto">
          <div className="flex-1 w-full">
            <ImageGenerator onImageGenerated={handleImageGenerated} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 w-full lg:sticky lg:top-20"
          >
            <div className="rounded-2xl border border-border/50 bg-background/80 blur-backdrop shadow-xl shadow-black/5 dark:shadow-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Generated Image</h2>
              <AnimatePresence mode="wait">
                {generatedImage ? (
                  <motion.div
                    key={generatedImage.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-border/50"
                  >
                    <Image
                      src={generatedImage.image_url}
                      alt={generatedImage.prompt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {generatedImage.prompt}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-border"
                  >
                    <div className="w-16 h-16 rounded-full gradient-soft flex items-center justify-center mb-4">
                      <ImageIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center px-4">
                      Your generated image will appear here
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

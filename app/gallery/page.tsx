'use client'

import { Gallery } from "@/components/gallery"
import { motion } from "framer-motion"

export default function GalleryPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse and manage all your generated images
          </p>
        </motion.div>
        <Gallery />
      </div>
    </main>
  )
}
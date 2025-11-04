import { Gallery } from "@/components/gallery"

export default function GalleryPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground">
          Browse all your generated images
        </p>
      </div>
      <Gallery />
    </main>
  )
}
import { Gallery } from "@/components/gallery"
import { ImageGenerator } from "@/components/image-generator"

export default function Home() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
        <p className="text-muted-foreground">
          Create stunning AI-generated images and browse your gallery
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <ImageGenerator />
        </div>
        <div>
          <Gallery />
        </div>
      </div>
    </main>
  )
}


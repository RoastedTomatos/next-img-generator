import { Gallery } from "@/components/gallery"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GalleryPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-4">
        <h1 className="text-4xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground">
          Browse all your generated images
        </p>
      </div>
      <div className="flex mb-4">
        <Link href="/">
          <Button 
            className="w-[120px]"
            >
            Back</Button>
        </Link>
      </div>
      <Gallery />
    </main>
  )
}
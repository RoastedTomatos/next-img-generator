"use client"

import React, { forwardRef, useMemo, useState } from "react"
import Image from "next/image"
import Modal from "./Modal"
import { deleteImage as deleteImageApi } from "@/utils/api"
import { motion } from "framer-motion"
import { Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  id: string
  prompt: string
  imageUrl: string
  onDelete?: (id: string) => void
  ratio?: "square" | "4:3"
}

function isExternalUrl(url: string) {
  try {
    const u = new URL(url)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

const ImageCard = forwardRef<HTMLDivElement, Props>(function ImageCard(
  { id, prompt, imageUrl, onDelete, ratio = "square" },
  ref
) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const aspectClass = useMemo(() => {
    return ratio === "4:3" ? "aspect-[4/3]" : "aspect-square"
  }, [ratio])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const doDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this image?')) return
    setDeleting(true)
    setDeleteError(null)
    try {
      if (onDelete) {
        onDelete(id)
      } else {
        await deleteImageApi(id)
      }
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Delete failed")
    } finally {
      setDeleting(false)
    }
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleOpen()
    }
  }

  const maxHeight = "max-h-[800px]"
  const Img = isExternalUrl(imageUrl) ? (
    <Image 
      src={imageUrl} 
      alt={prompt} 
      fill 
      className="object-cover" 
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
    />
  ) : (
    <Image
      src={imageUrl}
      alt={prompt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/5 dark:shadow-white/5 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/10 transition-all duration-300"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Open image"
        onKeyDown={onKeyDown}
        onClick={handleOpen}
        className={`${aspectClass} ${maxHeight} relative cursor-pointer overflow-hidden`}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {Img}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4"
        >
          <div className="space-y-3">
            <p className="text-sm text-white font-medium line-clamp-2" title={prompt}>
              {prompt}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpen()
                }}
                className="flex-1 bg-white/90 hover:bg-white text-black text-xs font-semibold"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={doDelete}
                disabled={deleting}
                className="flex-1 bg-red-500/90 hover:bg-red-500 text-white text-xs font-semibold"
              >
                {deleting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {deleteError && (
        <div className="p-3 text-xs text-destructive bg-destructive/10 border-t border-destructive/20">
          {deleteError}
        </div>
      )}

      <Modal open={open} onClose={handleClose} ariaLabel="Image preview">
        <div className="flex max-h-[90vh] min-h-[40vh] items-center justify-center p-4">
          <div className="relative max-h-[90vh] w-full max-w-7xl">
            <div className="relative mx-auto h-full w-full">
              <div className="relative mx-auto flex max-h-[90vh] max-w-full items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                {isExternalUrl(imageUrl) ? (
                  <Image
                    src={imageUrl}
                    alt={prompt}
                    width={1600}
                    height={1200}
                    className="h-auto max-h-[90vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={prompt}
                    width={800}
                    height={600}
                    className="h-auto max-h-[90vh] w-auto max-w-full object-contain"
                  />
                )}
              </div>
              {prompt && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    {prompt}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
})

export default ImageCard



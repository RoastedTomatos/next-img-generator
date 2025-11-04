"use client"

import React, { forwardRef, useMemo, useState } from "react"
import Image from "next/image"
import Modal from "./Modal"
import { deleteImage as deleteImageApi } from "@/utils/api"

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

  const doDelete = async () => {
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

  const Img = isExternalUrl(imageUrl) ? (
    <Image src={imageUrl} alt={prompt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
  ) : (
    <Image
  src={imageUrl}
  alt={prompt}
  width={800}
  height={600}
  className="h-full w-full object-cover"
/>
  )

  return (
    <div ref={ref} className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div
        role="button"
        tabIndex={0}
        aria-label="Open image"
        onKeyDown={onKeyDown}
        onClick={handleOpen}
        className={`${aspectClass} relative cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]`}
      >
        <div className="absolute inset-0">
          {Img}
        </div>

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="pointer-events-auto flex items-center justify-between gap-2 p-3">
            <p className="max-w-[70%] truncate text-sm text-white" title={prompt}>{prompt}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={async (e) => { e.stopPropagation(); await doDelete() }}
                aria-label="Delete"
                disabled={deleting}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                {deleting ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                ) : (
                  <Image src="/icons/trashbin-icon.svg" alt="" width={32} height={32} className="h-8 w-8" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="p-2 text-xs text-destructive">{deleteError}</div>
      )}

      {/* Modal with responsive image */}
      <Modal open={open} onClose={handleClose} ariaLabel="Image preview">
        <div className="flex max-h-[80vh] min-h-[40vh] items-center justify-center">
          <div className="relative max-h-[80vh] w-full">
            <div className="relative mx-auto h-full w-full">
              <div className="relative mx-auto flex max-h-[80vh] max-w-full items-center justify-center">
                {isExternalUrl(imageUrl) ? (
                  <Image
                    src={imageUrl}
                    alt={prompt}
                    width={1600}
                    height={1200}
                    className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
                  />
                ) : (
                  <Image
  src={imageUrl}
  alt={prompt}
  width={800}
  height={600}
  className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
/>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
})

export default ImageCard



"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  ariaLabel?: string
  ariaLabelledBy?: string
}

export default function Modal({ open, onClose, children, ariaLabel, ariaLabelledBy }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstTrapRef = useRef<HTMLSpanElement>(null)
  const lastTrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const focusFirstElement = useCallback(() => {
    const root = dialogRef.current
    if (!root) return
    const focusables = root.querySelectorAll<HTMLElement>(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusables[0]
    first?.focus()
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(focusFirstElement, 0)
    }
  }, [open, focusFirstElement])

  const onTrapFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
    if (!dialogRef.current) return
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return
    if (e.currentTarget === firstTrapRef.current) {
      focusables[focusables.length - 1]?.focus()
    } else {
      focusables[0]?.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-hidden={!open}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <span ref={firstTrapRef} tabIndex={0} onFocus={onTrapFocus} className="sr-only" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-40 w-full max-w-7xl max-h-[90vh] rounded-2xl bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/20 dark:shadow-white/10 outline-none overflow-hidden"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute z-50 right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 hover:bg-background text-foreground shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring/50"
            >
              <X className="h-5 w-5" />
            </button>

            {children}
          </motion.div>

          <span ref={lastTrapRef} tabIndex={0} onFocus={onTrapFocus} className="sr-only" />
        </div>
      )}
    </AnimatePresence>
  )
}

"use client"

import React, { useCallback, useEffect, useRef } from "react"

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

  // Lock scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Focus trap: cycle focus within the dialog while open
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
      // Delay to ensure elements are in DOM
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
      // move to last focusable when shift-tabbing from first trap
      focusables[focusables.length - 1]?.focus()
    } else {
      // move to first focusable when tabbing from last trap
      focusables[0]?.focus()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-100 animate-fade-in"
        onClick={onClose}
      />

      {/* Focus trap sentinels */}
      <span ref={firstTrapRef} tabIndex={0} onFocus={onTrapFocus} />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={dialogRef}
        className="relative z-40 mx-4 w-full max-w-4xl rounded-lg bg-background p-4 shadow-lg outline-none animate-scale-in"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute z-50 right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/70 text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        {children}
      </div>

      {/* Focus trap sentinels */}
      <span ref={lastTrapRef} tabIndex={0} onFocus={onTrapFocus} />
    </div>
  )
}

// Tailwind keyframe utility classes (use via animate-*)
// fade in
// Add in tailwind config if desired; for now use built-in transitions via opacity/scale classes


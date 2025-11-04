"use client"

import { useCallback, useState } from "react"

export function useModal(initial = false) {
  const [open, setOpen] = useState<boolean>(initial)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])
  return { open, openModal, closeModal, toggle }
}

export default useModal



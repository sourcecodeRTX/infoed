"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  onUndo: () => void
  onRedo: () => void
  onDelete: () => void
  onAddNode: () => void
}

export function useKeyboardShortcuts({ onUndo, onRedo, onDelete, onAddNode }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "z":
            event.preventDefault()
            if (event.shiftKey) {
              onRedo()
            } else {
              onUndo()
            }
            break
          case "y":
            event.preventDefault()
            onRedo()
            break
        }
      } else {
        switch (event.key) {
          case "Delete":
          case "Backspace":
            event.preventDefault()
            onDelete()
            break
          case " ":
            event.preventDefault()
            onAddNode()
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onUndo, onRedo, onDelete, onAddNode])
}

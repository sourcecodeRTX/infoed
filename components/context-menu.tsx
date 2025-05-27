"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Circle } from "lucide-react"

interface ContextMenuProps {
  x: number
  y: number
  nodeId?: string
  onAddChild?: () => void
  onDelete?: () => void
  onAddRoot?: () => void
  onClose: () => void
}

export function ContextMenu({ x, y, nodeId, onAddChild, onDelete, onAddRoot, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <Card
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border-gray-600 shadow-lg min-w-[150px]"
      style={{ left: x, top: y }}
    >
      <div className="p-2 space-y-1">
        {nodeId ? (
          <>
            {onAddChild && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={() => {
                  onAddChild()
                  onClose()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Child Node
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Node
              </Button>
            )}
          </>
        ) : (
          onAddRoot && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => {
                onAddRoot()
                onClose()
              }}
            >
              <Circle className="w-4 h-4 mr-2" />
              Add Root Node
            </Button>
          )
        )}
      </div>
    </Card>
  )
}

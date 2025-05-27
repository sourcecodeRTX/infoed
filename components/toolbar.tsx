"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Undo, Redo, Maximize, Target } from "lucide-react"

interface ToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onFitView: () => void
  onCenter: () => void
}

export function Toolbar({ canUndo, canRedo, onUndo, onRedo, onFitView, onCenter }: ToolbarProps) {
  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="text-gray-300 hover:text-white hover:bg-gray-700"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className="text-gray-300 hover:text-white hover:bg-gray-700"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 bg-gray-600" />

      {/* View Controls */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFitView}
        className="text-gray-300 hover:text-white hover:bg-gray-700"
      >
        <Maximize className="w-4 h-4 mr-1" />
        Fit View
      </Button>
      <Button variant="ghost" size="sm" onClick={onCenter} className="text-gray-300 hover:text-white hover:bg-gray-700">
        <Target className="w-4 h-4 mr-1" />
        Center
      </Button>

      <div className="flex-1" />

      {/* Status */}
      <div className="text-xs text-gray-400">Interactive Infographic Editor</div>
    </div>
  )
}

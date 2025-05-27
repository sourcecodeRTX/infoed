"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { ChevronDown, ChevronRight } from "lucide-react"

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const { label, shape = "circle", hasChildren = false, expanded = false } = data

  const getShapeClasses = () => {
    switch (shape) {
      case "rectangle":
        return "rounded-lg"
      case "ellipse":
        return "rounded-full"
      default:
        return "rounded-full"
    }
  }

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-gray-400 border-2 border-white" />

      <div
        className={`
          min-w-[80px] min-h-[80px] flex items-center justify-center p-3
          border-2 transition-all duration-200 cursor-pointer
          ${getShapeClasses()}
          ${selected ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900" : ""}
          hover:scale-105
        `}
        style={{
          backgroundColor: data.backgroundColor || "#6366f1",
          borderColor: data.borderColor || "#4f46e5",
          color: data.textColor || "#ffffff",
          fontSize: data.fontSize || "14px",
          borderWidth: data.borderWidth || "2px",
        }}
      >
        <div className="text-center font-medium leading-tight">{label}</div>

        {hasChildren && (
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center border-2 border-white">
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-white" />
            ) : (
              <ChevronRight className="w-3 h-3 text-white" />
            )}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-gray-400 border-2 border-white" />
    </div>
  )
})

CustomNode.displayName = "CustomNode"

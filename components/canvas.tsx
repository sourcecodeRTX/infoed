"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import type { Node, Edge } from "@/types/graph"

interface CanvasProps {
  nodes: Node[]
  edges: Edge[]
  selectedNode: string | null
  onNodeClick: (nodeId: string, event: React.MouseEvent) => void
  onNodeContextMenu: (nodeId: string, event: React.MouseEvent) => void
  onCanvasClick: () => void
  onCanvasContextMenu: (event: React.MouseEvent) => void
  onNodeDrag: (nodeId: string, position: { x: number; y: number }) => void
}

export function Canvas({
  nodes,
  edges,
  selectedNode,
  onNodeClick,
  onNodeContextMenu,
  onCanvasClick,
  onCanvasContextMenu,
  onNodeDrag,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, zoom: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Handle mouse down on node
  const handleNodeMouseDown = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      event.stopPropagation()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const offsetX = event.clientX - rect.left - node.position.x * viewBox.zoom - viewBox.x
      const offsetY = event.clientY - rect.top - node.position.y * viewBox.zoom - viewBox.y

      setIsDragging(true)
      setDragNode(nodeId)
      setDragOffset({ x: offsetX, y: offsetY })
    },
    [nodes, viewBox],
  )

  // Handle mouse move
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && dragNode) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = (event.clientX - rect.left - viewBox.x - dragOffset.x) / viewBox.zoom
        const y = (event.clientY - rect.top - viewBox.y - dragOffset.y) / viewBox.zoom

        onNodeDrag(dragNode, { x, y })
      } else if (isPanning) {
        const deltaX = event.clientX - panStart.x
        const deltaY = event.clientY - panStart.y

        setViewBox((prev) => ({
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }))

        setPanStart({ x: event.clientX, y: event.clientY })
      }
    },
    [isDragging, dragNode, dragOffset, viewBox, onNodeDrag, isPanning, panStart],
  )

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragNode(null)
    setIsPanning(false)
  }, [])

  // Handle canvas mouse down for panning
  const handleCanvasMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) {
      // Left click for panning
      setIsPanning(true)
      setPanStart({ x: event.clientX, y: event.clientY })
    }
  }, [])

  // Handle wheel for zooming
  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(3, viewBox.zoom * zoomFactor))

      setViewBox((prev) => ({
        x: mouseX - (mouseX - prev.x) * (newZoom / prev.zoom),
        y: mouseY - (mouseY - prev.y) * (newZoom / prev.zoom),
        zoom: newZoom,
      }))
    },
    [viewBox.zoom],
  )

  // Add event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging || isPanning) {
        handleMouseMove(event as any)
      }
    }

    const handleGlobalMouseUp = () => {
      handleMouseUp()
    }

    if (isDragging || isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, isPanning, handleMouseMove, handleMouseUp])

  // Render edge
  const renderEdge = (edge: Edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source)
    const targetNode = nodes.find((n) => n.id === edge.target)

    if (!sourceNode || !targetNode || sourceNode.hidden || targetNode.hidden) return null

    const x1 = sourceNode.position.x + 40 // Node center offset
    const y1 = sourceNode.position.y + 40
    const x2 = targetNode.position.x + 40
    const y2 = targetNode.position.y + 40

    return (
      <line
        key={edge.id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={edge.style?.stroke || "#6b7280"}
        strokeWidth={edge.style?.strokeWidth || "2px"}
        strokeDasharray={edge.style?.strokeDasharray}
      />
    )
  }

  // Render node
  const renderNode = (node: Node) => {
    if (node.hidden) return null

    const isSelected = selectedNode === node.id
    const { shape = "circle" } = node.data

    const getShapeElement = () => {
      const baseProps = {
        x: node.position.x,
        y: node.position.y,
        width: 80,
        height: 80,
        fill: node.style?.backgroundColor || "#6366f1",
        stroke: node.style?.borderColor || "#4f46e5",
        strokeWidth: node.style?.borderWidth || "2px",
        className: `cursor-pointer transition-all duration-200 ${isSelected ? "filter drop-shadow-lg" : ""} hover:scale-105`,
        onMouseDown: (e: React.MouseEvent) => handleNodeMouseDown(node.id, e),
        onClick: (e: React.MouseEvent) => onNodeClick(node.id, e),
        onContextMenu: (e: React.MouseEvent) => onNodeContextMenu(node.id, e),
      }

      switch (shape) {
        case "rectangle":
          return <rect {...baseProps} rx={8} />
        case "ellipse":
          return <ellipse {...baseProps} cx={node.position.x + 40} cy={node.position.y + 40} rx={40} ry={30} />
        default:
          return <circle {...baseProps} cx={node.position.x + 40} cy={node.position.y + 40} r={40} />
      }
    }

    return (
      <g key={node.id}>
        {getShapeElement()}
        <text
          x={node.position.x + 40}
          y={node.position.y + 40}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={node.style?.color || "#ffffff"}
          fontSize={node.style?.fontSize || "14px"}
          fontWeight="500"
          className="pointer-events-none select-none"
        >
          {node.data.label}
        </text>
        {node.data.hasChildren && (
          <circle
            cx={node.position.x + 70}
            cy={node.position.y + 70}
            r={8}
            fill="#374151"
            stroke="#ffffff"
            strokeWidth="2"
            className="pointer-events-none"
          />
        )}
        {node.data.hasChildren && (
          <text
            x={node.position.x + 70}
            y={node.position.y + 70}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize="10px"
            className="pointer-events-none select-none"
          >
            {node.data.expanded ? "−" : "+"}
          </text>
        )}
        {isSelected && (
          <rect
            x={node.position.x - 5}
            y={node.position.y - 5}
            width={90}
            height={90}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            rx={shape === "circle" ? 45 : 8}
            className="pointer-events-none"
          />
        )}
      </g>
    )
  }

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gray-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleCanvasMouseDown}
      onClick={onCanvasClick}
      onContextMenu={onCanvasContextMenu}
      onWheel={handleWheel}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          transform: `translate(${viewBox.x}px, ${viewBox.y}px) scale(${viewBox.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Render edges first (behind nodes) */}
        {edges.map(renderEdge)}

        {/* Render nodes */}
        {nodes.map(renderNode)}
      </svg>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-2 py-1 rounded text-sm">
        {Math.round(viewBox.zoom * 100)}%
      </div>
    </div>
  )
}

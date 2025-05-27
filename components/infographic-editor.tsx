"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"

import { Sidebar } from "@/components/sidebar"
import { Toolbar } from "@/components/toolbar"
import { Canvas } from "@/components/canvas"
import { ContextMenu } from "@/components/context-menu"
import { useInfographicStore } from "@/hooks/use-infographic-store"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { createNode } from "@/lib/graph-utils"
import { exportToImage, exportToJSON, importFromJSON } from "@/lib/export-utils"

export function InfographicEditor() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    nodeId?: string
  }>({ show: false, x: 0, y: 0 })

  const {
    nodes,
    edges,
    selectedNode,
    globalStyles,
    setNodes,
    setEdges,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
  } = useInfographicStore()

  // Handle node selection
  const handleNodeClick = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      event.stopPropagation()
      setSelectedNode(nodeId)

      // Toggle node expansion
      const node = nodes.find((n) => n.id === nodeId)
      if (node?.data.hasChildren) {
        const isExpanded = node.data.expanded
        updateNode(nodeId, {
          data: { ...node.data, expanded: !isExpanded },
        })

        // Show/hide child nodes
        const childNodes = nodes.filter((n) => n.data.parentId === nodeId)
        childNodes.forEach((childNode) => {
          updateNode(childNode.id, { hidden: isExpanded })
        })
      }
    },
    [setSelectedNode, updateNode, nodes],
  )

  // Handle canvas click
  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null)
    setContextMenu({ show: false, x: 0, y: 0 })
  }, [setSelectedNode])

  // Handle context menu
  const handleNodeContextMenu = useCallback((nodeId: string, event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      nodeId,
    })
  }, [])

  const handleCanvasContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  // Add root node
  const addRootNode = useCallback(() => {
    const position = { x: 400, y: 200 }
    const newNode = createNode("Root Node", position, globalStyles.node)
    addNode(newNode)
    saveToHistory()
  }, [addNode, globalStyles.node, saveToHistory])

  // Add child node
  const addChildNode = useCallback(
    (parentId: string) => {
      const parentNode = nodes.find((n) => n.id === parentId)
      if (!parentNode) return

      const childCount = nodes.filter((n) => n.data.parentId === parentId).length
      const angle = childCount * 60 - 30 // Spread children in a fan
      const distance = 150
      const radians = (angle * Math.PI) / 180

      const position = {
        x: parentNode.position.x + Math.cos(radians) * distance,
        y: parentNode.position.y + Math.sin(radians) * distance,
      }

      const newNode = createNode(`Child ${childCount + 1}`, position, globalStyles.node, parentId)
      addNode(newNode)

      // Create edge from parent to child
      addEdge({
        id: `edge_${parentId}_${newNode.id}`,
        source: parentId,
        target: newNode.id,
        style: globalStyles.edge,
      })

      // Update parent to show it has children
      updateNode(parentId, {
        data: { ...parentNode.data, hasChildren: true, expanded: true },
      })

      saveToHistory()
    },
    [nodes, addNode, addEdge, updateNode, globalStyles, saveToHistory],
  )

  // Delete node and its subtree
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const nodesToDelete = [nodeId]

      // Find all descendant nodes
      const findDescendants = (id: string) => {
        const children = nodes.filter((n) => n.data.parentId === id)
        children.forEach((child) => {
          nodesToDelete.push(child.id)
          findDescendants(child.id)
        })
      }

      findDescendants(nodeId)

      // Delete nodes
      nodesToDelete.forEach((id) => deleteNode(id))

      // Update parent if it no longer has children
      const deletedNode = nodes.find((n) => n.id === nodeId)
      if (deletedNode?.data.parentId) {
        const parentId = deletedNode.data.parentId
        const remainingChildren = nodes.filter((n) => n.data.parentId === parentId && !nodesToDelete.includes(n.id))

        if (remainingChildren.length === 0) {
          const parentNode = nodes.find((n) => n.id === parentId)
          if (parentNode) {
            updateNode(parentId, {
              data: { ...parentNode.data, hasChildren: false, expanded: false },
            })
          }
        }
      }

      setSelectedNode(null)
      saveToHistory()
    },
    [nodes, deleteNode, updateNode, setSelectedNode, saveToHistory],
  )

  // Export functions
  const handleExportJSON = useCallback(() => {
    exportToJSON(nodes, edges, globalStyles)
  }, [nodes, edges, globalStyles])

  const handleExportImage = useCallback(() => {
    if (canvasRef.current) {
      exportToImage(canvasRef.current)
    }
  }, [])

  // Import function
  const handleImportJSON = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        importFromJSON(file, setNodes, setEdges)
        saveToHistory()
      }
    },
    [setNodes, setEdges, saveToHistory],
  )

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onDelete: () => selectedNode && handleDeleteNode(selectedNode),
    onAddNode: () => (selectedNode ? addChildNode(selectedNode) : addRootNode()),
  })

  return (
    <div className="h-screen w-full flex bg-gray-900">
      <Sidebar
        selectedNode={selectedNode}
        onAddRootNode={addRootNode}
        onExportJSON={handleExportJSON}
        onExportImage={handleExportImage}
        onImportJSON={handleImportJSON}
      />

      <div className="flex-1 flex flex-col">
        <Toolbar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onFitView={() => {}}
          onCenter={() => {}}
        />

        <div className="flex-1" ref={canvasRef}>
          <Canvas
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            onNodeClick={handleNodeClick}
            onNodeContextMenu={handleNodeContextMenu}
            onCanvasClick={handleCanvasClick}
            onCanvasContextMenu={handleCanvasContextMenu}
            onNodeDrag={(nodeId, position) => updateNode(nodeId, { position })}
          />
        </div>
      </div>

      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onAddChild={contextMenu.nodeId ? () => addChildNode(contextMenu.nodeId!) : undefined}
          onDelete={contextMenu.nodeId ? () => handleDeleteNode(contextMenu.nodeId!) : undefined}
          onAddRoot={!contextMenu.nodeId ? addRootNode : undefined}
          onClose={() => setContextMenu({ show: false, x: 0, y: 0 })}
        />
      )}
    </div>
  )
}

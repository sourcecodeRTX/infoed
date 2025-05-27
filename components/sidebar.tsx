"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, ImageIcon, FileJson, Palette, Settings } from "lucide-react"
import { useInfographicStore } from "@/hooks/use-infographic-store"

interface SidebarProps {
  selectedNode: string | null
  onAddRootNode: () => void
  onExportJSON: () => void
  onExportImage: () => void
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function Sidebar({ selectedNode, onAddRootNode, onExportJSON, onExportImage, onImportJSON }: SidebarProps) {
  const { nodes, globalStyles, updateNode, updateGlobalStyles } = useInfographicStore()

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  const handleNodeUpdate = (updates: any) => {
    if (selectedNode) {
      updateNode(selectedNode, updates)
    }
  }

  const handleStyleUpdate = (path: string, value: any) => {
    if (selectedNode && selectedNodeData) {
      const style = { ...selectedNodeData.style, [path]: value }
      handleNodeUpdate({ style })
    }
  }

  const handleDataUpdate = (updates: any) => {
    if (selectedNode && selectedNodeData) {
      const data = { ...selectedNodeData.data, ...updates }
      handleNodeUpdate({ data })
    }
  }

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Infographic Editor</h2>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button onClick={onAddRootNode} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Root Node
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExportJSON} className="flex-1">
              <FileJson className="w-4 h-4 mr-1" />
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={onExportImage} className="flex-1">
              <ImageIcon className="w-4 h-4 mr-1" />
              Image
            </Button>
            <label className="flex-1">
              <Button variant="outline" size="sm" className="w-full cursor-pointer">
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <input type="file" accept=".json" onChange={onImportJSON} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node Properties */}
        {selectedNodeData ? (
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Node Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Node Label */}
              <div>
                <Label htmlFor="node-label" className="text-gray-300 text-xs">
                  Label
                </Label>
                <Input
                  id="node-label"
                  value={selectedNodeData.data.label || ""}
                  onChange={(e) => handleDataUpdate({ label: e.target.value })}
                  className="bg-gray-600 border-gray-500 text-white"
                />
              </div>

              {/* Node Shape */}
              <div>
                <Label className="text-gray-300 text-xs">Shape</Label>
                <Select
                  value={selectedNodeData.data.shape || "circle"}
                  onValueChange={(value) => handleDataUpdate({ shape: value })}
                >
                  <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="ellipse">Ellipse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-gray-300 text-xs">Fill Color</Label>
                  <Input
                    type="color"
                    value={selectedNodeData.style?.backgroundColor || "#6366f1"}
                    onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                    className="h-8 p-1 bg-gray-600 border-gray-500"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-xs">Border Color</Label>
                  <Input
                    type="color"
                    value={selectedNodeData.style?.borderColor || "#4f46e5"}
                    onChange={(e) => handleStyleUpdate("borderColor", e.target.value)}
                    className="h-8 p-1 bg-gray-600 border-gray-500"
                  />
                </div>
              </div>

              {/* Border Width */}
              <div>
                <Label className="text-gray-300 text-xs">Border Width</Label>
                <Slider
                  value={[Number.parseInt(selectedNodeData.style?.borderWidth || "2")]}
                  onValueChange={([value]) => handleStyleUpdate("borderWidth", `${value}px`)}
                  max={10}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Text Color */}
              <div>
                <Label className="text-gray-300 text-xs">Text Color</Label>
                <Input
                  type="color"
                  value={selectedNodeData.style?.color || "#ffffff"}
                  onChange={(e) => handleStyleUpdate("color", e.target.value)}
                  className="h-8 p-1 bg-gray-600 border-gray-500"
                />
              </div>

              {/* Font Size */}
              <div>
                <Label className="text-gray-300 text-xs">Font Size</Label>
                <Slider
                  value={[Number.parseInt(selectedNodeData.style?.fontSize || "14")]}
                  onValueChange={([value]) => handleStyleUpdate("fontSize", `${value}px`)}
                  max={24}
                  min={8}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4 text-center text-gray-400">Select a node to edit its properties</CardContent>
          </Card>
        )}

        {/* Global Styles */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Global Styles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Default Node Color */}
            <div>
              <Label className="text-gray-300 text-xs">Default Node Color</Label>
              <Input
                type="color"
                value={globalStyles.node.backgroundColor}
                onChange={(e) =>
                  updateGlobalStyles({
                    node: { ...globalStyles.node, backgroundColor: e.target.value },
                  })
                }
                className="h-8 p-1 bg-gray-600 border-gray-500"
              />
            </div>

            {/* Default Edge Color */}
            <div>
              <Label className="text-gray-300 text-xs">Default Edge Color</Label>
              <Input
                type="color"
                value={globalStyles.edge.stroke}
                onChange={(e) =>
                  updateGlobalStyles({
                    edge: { ...globalStyles.edge, stroke: e.target.value },
                  })
                }
                className="h-8 p-1 bg-gray-600 border-gray-500"
              />
            </div>

            {/* Edge Width */}
            <div>
              <Label className="text-gray-300 text-xs">Default Edge Width</Label>
              <Slider
                value={[Number.parseInt(globalStyles.edge.strokeWidth)]}
                onValueChange={([value]) =>
                  updateGlobalStyles({
                    edge: { ...globalStyles.edge, strokeWidth: `${value}px` },
                  })
                }
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-300 space-y-1">
            <div>Ctrl+Z: Undo</div>
            <div>Ctrl+Y: Redo</div>
            <div>Delete: Delete selected node</div>
            <div>Space: Add child node</div>
            <div>Click node: Expand/collapse</div>
            <div>Right-click: Context menu</div>
            <div>Mouse wheel: Zoom</div>
            <div>Drag canvas: Pan view</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

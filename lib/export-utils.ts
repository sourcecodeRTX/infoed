import type { Node, Edge } from "@/types/graph"

export function exportToJSON(nodes: Node[], edges: Edge[], globalStyles: any) {
  const data = {
    nodes,
    edges,
    globalStyles,
    version: "1.0",
    exportedAt: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `infographic_${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportToImage(element: HTMLElement) {
  try {
    // Create a canvas to draw the SVG content
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = element.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Fill background
    ctx.fillStyle = "#111827"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Convert canvas to image
    const dataUrl = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `infographic_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error exporting image:", error)
  }
}

export function importFromJSON(file: File, setNodes: (nodes: Node[]) => void, setEdges: (edges: Edge[]) => void) {
  const reader = new FileReader()

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result as string)

      if (data.nodes && data.edges) {
        setNodes(data.nodes)
        setEdges(data.edges)
      }
    } catch (error) {
      console.error("Error importing JSON:", error)
      alert("Invalid JSON file")
    }
  }

  reader.readAsText(file)
}

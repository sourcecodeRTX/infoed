import type { Node, Edge } from "@/types/graph"

export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateEdgeId(): string {
  return `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function createNode(
  label: string,
  position: { x: number; y: number },
  globalStyles: any,
  parentId?: string,
): Node {
  return {
    id: generateNodeId(),
    position,
    data: {
      label,
      shape: "circle",
      hasChildren: false,
      expanded: false,
      parentId,
    },
    style: {
      backgroundColor: globalStyles.backgroundColor,
      borderColor: globalStyles.borderColor,
      borderWidth: globalStyles.borderWidth,
      color: globalStyles.color,
      fontSize: globalStyles.fontSize,
    },
  }
}

export function createEdge(source: string, target: string, globalStyles: any): Edge {
  return {
    id: generateEdgeId(),
    source,
    target,
    style: {
      stroke: globalStyles.stroke,
      strokeWidth: globalStyles.strokeWidth,
    },
  }
}

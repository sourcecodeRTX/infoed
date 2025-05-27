export interface Node {
  id: string
  position: { x: number; y: number }
  data: {
    label: string
    shape?: "circle" | "rectangle" | "ellipse"
    hasChildren?: boolean
    expanded?: boolean
    parentId?: string
  }
  style?: {
    backgroundColor?: string
    borderColor?: string
    borderWidth?: string
    color?: string
    fontSize?: string
  }
  hidden?: boolean
}

export interface Edge {
  id: string
  source: string
  target: string
  style?: {
    stroke?: string
    strokeWidth?: string
    strokeDasharray?: string
  }
  hidden?: boolean
}

"use client"

import { create } from "zustand"
import type { Node, Edge } from "@/types/graph"

interface GlobalStyles {
  node: {
    backgroundColor: string
    borderColor: string
    borderWidth: string
    color: string
    fontSize: string
  }
  edge: {
    stroke: string
    strokeWidth: string
    strokeDasharray?: string
  }
}

interface HistoryState {
  nodes: Node[]
  edges: Edge[]
}

interface InfographicStore {
  nodes: Node[]
  edges: Edge[]
  selectedNode: string | null
  globalStyles: GlobalStyles
  history: HistoryState[]
  historyIndex: number

  // Actions
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setSelectedNode: (nodeId: string | null) => void
  addNode: (node: Node) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  deleteNode: (nodeId: string) => void
  addEdge: (edge: Edge) => void
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void
  deleteEdge: (edgeId: string) => void
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void

  // History
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const defaultGlobalStyles: GlobalStyles = {
  node: {
    backgroundColor: "#6366f1",
    borderColor: "#4f46e5",
    borderWidth: "2px",
    color: "#ffffff",
    fontSize: "14px",
  },
  edge: {
    stroke: "#6b7280",
    strokeWidth: "2px",
  },
}

export const useInfographicStore = create<InfographicStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  globalStyles: defaultGlobalStyles,
  history: [],
  historyIndex: -1,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: state.selectedNode === nodeId ? null : state.selectedNode,
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  updateEdge: (edgeId, updates) =>
    set((state) => ({
      edges: state.edges.map((edge) => (edge.id === edgeId ? { ...edge, ...updates } : edge)),
    })),

  deleteEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),

  updateGlobalStyles: (styles) =>
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...styles },
    })),

  saveToHistory: () =>
    set((state) => {
      const newHistoryState = { nodes: state.nodes, edges: state.edges }
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(newHistoryState)

      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift()
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex > 0) {
        const prevState = state.history[state.historyIndex - 1]
        return {
          nodes: prevState.nodes,
          edges: prevState.edges,
          historyIndex: state.historyIndex - 1,
          selectedNode: null,
        }
      }
      return state
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1]
        return {
          nodes: nextState.nodes,
          edges: nextState.edges,
          historyIndex: state.historyIndex + 1,
          selectedNode: null,
        }
      }
      return state
    }),

  get canUndo() {
    return get().historyIndex > 0
  },

  get canRedo() {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },
}))

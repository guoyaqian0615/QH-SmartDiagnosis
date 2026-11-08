import { create } from "zustand";

import type { EvidenceGraphHint } from "@/types/clinical-inference";

export type LogicGraphNode = EvidenceGraphHint & {
  x?: number;
  y?: number;
};

export type LogicGraphEdge = {
  source: string;
  target: string;
  relation?: string;
};

type Phase = "idle" | "streaming" | "complete";

type LogicGraphState = {
  phase: Phase;
  nodes: LogicGraphNode[];
  edges: LogicGraphEdge[];
  /** 已「点亮」的边数量（用于流式显现 + 流光逐条出现） */
  activeEdgeCount: number;
  reset: () => void;
  setStreaming: (nodes: LogicGraphNode[], edges: LogicGraphEdge[]) => void;
  setComplete: (nodes: LogicGraphNode[], edges: LogicGraphEdge[]) => void;
  revealNextEdge: () => void;
  revealAllEdges: () => void;
};

export const useLogicGraphStore = create<LogicGraphState>((set, get) => ({
  phase: "idle",
  nodes: [],
  edges: [],
  activeEdgeCount: 0,
  reset: () =>
    set({
      phase: "idle",
      nodes: [],
      edges: [],
      activeEdgeCount: 0,
    }),
  setStreaming: (nodes, edges) =>
    set({
      phase: "streaming",
      nodes,
      edges,
      activeEdgeCount: 0,
    }),
  setComplete: (nodes, edges) =>
    set({
      phase: "complete",
      nodes,
      edges,
      activeEdgeCount: edges.length,
    }),
  revealNextEdge: () => {
    const { edges, activeEdgeCount } = get();
    if (activeEdgeCount < edges.length) {
      set({ activeEdgeCount: activeEdgeCount + 1 });
    }
  },
  revealAllEdges: () => {
    const { edges } = get();
    set({ activeEdgeCount: edges.length, phase: "complete" });
  },
}));

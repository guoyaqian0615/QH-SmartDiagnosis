import type { LogicGraphEdge, LogicGraphNode } from "@/stores/logic-graph-store";

// 👇 原来高度 320 → 现在改成 120（超级小！）
const W = 100;
const H = 60;

function columnForRole(
  role: LogicGraphNode["role"],
): 0 | 1 | 2 {
  switch (role) {
    case "symptom":
      return 0;
    case "syndrome":
      return 1;
    case "formula":
      return 2;
    case "herb":
      return 2;
    default:
      return 1;
  }
}

/** 三列力导向式排布：左证、中机、右方药 */
export function layoutLogicGraph(
  nodes: LogicGraphNode[],
): { positioned: LogicGraphNode[]; viewBox: string } {
  const cols: LogicGraphNode[][] = [[], [], []];
  for (const n of nodes) {
    const c = columnForRole(n.role);
    cols[c].push(n);
  }

  const xForCol = (c: 0 | 1 | 2) => {
    if (c === 0) return 22;
    if (c === 1) return W / 2;
    return W - 22;
  };

  const positioned: LogicGraphNode[] = [];
  cols.forEach((list, ci) => {
    const c = ci as 0 | 1 | 2;
    const n = list.length;
    list.forEach((node, i) => {
      const y =
        n === 1
          ? H / 2
          : 
          // 👇 原来上下留白超大：48、96 → 现在改成 12、24（超级紧凑）
          12 + (i * (H - 24)) / Math.max(1, n - 1);
      positioned.push({
        ...node,
        x: xForCol(c),
        y,
      });
    });
  });

  return { positioned, viewBox: `0 0 ${W} ${H}` };
}

export function edgePath(
  a: LogicGraphNode,
  b: LogicGraphNode,
): string {
  const x1 = a.x ?? 0;
  const y1 = a.y ?? 0;
  const x2 = b.x ?? 0;
  const y2 = b.y ?? 0;
  const mx = (x1 + x2) / 2;
  const c1x = mx;
  const c1y = y1;
  const c2x = mx;
  const c2y = y2;
  return `M ${x1} ${y1} C ${c1x} ${c1y + (y2 - y1) * 0.35} ${c2x} ${c2y - (y2 - y1) * 0.35} ${x2} ${y2}`;
}

export function getEdgeEndpoints(
  edges: LogicGraphEdge[],
  nodes: LogicGraphNode[],
): { edge: LogicGraphEdge; path: string }[] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const out: { edge: LogicGraphEdge; path: string }[] = [];
  for (const e of edges) {
    const s = map.get(e.source);
    const t = map.get(e.target);
    if (!s || !t || s.x == null || t.x == null) continue;
    out.push({ edge: e, path: edgePath(s, t) });
  }
  return out;
}

export const LOGIC_GRAPH_VIEW = { w: W, h: H };
import type {
  ClinicalInferenceResponse,
  EvidenceGraphHint,
} from "@/types/clinical-inference";

import type { LogicGraphEdge, LogicGraphNode } from "@/stores/logic-graph-store";

/** 从主诉中拆出若干「象」作占位节点，推演未返回前右侧即可先动起来 */
export function buildInterimGraphFromComplaint(
  chiefComplaint: string,
): { nodes: LogicGraphNode[]; edges: LogicGraphEdge[] } {
  const raw = chiefComplaint.trim();
  const parts = raw
    ? raw.split(/[，,、；;\n]+/).map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : [];
  const symptoms = parts.length ? parts : ["主诉要点"];
  const nodes: LogicGraphNode[] = [];
  const sIds: string[] = [];
  symptoms.forEach((s, i) => {
    const id = `sym-${i + 1}`;
    sIds.push(id);
    nodes.push({
      id,
      label: s.length > 8 ? `${s.slice(0, 8)}…` : s,
      role: "symptom",
    });
  });
  nodes.push({ id: "syn-core", label: "辨证推演", role: "syndrome" });
  nodes.push({ id: "form-tmp", label: "方意初稿", role: "formula" });
  const edges: LogicGraphEdge[] = [];
  for (const sid of sIds) {
    edges.push({ source: sid, target: "syn-core", relation: "合参" });
  }
  edges.push({ source: "syn-core", target: "form-tmp", relation: "遣方" });
  return { nodes, edges };
}

function normalizeApiNodes(
  nodes: EvidenceGraphHint[],
): LogicGraphNode[] {
  return nodes.map((n) => ({
    ...n,
    label:
      n.label.length > 10 ? `${n.label.slice(0, 10)}…` : n.label,
  }));
}

/** 合并接口图与占位，优先使用接口节点 */
export function graphFromInferenceResponse(
  res: ClinicalInferenceResponse,
  fallbackComplaint: string,
): { nodes: LogicGraphNode[]; edges: LogicGraphEdge[] } {
  const g = res.evidenceGraph;
  if (g?.nodes?.length && g.edges?.length) {
    return {
      nodes: normalizeApiNodes(g.nodes),
      edges: g.edges.map((e) => ({ ...e })),
    };
  }
  if (g?.nodes?.length) {
    const nodes = normalizeApiNodes(g.nodes);
    const edges = g.edges?.length
      ? g.edges.map((e) => ({ ...e }))
      : [];
    if (edges.length) return { nodes, edges };
    return buildInterimGraphFromComplaint(fallbackComplaint);
  }
  return buildInterimGraphFromComplaint(fallbackComplaint);
}

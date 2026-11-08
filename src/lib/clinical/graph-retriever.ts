import {
  CLINICAL_FACTORS,
  CLINICAL_SYMPTOMS,
  CLINICAL_SYNDROMES,
  type FactorDefinition,
  type SyndromeRule,
  type SymptomDefinition,
} from "@/data/clinical/rule-pack";
import {
  CLINICAL_GRAPH_VERSION,
  CLINICAL_KNOWLEDGE_GRAPH,
  clinicalGraphIds,
} from "@/data/clinical/knowledge-graph";
import {
  createDefaultConstitutionContext,
} from "@/lib/clinical/constitution-context";
import type {
  ClinicalConstitutionContext,
  ClinicalInferenceRequest,
  EvidenceGraphHint,
} from "@/types/clinical-inference";

export type SymptomMatch = {
  definition: SymptomDefinition;
  hits: string[];
  score: number;
};

export type FactorMatch = {
  definition: FactorDefinition;
  hits: string[];
  score: number;
};

export type CandidateSyndrome = {
  rule: SyndromeRule;
  score: number;
  hitSymptoms: SymptomMatch[];
};

export type ClinicalGraphRetrievalResult = {
  normalizedText: string;
  matchedSymptoms: SymptomMatch[];
  matchedFactors: FactorMatch[];
  constitutionContext: ClinicalConstitutionContext;
  candidates: CandidateSyndrome[];
  lead?: CandidateSyndrome;
  second?: CandidateSyndrome;
  confidence?: number;
  graphVersion: string;
  evidenceGraph: {
    nodes: EvidenceGraphHint[];
    edges: { source: string; target: string; relation?: string }[];
  };
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeClinicalText(parts: Array<string | undefined>) {
  return parts
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join("；")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function keywordHits(text: string, keywords: string[]) {
  return uniqueItems(keywords.filter((keyword) => text.includes(keyword.toLowerCase())));
}

function matchSymptoms(text: string): SymptomMatch[] {
  return CLINICAL_SYMPTOMS.map((definition) => {
    const hits = keywordHits(text, definition.keywords);
    return hits.length
      ? {
          definition,
          hits,
          score: 1 + Math.min(0.4, (hits.length - 1) * 0.15),
        }
      : null;
  }).filter((item): item is SymptomMatch => item !== null);
}

function matchFactors(text: string): FactorMatch[] {
  return CLINICAL_FACTORS.map((definition) => {
    const hits = keywordHits(text, definition.keywords);
    return hits.length
      ? {
          definition,
          hits,
          score: 1 + Math.min(0.5, (hits.length - 1) * 0.2),
        }
      : null;
  }).filter((item): item is FactorMatch => item !== null);
}

const CONSTITUTION_PRIOR_WEIGHTS: Record<string, Partial<Record<string, number>>> = {
  qixu: { "spleen-qi": 1.3, "liver-spleen": 0.5 },
  yangxu: { "yang-deficiency": 1.5, "spleen-qi": 0.3 },
  yinxu: { "yin-deficiency": 1.5, "damp-heat": 0.3 },
  tanshi: { "phlegm-damp": 1.5, "damp-heat": 0.5, "summerheat-damp": 0.3 },
  shire: { "damp-heat": 1.5, "summerheat-damp": 0.8, "phlegm-damp": 0.4 },
  qiyu: { "liver-spleen": 1.2, "qi-stagnation-blood-stasis": 0.9 },
  xueyu: { "qi-stagnation-blood-stasis": 1.5, "liver-spleen": 0.3 },
  tebing: { "summerheat-damp": 0.3, "damp-heat": 0.3 },
  pinghe: {},
};

function normalizePriorScore(score: number | undefined) {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return score <= 1 ? score : score / 100;
}

function syndromePriorBonus(
  syndromeId: string,
  constitutionContext: ClinicalConstitutionContext,
) {
  const entries = [
    constitutionContext.primaryType,
    ...(constitutionContext.secondaryTypes ?? []),
  ];
  let bonus = 0;
  for (const entry of entries) {
    const weight = CONSTITUTION_PRIOR_WEIGHTS[entry.code]?.[syndromeId] ?? 0;
    bonus += weight * normalizePriorScore(entry.score);
  }
  // 已移除舌象权重加成逻辑
  return bonus;
}

function scoreSyndrome(
  rule: SyndromeRule,
  symptoms: SymptomMatch[],
  factors: FactorMatch[],
  constitutionContext: ClinicalConstitutionContext,
): CandidateSyndrome {
  let score = 0;
  const hitSymptoms: SymptomMatch[] = [];
  for (const symptom of symptoms) {
    const weight = rule.symptomWeights[symptom.definition.id];
    if (!weight) continue;
    score += weight * symptom.score;
    hitSymptoms.push(symptom);
  }
  for (const factor of factors) {
    const bonus = rule.factorBonuses?.[factor.definition.id];
    if (!bonus) continue;
    score += bonus * factor.score;
  }
  score += syndromePriorBonus(rule.id, constitutionContext);
  return {
    rule,
    score,
    hitSymptoms: hitSymptoms.sort(
      (a, b) =>
        (rule.symptomWeights[b.definition.id] ?? 0) - (rule.symptomWeights[a.definition.id] ?? 0),
    ),
  };
}

function buildFallbackGraph(text: string) {
  const tokens = text
    .split(/[，。；、,\s]+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .slice(0, 3);
  const symptomLabels = tokens.length ? tokens : ["主诉已录入"];
  const nodes: EvidenceGraphHint[] = symptomLabels.map((label, index) => ({
    id: `symptom:fallback:${index + 1}`,
    label,
    role: "symptom",
  }));
  nodes.push({ id: "syndrome:fallback", label: "初步辨证待复核", role: "syndrome" });
  nodes.push({ id: "plan:fallback", label: "补充关键问答后细化", role: "other" });
  return {
    nodes,
    edges: [
      ...symptomLabels.map((_, index) => ({
        source: `symptom:fallback:${index + 1}`,
        target: "syndrome:fallback",
        relation: "初筛",
      })),
      { source: "syndrome:fallback", target: "plan:fallback", relation: "细化" },
    ],
  };
}

function buildEvidenceGraph(
  lead: CandidateSyndrome | undefined,
  symptoms: SymptomMatch[],
  factors: FactorMatch[],
  normalizedText: string,
) {
  if (!lead) {
    return buildFallbackGraph(normalizedText);
  }
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  const graphNodesById = new Map(CLINICAL_KNOWLEDGE_GRAPH.nodes.map((node) => [node.id, node]));
  const symptomNodes = uniqueBy(
    lead.hitSymptoms.length ? lead.hitSymptoms.slice(0, 4) : symptoms.slice(0, 4),
    (item) => item.definition.id,
  );
  const factorNodes = uniqueBy(factors.slice(0, 2), (item) => item.definition.id);
  for (const symptom of symptomNodes) {
    nodeIds.add(clinicalGraphIds.symptom(symptom.definition.id));
  }
  for (const factor of factorNodes) {
    nodeIds.add(clinicalGraphIds.factor(factor.definition.id));
  }
  nodeIds.add(clinicalGraphIds.syndrome(lead.rule.id));
  nodeIds.add(clinicalGraphIds.principle(lead.rule.id));
  nodeIds.add(clinicalGraphIds.formula(lead.rule.id));
  lead.rule.prescriptionLines.slice(0, 5).forEach((line) => {
    nodeIds.add(clinicalGraphIds.herb(lead.rule.id, line.herb));
  });
  const edges = CLINICAL_KNOWLEDGE_GRAPH.edges
    .filter((edge) => {
      const keep = nodeIds.has(edge.source) && nodeIds.has(edge.target);
      if (!keep) return false;
      const id = `${edge.source}|${edge.relation}|${edge.target}`;
      if (edgeIds.has(id)) return false;
      edgeIds.add(id);
      return true;
    })
    .map((edge) => ({
      source: edge.source,
      target: edge.target,
      relation: edge.relation,
    }));
  const nodes = Array.from(nodeIds)
    .map((id) => graphNodesById.get(id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .map((node) => ({
      id: node.id,
      label: node.label,
      role: node.role,
    }));
  return { nodes, edges };
}

function buildConfidence(
  lead: CandidateSyndrome | undefined,
  second: CandidateSyndrome | undefined,
  symptoms: SymptomMatch[],
  hasFourNotes: boolean,
  hasScreeningPrior: boolean,
) {
  if (!lead) return 0.46;
  const gap = lead.score - (second?.score ?? 0);
  let confidence =
    0.48 +
    Math.min(symptoms.length, 5) * 0.06 +
    Math.min(lead.score, 8) * 0.025 +
    (hasFourNotes ? 0.04 : 0) +
    (hasScreeningPrior ? 0.03 : 0) +
    Math.min(Math.max(gap, 0), 2) * 0.04;
  if (symptoms.length < 2) confidence -= 0.07;
  return clamp(confidence, hasFourNotes ? 0.48 : 0.44, hasFourNotes ? 0.88 : 0.78);
}

export function retrieveClinicalGraph(request: ClinicalInferenceRequest): ClinicalGraphRetrievalResult {
  const normalizedText = normalizeClinicalText([request.chiefComplaint, request.fourExaminationsNotes]);
  const constitutionContext = request.constitutionContext ?? createDefaultConstitutionContext();
  const matchedSymptoms = matchSymptoms(normalizedText);
  const matchedFactors = matchFactors(normalizedText);
  const candidates = CLINICAL_SYNDROMES.map((rule) =>
    scoreSyndrome(rule, matchedSymptoms, matchedFactors, constitutionContext),
  ).sort((a, b) => b.score - a.score);
  const positiveCandidates = candidates.filter((candidate) => candidate.score > 0);
  const lead = positiveCandidates[0];
  const second = positiveCandidates[1];
  return {
    normalizedText,
    matchedSymptoms,
    matchedFactors,
    constitutionContext,
    candidates,
    lead,
    second,
    confidence: buildConfidence(
      lead,
      second,
      matchedSymptoms,
      Boolean(request.fourExaminationsNotes?.trim()),
      constitutionContext.source === "screening",
    ),
    graphVersion: CLINICAL_GRAPH_VERSION,
    evidenceGraph: buildEvidenceGraph(lead, matchedSymptoms, matchedFactors, normalizedText),
  };
}

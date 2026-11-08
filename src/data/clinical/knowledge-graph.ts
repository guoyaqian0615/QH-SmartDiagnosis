import { CLINICAL_FACTORS, CLINICAL_SYMPTOMS, CLINICAL_SYNDROMES } from "@/data/clinical/rule-pack";
import type { EvidenceGraphHint } from "@/types/clinical-inference";

export type ClinicalGraphNode = EvidenceGraphHint & {
  kind:
    | "symptom"
    | "factor"
    | "syndrome"
    | "principle"
    | "formula"
    | "herb"
    | "diet"
    | "lifestyle";
};

export type ClinicalGraphEdge = {
  source: string;
  target: string;
  relation: string;
  weight?: number;
};

export type ClinicalKnowledgeGraph = {
  version: string;
  nodes: ClinicalGraphNode[];
  edges: ClinicalGraphEdge[];
};

export const CLINICAL_GRAPH_VERSION = "kg-v1";

export const clinicalGraphIds = {
  symptom: (id: string) => `symptom:${id}`,
  factor: (id: string) => `factor:${id}`,
  syndrome: (id: string) => `syndrome:${id}`,
  principle: (syndromeId: string) => `principle:${syndromeId}`,
  formula: (syndromeId: string) => `formula:${syndromeId}`,
  herb: (syndromeId: string, herb: string) => `herb:${syndromeId}:${herb}`,
  diet: (syndromeId: string, index: number) => `diet:${syndromeId}:${index}`,
  lifestyle: (syndromeId: string, index: number) => `lifestyle:${syndromeId}:${index}`,
};

function buildClinicalKnowledgeGraph(): ClinicalKnowledgeGraph {
  const nodes: ClinicalGraphNode[] = [];
  const edges: ClinicalGraphEdge[] = [];

  for (const symptom of CLINICAL_SYMPTOMS) {
    nodes.push({
      id: clinicalGraphIds.symptom(symptom.id),
      label: symptom.label,
      role: "symptom",
      kind: "symptom",
    });
  }

  for (const factor of CLINICAL_FACTORS) {
    nodes.push({
      id: clinicalGraphIds.factor(factor.id),
      label: factor.label,
      role: "other",
      kind: "factor",
    });
  }

  for (const syndrome of CLINICAL_SYNDROMES) {
    nodes.push({
      id: clinicalGraphIds.syndrome(syndrome.id),
      label: syndrome.label,
      role: "syndrome",
      kind: "syndrome",
    });
    nodes.push({
      id: clinicalGraphIds.principle(syndrome.id),
      label: syndrome.principle,
      role: "other",
      kind: "principle",
    });
    nodes.push({
      id: clinicalGraphIds.formula(syndrome.id),
      label: syndrome.formulaTitle,
      role: "formula",
      kind: "formula",
    });

    edges.push({
      source: clinicalGraphIds.syndrome(syndrome.id),
      target: clinicalGraphIds.principle(syndrome.id),
      relation: "治则",
    });
    edges.push({
      source: clinicalGraphIds.principle(syndrome.id),
      target: clinicalGraphIds.formula(syndrome.id),
      relation: "对应方意",
    });

    for (const [symptomId, weight] of Object.entries(syndrome.symptomWeights)) {
      edges.push({
        source: clinicalGraphIds.symptom(symptomId),
        target: clinicalGraphIds.syndrome(syndrome.id),
        relation: "支持证候",
        weight,
      });
    }

    for (const [factorId, weight] of Object.entries(syndrome.factorBonuses ?? {})) {
      edges.push({
        source: clinicalGraphIds.factor(factorId),
        target: clinicalGraphIds.syndrome(syndrome.id),
        relation: "诱因线索",
        weight,
      });
    }

    syndrome.prescriptionLines.forEach((line, index) => {
      nodes.push({
        id: clinicalGraphIds.herb(syndrome.id, line.herb),
        label: line.herb,
        role: "herb",
        kind: "herb",
      });
      edges.push({
        source: clinicalGraphIds.formula(syndrome.id),
        target: clinicalGraphIds.herb(syndrome.id, line.herb),
        relation: index === 0 ? "君药示意" : "组成",
      });
    });

    syndrome.dietSuggestions.forEach((item, index) => {
      nodes.push({
        id: clinicalGraphIds.diet(syndrome.id, index),
        label: item,
        role: "other",
        kind: "diet",
      });
      edges.push({
        source: clinicalGraphIds.syndrome(syndrome.id),
        target: clinicalGraphIds.diet(syndrome.id, index),
        relation: "膳食建议",
      });
    });

    syndrome.lifestyleSuggestions.forEach((item, index) => {
      nodes.push({
        id: clinicalGraphIds.lifestyle(syndrome.id, index),
        label: item,
        role: "other",
        kind: "lifestyle",
      });
      edges.push({
        source: clinicalGraphIds.syndrome(syndrome.id),
        target: clinicalGraphIds.lifestyle(syndrome.id, index),
        relation: "调理建议",
      });
    });
  }

  return {
    version: CLINICAL_GRAPH_VERSION,
    nodes,
    edges,
  };
}

export const CLINICAL_KNOWLEDGE_GRAPH = buildClinicalKnowledgeGraph();

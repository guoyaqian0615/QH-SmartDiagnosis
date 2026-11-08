/** POST /v1/clinical/inference */
export type ClinicalInferenceRequest = {
  chiefComplaint: string;
  fourExaminationsNotes?: string;
  constitutionContext?: ClinicalConstitutionContext;
  /** BCP-47; default zh-CN on server if omitted */
  locale?: "zh-CN";
};
export type EvidenceGraphHint = {
  id: string;
  label: string;
  role?: "symptom" | "syndrome" | "formula" | "herb" | "other";
};
export type PrescriptionLine = {
  herb: string;
  /** Example dosage such as "9g" or "先煎" */
  dosage?: string;
};
export type ClinicalConstitutionContext = {
  source: "screening" | "default";
  primaryType: {
    code: string;
    label: string;
    score: number;
  };
  secondaryTypes?: {
    code: string;
    label: string;
    score: number;
  }[];
  summary?: string;
  capturedAt?: number;
};
export type ClinicalInferenceEngineMeta = {
  mode: "rule-graph" | "graph-llm";
  llmUsed: boolean;
  provider?: "deepseek";
  model?: string;
  graphVersion: string;
  candidateSyndromes?: string[];
  note?: string;
};
export type ClinicalRetrievalTrace = {
  matchedSymptoms?: string[];
  matchedFactors?: string[];
  candidateSyndromes?: { label: string; score: number }[];
  constitutionSummary?: string;
};
export type ClinicalInferenceResponse = {
  narrative: string;
  confidence?: number;
  syndromeLabels?: string[];
  causeAnalysis?: string[];
  dietSuggestions?: string[];
  lifestyleSuggestions?: string[];
  followUpQuestions?: string[];
  cautions?: string[];
  retrievalTrace?: ClinicalRetrievalTrace;
  engine?: ClinicalInferenceEngineMeta;
  evidenceGraph?: {
    nodes: EvidenceGraphHint[];
    edges: { source: string; target: string; relation?: string }[];
  };
  /** Formula intent card shown in UI, not a real prescription. */
  prescription?: {
    title?: string;
    lines: PrescriptionLine[];
    sealNumber?: string;
  };
};

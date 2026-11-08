import type { ClinicalGraphRetrievalResult } from "@/lib/clinical/graph-retriever";
import type { ClinicalInferenceRequest, ClinicalInferenceResponse } from "@/types/clinical-inference";

export type DeepSeekChatMessage = {
  role: "system" | "user";
  content: string;
};

function summarizeGraph(retrieval: ClinicalGraphRetrievalResult) {
  const nodeById = new Map(retrieval.evidenceGraph.nodes?.map((node) => [node.id, node.label]) ?? []);
  return (retrieval.evidenceGraph.edges ?? []).slice(0, 16).map((edge) => ({
    source: nodeById.get(edge.source) ?? edge.source,
    relation: edge.relation ?? "关联",
    target: nodeById.get(edge.target) ?? edge.target,
  }));
}

export function buildDeepSeekClinicalMessages(input: {
  request: ClinicalInferenceRequest;
  retrieval: ClinicalGraphRetrievalResult;
  ruleDraft: ClinicalInferenceResponse;
}): DeepSeekChatMessage[] {
  const candidateSyndromes = input.retrieval.candidates
    .filter((candidate) => candidate.score > 0)
    .slice(0, 3)
    .map((candidate) => ({
      label: candidate.rule.label,
      score: Number(candidate.score.toFixed(2)),
      principle: candidate.rule.principle,
      formulaTitle: candidate.rule.formulaTitle,
    }));

  const payload = {
    locale: input.request.locale ?? "zh-CN",
    chiefComplaint: input.request.chiefComplaint,
    fourExaminationsNotes: input.request.fourExaminationsNotes ?? "",
    constitutionContext: input.request.constitutionContext ?? null,
    matchedSymptoms: input.retrieval.matchedSymptoms.map((item) => item.definition.label),
    matchedFactors: input.retrieval.matchedFactors.map((item) => item.definition.label),
    candidateSyndromes,
    evidenceTriples: summarizeGraph(input.retrieval),
    ruleDraft: {
      narrative: input.ruleDraft.narrative,
      syndromeLabels: input.ruleDraft.syndromeLabels ?? [],
      causeAnalysis: input.ruleDraft.causeAnalysis ?? [],
      dietSuggestions: input.ruleDraft.dietSuggestions ?? [],
      lifestyleSuggestions: input.ruleDraft.lifestyleSuggestions ?? [],
      followUpQuestions: input.ruleDraft.followUpQuestions ?? [],
      cautions: input.ruleDraft.cautions ?? [],
    },
  };

  return [
    {
      role: "system",
      content: [
        "你是中医辅助问诊系统中的图谱约束生成助手。",
        "你只能依据提供的知识图谱证据、候选证候和规则草稿进行润色与结构化输出。",
        "绝对不能新增候选列表之外的证候名称、治则或方意。",
        "输出必须是 JSON 对象，不要输出 markdown，不要输出额外解释。",
        "JSON 字段固定为 narrative, syndromeLabels, causeAnalysis, dietSuggestions, lifestyleSuggestions, followUpQuestions, cautions。",
        "syndromeLabels 只能从 candidateSyndromes.label 中选择 1 到 2 个。",
        "narrative 使用中文，控制在 110 到 220 字之间，语气克制，强调“辅助参考、建议复核”。",
        "数组字段每项都要短句化，最多 4 项。",
      ].join("\n"),
    },
    {
      role: "user",
      content: JSON.stringify(payload, null, 2),
    },
  ];
}

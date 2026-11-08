import { requestDeepSeekJson } from "@/lib/clinical/deepseek-client";
import type { ClinicalGraphRetrievalResult } from "@/lib/clinical/graph-retriever";
import { buildRuleBasedClinicalResponse } from "@/lib/clinical/inference-engine";
import { buildDeepSeekClinicalMessages } from "@/lib/clinical/llm-prompt";
import type { ClinicalInferenceRequest, ClinicalInferenceResponse } from "@/types/clinical-inference";

type LlmClinicalPayload = {
  narrative?: string;
  syndromeLabels?: string[];
  causeAnalysis?: string[];
  dietSuggestions?: string[];
  lifestyleSuggestions?: string[];
  followUpQuestions?: string[];
  cautions?: string[];
};

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function sanitizeTextArray(value: unknown, maxItems = 4) {
  if (!Array.isArray(value)) return [];
  return uniqueItems(
    value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0),
  ).slice(0, maxItems);
}

export async function generateGraphConstrainedClinicalResponse(input: {
  request: ClinicalInferenceRequest;
  retrieval: ClinicalGraphRetrievalResult;
}): Promise<ClinicalInferenceResponse> {
  const ruleDraft = buildRuleBasedClinicalResponse(input.request, input.retrieval);
  const messages = buildDeepSeekClinicalMessages({
    request: input.request,
    retrieval: input.retrieval,
    ruleDraft,
  });
  const { data, model } = await requestDeepSeekJson<LlmClinicalPayload>(messages);

  const allowedSyndromes = new Set(
    input.retrieval.candidates
      .filter((candidate) => candidate.score > 0)
      .slice(0, 3)
      .map((candidate) => candidate.rule.label),
  );

  const syndromeLabels = sanitizeTextArray(data.syndromeLabels, 2).filter((item) =>
    allowedSyndromes.has(item),
  );

  return {
    ...ruleDraft,
    narrative:
      typeof data.narrative === "string" && data.narrative.trim().length > 20
        ? data.narrative.trim()
        : ruleDraft.narrative,
    syndromeLabels: syndromeLabels.length ? syndromeLabels : ruleDraft.syndromeLabels,
    causeAnalysis: sanitizeTextArray(data.causeAnalysis) || ruleDraft.causeAnalysis,
    dietSuggestions: sanitizeTextArray(data.dietSuggestions) || ruleDraft.dietSuggestions,
    lifestyleSuggestions:
      sanitizeTextArray(data.lifestyleSuggestions) || ruleDraft.lifestyleSuggestions,
    followUpQuestions:
      sanitizeTextArray(data.followUpQuestions, 3) || ruleDraft.followUpQuestions,
    cautions: sanitizeTextArray(data.cautions) || ruleDraft.cautions,
    engine: {
      mode: "graph-llm",
      llmUsed: true,
      provider: "deepseek",
      model,
      graphVersion: input.retrieval.graphVersion,
      candidateSyndromes: Array.from(allowedSyndromes),
      note:
      input.retrieval.constitutionContext.source === "screening"
      ? "已纳入最近一次体质倾向先验，先做图谱检索，再用 DeepSeek 在候选证候范围内生成自然语言结果。"
      : "当前未检测到体质辨识记录，按平和质默认先验完成图谱检索，再由 DeepSeek 在候选证候范围内生成结果。",
  
    },
  };
}

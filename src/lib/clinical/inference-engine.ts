import { GENERAL_CLINICAL_CAUTION } from "@/data/clinical/rule-pack";
import { summarizeConstitutionContext } from "@/lib/clinical/constitution-context";
import type { ClinicalGraphRetrievalResult } from "@/lib/clinical/graph-retriever";
import { retrieveClinicalGraph } from "@/lib/clinical/graph-retriever";
import type { ClinicalInferenceRequest, ClinicalInferenceResponse } from "@/types/clinical-inference";

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function buildNarrative(retrieval: ClinicalGraphRetrievalResult) {
  const lead = retrieval.lead;
  if (!lead) {
    return "当前主诉仍偏简略，但系统已经先完成一次初筛。现阶段更适合按“初步辨证待复核”处理：先补充起病时间、寒热偏向、食欲与二便变化，再把判断收紧到更具体的证候。";
  }
  const second = retrieval.second;
  const symptomText = uniqueItems(
    (lead.hitSymptoms.length ? lead.hitSymptoms : retrieval.matchedSymptoms)
      .slice(0, 4)
      .map((item) => item.definition.label),
  ).join("、");
  const factorText = uniqueItems(
    retrieval.matchedFactors.slice(0, 2).map((item) => item.definition.label),
  ).join("、");
  const secondText =
    second && second.score >= lead.score * 0.72 ? `，兼见“${second.rule.label}”线索` : "";
  const factorSentence = factorText ? `结合文本中的 ${factorText} 线索，` : "";
  const constitutionSentence =
    retrieval.constitutionContext.source === "screening"
      ? `并参考最近体质辨识提示的 ${retrieval.constitutionContext.primaryType.label} 先验，`
      : "";

  return [
    `根据主诉与四诊摘要，系统提取到 ${symptomText || "待进一步补充的症状信息"}，${factorSentence}${constitutionSentence}当前更符合“${lead.rule.label}”倾向${secondText}。`,
    `辨证思路以“症状 -> 证候 -> 治则 -> 方案”串联，建议先按“${lead.rule.principle}”的方向理解当前结果。`,
    `当前图谱检索置信度约为 ${Math.round((retrieval.confidence ?? 0.46) * 100)}%，可继续补充诱因、排便/睡眠等细节以提高稳定性。`,
  ].join("");
}

function buildFallbackResponse(retrieval: ClinicalGraphRetrievalResult): ClinicalInferenceResponse {
  return {
    narrative: buildNarrative(retrieval),
    confidence: retrieval.confidence ?? 0.46,
    syndromeLabels: ["初步辨证待复核"],
    causeAnalysis: ["当前描述更像症状摘要或早期主诉，线索尚未完全展开，但已具备继续细化的基础。"],
    dietSuggestions: ["若伴发热、胃口差或口渴，近期先以清淡补水、规律休息为主，不急于进补。"],
    lifestyleSuggestions: [
      "先按时间顺序补充主诉，包括起病、加重或缓解因素和伴随症状。",
      "补充睡眠、食欲、排便、怕冷怕热和近期压力变化，可明显提升判断质量。",
    ],
    followUpQuestions: [
      "主要不适从什么时候开始，近期是加重还是缓解？",
      "是否伴有怕冷/怕热、食欲变化、睡眠变化或二便异常？",
      "症状是否与情绪、饮食、熬夜或受凉有关？",
    ],
    cautions: [GENERAL_CLINICAL_CAUTION],
    retrievalTrace: {
      matchedSymptoms: retrieval.matchedSymptoms.map((item) => item.definition.label),
      matchedFactors: retrieval.matchedFactors.map((item) => item.definition.label),
      candidateSyndromes: retrieval.candidates
        .filter((item) => item.score > 0)
        .slice(0, 3)
        .map((item) => ({ label: item.rule.label, score: Number(item.score.toFixed(2)) })),
      constitutionSummary: summarizeConstitutionContext(retrieval.constitutionContext),
    },
    engine: {
      mode: "rule-graph",
      llmUsed: false,
      graphVersion: retrieval.graphVersion,
      candidateSyndromes: ["初步辨证待复核"],
      note:
        retrieval.constitutionContext.source === "screening"
          ? "已纳入最近一次体质倾向先验，但当前仍以图谱初筛结果回退输出。"
          : "当前未检测到体质辨识记录，按平和质默认先验进行图谱初筛。",
    },
    evidenceGraph: retrieval.evidenceGraph,
  };
}

export function buildRuleBasedClinicalResponse(
  request: ClinicalInferenceRequest,
  retrieval = retrieveClinicalGraph(request),
): ClinicalInferenceResponse {
  const lead = retrieval.lead;
  if (!lead || lead.score <= 0) {
    return buildFallbackResponse(retrieval);
  }
  const second = retrieval.second;
  const syndromeLabels = [lead.rule.label];
  if (second && second.score >= lead.score * 0.72) {
    syndromeLabels.push(second.rule.label);
  }

  return {
    narrative: buildNarrative(retrieval),
    confidence: retrieval.confidence,
    syndromeLabels,
    causeAnalysis: uniqueItems([
      ...retrieval.matchedFactors.map((item) => item.definition.analysis),
      ...lead.rule.defaultCauseAnalysis,
    ]).slice(0, 4),
    dietSuggestions: uniqueItems([
      ...lead.rule.dietSuggestions,
      ...retrieval.matchedFactors.flatMap((item) => item.definition.dietSuggestions ?? []),
    ]).slice(0, 4),
    lifestyleSuggestions: uniqueItems([
      ...lead.rule.lifestyleSuggestions,
      ...retrieval.matchedFactors.flatMap((item) => item.definition.lifestyleSuggestions ?? []),
    ]).slice(0, 4),
    followUpQuestions:
      retrieval.matchedSymptoms.length < 3 ||
      !request.fourExaminationsNotes?.trim() ||
      (second && lead.score - second.score < 1.35)
        ? lead.rule.followUpQuestions.slice(0, 3)
        : [],
    cautions: uniqueItems([...(lead.rule.cautions ?? []), GENERAL_CLINICAL_CAUTION]),
    retrievalTrace: {
      matchedSymptoms: retrieval.matchedSymptoms.map((item) => item.definition.label),
      matchedFactors: retrieval.matchedFactors.map((item) => item.definition.label),
      candidateSyndromes: retrieval.candidates
        .filter((item) => item.score > 0)
        .slice(0, 3)
        .map((item) => ({ label: item.rule.label, score: Number(item.score.toFixed(2)) })),
      constitutionSummary: summarizeConstitutionContext(retrieval.constitutionContext),
    },
    engine: {
      mode: "rule-graph",
      llmUsed: false,
      graphVersion: retrieval.graphVersion,
      candidateSyndromes: retrieval.candidates
        .filter((item) => item.score > 0)
        .slice(0, 3)
        .map((item) => item.rule.label),
      note:
        retrieval.constitutionContext.source === "screening"
          ? "图谱检索时已纳入最近一次体质倾向先验，再由规则模板生成叙事。"
          : "当前未检测到体质辨识记录，图谱检索按平和质默认先验处理。",
    },
    evidenceGraph: retrieval.evidenceGraph,
    prescription: {
      title: lead.rule.formulaTitle,
      sealNumber: lead.rule.sealNumber,
      lines: lead.rule.prescriptionLines,
    },
  };
}

export function inferClinicalResponse(request: ClinicalInferenceRequest): ClinicalInferenceResponse {
  return buildRuleBasedClinicalResponse(request, retrieveClinicalGraph(request));
}

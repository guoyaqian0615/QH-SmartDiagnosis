import {
  ALL_QUESTION_KEYS,
  CONSTITUTION_SCORING,
  SCALE_MAX,
  SCALE_MIN,
} from "@/lib/constitution/questionnaire";
import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";

/**
 * 体质问卷评分引擎（18 题简化量表，非 60 题国标全表）。
 *
 * 规则：
 * 1. 按题目名（QuestionKey）取答案，不再依赖数字下标，漏答不会导致错位。
 * 2. 8 个偏颇体质：得分 = Σ权重×(答案-1) / Σ权重×4 × 100，范围 0–100。
 * 3. 判定参考国标的分段：≥40 为“是”，30–39 为“倾向是”，<30 为“否”。
 * 4. 平和质由偏颇程度反推：最高偏颇分 ≤30 时平和质 ≥60；最高偏颇分达到 75 及以上时为 0。
 * 5. 缺题或分值不在 1–5 的整数范围时直接抛出 ConstitutionInputError，不静默补 0。
 */

export class ConstitutionInputError extends Error {
  readonly missing: string[];
  readonly invalid: string[];

  constructor(message: string, missing: string[] = [], invalid: string[] = []) {
    super(message);
    this.name = "ConstitutionInputError";
    this.missing = missing;
    this.invalid = invalid;
  }
}

const LABELS: Record<string, string> = {
  pinghe: "平和质",
  ...Object.fromEntries(CONSTITUTION_SCORING.map((c) => [c.code, c.label])),
};

const SUMMARY: Record<string, string> = {
  pinghe: "阴阳气血相对调和，体态适中，精力较充沛。",
  qixu: "元气偏不足，容易疲乏、气短、自汗。",
  yangxu: "阳气偏不足，畏寒怕冷、手足不温。",
  yinxu: "阴液偏亏少，口燥咽干、手足心热。",
  tanshi: "痰湿偏凝聚，身体沉重、腹部肥满、口黏痰多。",
  shire: "湿热偏内蕴，面部油光、口苦、大便黏滞。",
  xueyu: "血行偏不畅，肤色晦暗、易有瘀斑或固定刺痛。",
  qiyu: "气机偏郁滞，情绪低落、胸闷叹息。",
  tebing: "先天禀赋偏特殊，对季节、气味或过敏原较敏感。",
};

const SUGGEST: Record<string, string[]> = {
  pinghe: ["饮食均衡，作息规律，适度运动。"],
  qixu: ["多食益气健脾食物；避免过度劳累；适度慢跑、八段锦。"],
  yangxu: ["注意防寒保暖；多食温补食物；少寒凉冷饮。"],
  yinxu: ["避免熬夜；少食辛辣燥热；多食滋阴润燥食材。"],
  tanshi: ["饮食清淡，少甜腻油腻；坚持运动；控制体重。"],
  shire: ["饮食清淡，忌辛辣油腻；起居防潮；适度运动。"],
  xueyu: ["适度运动促进气血流通；可适度食用活血食材。"],
  qiyu: ["调畅情志，多户外活动；疏肝理气饮食。"],
  tebing: ["规避过敏原；饮食清淡；起居调护。"],
};

const DISCLAIMER = "本结果由 18 题简化问卷得出，仅作体质倾向参考，不构成医疗诊断；如有明显不适请咨询专业医师。";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** 校验并返回按题目名整理好的答案；不合格时抛 ConstitutionInputError。 */
export function validateAnswers(answers: Record<string, unknown>): Record<string, number> {
  const missing: string[] = [];
  const invalid: string[] = [];
  const clean: Record<string, number> = {};

  for (const key of ALL_QUESTION_KEYS) {
    const raw = answers[key];
    if (raw === undefined || raw === null || raw === "") {
      missing.push(key);
      continue;
    }
    const value = Number(raw);
    if (!Number.isInteger(value) || value < SCALE_MIN || value > SCALE_MAX) {
      invalid.push(key);
      continue;
    }
    clean[key] = value;
  }

  if (missing.length || invalid.length) {
    const parts: string[] = [];
    if (missing.length) parts.push(`缺少题目：${missing.join("、")}`);
    if (invalid.length) parts.push(`分值需为 ${SCALE_MIN}–${SCALE_MAX} 的整数：${invalid.join("、")}`);
    throw new ConstitutionInputError(parts.join("；"), missing, invalid);
  }
  return clean;
}

export function calcConstitutionReport(
  rawAnswers: Record<string, unknown>,
): ConstitutionScreeningResponse {
  const answers = validateAnswers(rawAnswers);

  const biased = CONSTITUTION_SCORING.map((def) => {
    let weighted = 0;
    let total = 0;
    for (const [key, weight] of Object.entries(def.items)) {
      weighted += (weight as number) * (answers[key] - SCALE_MIN);
      total += (weight as number) * (SCALE_MAX - SCALE_MIN);
    }
    return {
      code: def.code as string,
      label: def.label,
      score: total > 0 ? round1((weighted / total) * 100) : 0,
    };
  }).sort((a, b) => b.score - a.score);

  const maxBiased = biased[0]?.score ?? 0;
  const pinghe = {
    code: "pinghe",
    label: LABELS.pinghe,
    score: round1(Math.min(100, Math.max(0, 100 - (40 / 30) * maxBiased))),
  };

  // 主体质：偏颇最高分 ≥30 取偏颇体质，否则为平和质
  const isBalanced = maxBiased < 30;
  const primary = isBalanced ? pinghe : biased[0];
  const rest = [...(isBalanced ? biased : [...biased.slice(1), pinghe])].sort(
    (a, b) => b.score - a.score,
  );
  const constitutionTypes = [primary, ...rest];

  const verdict = isBalanced ? "基本平和" : maxBiased >= 40 ? "是" : "倾向是";
  const secondary = biased
    .filter((c) => c.code !== primary.code && c.score >= 30)
    .slice(0, 2);

  const lead = isBalanced
    ? `综合问卷结果，各偏颇体质得分均低于 30 分，整体偏${LABELS.pinghe}（${pinghe.score.toFixed(0)} 分）。${SUMMARY.pinghe}`
    : `综合问卷结果，您当前最突出的体质倾向为${primary.label}（${primary.score.toFixed(0)} 分，判定：${verdict}）。${primary.label}${SUMMARY[primary.code]}`;
  const secondaryText = secondary.length
    ? `同时兼有${secondary.map((c) => `${c.label}（${c.score.toFixed(0)} 分）`).join("、")}的倾向。`
    : "";

  return {
    constitutionTypes,
    narrative: [lead, secondaryText].filter(Boolean).join(""),
    cautions: [...(SUGGEST[primary.code] ?? []), DISCLAIMER],
    questionnaireScores: { ...answers },
  };
}


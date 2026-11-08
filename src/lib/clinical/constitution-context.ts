import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";
import type { ClinicalConstitutionContext } from "@/types/clinical-inference";

/** 体质筛查接口的得分固定为 0–100，这里统一换算到 0–1，不再用 “<=1” 猜量纲。 */
function normalizeScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.min(1, Math.max(0, score / 100));
}

export function createDefaultConstitutionContext(): ClinicalConstitutionContext {
  return {
    source: "default",
    primaryType: {
      code: "pinghe",
      label: "平和质（默认先验）",
      score: 0.5,
    },
    summary: "当前未检测到近期体质辨识记录，问诊先按平和质默认先验处理。",
  };
}

export function buildConstitutionContextFromScreening(
  result: ConstitutionScreeningResponse,
): ClinicalConstitutionContext {
  const primary = result.constitutionTypes[0] ?? {
    code: "pinghe",
    label: "平和质",
    score: 50,
  };
  // 次要体质：不含平和质，且得分达到 30 分以上才视为有倾向
  const secondaryTypes = result.constitutionTypes
    .slice(1)
    .filter((item) => item.code !== "pinghe")
    .map((item) => ({
      code: item.code,
      label: item.label,
      score: normalizeScore(item.score),
    }))
    .filter((item) => item.score >= 0.3)
    .slice(0, 2);

  const summaryParts = [`最近体质倾向：${primary.label}`];
  if (secondaryTypes.length) {
    summaryParts.push(`兼有${secondaryTypes.map((item) => item.label).join("、")}`);
  }

  return {
    source: "screening",
    primaryType: {
      code: primary.code,
      label: primary.label,
      score: normalizeScore(primary.score),
    },
    secondaryTypes,
    summary: summaryParts.join("；"),
    capturedAt: Date.now(),
  };
}

export function summarizeConstitutionContext(context?: ClinicalConstitutionContext | null) {
  if (!context) return createDefaultConstitutionContext().summary ?? "";
  return context.summary ?? `${context.primaryType.label}`;
}

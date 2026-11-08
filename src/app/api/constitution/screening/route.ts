import { NextResponse } from "next/server";

import { calcConstitutionReport, ConstitutionInputError } from "@/lib/constitution/screening-engine";
import type {
  ConstitutionQuestionnaire,
  ConstitutionScreeningResponse,
} from "@/types/constitution-screening";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { questionnaire?: ConstitutionQuestionnaire };
  try {
    body = (await request.json()) as { questionnaire?: ConstitutionQuestionnaire };
  } catch {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const answers = body.questionnaire?.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "缺少问卷 answers 字段" }, { status: 400 });
  }

  try {
    // 题目是否齐全、分值是否合法，由引擎统一校验
    const report: ConstitutionScreeningResponse = calcConstitutionReport(answers);
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    if (err instanceof ConstitutionInputError) {
      return NextResponse.json(
        { error: err.message, missing: err.missing, invalid: err.invalid },
        { status: 400 },
      );
    }
    const msg = err instanceof Error ? err.message : "体质报告计算失败";
    console.error("[constitution screening] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import { hasDeepSeekConfig } from "@/lib/clinical/deepseek-client";
import { generateGraphConstrainedClinicalResponse } from "@/lib/clinical/graph-llm-inference";
import { retrieveClinicalGraph } from "@/lib/clinical/graph-retriever";
import { buildRuleBasedClinicalResponse } from "@/lib/clinical/inference-engine";
import type { ClinicalInferenceRequest } from "@/types/clinical-inference";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: ClinicalInferenceRequest;

  try {
    body = (await request.json()) as ClinicalInferenceRequest;
  } catch {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const chiefComplaint =
    typeof body.chiefComplaint === "string" ? body.chiefComplaint.trim() : "";

  if (!chiefComplaint) {
    return NextResponse.json({ error: "缺少 chiefComplaint" }, { status: 400 });
  }

  const normalizedRequest: ClinicalInferenceRequest = {
    chiefComplaint,
    fourExaminationsNotes:
      typeof body.fourExaminationsNotes === "string"
        ? body.fourExaminationsNotes.trim() || undefined
        : undefined,
    constitutionContext: body.constitutionContext,
    locale: body.locale === "zh-CN" ? "zh-CN" : undefined,
  };

  try {
    const retrieval = retrieveClinicalGraph(normalizedRequest);
    const ruleDraft = buildRuleBasedClinicalResponse(normalizedRequest, retrieval);

    if (!hasDeepSeekConfig()) {
      return NextResponse.json(ruleDraft, { status: 200 });
    }

    try {
      const result = await generateGraphConstrainedClinicalResponse({
        request: normalizedRequest,
        retrieval,
      });
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "DeepSeek generation failed";
      console.warn("[clinical/inference] DeepSeek unavailable, falling back to graph rules", {
        detail,
      });
      return NextResponse.json(
        {
          ...ruleDraft,
          engine: {
            ...ruleDraft.engine,
            note: "DeepSeek 调用失败，已自动回退到图谱规则结果。",
          },
        },
        { status: 200 },
      );
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "clinical inference failed";
    console.error("[clinical/inference] inference failed", { detail });
    return NextResponse.json(
      {
        error: "推理失败",
        detail,
      },
      { status: 500 },
    );
  }
}

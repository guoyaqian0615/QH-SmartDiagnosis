import { NextResponse } from "next/server";

import { lookupOrGenerateKnowledgeEntry } from "@/lib/knowledge/enrichment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { query?: string };

  try {
    body = (await request.json()) as { query?: string };
  } catch {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json({ error: "缺少 query" }, { status: 400 });
  }

  try {
    const result = await lookupOrGenerateKnowledgeEntry(query);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "knowledge lookup failed";
    return NextResponse.json(
      {
        error: "知识补全失败",
        detail,
      },
      { status: 500 },
    );
  }
}

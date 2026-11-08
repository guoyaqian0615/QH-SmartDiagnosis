import { NextResponse } from "next/server";

import { getKnowledgeCatalogPayload } from "@/lib/knowledge/repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    const payload = await getKnowledgeCatalogPayload();
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "knowledge catalog failed";
    return NextResponse.json(
      {
        error: "知识库读取失败",
        detail,
      },
      { status: 500 },
    );
  }
}

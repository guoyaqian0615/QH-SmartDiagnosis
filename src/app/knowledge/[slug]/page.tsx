import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { KnowledgeEntryDetail } from "@/components/knowledge/KnowledgeEntryDetail";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { getKnowledgeEntryBySlugFromRepo } from "@/lib/knowledge/repository";
import { BookOpen } from "lucide-react";

type KnowledgeDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: KnowledgeDetailPageProps): Promise<Metadata> {
  const entry = await getKnowledgeEntryBySlugFromRepo(params.slug);
  if (!entry) {
    return {
      title: "知识条目不存在 · 本草智诊",
    };
  }

  return {
    title: `${entry.title} · 知识库 · 本草智诊`,
    description: entry.summary,
  };
}

export const dynamic = "force-dynamic";

export default async function KnowledgeDetailPage({ params }: KnowledgeDetailPageProps) {
  const entry = await getKnowledgeEntryBySlugFromRepo(params.slug);
  if (!entry) {
    notFound();
  }

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-8">
      <ModuleHeader
        icon={BookOpen}
        title="知识库"
        description="从智诊结果直接回到知识解释层，查看术语、证候、方意与药材详情。"
        badge="Core"
      />
      <KnowledgeEntryDetail entry={entry} />
    </div>
  );
}

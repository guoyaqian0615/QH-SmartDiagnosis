import type { Metadata } from "next";
import { Suspense } from "react";

import { KnowledgeDirectory } from "@/components/knowledge/KnowledgeDirectory";
// 删掉无用导入
// import { BookOpen } from "lucide-react";
// import { ModuleHeader } from "@/components/shell/ModuleHeader";

export const metadata: Metadata = {
  title: "全部知识 · 知识库 · 岐黄智诊",
  description: "分页浏览术语、证候、方意与药材，并支持 DeepSeek 智能补全入库。",
};

export default function KnowledgeDirectoryPage() {
  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-8">
      {/* 已删除顶部标题栏ModuleHeader */}
      <Suspense fallback={<div className="module-card p-6 text-sm text-muted-foreground">知识目录载入中…</div>}>
        <KnowledgeDirectory />
      </Suspense>
    </div>
  );
}
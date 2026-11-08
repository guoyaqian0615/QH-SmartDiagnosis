import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Suspense } from "react";

import { KnowledgeAtlas } from "@/components/knowledge/KnowledgeAtlas";
// ModuleHeader没用了，可注释/删掉导入
// import { ModuleHeader } from "@/components/shell/ModuleHeader";

export const metadata: Metadata = {
  title: "知识库 · 本草智诊",
  description: "知识库首页，承接搜索、精选导航与 DeepSeek 智能补全入口。",
};

export default function KnowledgePage() {
  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-8">
      {/* 直接删除下面整行ModuleHeader代码 */}
      {/* <ModuleHeader
        icon={BookOpen}
        title="知识库"
        description="首页负责搜索入口、精选导航与补全入库；全部知识目录单独成页，浏览体验更清晰。"
        badge="Core"
      /> */}
      <Suspense fallback={<div className="module-card p-6 text-sm text-muted-foreground">知识库首页载入中…</div>}>
        <KnowledgeAtlas />
      </Suspense>
    </div>
  );
}
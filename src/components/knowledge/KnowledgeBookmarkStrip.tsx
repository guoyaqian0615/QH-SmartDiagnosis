"use client";

import Link from "next/link";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";
import { knowledgeKindLabels, type KnowledgeEntry } from "@/data/knowledge/catalog";
import { getFeaturedKnowledgeEntries } from "@/lib/knowledge/search";
import { cn } from "@/lib/utils";

type KnowledgeBookmarkStripProps = {
  activeSlug?: string | null;
};

const FEATURED = getFeaturedKnowledgeEntries(4);

export function KnowledgeBookmarkStrip({ activeSlug }: KnowledgeBookmarkStripProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          精选 · 知识导航
        </p>
        <span className="rounded-full border border-border/60 bg-background/45 px-3 py-1 text-[11px] text-muted-foreground">
          适合从智诊结果回溯理解
        </span>
      </div>
      <ul className="grid gap-3 lg:grid-cols-4">
        {FEATURED.map((entry) => (
          <li key={entry.id}>
            <KnowledgeFeaturedCard entry={entry} active={activeSlug === entry.slug} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function KnowledgeFeaturedCard({
  entry,
  active,
}: {
  entry: KnowledgeEntry;
  active: boolean;
}) {
  return (
    <Link
      href={`/knowledge/${entry.slug}`}
      className={cn(
        "module-card-soft group flex h-full flex-col gap-3 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        active && "border-primary/30 bg-primary/[0.06]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {knowledgeKindLabels[entry.kind]}
          </p>
          <h3 className="mt-1 font-serif text-lg font-medium tracking-[0.08em] text-foreground">
            {entry.title}
          </h3>
        </div>
        <FavoriteStarButton
          size="sm"
          className="-mr-1 -mt-1 shrink-0"
          item={{
            id: entry.id,
            kind: entry.kind === "term" ? "term" : "knowledge",
            title: entry.title,
            subtitle: entry.summary,
            tags: entry.tags,
          }}
          label="收藏知识卡"
        />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
      <div className="mt-auto pt-1 text-xs font-medium text-foreground/72 transition group-hover:text-foreground">
        查看详情
      </div>
    </Link>
  );
}

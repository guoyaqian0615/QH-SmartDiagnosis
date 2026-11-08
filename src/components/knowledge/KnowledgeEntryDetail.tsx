"use client";

import { ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";
import {
  knowledgeKindLabels,
  type KnowledgeEntry,
  type KnowledgeKind,
} from "@/data/knowledge/catalog";
import { getKnowledgeEntryBySlug } from "@/lib/knowledge/search";
import { cn } from "@/lib/utils";

const KIND_STYLES: Record<KnowledgeKind, string> = {
  term: "border-emerald-200/80 bg-emerald-50/80 text-emerald-900",
  syndrome: "border-amber-200/80 bg-amber-50/80 text-amber-900",
  formula: "border-rose-200/80 bg-rose-50/80 text-rose-900",
  herb: "border-sky-200/80 bg-sky-50/80 text-sky-900",
};

function KnowledgeKindPill({ kind }: { kind: KnowledgeKind }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-[0.08em]",
        KIND_STYLES[kind],
      )}
    >
      {knowledgeKindLabels[kind]}
    </span>
  );
}

export function KnowledgeEntryDetail({
  entry,
}: {
  entry: KnowledgeEntry;
}) {
  const related = (entry.relations ?? [])
    .map((relation) => ({
      relation,
      entry: getKnowledgeEntryBySlug(relation.slug),
    }))
    .filter((item): item is { relation: NonNullable<KnowledgeEntry["relations"]>[number]; entry: KnowledgeEntry } =>
      Boolean(item.entry),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonLink href="/knowledge" label="返回知识库" />
        <div className="text-xs text-muted-foreground">
          <Link href="/knowledge" className="hover:text-foreground">
            知识库
          </Link>
          <span className="mx-1.5 text-muted-foreground/55">/</span>
          <span className="text-foreground">{entry.title}</span>
        </div>
      </div>

      <section className="module-card relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-8 bottom-0 size-32 rounded-full bg-season-accent/[0.08] blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <KnowledgeKindPill kind={entry.kind} />
              <h1 className="mt-4 font-serif text-[2rem] font-medium tracking-[0.11em] text-foreground sm:text-[2.4rem]">
                {entry.title}
              </h1>
              <p className="mt-4 text-sm leading-[1.9] text-foreground/86">{entry.summary}</p>
              {entry.aliases?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.aliases.map((alias) => (
                    <span
                      key={alias}
                      className="rounded-full border border-border/60 bg-background/45 px-3 py-1 text-[11px] text-muted-foreground"
                    >
                      别名 · {alias}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <FavoriteStarButton
              size="sm"
              className="shrink-0"
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

          {entry.facts?.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entry.facts.map((fact) => (
                <div
                  key={`${entry.slug}-${fact.label}`}
                  className="rounded-2xl border border-white/75 bg-white/60 p-4 shadow-[0_8px_24px_rgba(42,50,44,0.05)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{fact.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/88">{fact.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

     {/* 根据关联/标签动态切换列宽，items-stretch天然等高 */}
<div className={`grid gap-6 items-stretch
  ${related.length && entry.tags?.length ? 'lg:grid-cols-[2fr_1fr_1fr]' : ''}
  ${(related.length || entry.tags?.length) && !(related.length && entry.tags?.length) ? 'lg:grid-cols-[3fr_1fr]' : ''}
  ${!related.length && !entry.tags?.length ? 'lg:grid-cols-1' : ''}
`}>
  {/* 左：正文区块 */}
  <section className="space-y-4 h-full flex flex-col">
    {entry.sections?.map((section) => (
      <article key={`${entry.slug}-${section.title}`} className="module-card p-5 sm:p-6 flex-1">
        <h2 className="font-serif text-lg font-medium tracking-[0.08em] text-foreground">
          {section.title}
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {section.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/80" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </article>
    ))}
  </section>

  {/* 中：关联知识 */}
  {related.length ? (
    <section className="h-full">
      <div className="module-card-soft p-4 w-full h-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-foreground">关联知识</h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Knowledge Links
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {related.map(({ relation, entry: relatedEntry }) => (
            <Link
              key={`${entry.slug}-${relation.slug}-${relation.relation}`}
              href={`/knowledge/${relatedEntry.slug}`}
              className="block rounded-2xl border border-border/60 bg-background/60 px-3 py-3 transition hover:border-primary/30 hover:bg-primary/[0.06]"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <Link2 className="size-3.5" />
                <span>{relation.relation}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{relatedEntry.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{knowledgeKindLabels[relatedEntry.kind]}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  ) : null}

  {/* 右：标签，无关联时自动靠右占1份，左侧放大 */}
  {entry.tags?.length ? (
    <section className="h-full">
      <div className="module-card-soft p-4 h-full">
        <h2 className="text-sm font-medium text-foreground">标签</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-background/55 px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  ) : null}
</div>
    </div>
  );
}

function ButtonLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/55 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
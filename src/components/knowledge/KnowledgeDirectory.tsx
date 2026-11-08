"use client";

import { Library, Loader2, ScrollText, Search, Sparkles } from "lucide-react";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { knowledgeKindLabels, type KnowledgeEntry, type KnowledgeKind } from "@/data/knowledge/catalog";
import {
  getKnowledgeEntriesByKindFromEntries,
  paginateKnowledgeEntries,
  searchKnowledgeEntriesFromEntries,
  type KnowledgeFilter,
} from "@/lib/knowledge/search";
import { cn } from "@/lib/utils";

const FILTERS: KnowledgeFilter[] = ["all", "term", "syndrome", "formula", "herb"];
const PAGE_SIZE = 8;

const FILTER_META: Record<KnowledgeFilter, { title: string; description: string; Icon: typeof Library }> = {
  all: {
    title: "全部知识",
    description: "一站式浏览中医术语、证候、方剂和药材知识。",
    Icon: Library,
  },
  term: {
    title: "术语索引",
    description: "快速查询中医专业名词，轻松理解中医用语。",
    Icon: Library,
  },
  syndrome: {
    title: "证候导航",
    description: "了解常见体质与症状，学习对应的调理方法。",
    Icon: Sparkles,
  },
  formula: {
    title: "方意目录",
    description: "学习经典药方，了解配伍与适用场景。",
    Icon: ScrollText,
  },
  herb: {
    title: "药材图鉴",
    description: "认识各类中药材，了解功效与基础用法。",
    Icon: Library,
  },
};

const KIND_STYLES: Record<KnowledgeKind, string> = {
  term: "border-emerald-200/80 bg-emerald-50/80 text-emerald-900",
  syndrome: "border-amber-200/80 bg-amber-50/80 text-amber-900",
  formula: "border-rose-200/80 bg-rose-50/80 text-rose-900",
  herb: "border-sky-200/80 bg-sky-50/80 text-sky-900",
};

type KnowledgeCatalogPayload = {
  entries: KnowledgeEntry[];
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

function KnowledgeDirectoryCard({ entry }: { entry: KnowledgeEntry }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/75 bg-[linear-gradient(165deg,rgba(255,255,255,0.82),rgba(250,252,250,0.68))] p-5 shadow-[0_14px_44px_rgba(42,50,44,0.06)] backdrop-blur-xl backdrop-saturate-[1.06] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_20px_56px_rgba(42,50,44,0.09)]">
      <div
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
        aria-hidden
      />
      <div className="min-w-0">
        <KnowledgeKindPill kind={entry.kind} />
        <h3 className="mt-3 font-serif text-xl font-medium tracking-[0.08em] text-foreground">
          {entry.title}
        </h3>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
      {entry.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-background/45 px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>{entry.relations?.length ?? 0} 条关联知识</span>
        <Link
          href={`/knowledge/${entry.slug}`}
          className="rounded-full border border-border/60 bg-background/65 px-3 py-1.5 font-medium text-foreground/75 transition hover:border-primary/30 hover:bg-primary/[0.06] hover:text-foreground"
        >
          查看详情
        </Link>
      </div>
    </article>
  );
}

function PageButton({
  label,
  active,
  href,
}: {
  label: string;
  active?: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm transition",
        active
          ? "border-primary/30 bg-primary/[0.08] text-foreground shadow-sm"
          : "border-border/60 bg-background/55 text-muted-foreground hover:border-primary/20 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function KnowledgeDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filter, setFilter] = useState<KnowledgeFilter>(
    (searchParams.get("kind") as KnowledgeFilter | null) ?? "all",
  );
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setFilter((searchParams.get("kind") as KnowledgeFilter | null) ?? "all");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/knowledge/catalog", { cache: "no-store" });
        if (!response.ok) throw new Error("知识目录加载失败");
        const data = (await response.json()) as KnowledgeCatalogPayload;
        if (!cancelled) setEntries(data.entries ?? []);
      } catch {
        if (!cancelled) setEntries([]);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const deferredQuery = useDeferredValue(query);
  const currentPage = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const allResults = searchKnowledgeEntriesFromEntries(entries, { query: deferredQuery, kind: filter });
  const paged = paginateKnowledgeEntries(allResults, currentPage, PAGE_SIZE);
  const currentMeta = FILTER_META[filter];
  const canAutoLookup = deferredQuery.trim().length > 0 && allResults.length === 0 && !catalogLoading;

  function syncUrl(next: {
    q?: string;
    kind?: KnowledgeFilter;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    if (typeof next.q === "string") {
      if (next.q.trim()) params.set("q", next.q.trim());
      else params.delete("q");
    }
    if (next.kind) {
      if (next.kind === "all") params.delete("kind");
      else params.set("kind", next.kind);
    }
    if (typeof next.page === "number" && next.page > 1) params.set("page", String(next.page));
    else params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/knowledge/all?${qs}` : "/knowledge/all", { scroll: false });
    });
  }

  function handleFilterChange(next: KnowledgeFilter) {
    setFilter(next);
    syncUrl({ kind: next, q: query, page: 1 });
  }

  const pageLinks = useMemo(() => {
    const totalPages = paged.totalPages;
    const current = paged.page;
    const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  }, [paged.page, paged.totalPages]);

  async function handleLookup() {
    const search = query.trim();
    if (!search) return;

    setLookupError(null);
    setLookupLoading(true);
    try {
      const response = await fetch("/api/knowledge/lookup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ query: search }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        entry?: KnowledgeEntry;
      };
      if (!response.ok || !data.entry) {
        throw new Error(data.error || "知识补全失败");
      }

      startTransition(() => {
        router.push(`/knowledge/${data.entry!.slug}`);
      });
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : "知识补全失败");
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="module-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <currentMeta.Icon className="size-4 text-season-accent/80" />
              <span>Knowledge Directory</span>
            </div>
            <h2 className="mt-2 font-serif text-[1.9rem] font-medium tracking-[0.1em] text-foreground">
              {deferredQuery ? `“${deferredQuery}” 的匹配结果` : currentMeta.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {deferredQuery
                ? "将写入知识库"
                : currentMeta.description}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            第 {paged.page} / {paged.totalPages} 页 · 共 {paged.total} 条
          </div>
        </div>
      </section>

      <section className="module-card p-5 sm:p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            syncUrl({ q: query, kind: filter, page: 1 });
            if (canAutoLookup) void handleLookup();
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索证候、方剂、药材或中医术语"
              className="h-14 rounded-2xl border-white/60 bg-background/55 pl-12 pr-36 text-sm shadow-none"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <Button type="submit" variant="outline" className="h-10 rounded-xl">
                搜索
              </Button>
              <Button type="button" className="h-10 rounded-xl" onClick={() => void handleLookup()} disabled={!query.trim() || lookupLoading}>
                {lookupLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    补全中
                  </>
                ) : (
                  "联网搜索"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => {
              const active = filter === item;
              const count = getKnowledgeEntriesByKindFromEntries(entries, item).length;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleFilterChange(item)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition",
                    active
                      ? "border-primary/30 bg-primary/[0.08] text-foreground shadow-sm"
                      : "border-border/60 bg-background/55 text-muted-foreground hover:border-primary/20 hover:text-foreground",
                  )}
                >
                  {item === "all" ? "全部" : knowledgeKindLabels[item]}
                  <span className="ml-1.5 text-xs text-muted-foreground/85">{count}</span>
                </button>
              );
            })}
          </div>

          {lookupError ? (
            <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {lookupError}
            </p>
          ) : null}

          {canAutoLookup ? (
            <div className="rounded-2xl border border-primary/15 bg-primary/[0.05] p-4 text-sm text-muted-foreground">
              本地知识库暂未命中“{deferredQuery}”。可以直接调用 DeepSeek 搜索并生成结构化知识卡，生成后会自动写入知识库。
            </div>
          ) : null}
        </form>
      </section>

      {catalogLoading ? (
        <div className="module-card flex min-h-[16rem] items-center justify-center p-6 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          知识目录载入中…
        </div>
      ) : paged.items.length ? (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.items.map((entry) => (
              <KnowledgeDirectoryCard key={entry.id} entry={entry} />
            ))}
          </div>

          <div className="module-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              当前展示第 {(paged.page - 1) * paged.pageSize + 1} - {Math.min(paged.page * paged.pageSize, paged.total)} 条
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {paged.hasPrev ? (
                <PageButton href={buildPageHref(searchParams, paged.page - 1)} label="上一页" />
              ) : (
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-border/50 px-3 text-sm text-muted-foreground/60">
                  上一页
                </span>
              )}
              {pageLinks.map((page) => (
                <PageButton key={page} href={buildPageHref(searchParams, page)} label={String(page)} active={page === paged.page} />
              ))}
              {paged.hasNext ? (
                <PageButton href={buildPageHref(searchParams, paged.page + 1)} label="下一页" />
              ) : (
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-border/50 px-3 text-sm text-muted-foreground/60">
                  下一页
                </span>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="module-card flex min-h-[18rem] flex-col items-center justify-center gap-4 p-6 text-center">
          <ScrollText className="size-9 text-season-accent/75" aria-hidden />
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-medium tracking-[0.08em] text-foreground">没有找到合适条目</h3>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              可以尝试更短的关键词，或者直接点击上方“联网搜索”，把新条目生成到知识库中。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function buildPageHref(searchParams: ReturnType<typeof useSearchParams>, page: number) {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  return query ? `/knowledge/all?${query}` : "/knowledge/all";
}

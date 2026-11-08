"use client";

import { Compass, Loader2, Search } from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { KnowledgeBookmarkStrip } from "@/components/knowledge/KnowledgeBookmarkStrip";
import { EditorialMediaSlot } from "@/components/media/EditorialMediaSlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { knowledgeKindLabels, type KnowledgeEntry } from "@/data/knowledge/catalog";
import { getKnowledgeEntriesByKindFromEntries, getKnowledgeStatsFromEntries, type KnowledgeFilter } from "@/lib/knowledge/search";
import { cn } from "@/lib/utils";

type KnowledgeCatalogPayload = {
  entries: KnowledgeEntry[];
};

const FILTERS: Array<Exclude<KnowledgeFilter, "all">> = ["term", "syndrome", "formula", "herb"];

const FILTER_META: Record<Exclude<KnowledgeFilter, "all">, { title: string; description: string; accent: string }> = {
  term: {
    title: "术语索引",
    description: "快速了解专业名词，看懂中医词汇不再难。",
    accent: "from-emerald-100/80 to-emerald-50/30",
  },
  syndrome: {
    title: "证候导航",
    description: "智诊结果最常出现的证候切入，理解病机和治则。",
    accent: "from-amber-100/80 to-amber-50/30",
  },
  formula: {
    title: "方意目录",
    description: "认识每一味药材，了解功效与用法。",
    accent: "from-rose-100/80 to-rose-50/30",
  },
  herb: {
    title: "药材图鉴",
    description: "让药材不只是名字，而是用户能读懂的解释节点。",
    accent: "from-sky-100/80 to-sky-50/30",
  },
};

function KindEntryCard({
  kind,
  count,
}: {
  kind: Exclude<KnowledgeFilter, "all">;
  count: number;
}) {
  const meta = FILTER_META[kind];
  return (
    <Link
      href={`/knowledge/all?kind=${kind}`}
      className="group relative overflow-hidden rounded-3xl border border-white/75 bg-[linear-gradient(165deg,rgba(255,255,255,0.78),rgba(250,252,250,0.62))] p-5 shadow-[0_14px_44px_rgba(42,50,44,0.06)] backdrop-blur-xl backdrop-saturate-[1.06] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_20px_56px_rgba(42,50,44,0.09)]"
    >
      <div className={cn("absolute inset-x-0 top-0 h-24 bg-gradient-to-r opacity-70", meta.accent)} aria-hidden />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-border/55 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {knowledgeKindLabels[kind]}
          </span>
          <span className="text-xs text-muted-foreground">{count} 条</span>
        </div>
        <h3 className="font-serif text-xl font-medium tracking-[0.08em] text-foreground">{meta.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{meta.description}</p>
        <div className="pt-2 text-xs font-medium text-foreground/75 transition group-hover:text-foreground">
          进入目录
        </div>
      </div>
    </Link>
  );
}

export function KnowledgeAtlas() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/knowledge/catalog", { cache: "no-store" });
        if (!response.ok) throw new Error("知识目录加载失败");
        const data = (await response.json()) as KnowledgeCatalogPayload;
        if (!cancelled) {
          setEntries(data.entries ?? []);
        }
      } catch {
        if (!cancelled) {
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = getKnowledgeStatsFromEntries(entries);
  const kindCounts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((kind) => [kind, getKnowledgeEntriesByKindFromEntries(entries, kind).length]),
      ) as Record<Exclude<KnowledgeFilter, "all">, number>,
    [entries],
  );

  function handleSearch() {
    const trimmed = query.trim();
    startTransition(() => {
      router.push(trimmed ? `/knowledge/all?q=${encodeURIComponent(trimmed)}` : "/knowledge/all");
    });
  }

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
      <section className="module-card relative overflow-hidden p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-primary/[0.08] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-12 bottom-0 size-36 rounded-full bg-season-accent/[0.09] blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Knowledge Atlas</p>
              <h2 className="mt-2 font-serif text-2xl font-medium tracking-[0.1em] text-foreground sm:text-[2rem]">
                面向智诊解释层的中医知识库
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              在这里可以快速搜索中医术语、方剂与药材，各类知识分类单独分页，查阅内容清爽不杂乱。
              </p>
            </div>
            
          </div>

          <form
            className="rounded-[1.75rem] border border-white/70 bg-white/65 p-3 shadow-[0_10px_36px_rgba(42,50,44,0.07)] backdrop-blur-xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索证候、方剂、药材或中医术语，例如“肝郁脾虚”“逍遥散”“柴胡”"
                className="h-14 rounded-2xl border-white/60 bg-background/55 pl-12 pr-36 text-sm shadow-none"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <Button type="submit" variant="outline" className="h-10 rounded-xl">
                  搜索
                </Button>
                <Button
                  type="button"
                  className="h-10 rounded-xl"
                  onClick={() => void handleLookup()}
                  disabled={!query.trim() || lookupLoading}
                >
                  {lookupLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      补全中
                    </>
                  ) : (
                    " 联网搜索"
                  )}
                </Button>
              </div>
            </div>
            {lookupError ? (
              <p className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {lookupError}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="module-card p-5 sm:p-6">
        <KnowledgeBookmarkStrip />
      </section>

      <section className="py-8 rounded-3xl bg-[#e2ebe2]/60 px-6 backdrop-blur-sm">
  <div className="mb-7 text-center">
    <h2 className="font-serif text-[2.2rem] tracking-wider text-[#334233]">知识库主题图集</h2>
    <p className="mt-2 text-[#657865]">精选本草药材、中医古籍、经典方药配图，一览中医药风貌</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    <div className="overflow-hidden rounded-2xl">
      {/* 去掉bg底色，只保留relative定位 */}
      <div className="relative h-[220px] w-full">
        <Image src="/brand/p1.jpg" alt="本草药材" fill className="object-cover" />
      </div>
      <div className="p-4 bg-white/70">
        <h3 className="text-lg font-medium text-[#2d3b2d]">本草药材</h3>
        <p className="mt-1 text-sm text-[#627562]">原生药材实拍图鉴</p>
      </div>
    </div>
    <div className="overflow-hidden rounded-2xl">
      <div className="relative h-[220px] w-full">
        <Image src="/brand/p2.jpg" alt="古籍手札" fill className="object-cover" />
      </div>
      <div className="p-4 bg-white/70">
        <h3 className="text-lg font-medium text-[#2d3b2d]">古籍手札</h3>
        <p className="mt-1 text-sm text-[#627562]">中医古医书原稿</p>
      </div>
    </div>
    <div className="overflow-hidden rounded-2xl">
      <div className="relative h-[220px] w-full">
        <Image src="/brand/p3.jpg" alt="方药图谱" fill className="object-cover" />
      </div>
      <div className="p-4 bg-white/70">
        <h3 className="text-lg font-medium text-[#2d3b2d]">方药图谱</h3>
        <p className="mt-1 text-sm text-[#627562]">古方笺与方剂图解</p>
      </div>
    </div>
  </div>
</section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {FILTERS.map((kind) => (
          <KindEntryCard key={kind} kind={kind} count={kindCounts[kind]} />
        ))}
      </section>

      <section className="module-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <Compass className="size-4 text-season-accent/80" />
              <span>Directory Entry</span>
            </div>
            <h3 className="mt-2 font-serif text-xl font-medium tracking-[0.08em] text-foreground">
              进入全部知识目录
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            点击即可进入完整知识大全，按分类浏览全部中医知识条目，包含AI补充生成的专业内容。
            </p>
          </div>
          <Button asChild className="h-11 rounded-xl px-5">
            <Link href="/knowledge/all">查看全部知识</Link>
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="module-card p-6 text-sm text-muted-foreground">知识库概览正在载入…</div>
      ) : null}
    </div>
  );
}

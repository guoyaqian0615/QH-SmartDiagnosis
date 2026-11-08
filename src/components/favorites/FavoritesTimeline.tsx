"use client";

import { motion } from "framer-motion";
import { ArrowUp, BookMarked, ChefHat, Sparkles, Star } from "lucide-react";

import { ModuleEmptyState } from "@/components/shell/ModuleEmptyState";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/stores/toast-store";
import type { FavoriteItem, FavoriteKind } from "@/stores/favorites-store";
import { useFavoritesStore } from "@/stores/favorites-store";

function kindIcon(kind: FavoriteKind) {
  switch (kind) {
    case "formula":
      return Sparkles;
    case "diet":
      return ChefHat;
    case "term":
    case "knowledge":
      return BookMarked;
    default:
      return Star;
  }
}

function kindLabel(kind: FavoriteKind): string {
  switch (kind) {
    case "formula":
      return "方意";
    case "diet":
      return "膳食";
    case "term":
      return "词条";
    case "knowledge":
      return "知识";
    default:
      return "收藏";
  }
}

function TimelineRow({
  item,
  last,
  onRemove,
}: {
  item: FavoriteItem;
  last: boolean;
  onRemove: () => void;
}) {
  const Icon = kindIcon(item.kind);
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="module-icon-pill flex size-11 shrink-0 items-center justify-center text-season-accent">
          <Icon className="size-5" strokeWidth={1.35} aria-hidden />
        </div>
        {!last ? (
          <div
            className="mt-2 w-px flex-1 min-h-[2.5rem] bg-gradient-to-b from-border via-border/50 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="module-card mb-8 min-w-0 flex-1 p-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-primary">
            {kindLabel(item.kind)}
          </span>
          <time className="font-sans text-[11px] text-muted-foreground">{dateStr}</time>
        </div>
        <h2 className="mt-2 font-serif text-lg font-medium tracking-[0.08em] text-foreground">
          {item.title}
        </h2>
        {item.subtitle ? (
          <p className="mt-1 font-sans text-sm leading-relaxed text-muted-foreground">
            {item.subtitle}
          </p>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 font-sans text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={onRemove}
          >
            移出时光轴
          </Button>
        </div>
      </motion.article>
    </div>
  );
}

export function FavoritesTimeline() {
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);
  const { toast } = useToast();
  const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-5xl flex-col gap-6 overflow-y-auto pb-8">
      <ModuleHeader
        icon={Star}
        title="我的收藏"
        description="时光轴记录你点亮的方笺、词条与膳食灵感。"
        badge="Core"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-xs"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="mr-1.5 size-4" />
            回顶部
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <ModuleEmptyState
          icon={Star}
          title="还没有收藏"
          description="去智诊页、首页每日一词或膳食卡片，点一下星星即可加入。"
          ctaHref="/"
          ctaLabel="回首页逛逛"
        />
      ) : (
        <div className="module-card relative p-6">
          {sorted.map((item, i) => (
            <TimelineRow
              key={item.id}
              item={item}
              last={i === sorted.length - 1}
              onRemove={() => {
                remove(item.id);
                toast({
                  tone: "success",
                  title: "已移出收藏",
                  description: item.title,
                });
              }}
            />
          ))}
        </div>
      )}

      {sorted.length > 0 ? (
        <p className="text-center font-sans text-[11px] text-muted-foreground">
          点击条目可在未来版本联动详情（当前为本地示意）。
        </p>
      ) : null}
    </div>
  );
}

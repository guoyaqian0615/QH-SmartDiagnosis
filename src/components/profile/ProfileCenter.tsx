"use client";

import { motion } from "framer-motion";
import { Activity, ArrowUp, BookMarked, Heart, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";

import { ModuleEmptyState } from "@/components/shell/ModuleEmptyState";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useToast } from "@/stores/toast-store";

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProfileCenter() {
  const user = useAuthStore((s) => s.user);
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);
  const { toast } = useToast();

  const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);
  const recent = sorted.slice(0, 5);
  const formulaCount = items.filter((i) => i.kind === "formula").length;
  const knowledgeCount = items.filter((i) => i.kind === "knowledge" || i.kind === "term").length;

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-6 overflow-y-auto pb-8">
      <ModuleHeader
        icon={UserRound}
        title="个人中心"
        description={user?.email ?? "管理个人信息、收藏与常用智诊入口。"}
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

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="module-card p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl tracking-[0.08em] text-foreground">欢迎，{user?.displayName ?? "访客"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email ?? "尚未登录邮箱"}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/55 px-3 py-1 text-xs text-muted-foreground">
            <UserRound className="size-4 text-season-accent" />
            智诊用户
          </span>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="module-stat-card p-6">
          <p className="text-xs text-muted-foreground">总收藏</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{items.length}</p>
        </div>
        <div className="module-stat-card p-6">
          <p className="text-xs text-muted-foreground">方意收藏</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{formulaCount}</p>
        </div>
        <div className="module-stat-card p-6">
          <p className="text-xs text-muted-foreground">知识收藏</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{knowledgeCount}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <Button asChild variant="outline" className="h-11 justify-start gap-2 rounded-xl">
          <Link href="/favorites">
            <Heart className="size-4 text-season-accent" />
            收藏库
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 justify-start gap-2 rounded-xl">
          <Link href="/clinical">
            <Sparkles className="size-4 text-season-accent" />
            智诊辅助
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 justify-start gap-2 rounded-xl">
          <Link href="/constitution">
            <Activity className="size-4 text-season-accent" />
            体质辨识
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 justify-start gap-2 rounded-xl">
          <Link href="/knowledge">
            <BookMarked className="size-4 text-season-accent" />
            知识库
          </Link>
        </Button>
      </section>

      <section className="module-card p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-medium text-foreground">最近收藏</h2>
          <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground">
            <Link href="/favorites">查看全部</Link>
          </Button>
        </div>
        {recent.length === 0 ? (
          <ModuleEmptyState
            icon={Heart}
            title="暂无最近收藏"
            description="先去智诊、体质或知识页收藏内容，这里会自动出现最近记录。"
            ctaHref="/clinical"
            ctaLabel="去智诊辅助"
          />
        ) : (
          <div className="space-y-2">
            {recent.map((item) => (
              <div
                key={item.id}
                className="module-card-soft flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 shrink-0 text-xs text-muted-foreground"
                  onClick={() => {
                    remove(item.id);
                    toast({
                      tone: "success",
                      title: "已取消收藏",
                      description: item.title,
                    });
                  }}
                >
                  取消
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


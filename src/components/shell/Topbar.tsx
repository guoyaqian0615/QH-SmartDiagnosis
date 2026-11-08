"use client";

import { motion } from "framer-motion";
import { Home, LogOut, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ZenModeToggle } from "@/components/zen/ZenModeToggle";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

function formatNow(d: Date) {
  return d.toLocaleString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

export function Topbar() {
  const router = useRouter();
  const { label } = useSeasonTheme();
  const [now, setNow] = useState(() => formatNow(new Date()));
  const toggleXai = useUIStore((s) => s.toggleXai);
  const xaiOpen = useUIStore((s) => s.xaiOpen);
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  useEffect(() => {
    const id = window.setInterval(() => setNow(formatNow(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.header
      layout
      className="bg-white/40 backdrop-blur-2xl backdrop-saturate-150 flex min-w-0 shrink-0 flex-wrap items-center gap-x-2 gap-y-2.5 px-3 py-2.5 sm:gap-x-3 sm:gap-y-2 sm:px-4 sm:py-3 border-b border-white/20 shadow-sm"
    >
      <div className="flex min-w-0 flex-1 basis-[min(100%,18rem)] items-start gap-2 sm:basis-auto sm:items-center sm:gap-3">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="size-11 shrink-0 rounded-xl border-border/70 bg-background/40 sm:size-10"
          title="返回首页"
        >
          <Link href="/" aria-label="返回首页">
            <Home className="size-[1.125rem] text-season-accent" />
          </Link>
        </Button>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            {label}
          </p>
          <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">{now}</p>
        </div>
      </div>

      <div className="relative hidden min-h-10 min-w-0 flex-1 basis-0 md:block md:max-w-md lg:max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <div className="h-10 w-full rounded-xl border border-input/80 bg-background/30 pl-10 pr-3 text-sm leading-10 text-muted-foreground backdrop-blur-sm">
          全局检索…
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ZenModeToggle withLabel className="mr-0.5" size="md" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-xl border-dashed md:hidden"
          aria-label="打开全局检索"
        >
          <Search className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0 rounded-xl text-muted-foreground hover:text-foreground sm:size-10"
          aria-label="退出登录"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
        </Button>
        <Button
          type="button"
          variant={xaiOpen ? "secondary" : "outline"}
          size="sm"
          className="h-11 min-h-11 shrink-0 gap-2 rounded-xl border-dashed px-3 sm:h-9 sm:min-h-0"
          title={xaiOpen ? "收起右侧逻辑链" : "展开逻辑链面板"}
          onClick={toggleXai}
        >
          <Sparkles className="size-4 shrink-0 text-season-accent" />
          <span className="hidden sm:inline">逻辑链</span>
        </Button>
      </div>
    </motion.header>
  );
}
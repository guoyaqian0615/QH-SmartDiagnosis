"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Camera, Home, PanelLeft, Star, Stethoscope, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DbcnetMark } from "@/components/brand/DbcnetMark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useUIStore } from "@/stores/ui-store";

const nav: {
  href: string;
  icon: LucideIcon;
  label: string;
  anchorId?: string;
}[] = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/constitution", icon: Camera, label: "体质辨识" },
  { href: "/clinical", icon: Stethoscope, label: "智诊辅助" },
  { href: "/knowledge", icon: BookOpen, label: "知识库" },
  { href: "/favorites", icon: Star, label: "收藏", anchorId: "favorites-nav-anchor" },
];

export function Sidebar() {
  const pathname = usePathname();
  const expanded = useUIStore((s) => s.sidebarExpanded);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const favCount = useFavoritesStore((s) => s.items.length);

  return (
    <>
      {expanded ? (
        <button
          type="button"
          aria-label="关闭侧栏"
          className="fixed inset-0 z-[70] bg-background/40 backdrop-blur-[3px] transition-opacity lg:hidden"
          onClick={toggleSidebar}
        />
      ) : null}
      <motion.aside
        initial={false}
        animate={{ width: expanded ? "var(--sidebar-expanded)" : "var(--sidebar-collapsed)" }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "floating-sidebar-shell relative z-[80] flex h-full shrink-0 flex-col py-4 pl-[max(0.5rem,env(safe-area-inset-left,0px))] pr-2",
          expanded &&
            "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:z-[80] max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:border-r max-lg:border-border/50 max-lg:shadow-[24px_0_48px_rgba(0,0,0,0.08)] max-lg:py-[max(0.75rem,env(safe-area-inset-top))] max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div
          className={cn(
            "mb-6 flex items-center gap-1 px-1",
            expanded ? "justify-between" : "flex-col gap-2",
          )}
        >
          {expanded ? (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="min-w-0 flex-1"
            >
              <Link
                href="/"
                className="flex min-w-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground transition hover:text-primary"
                title="返回首页"
              >
                <DbcnetMark aria-hidden />
                <span className="truncate">岐黄智诊</span>
              </Link>
            </motion.div>
          ) : (
            <Link
              href="/"
              className="mb-0.5 flex h-12 w-12 items-center justify-center transition hover:opacity-90"
              title="返回首页"
            >
              <DbcnetMark className="!h-11 !w-11" />
            </Link>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-xl sm:h-10 sm:w-10"
            onClick={toggleSidebar}
            aria-label={expanded ? "收起侧栏" : "展开侧栏"}
          >
            <PanelLeft className="size-[1.125rem]" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="主导航">
          {nav.map(({ href, icon: Icon, label, anchorId }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Button
                key={href}
                asChild
                variant="ghost"
                className={cn(
                  "h-12 min-h-12 justify-start gap-3 rounded-2xl px-2 text-muted-foreground hover:text-foreground sm:h-11 sm:min-h-0",
                  !expanded && "justify-center gap-0 px-0",
                  active && "bg-[var(--sidebar-tint)] text-foreground",
                )}
                title={label}
              >
                <Link
                  href={href}
                  id={anchorId}
                  className="relative flex w-full min-w-0 items-center gap-3"
                >
                  <Icon className="size-[1.125rem] shrink-0 text-season-accent" />
                  {expanded ? (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                      className="truncate text-sm font-medium"
                    >
                      {label}
                    </motion.span>
                  ) : null}
                  {href === "/favorites" && favCount > 0 && expanded ? (
                    <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 font-sans text-[10px] font-semibold tabular-nums text-amber-800 dark:text-amber-100">
                      {favCount > 99 ? "99+" : favCount}
                    </span>
                  ) : null}
                </Link>
              </Button>
            );
          })}
        </nav>

        {expanded && user ? (
          <p className="mb-2 truncate px-2 text-[11px] leading-snug text-muted-foreground">
            {user.displayName}
          </p>
        ) : null}

        <div className="mt-auto border-t border-border/60 pt-3">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "h-12 min-h-12 w-full rounded-2xl text-muted-foreground hover:text-foreground sm:h-11 sm:min-h-0",
              expanded ? "justify-start gap-3 px-2" : "justify-center px-0",
            )}
            title="个人中心"
          >
            <Link href="/profile" className="flex w-full items-center">
              <UserRound className="size-[1.125rem] shrink-0 text-season-accent" />
              {expanded ? (
                <span className="ml-3 text-sm font-medium">个人中心</span>
              ) : null}
            </Link>
          </Button>
        </div>
      </motion.aside>
    </>
  );
}

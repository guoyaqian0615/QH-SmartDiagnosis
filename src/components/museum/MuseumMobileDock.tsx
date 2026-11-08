"use client";

import { BookOpen, CalendarDays, Home, Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const dock = [
  { href: "#hero", label: "首页", Icon: Home },
  { href: "#daily-season", label: "时令", Icon: CalendarDays },
  { href: "#modules", label: "模块", Icon: BookOpen },
  { href: "/clinical", label: "智诊", Icon: Stethoscope },
] as const;

/**
 * 窄屏底栏：参考 zzf-album 类落地页的 App 式主导航（玻璃胶囊 + 图标栈）
 */
export function MuseumMobileDock() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <nav
      aria-label="底部快捷导航"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center pb-[max(0.35rem,env(safe-area-inset-bottom,0px))] pt-2 lg:hidden"
    >
      <div
        className={cn(
          "museum-glass-nav pointer-events-auto flex w-[min(22rem,calc(100dvw_-_1.5rem_-_env(safe-area-inset-left,0px)_-_env(safe-area-inset-right,0px)))] items-stretch justify-between gap-0.5 rounded-2xl px-2 py-2 shadow-[0_-8px_40px_rgba(42,50,44,0.08)]",
        )}
      >
        {dock.map(({ href, label, Icon }) => {
          const mappedHref =
            href === "#hero"
              ? isHome
                ? "#hero"
                : "/"
              : href === "#daily-season"
                ? isHome
                  ? "#daily-season"
                  : "/#daily-season"
                : href;
          return mappedHref.startsWith("/") ? (
            <Link
              key={href}
              href={mappedHref}
              className="flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium tracking-wide text-muted-foreground transition active:scale-[0.97] active:bg-stone-100/90 active:text-foreground dark:active:bg-stone-800/80 dark:active:text-foreground"
            >
              <Icon className="size-[1.15rem] shrink-0 text-[color-mix(in_srgb,var(--season-accent)_42%,#78716c)]" aria-hidden />
              {label}
            </Link>
          ) : (
            <a
              key={href}
              href={mappedHref}
              className="flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium tracking-wide text-muted-foreground transition active:scale-[0.97] active:bg-stone-100/90 active:text-foreground dark:active:bg-stone-800/80 dark:active:text-foreground"
            >
              <Icon className="size-[1.15rem] shrink-0 text-[color-mix(in_srgb,var(--season-accent)_42%,#78716c)]" aria-hidden />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

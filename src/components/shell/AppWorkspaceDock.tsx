"use client";

import { BookOpen, Camera, Home, Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "首页", shortLabel: "首页", Icon: Home },
  { href: "/constitution", label: "体质", shortLabel: "体质", Icon: Camera },
  { href: "/clinical", label: "智诊", shortLabel: "智诊", Icon: Stethoscope },
  { href: "/knowledge", label: "知识", shortLabel: "知识", Icon: BookOpen },
] as const;

/**
 * 窄屏底栏：固定主入口，方便回到首页与智诊/体质/知识等。
 */
export function AppWorkspaceDock() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主功能导航"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[75] flex justify-center pb-[max(0.35rem,env(safe-area-inset-bottom,0px))] pt-2 lg:hidden"
    >
      <div
        className={cn(
          "pointer-events-auto flex w-[min(24rem,calc(100dvw-1rem))] items-stretch justify-between gap-0.5 rounded-2xl border border-border/60 px-1.5 py-1.5 shadow-[0_-12px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl",
          "bg-[color-mix(in_srgb,var(--card)_92%,transparent)]",
        )}
      >
        {items.map(({ href, label, shortLabel, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-medium tracking-wide transition active:scale-[0.97]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              title={label}
            >
              <Icon
                className={cn(
                  "size-[1.2rem] shrink-0",
                  active ? "text-season-accent" : "opacity-80",
                )}
                aria-hidden
              />
              <span className="truncate">{shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/constitution", label: "体质辨识" },
  { href: "/clinical", label: "智诊辅助" },
  { href: "/knowledge", label: "知识库" },
  { href: "/favorites", label: "收藏" },
  { href: "/profile", label: "个人中心" },
] as const;

export function ModuleRouteBar() {
  const pathname = usePathname();
  const router = useRouter();
  const current = tabs.find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`));
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!activeRef.current) return;
    activeRef.current.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    function onKeydown(ev: KeyboardEvent) {
      if (!ev.altKey || ev.ctrlKey || ev.shiftKey || ev.metaKey) return;
      const n = Number(ev.key);
      if (!Number.isInteger(n) || n < 1 || n > tabs.length) return;
      ev.preventDefault();
      router.push(tabs[n - 1]!.href);
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [router]);

  return (
    <div className="space-y-2 pb-4">
      <p className="text-xs tracking-[0.04em] text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          首页
        </Link>
        <span className="mx-1 text-muted-foreground/60">/</span>
        <span className="text-foreground">{current?.label ?? "模块"}</span>
        <span className="ml-2 text-[10px] text-muted-foreground/70">
          （Alt+1~5 快速切换）
        </span>
      </p>
      <div className="module-route-wrap scrollbar-hide flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
          return (
            <Link
              key={t.href}
              href={t.href}
              ref={active ? activeRef : null}
              className={cn(
                "module-tab-link",
                active && "module-tab-link-active",
              )}
            >
              {active ? (
                <motion.span
                  layoutId="module-route-active-pill"
                  className="absolute inset-0 -z-10 rounded-lg border border-primary/25 bg-primary/14"
                  transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.52 }}
                />
              ) : null}
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


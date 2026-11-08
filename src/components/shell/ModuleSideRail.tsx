"use client";

import type { LucideIcon } from "lucide-react";
import { BookOpen, Camera, LogOut, Star, Stethoscope, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const MODULE_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/constitution", label: "体质辨识", icon: Camera },
  { href: "/clinical", label: "智诊辅助", icon: Stethoscope },
  { href: "/knowledge", label: "知识库", icon: BookOpen },
  { href: "/favorites", label: "收藏", icon: Star },
  { href: "/profile", label: "个人中心", icon: UserRound },
];

export function ModuleSideRail() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="sticky top-28 hidden h-fit w-60 shrink-0 lg:block">
      <div className="module-card p-3">
        <p className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          模块切换
        </p>
        <nav className="space-y-0.5">
          {MODULE_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-150 hover:bg-background/65 hover:text-foreground",
                  active && "bg-background/80 font-medium text-foreground shadow-sm",
                )}
              >
                <Icon className="size-4 shrink-0 text-season-accent" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-2 border-t border-border/50 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full justify-start rounded-xl px-3 text-muted-foreground hover:text-foreground"
            onClick={() => void handleLogout()}
          >
            <LogOut className="mr-2 size-4 text-season-accent" />
            登出
          </Button>
        </div>
      </div>
    </aside>
  );
}

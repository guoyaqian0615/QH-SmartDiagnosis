import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function ModuleHeader({
  icon: Icon,
  title,
  description,
  badge,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="shrink-0 space-y-3">
      <div className="module-header-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="module-icon-pill flex size-11 items-center justify-center text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="module-title">{title}</h1>
              {badge ? (
                <span className="rounded-full border border-border/60 bg-background/55 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {badge}
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 rounded-xl border-border/70 bg-background/60">
            <Link href="/">
              <Home className="mr-1.5 size-4" />
              首页
            </Link>
          </Button>
          {actions}
        </div>
      </div>
    </header>
  );
}


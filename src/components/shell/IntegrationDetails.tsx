"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type IntegrationDetailsProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

/** 面向工程师/联调的折叠说明，默认不向普通用户展开。 */
export function IntegrationDetails({
  title = "集成与接口说明",
  children,
  className,
}: IntegrationDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-muted/20 text-muted-foreground",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-xs font-medium text-foreground/70 transition hover:bg-muted/30"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? <div className="border-t border-border/40 px-4 py-3 text-[11px] leading-relaxed">{children}</div> : null}
    </div>
  );
}

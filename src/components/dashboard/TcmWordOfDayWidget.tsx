import { BookMarked } from "lucide-react";

import { TCM_WORD_OF_DAY } from "@/data/tcm-word-mock";
import { cn } from "@/lib/utils";

import { DashboardCard } from "./dashboard-card";

export function TcmWordOfDayWidget({ className }: { className?: string }) {
  return (
    <DashboardCard
      className={cn("flex flex-col justify-between gap-6", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          每日一词
        </p>
        <BookMarked
          className="size-5 shrink-0 text-season-accent/90"
          strokeWidth={1.25}
        />
      </div>
      <div className="space-y-4">
        <p
          className="text-balance text-3xl font-semibold leading-none tracking-tight text-foreground sm:text-4xl"
          style={{ fontFamily: "var(--font-serif-stack)" }}
        >
          {TCM_WORD_OF_DAY.term}
        </p>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {TCM_WORD_OF_DAY.gloss}
        </p>
        <p
          className="text-xs italic leading-relaxed text-muted-foreground/90"
          style={{ fontFamily: "var(--font-serif-stack)" }}
        >
          {TCM_WORD_OF_DAY.footnote}
        </p>
      </div>
    </DashboardCard>
  );
}

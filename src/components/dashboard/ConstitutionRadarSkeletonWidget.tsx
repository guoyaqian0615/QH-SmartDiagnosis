import { Radar } from "lucide-react";

import { cn } from "@/lib/utils";

import { DashboardCard } from "./dashboard-card";

export function ConstitutionRadarSkeletonWidget({
  className,
}: {
  className?: string;
}) {
  return (
    <DashboardCard
      className={cn(
        "flex min-h-[240px] flex-col gap-5 overflow-hidden sm:min-h-[280px]",
        className,
      )}
    >
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          体质雷达
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          九种体质分布
        </p>
      </div>

      <div className="relative flex min-h-[180px] flex-1 items-center justify-center sm:min-h-[200px]">
        <div className="relative flex size-[min(72vw,280px)] max-w-[280px] items-center justify-center rounded-full border border-dashed border-border/60 bg-muted/15 sm:size-64">
          <div className="absolute inset-[12%] rounded-full border border-border/40 bg-gradient-to-br from-muted/30 to-transparent animate-pulse" />
          <div className="absolute inset-[28%] rounded-full border border-border/30 bg-muted/20 animate-pulse [animation-delay:150ms]" />
          <div className="absolute inset-[44%] rounded-full border border-border/25 bg-muted/25 animate-pulse [animation-delay:300ms]" />
          <div className="relative z-[1] flex flex-col items-center gap-2 px-4 text-center">
            <Radar
              className="size-9 text-season-accent/85 animate-pulse-soft"
              strokeWidth={1.25}
            />
            <p className="max-w-[11rem] text-xs leading-relaxed text-muted-foreground">
              体质数据待同步，或前往评测以生成雷达图
            </p>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

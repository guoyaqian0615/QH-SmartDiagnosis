"use client";

import type { LucideIcon } from "lucide-react";
import { CloudRain, Leaf, Snowflake, Sun } from "lucide-react";

import { SEASONAL_GUIDE } from "@/data/seasonal-guide-mock";
import { useSeasonTheme, type Season } from "@/hooks/useSeasonTheme";

import { DashboardCard } from "./dashboard-card";

const SEASON_ICONS: Record<Season, { row: LucideIcon[] }> = {
  spring: { row: [Leaf, Sun] },
  summer: { row: [Sun, CloudRain] },
  autumn: { row: [CloudRain, Leaf] },
  winter: { row: [Snowflake, CloudRain] },
};

export function SeasonalGuideWidget({ className }: { className?: string }) {
  const { season } = useSeasonTheme();
  const copy = SEASONAL_GUIDE[season];
  const icons = SEASON_ICONS[season].row;

  return (
    <DashboardCard className={className}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            时令养生
          </p>
          <h2 className="text-balance text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
            {copy.title}
          </h2>
          <p className="inline-flex rounded-full border border-border/70 bg-background/40 px-2.5 py-0.5 text-[0.7rem] font-medium text-season-accent">
            {copy.tag}
          </p>
          <p className="max-w-prose text-pretty text-sm leading-[1.75] text-muted-foreground">
            {copy.body}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 pt-1">
          {icons.map((Icon, index) => (
            <Icon
              key={`${season}-${index}`}
              className="size-7 text-season-accent/90 sm:size-8"
              strokeWidth={1.25}
            />
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

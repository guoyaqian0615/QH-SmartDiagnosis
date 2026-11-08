"use client";

import { useEffect, useMemo, useState } from "react";

import type { Season } from "@/types/season";

export type { Season } from "@/types/season";

const SEASON_CLASSES: Season[] = ["spring", "summer", "autumn", "winter"];

export function getSeasonFromDate(date: Date): Season {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function syncDocumentSeason(season: Season) {
  const root = document.documentElement;
  for (const s of SEASON_CLASSES) {
    root.classList.remove(`season-${s}`);
  }
  root.classList.add(`season-${season}`);
  root.dataset.season = season;
}

/**
 * Binds the current calendar season (by local month) to `<html>` classes
 * and keeps them in sync if the month changes while the app stays open.
 */
export function useSeasonTheme() {
  const [season, setSeason] = useState<Season>(() =>
    getSeasonFromDate(new Date()),
  );

  const label = useMemo(() => {
    const map: Record<Season, string> = {
      spring: "春 · 生发",
      summer: "夏 · 蕃秀",
      autumn: "秋 · 容平",
      winter: "冬 · 闭藏",
    };
    return map[season];
  }, [season]);

  const seasonZh = useMemo(() => {
    const map: Record<Season, string> = {
      spring: "春",
      summer: "夏",
      autumn: "秋",
      winter: "冬",
    };
    return map[season];
  }, [season]);

  /** 与首页 `museum-airy` 色系说明一致，便于文案展示 */
  const themeSkinLabel = useMemo(() => {
    const map: Record<Season, string> = {
      spring: "春令 · 竹青淡雅",
      summer: "夏令 · 朱荷温润",
      autumn: "秋令 · 银杏鎏金",
      winter: "冬令 · 墨韵深沉",
    };
    return map[season];
  }, [season]);

  const calendarSeasonHint = useMemo(() => {
    const map: Record<Season, string> = {
      spring: "本站按公历月份划分四时：3–5 月为春（与界面春令皮肤一致）",
      summer: "本站按公历月份划分四时：6–8 月为夏（与界面夏令皮肤一致）",
      autumn: "本站按公历月份划分四时：9–11 月为秋（与界面秋令皮肤一致）",
      winter: "本站按公历月份划分四时：12–2 月为冬（与界面冬令皮肤一致）",
    };
    return map[season];
  }, [season]);

  useEffect(() => {
    syncDocumentSeason(season);
  }, [season]);

  useEffect(() => {
    const refresh = () => {
      const next = getSeasonFromDate(new Date());
      setSeason((current) => (current === next ? current : next));
    };
    const id = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return { season, label, seasonZh, themeSkinLabel, calendarSeasonHint };
}

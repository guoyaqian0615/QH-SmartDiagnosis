"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  CalendarDays,
  Leaf,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";
import { getDailyTcmForDate } from "@/data/daily-tcm";
import { SEASONAL_WELLNESS } from "@/data/seasonal-wellness";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { getSolarTermName } from "@/lib/solar-term";

function formatZhCalendar(d: Date): string {
  return d.toLocaleDateString("zh-CN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MuseumDailySeason() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const { season, seasonZh, label, themeSkinLabel, calendarSeasonHint } = useSeasonTheme();

  const daily = now ? getDailyTcmForDate(now) : null;
  const solar = now ? getSolarTermName(now) : null;
  const wellness = SEASONAL_WELLNESS[season];

  // 翻转动画变体：Y轴180°翻转 + 透明度
  const flipVariants = {
    hidden: { rotateY: 180, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  };

  return (
    <section
      id="home-bento"
      className="relative z-10 scroll-mt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-20 pt-12 sm:pb-24 sm:pt-16 lg:scroll-mt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))]"
    >
      <div className="relative mx-auto max-w-6xl">

        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col gap-[4px]">
                <span className="h-[1rem] w-[1.5px] rounded-full bg-[color-mix(in_srgb,var(--season-accent)_50%,transparent)]" />
                <span className="h-[0.5rem] w-[1.5px] rounded-full bg-[color-mix(in_srgb,var(--season-accent)_26%,transparent)]" />
              </div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Rhythm · 时令场域
              </p>
            </div>

            <div className="scrollbar-hide -mx-1 flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-0.5 font-sans text-[13px] text-muted-foreground sm:text-[14px] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300/85 bg-white/78 px-3 py-1.5 shadow-sm dark:border-stone-500/40 dark:bg-stone-900/50 sm:py-1">
                <CalendarDays className="size-3.5 text-muted-foreground" aria-hidden />
                <span className="text-foreground/90" suppressHydrationWarning>
                  {now ? formatZhCalendar(now) : "载入本机日期…"}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300/85 bg-white/78 px-3 py-1.5 shadow-sm dark:border-stone-500/40 dark:bg-stone-900/50 sm:py-1">
                <Sparkles className="size-3.5 text-[color-mix(in_srgb,var(--season-accent)_52%,#6b6560)]" aria-hidden />
                节气（公历近似）·{" "}
                <strong className="font-medium text-foreground" suppressHydrationWarning>
                  {solar ?? "…"}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-start gap-1.5 lg:max-w-sm lg:items-end">
            <p className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              四时 · 界面主题
            </p>
            <p className="text-left font-serif text-[16px] font-medium tracking-[0.06em] text-foreground lg:text-right">
              当前为 <strong className="text-[color-mix(in_srgb,var(--season-accent)_65%,#b8b0a0)] dark:text-[color-mix(in_srgb,var(--season-accent)_70%,#d4ccc0)]">{seasonZh}</strong>
              季 · {label}
            </p>
            <p className="max-w-md text-left font-sans text-[13px] leading-relaxed text-muted-foreground sm:text-[14px] lg:text-right">
              主题皮肤：<span className="font-medium text-foreground">{themeSkinLabel}</span>
            </p>
            <p className="max-w-md text-left font-sans text-[12px] leading-relaxed text-muted-foreground/90 lg:text-right">
              {calendarSeasonHint}
            </p>
          </div>
        </motion.div>

        {/* 卡片容器：桌面端三等分、一行排列、等宽等高 */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 !scale-[0.92] origin-top"
          style={{ perspective: "1200px" }}
        >
          {/* 每日一词 */}
          <motion.article
            variants={flipVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, delay: 0.05, ease: "easeOut" }}
            className="museum-glass-card relative flex min-h-[18rem] flex-col rounded-[1.4rem] p-5 sm:p-6"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="mb-4 flex min-w-0 items-center justify-between gap-3 border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <BookMarked className="size-4 text-[color-mix(in_srgb,var(--season-accent)_50%,#78716c)]" />
                <h2 className="font-serif text-[16px] font-medium">每日一词</h2>
              </div>
              {daily && <FavoriteStarButton
                className="shrink-0 text-muted-foreground hover:bg-white/50"
                item={{
                  id: `term-${daily.term}`,
                  kind: "term",
                  title: daily.term,
                  subtitle: daily.gloss,
                  tags: ["每日一词", seasonZh],
                }}
              />}
            </div>

            <div className="mb-3 h-px w-10 bg-[color-mix(in_srgb,var(--season-accent)_30%,transparent)]" />
            <p className="font-serif text-[clamp(2rem,5.5vw,3rem)] font-medium tracking-[0.1em]">
              {daily?.term ?? "…"}
            </p>
            {daily?.reading && (
              <p className="mt-2 text-[13px] text-muted-foreground">
                {daily.reading}
              </p>
            )}
            <p className="mt-4 flex-1 text-[14px] leading-[1.7] text-muted-foreground">
              {daily?.gloss ?? "加载中…"}
            </p>
          </motion.article>

          {/* 时令养生 */}
          <motion.article
            variants={flipVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
            className="museum-glass-card relative flex min-h-[18rem] flex-col rounded-[1.4rem] p-5 sm:p-6"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-2">
              <Leaf className="size-4 text-[color-mix(in_srgb,var(--season-accent)_50%,#78716c)]" />
              <h2 className="font-serif text-[16px] font-medium">时令养生</h2>
            </div>
            <div className="mb-2 inline-flex items-center gap-1.5 self-start rounded-full border border-[color-mix(in_srgb,var(--season-accent)_18%,transparent)] bg-[color-mix(in_srgb,var(--season-accent)_6%,white)] px-2 py-0.5">
              <span className="h-1 w-1 rounded-full bg-[color-mix(in_srgb,var(--season-accent)_60%,transparent)]" />
              <span className="text-[10px]">{seasonZh}令</span>
            </div>
            <h3 className="font-serif text-[1.1rem] font-medium">{wellness.title}</h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground">
              起居 · {wellness.advice}
            </p>
            <p className="mt-1 text-[13px] leading-[1.6] text-muted-foreground">
              膳食 · {wellness.diet}
            </p>
          </motion.article>

          {/* 体质测算 */}
          <motion.div
            variants={flipVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <Link
              href="/constitution"
              className="museum-glass-card group flex min-h-[18rem] h-full flex-col justify-between rounded-[1.4rem] p-5 sm:p-6 hover:-translate-y-0.5 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color-mix(in_srgb,var(--season-accent)_55%,transparent)]" />
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">体质测算</p>
                </div>
                <h3 className="font-serif text-[1.3rem] font-medium">问卷</h3>
                <div className="mt-2 mb-2 h-px w-8 bg-[color-mix(in_srgb,var(--season-accent)_28%,transparent)]" />
                <p className="text-[13px] text-muted-foreground">体质辨识入口</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[color-mix(in_srgb,var(--season-accent)_72%,#6b6560)]">
                进入工作台
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </motion.div>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground/70">
          全站皮肤随四时联动；文意为科普示意，具体诊疗请遵医嘱。
        </p>
      </div>
    </section>
  );
}
"use client";

import Link from "next/link";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";
import { cn } from "@/lib/utils";
import type { FavoriteItem } from "@/stores/favorites-store";
import type { PrescriptionLine } from "@/types/clinical-inference";

type PrescriptionScrollCardProps = {
  title?: string;
  lines: PrescriptionLine[];
  sealNumber?: string;
  className?: string;
  titleHref?: string | null;
  herbHrefs?: Record<string, string | null | undefined>;
  /** 传入则显示可收藏星标 */
  favorite?: Omit<FavoriteItem, "createdAt">;
};

export function PrescriptionScrollCard({
  title = "方意笺",
  lines,
  sealNumber = "叁",
  className,
  titleHref,
  herbHrefs,
  favorite,
}: PrescriptionScrollCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-br from-white/[0.42] via-white/[0.28] to-white/[0.18] p-4 shadow-[0_12px_40px_rgba(42,50,44,0.08)] backdrop-blur-xl backdrop-saturate-[1.15]",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0%,transparent_42%,rgba(255,255,255,0.08)_100%)]",
        className,
      )}
    >
      <div className="relative z-[1] flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-stone-200/70 pb-2">
            <div className="flex items-baseline gap-2">
              <p
                className="font-serif text-[11px] font-medium tracking-[0.28em] text-stone-500"
                style={{ fontFamily: "var(--font-noto-serif), var(--font-serif-stack)" }}
              >
                {titleHref ? (
                  <Link href={titleHref} className="transition hover:text-stone-700">
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </p>
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-stone-400">
                Rx
              </span>
            </div>
            {favorite ? (
              <FavoriteStarButton item={favorite} size="sm" label="收藏此方笺" />
            ) : null}
          </div>
          <ul className="space-y-2">
            {lines.map((row, i) => (
              <li
                key={`${row.herb}-${i}`}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-dashed border-stone-200/50 pb-1.5 last:border-0"
              >
                {herbHrefs?.[row.herb] ? (
                  <Link
                    href={herbHrefs[row.herb] as string}
                    className="min-w-[3.8rem] text-[12px] leading-snug text-stone-800 transition hover:text-season-accent"
                    style={{
                      fontFamily: "var(--font-noto-serif), var(--font-serif-stack)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {row.herb}
                  </Link>
                ) : (
                  <span
                    className="min-w-[3.8rem] text-[12px] leading-snug text-stone-800"
                    style={{
                      fontFamily: "var(--font-noto-serif), var(--font-serif-stack)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {row.herb}
                  </span>
                )}
                {row.dosage ? (
                  <span className="font-sans text-[11px] text-stone-500">
                    {row.dosage}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-[#c45c5c]/90 bg-gradient-to-br from-[#e8a0a0]/95 via-[#d06060] to-[#a83838] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_rgba(160,50,50,0.25)]"
          aria-hidden
        >
          <span
            className="select-none text-[14px] font-semibold tabular-nums text-white/95 [text-shadow:0_1px_0_rgba(0,0,0,0.15)]"
            style={{ fontFamily: "var(--font-noto-serif), var(--font-serif-stack)" }}
          >
            {sealNumber}
          </span>
        </div>
      </div>
      <p className="relative z-[1] mt-3 font-sans text-[9px] leading-relaxed text-stone-400">
        示意笺 · 临床请以医师处方与医嘱为准
      </p>
    </div>
  );
}
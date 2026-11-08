"use client";

import { forwardRef } from "react";

import type { RadarDatum } from "@/components/constitution/ConstitutionRadarChart";
import { ConstitutionRadarChart } from "@/components/constitution/ConstitutionRadarChart";
import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";

export type ConstitutionHeirloomReportProps = {
  result: ConstitutionScreeningResponse;
  radarData: RadarDatum[];
};

export const ConstitutionHeirloomReport = forwardRef<
  HTMLDivElement,
  ConstitutionHeirloomReportProps
>(function ConstitutionHeirloomReport({ result, radarData }, ref) {
  const dateStr = new Date().toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      ref={ref}
      className="w-[390px] shrink-0 rounded-[2rem] border border-stone-200/90 bg-gradient-to-b from-[#faf9f6] via-[#f6f4ef] to-[#efeae2] p-8 shadow-2xl"
      style={{ fontFamily: "var(--font-noto-serif), var(--font-serif-stack), serif" }}
    >
      <header className="border-b border-stone-300/60 pb-5 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-stone-500">
          本草智诊
        </p>
        <h1 className="mt-2 text-[1.35rem] font-medium tracking-[0.18em] text-stone-800">
          传家体质笺
        </h1>
        <p className="mt-2 font-sans text-[11px] text-stone-500">{dateStr}</p>
      </header>

      <div className="mt-6 rounded-2xl border border-stone-200/70 bg-white/50 p-4">
        <ConstitutionRadarChart data={radarData} />
      </div>

      <section className="mt-6 space-y-2">
        <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
          体质叙事
        </h2>
        <p className="whitespace-pre-wrap rounded-2xl border border-stone-200/80 bg-white/45 p-4 font-sans text-[13px] leading-[1.9] text-stone-800">
          {result.narrative}
        </p>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
          分布
        </h2>
        <ul className="space-y-2 font-sans text-[12.5px] text-stone-700">
          {result.constitutionTypes.map((c) => {
            const pct = c.score;
            return (
              <li key={c.code} className="flex justify-between border-b border-stone-200/50 pb-1">
                <span>{c.label}</span>
                <span className="tabular-nums text-stone-500">{pct.toFixed(0)}%</span>
              </li>
            );
          })}
        </ul>
      </section>

      {result.cautions?.length ? (
        <section className="mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/80 p-4">
          <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-amber-900/70">
            提示
          </h2>
          {result.cautions.map((c) => (
            <p key={c} className="mt-2 font-sans text-[12px] leading-relaxed text-amber-950/85">
              {c}
            </p>
          ))}
        </section>
      ) : null}

      <footer className="mt-8 border-t border-stone-300/50 pt-5 text-center">
        <p className="font-sans text-[10px] leading-relaxed text-stone-400">
          本笺为体质倾向示意，非医疗诊断。
          <br />
          本草智诊 · 问卷体质辨识
        </p>
      </footer>
    </div>
  );
});

"use client";

import { forwardRef } from "react";

import type { LogicGraphNode } from "@/stores/logic-graph-store";
import type { ClinicalInferenceResponse } from "@/types/clinical-inference";

export type ClinicalHeirloomReportProps = {
  result: ClinicalInferenceResponse;
  chiefComplaint: string;
  /** 逻辑链节点摘要，导出时用于静态呈现 */
  graphNodes: LogicGraphNode[];
  seasonalHint: string;
};

export const ClinicalHeirloomReport = forwardRef<
  HTMLDivElement,
  ClinicalHeirloomReportProps
>(function ClinicalHeirloomReport(
  { result, chiefComplaint, graphNodes, seasonalHint },
  ref,
) {
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
          传家辨证笺
        </h1>
        <p className="mt-2 font-sans text-[11px] text-stone-500">{dateStr}</p>
      </header>

      <section className="mt-6 space-y-2">
        <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
          主诉摘要
        </h2>
        <p className="rounded-2xl border border-stone-200/80 bg-white/50 p-4 font-sans text-[13px] leading-[1.85] text-stone-700">
          {chiefComplaint.trim() || "（未填写主诉）"}
        </p>
      </section>

      <section className="mt-6 space-y-2">
        <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
          辨证叙事
        </h2>
        <p className="whitespace-pre-wrap rounded-2xl border border-stone-200/80 bg-white/45 p-4 font-sans text-[13px] leading-[1.9] text-stone-800">
          {result.narrative}
        </p>
      </section>

      {result.syndromeLabels?.length ? (
        <section className="mt-5">
          <h2 className="mb-2 text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
            证候标签
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {result.syndromeLabels.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#3d6b5c]/25 bg-[#3d6b5c]/10 px-3 py-1 font-sans text-[11px] font-medium text-[#2a4a40]"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {typeof result.confidence === "number" ? (
        <section className="mt-5">
          <p className="text-center font-sans text-[11px] text-stone-500">
            当前把握度 {(result.confidence * 100).toFixed(0)}%
          </p>
          {result.engine ? (
            <p className="mt-1 text-center font-sans text-[11px] text-stone-400">
              {result.engine.mode === "graph-llm"
                ? "知识图谱检索 + DeepSeek 约束生成"
                : "知识图谱检索 + 规则生成"}
            </p>
          ) : null}
        </section>
      ) : null}

      {result.prescription?.lines?.length ? (
        <section className="mt-6 space-y-2">
          <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
            方意示意
          </h2>
          <ul className="space-y-2 rounded-2xl border border-stone-200/70 bg-white/40 p-4">
            {result.prescription.lines.map((row, index) => (
              <li
                key={`${row.herb}-${index}`}
                className="flex justify-between border-b border-dashed border-stone-200/60 pb-2 font-sans text-[13px] text-stone-800 last:border-0"
              >
                <span>{row.herb}</span>
                {row.dosage ? <span className="text-stone-500">{row.dosage}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.causeAnalysis?.length ? (
        <section className="mt-6 space-y-2">
          <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
            成因分析
          </h2>
          <ul className="space-y-2 rounded-2xl border border-stone-200/70 bg-white/35 p-4 font-sans text-[12.5px] leading-relaxed text-stone-700">
            {result.causeAnalysis.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#4a7c6a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.dietSuggestions?.length || result.lifestyleSuggestions?.length ? (
        <section className="mt-6 space-y-2">
          <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
            调理建议
          </h2>
          <ul className="space-y-2 rounded-2xl border border-stone-200/70 bg-white/35 p-4 font-sans text-[12.5px] leading-relaxed text-stone-700">
            {[...(result.dietSuggestions ?? []), ...(result.lifestyleSuggestions ?? [])]
              .slice(0, 5)
              .map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#4a7c6a]" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 space-y-2">
        <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
          逻辑链 · 图谱摘要
        </h2>
        <div className="rounded-2xl border border-stone-200/70 bg-white/35 p-4">
          <ul className="space-y-2 font-sans text-[13px] text-stone-700">
            {graphNodes
              .filter((node) => node.label)
              .map((node) => (
                <li key={node.id} className="flex items-center gap-2">
                  <span className="size-1.5 shrink-0 rounded-full bg-[#4a7c6a]" />
                  <span>{node.label}</span>
                  {node.role ? (
                    <span className="text-[11px] text-stone-400">（{node.role}）</span>
                  ) : null}
                </li>
              ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/80 p-4">
        <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-amber-900/70">
          养生随记
        </h2>
        <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-amber-950/85">
          {seasonalHint}
        </p>
      </section>

      {result.cautions?.length ? (
        <section className="mt-6 rounded-2xl border border-stone-200/70 bg-white/40 p-4">
          <h2 className="text-center text-[12px] font-medium tracking-[0.2em] text-stone-500">
            结果提示
          </h2>
          <div className="mt-2 space-y-2 font-sans text-[11.5px] leading-relaxed text-stone-500">
            {result.cautions.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mt-8 border-t border-stone-300/50 pt-5 text-center">
        <p className="font-sans text-[10px] leading-relaxed text-stone-400">
          本笺为健康科普示意，非医疗诊断；不适请及时就医。
          <br />
          本草智诊 · DBCNet · 文本问诊中医智能辅助

        </p>
      </footer>
    </div>
  );
});

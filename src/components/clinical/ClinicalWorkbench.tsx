"use client";

import { ArrowUp, Download, Loader2, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { PrescriptionScrollCard } from "@/components/clinical/PrescriptionScrollCard";
import { ClinicalHeirloomReport } from "@/components/reports/ClinicalHeirloomReport";
import { IntegrationDetails } from "@/components/shell/IntegrationDetails";
import { LogicGraphCanvas } from "@/components/shell/LogicGraphCanvas";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { requestClinicalInference } from "@/lib/api/clinical-inference";
import { createDefaultConstitutionContext, summarizeConstitutionContext } from "@/lib/clinical/constitution-context";
import { hasPublicApiOrigin } from "@/lib/api/public-origin";
import {
  buildInterimGraphFromComplaint,
  graphFromInferenceResponse,
} from "@/lib/clinical-graph";
import { downloadElementAsPng } from "@/lib/heirloom-report";
import { resolveKnowledgeHref } from "@/lib/knowledge/search";
import { cn } from "@/lib/utils";
import {
  isConstitutionProfileFresh,
  useConstitutionProfileStore,
} from "@/stores/constitution-profile-store";
import { useLogicGraphStore } from "@/stores/logic-graph-store";
import { useToast } from "@/stores/toast-store";
import { useUIStore } from "@/stores/ui-store";
import type { ClinicalInferenceResponse } from "@/types/clinical-inference";

function InsightListCard({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-border/60 bg-background/45 p-4">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground/85">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/80" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ClinicalWorkbench() {
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [fourNotes, setFourNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClinicalInferenceResponse | null>(null);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { themeSkinLabel } = useSeasonTheme();
  const latestConstitutionProfile = useConstitutionProfileStore((s) => s.latest);
  const graphNodes = useLogicGraphStore((s) => s.nodes);
  const setXaiOpen = useUIStore((s) => s.setXaiOpen);
  const setStreaming = useLogicGraphStore((s) => s.setStreaming);
  const setComplete = useLogicGraphStore((s) => s.setComplete);
  const { toast } = useToast();
  // 体质记录超过有效期（默认 90 天）后按默认先验处理，并提示重新测评
  const constitutionContext = isConstitutionProfileFresh(latestConstitutionProfile)
    ? latestConstitutionProfile.context
    : createDefaultConstitutionContext();
  const hasScreeningPrior = constitutionContext.source === "screening";
  const constitutionSummary = summarizeConstitutionContext(constitutionContext);
  const syndromeTagLinks = Object.fromEntries(
    (result?.syndromeLabels ?? []).map((tag) => [tag, resolveKnowledgeHref({ kind: "syndrome", title: tag })]),
  );
  const formulaHref = result?.prescription?.title
    ? resolveKnowledgeHref({ kind: "formula", title: result.prescription.title })
    : null;
  const herbHrefs = Object.fromEntries(
    (result?.prescription?.lines ?? []).map((line) => [line.herb, resolveKnowledgeHref({ kind: "herb", title: line.herb })]),
  );

  const seasonalHint = `${themeSkinLabel}；饮食有节，起居有常，情绪舒畅为要。`;

  useLayoutEffect(() => {
    setXaiOpen(true);
  }, [setXaiOpen]);

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      const state = useLogicGraphStore.getState();
      if (state.activeEdgeCount < state.edges.length) {
        state.revealNextEdge();
      }
    }, 200);

    return () => window.clearInterval(id);
  }, [loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const complaint = chiefComplaint.trim();
    setXaiOpen(true);

    const interim = buildInterimGraphFromComplaint(complaint);
    setStreaming(interim.nodes, interim.edges);
    setLoading(true);

    try {
      const data = await requestClinicalInference({
        chiefComplaint: complaint,
        fourExaminationsNotes: fourNotes.trim() || undefined,
        constitutionContext,
        locale: "zh-CN",
      });

      setResult(data);
      const graph = graphFromInferenceResponse(data, complaint);
      setComplete(graph.nodes, graph.edges);
      toast({
        tone: "success",
        title: "辨证结果已生成",
        description: "已更新叙事、建议与逻辑链。",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
      setComplete(interim.nodes, interim.edges);
      toast({
        tone: "error",
        title: "生成失败",
        description: err instanceof Error ? err.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleHeirloomExport() {
    if (!reportRef.current) return;

    setExporting(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      await downloadElementAsPng(
        reportRef.current,
        `岐黄智诊-传家辨证笺-${new Date().toISOString().slice(0, 10)}.png`,
      );
      toast({
        tone: "success",
        title: "已导出报告",
      });
    } catch {
      toast({
        tone: "error",
        title: "导出失败",
        description: "请稍后再试。",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-8">
      <ModuleHeader
        icon={Stethoscope}
        title="智诊辅助"
        description="录入主诉与四诊摘要，生成可解释的规则推理结果、诱因分析与调理建议；结果仅供辅助参考。"
        badge="Core"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-xs"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="mr-1.5 size-4" />
            回到顶部
          </Button>
        }
      />

      <div className="grid min-h-[70vh] flex-1 gap-6 lg:grid-cols-12">
        {/* ========== 左侧：输入框 + 知识图谱 + 处方卡片（全部放左边） ========== */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <form onSubmit={onSubmit} className="module-card p-6">
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint" className="text-foreground">
                主诉与现病史
              </Label>
              <textarea
                id="chiefComplaint"
                name="chiefComplaint"
                required
                rows={5}
                value={chiefComplaint}
                onChange={(event) => setChiefComplaint(event.target.value)}
                placeholder="尽量按时间顺序描述：起病、主要不适、诱发或缓解因素、伴随症状。"
                className="w-full resize-y rounded-2xl border border-input/80 bg-background/60 px-4 py-3 text-sm leading-[1.75] text-foreground outline-none ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fourNotes" className="text-foreground">
                四诊摘要 <span className="font-normal text-muted-foreground">（可选）</span>
              </Label>
              <textarea
                id="fourNotes"
                name="fourNotes"
                rows={4}
                value={fourNotes}
                onChange={(event) => setFourNotes(event.target.value)}
                placeholder="可补充望闻问切要点，如睡眠、食欲、二便、怕冷怕热等。"
                className="w-full resize-y rounded-2xl border border-input/80 bg-background/60 px-4 py-3 text-sm leading-[1.75] text-foreground outline-none ring-offset-background placeholder:text-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="h-12 rounded-2xl text-[15px] shadow-sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  正在生成…
                </>
              ) : (
                "生成辨证参考"
              )}
            </Button>
          </form>

                    
          {result?.prescription?.lines?.length ? (
  <PrescriptionScrollCard
    title={result.prescription.title}
    lines={result.prescription.lines}
    sealNumber={result.prescription.sealNumber}
    titleHref={formulaHref}
    herbHrefs={herbHrefs}
    favorite={{
      id: `rx-${result.prescription.lines.map((line) => line.herb).join("-")}`,
      kind: "formula",
      title: result.prescription.title ?? "辨证方意",
      subtitle: result.syndromeLabels?.join(" · "),
      tags: result.syndromeLabels ?? [],
    }}
  />
) : null}

          <section className="rounded-2xl border border-border/60 bg-background/45 p-4 text-sm leading-relaxed text-muted-foreground">
            
            <p className="mt-2">{constitutionSummary}</p>
            {!hasScreeningPrior ? (
              <Button asChild variant="outline" size="sm" className="mt-3 h-9 rounded-xl">
                <Link href="/constitution">先做体质辨识</Link>
              </Button>
            ) : null}
          </section>

          <IntegrationDetails title="开发者 · 接口与字段">
            <p>
              推理端点：
              <code className="rounded bg-muted/80 px-1">
                {hasPublicApiOrigin() ? "POST /v1/clinical/inference" : "POST /api/clinical/inference"}
              </code>
              ，请求字段包含
              <code className="rounded bg-muted/80 px-1">chiefComplaint</code>
              与
              <code className="rounded bg-muted/80 px-1">fourExaminationsNotes</code>
              。
            </p>
            <p className="mt-2">
              响应除
              <code className="rounded bg-muted/80 px-1">narrative</code>
              、
              <code className="rounded bg-muted/80 px-1">syndromeLabels</code>
              、
              <code className="rounded bg-muted/80 px-1">evidenceGraph</code>
              外，还会返回
              <code className="rounded bg-muted/80 px-1">causeAnalysis</code>
              、
              <code className="rounded bg-muted/80 px-1">dietSuggestions</code>
              、
              <code className="rounded bg-muted/80 px-1">lifestyleSuggestions</code>
              与
              <code className="rounded bg-muted/80 px-1">followUpQuestions</code>
              。
            </p>
            <p className="mt-2">
              若已完成体质辨识，请求还会携带
              <code className="rounded bg-muted/80 px-1">constitutionContext</code>
              ，用于把体质倾向作为图谱检索先验输入。
            </p>
            <p className="mt-2">
              当前未配置
              <code className="rounded bg-muted/80 px-1">NEXT_PUBLIC_API_BASE</code>
              时，页面会使用仓库内置的本地规则推理演示。
            </p>
          </IntegrationDetails>
        </div>

        {/* ========== 右侧：只保留辨证结果（不放处方） ========== */}
        <div className="flex min-h-[70vh] flex-col gap-6 lg:col-span-8">
          {(loading || result) ? (
            <section className="module-card border-primary/25 p-5 shadow-md ring-1 ring-primary/10">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-serif text-lg font-semibold text-foreground">辨证推理链</h2>
                  <span className="text-xs text-muted-foreground">症→证→治→药</span>
                </div>
                <div className="flex flex-wrap gap-2.5 text-xs font-medium text-foreground/80">
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-emerald-400"></span>症</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-blue-400"></span>证</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-purple-400"></span>治</span>
                  <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-amber-500"></span>药</span>
                </div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 p-2">
                <LogicGraphCanvas className="!min-h-[22rem]" />
              </div>
            </section>
          ) : null}

          <div
            className={cn(
              "flex flex-1 flex-col rounded-2xl p-6",
              result || loading ? "module-card" : "module-card border-dashed",
            )}
          >
            {!result && !loading ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
                <div className="rounded-full border border-border/60 bg-background/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  输出预览
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  提交后，辨证叙事、成因分析、调理建议与上方辨证推理链会同步呈现，便于对照复核推理路径。
                </p>
              </div>
            ) : null}

            {loading && !result ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
                <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">正在合参辨证…</p>
                  <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                    上方「辨证推理链」会根据主诉先行展开占位路径，返回后再替换为完整证据链。
                  </p>
                </div>
              </div>
            ) : null}

            {result ? (
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-serif text-lg font-medium text-foreground">辨证参考</h2>
                    {typeof result.confidence === "number" ? (
                      <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        当前把握度 {(result.confidence * 100).toFixed(0)}%
                      </span>
                    ) : null}
                    {result.engine ? (
                      <span className="rounded-full border border-border/60 bg-background/55 px-3 py-1 text-xs text-muted-foreground">
                        {result.engine.mode === "graph-llm"
                          ? `图谱约束生成 · ${result.engine.provider === "deepseek" ? "DeepSeek" : "LLM"}`
                          : "知识图谱推理"}
                      </span>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-10 gap-2 rounded-xl"
                    disabled={exporting}
                    onClick={() => void handleHeirloomExport()}
                  >
                    {exporting ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <Download className="size-4" aria-hidden />
                    )}
                    传家报告长图
                  </Button>
                </div>

                <div className="flex-1  pr-2">
                  <p className="whitespace-pre-wrap text-sm leading-[1.85] text-foreground/90">
                    {result.narrative}
                  </p>

                  {result.syndromeLabels?.length ? (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {result.syndromeLabels.map((tag) => (
                        syndromeTagLinks[tag] ? (
                          <Link
                            key={tag}
                            href={syndromeTagLinks[tag] as string}
                            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary transition hover:border-primary/35 hover:bg-primary/[0.12]"
                          >
                            {tag}
                          </Link>
                        ) : (
                          <span
                            key={tag}
                            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {tag}
                          </span>
                        )
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-4 lg:grid-cols-2 mt-5">
                    <InsightListCard title="成因分析" items={result.causeAnalysis} />
                    <InsightListCard title="建议补充追问" items={result.followUpQuestions} />
                    <InsightListCard title="膳食建议" items={result.dietSuggestions} />
                    <InsightListCard title="调理建议" items={result.lifestyleSuggestions} />
                  </div>

                  {result.cautions?.length ? (
                    <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-950/90 mt-5">
                      {result.cautions.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  ) : null}

                  {result.engine || result.retrievalTrace ? (
                    <section className="rounded-2xl border border-border/60 bg-background/45 p-4 text-xs leading-relaxed text-muted-foreground mt-5">
                      {result.engine ? (
                        <p>
                          推理模式：
                          {result.engine.mode === "graph-llm"
                            ? `知识图谱检索 + ${result.engine.provider === "deepseek" ? "DeepSeek" : "LLM"} 约束生成`
                            : "知识图谱检索 + 规则生成"}
                          {result.engine.model ? ` · ${result.engine.model}` : ""}
                        </p>
                      ) : null}
                      {result.retrievalTrace?.candidateSyndromes?.length ? (
                        <p className="mt-2">
                          候选证候：
                          {result.retrievalTrace.candidateSyndromes
                            .map((item) => `${item.label} (${Math.round(item.score * 10) / 10})`)
                            .join("，")}
                        </p>
                      ) : null}
                      {result.engine?.note ? <p className="mt-2">{result.engine.note}</p> : null}
                    </section>
                  ) : null}

                  <p className="text-xs leading-relaxed text-muted-foreground mt-5">
                    症状—证候—治则—方案的连线在上方「辨证推理链」区域同步呈现，可用于复核当前规则推理路径。
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {result ? (
        <div className="pointer-events-none fixed left-[-10000px] top-0 z-[-1]" aria-hidden>
          <ClinicalHeirloomReport
            ref={reportRef}
            result={result}
            chiefComplaint={chiefComplaint}
            graphNodes={graphNodes}
            seasonalHint={seasonalHint}
          />
        </div>
      ) : null}
    </div>
  );
}
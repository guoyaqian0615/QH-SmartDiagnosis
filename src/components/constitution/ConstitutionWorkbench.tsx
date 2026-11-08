"use client";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Download,
  Loader2,
  ArrowUp,
  Droplets,
  Flower2,
  HeartPulse,
  Snowflake,
  Sparkles,
  Utensils,
  Wind,
} from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { ConstitutionRadarChart, type RadarDatum } from "@/components/constitution/ConstitutionRadarChart";
import { ConstitutionHeirloomReport } from "@/components/reports/ConstitutionHeirloomReport";
import { ModuleHeader } from "@/components/shell/ModuleHeader";
import { Button } from "@/components/ui/button";
import { requestConstitutionScreening } from "@/lib/api/constitution-screening";
import { downloadElementAsPng } from "@/lib/heirloom-report";
import {
  ALL_QUESTION_KEYS,
  ALL_QUESTIONS,
  QUESTION_GROUPS,
  QUESTION_SCALE,
  type QuestionKey,
} from "@/lib/constitution/questionnaire";
import { cn } from "@/lib/utils";
import { useConstitutionProfileStore } from "@/stores/constitution-profile-store";
import { useToast } from "@/stores/toast-store";
import type { ConstitutionScreeningResponse } from "@/types/constitution-screening";

/** 与 QUESTION_GROUPS 一一对应：气虚 / 阳虚 / 阴虚 / 痰湿 / 气郁血瘀 / 湿热特禀 */
const GROUP_ICONS = [Wind, Snowflake, Droplets, Utensils, HeartPulse, Flower2];

type QuestionnaireAnswers = Record<QuestionKey, number | null>;

function createEmptyAnswers(): QuestionnaireAnswers {
  return Object.fromEntries(ALL_QUESTION_KEYS.map((key) => [key, null])) as QuestionnaireAnswers;
}

function toRadarData(
  types: ConstitutionScreeningResponse["constitutionTypes"],
): RadarDatum[] {
  const raw = types.map((c) => ({
    label: c.label.replace(/（演示）/g, "").trim(),
    value: Math.min(1, Math.max(0, c.score / 100)),
  }));
  // 最大值至少按 0.5 缩放，避免整体得分很低时雷达图被放大成“满格”
  const max = Math.max(...raw.map((r) => r.value), 0.5);
  return raw.map((r) => ({ ...r, value: r.value / max }));
}

export function ConstitutionWorkbench() {
  const [phase, setPhase] = useState<"wizard" | "result">("wizard");
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => createEmptyAnswers());
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConstitutionScreeningResponse | null>(null);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const saveConstitutionProfile = useConstitutionProfileStore((s) => s.saveFromScreening);
  const { toast } = useToast();

  const radarData = useMemo(
    () => (result ? toRadarData(result.constitutionTypes) : []),
    [result],
  );

  const completedCount = useMemo(
    () => ALL_QUESTIONS.filter((q) => answers[q.key] != null).length,
    [answers],
  );

  const groupProgress = useMemo(
    () =>
      QUESTION_GROUPS.map((group) => {
        const done = group.questions.filter((q) => answers[q.key] != null).length;
        return {
          done,
          total: group.questions.length,
          complete: done === group.questions.length,
        };
      }),
    [answers],
  );

  const completionPct = Math.round((completedCount / ALL_QUESTIONS.length) * 100);
  const activeGroup = QUESTION_GROUPS[activeGroupIndex];
  const activeGroupProgress = groupProgress[activeGroupIndex];
  const ActiveGroupIcon = GROUP_ICONS[activeGroupIndex % GROUP_ICONS.length];
  const remainingCount = ALL_QUESTIONS.length - completedCount;

  function resetAll() {
    setPhase("wizard");
    setResult(null);
    setError(null);
    setAnswers(createEmptyAnswers());
    setActiveGroupIndex(0);
  }

  async function onSubmit() {
    setError(null);

    const firstIncompleteGroup = QUESTION_GROUPS.findIndex((group) =>
      group.questions.some((q) => answers[q.key] == null),
    );
    if (firstIncompleteGroup >= 0) {
      setActiveGroupIndex(firstIncompleteGroup);
      setError(`还有 ${remainingCount} 题未作答，请补全后再生成报告（已跳转到第 ${firstIncompleteGroup + 1} 组）。`);
      return;
    }

    setLoading(true);
    try {
      const normalizedAnswers = Object.fromEntries(
        ALL_QUESTIONS.map((q) => [q.key, answers[q.key] as number]),
      );

      const data = await requestConstitutionScreening({
        answers: normalizedAnswers,
      });

      setResult(data);
      saveConstitutionProfile(data);
      setPhase("result");

      toast({
        tone: "success",
        title: "体质报告已生成",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
      toast({
        tone: "error",
        title: "生成失败",
        description: err instanceof Error ? err.message : "请稍后重试",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleExportHeirloom() {
    if (!reportRef.current) return;

    setExporting(true);
    try {
      await new Promise((r) => window.setTimeout(r, 400));
      await downloadElementAsPng(
        reportRef.current,
        `岐黄智诊-体质笺-${new Date().toISOString().slice(0, 10)}.png`,
      );

      toast({
        tone: "success",
        title: "已导出体质笺",
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

  const stepLabels = ["问卷", "报告"] as const;
  const currentStepIndex = phase === "result" ? 1 : 0;

  return (
    <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-6 overflow-y-auto pb-12">
      <header className="shrink-0 space-y-6">
        <ModuleHeader
          icon={Sparkles}
          title="体质辨识"
          description="通过问卷采集身体状态，生成体质倾向性参考（非医疗诊断）。"
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
              回顶部
            </Button>
          }
        />

        <div className="flex items-center gap-3 rounded-full bg-muted/30 px-4 py-3" aria-hidden>
          {stepLabels.map((label, i) => {
            const done = i < currentStepIndex;
            const current = i === currentStepIndex;

            return (
              <div key={label} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 shadow-sm",
                      done && "bg-primary text-primary-foreground shadow-primary/20",
                      current && !done && "bg-foreground text-background ring-4 ring-primary/15",
                      !done && !current && "border border-border/80 bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium uppercase tracking-wider sm:text-[11px]",
                      current ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 ? (
                  <div
                    className={cn(
                      "h-1 min-w-[1.5rem] flex-1 rounded-full",
                      i < currentStepIndex ? "bg-primary/50" : "bg-border/60",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </header>

      {phase === "wizard" ? (
        <section className="grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)] xl:items-start">
          <aside className="module-card flex flex-col overflow-hidden xl:sticky xl:top-6 xl:h-full xl:max-h-[calc(100vh-7rem)]">
            <div className="space-y-3 p-4 pt-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    体质问卷
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">填写量表</p>
                </div>
                <span className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                  第一步
                </span>
              </div>
            </div>

            <div className="border-t border-border/40 space-y-1 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    问卷进度
                  </p>
                  <p className="mt-1 font-serif text-2xl text-foreground">
                    {completedCount}/{ALL_QUESTIONS.length}
                  </p>
                </div>
                <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary shadow-sm">
                  {completionPct}%
                </div>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full bg-primary/80 transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                <li>量表选项按近两周总体状态填写。</li>
                <li>所有题目都需作答后才能生成报告，未答题目不会被默认补分。</li>
              </ul>
            </div>

            <div className="flex-1 border-t border-border/40 p-3 overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    维度导航
                  </p>
                </div>
                <span className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {QUESTION_GROUPS.length} 组
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {QUESTION_GROUPS.map((group, index) => {
                  const progress = groupProgress[index];
                  const active = activeGroupIndex === index;
                  const GroupIcon = GROUP_ICONS[index % GROUP_ICONS.length];

                  return (
                    <button
                      key={group.title}
                      type="button"
                      onClick={() => setActiveGroupIndex(index)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
                        active
                          ? "border-primary/40 bg-primary/10 shadow-sm"
                          : "border-border/45 bg-background/30 hover:border-primary/25 hover:bg-background/50 hover:shadow-sm",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-xl transition-all",
                            progress.complete && "bg-primary text-primary-foreground shadow-sm shadow-primary/20",
                            active && !progress.complete && "bg-foreground text-background",
                            !active && !progress.complete && "bg-muted/60 text-muted-foreground",
                          )}
                        >
                          {progress.complete ? (
                            <Check className="size-4" aria-hidden />
                          ) : (
                            <GroupIcon className="size-4" aria-hidden />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {group.title}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                            {group.tag}
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-background/60 px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground">
                        {progress.done}/{progress.total}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex flex-col gap-6">
            <div className="module-card overflow-hidden p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Constitution Scale
                  </p>
                  <h2 className="mt-2 font-serif text-xl font-medium tracking-[0.08em] text-foreground">
                    {ALL_QUESTIONS.length} 题体质量表
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    问卷采集身体长期状态，生成体质倾向报告。
                  </p>
                </div>
                <Button
                  type="button"
                  disabled={loading}
                  className="h-11 rounded-xl px-6 font-medium"
                  onClick={() => void onSubmit()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                      分析中…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 size-4" aria-hidden />
                      生成报告
                    </>
                  )}
                </Button>
              </div>
            </div>

            <motion.article
              key={activeGroup.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="module-card p-6"
            >
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm">
                    <ActiveGroupIcon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      第 {activeGroupIndex + 1} 组 / 共 {QUESTION_GROUPS.length} 组
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                      <h3 className="font-serif text-lg font-medium tracking-[0.08em] text-foreground">
                        {activeGroup.title}
                      </h3>
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
                        {activeGroup.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{activeGroup.description}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    activeGroupProgress.complete
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-background/60 text-muted-foreground",
                  )}
                >
                  {activeGroupProgress.complete ? <Check className="size-3.5" aria-hidden /> : null}
                  {activeGroupProgress.complete
                    ? "本组已完成"
                    : `${activeGroupProgress.done}/${activeGroupProgress.total}`}
                </span>
              </div>

              <div className="space-y-4">
                {activeGroup.questions.map((question) => {
                  const answered = answers[question.key] != null;
                  const number = ALL_QUESTIONS.findIndex((q) => q.key === question.key) + 1;

                  return (
                    <div
                      key={question.key}
                      className={cn(
                        "module-card-soft p-5 transition-all hover:shadow-sm",
                        answered && "ring-1 ring-primary/30",
                      )}
                    >
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex min-w-0 items-start gap-3.5">
                          <span
                            className={cn(
                              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-all",
                              answered
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                : "bg-muted/70 text-muted-foreground",
                            )}
                          >
                            {answered ? <Check className="size-4" aria-hidden /> : number}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium leading-relaxed text-foreground">
                              {question.label}
                            </p>
                            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                              {question.hint}
                            </p>
                          </div>
                        </div>
                        <div className="grid shrink-0 grid-cols-5 gap-2 sm:min-w-[24rem]">
                          {QUESTION_SCALE.map((option) => {
                            const selected = answers[question.key] === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [question.key]: option.value,
                                  }))
                                }
                                className={cn(
                                  "min-h-12 rounded-lg px-1 text-[11px] font-medium transition-all duration-200",
                                  selected
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.04]"
                                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                                )}
                              >
                                <span className="block text-sm font-semibold tabular-nums">{option.value}</span>
                                <span className="mt-0.5 block text-[10px]">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  已完成 {completedCount}/{ALL_QUESTIONS.length} 题
                  {remainingCount > 0 ? `；仍有 ${remainingCount} 题待补全。` : "；可以生成体质报告。"}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl px-5"
                    disabled={activeGroupIndex === 0}
                    onClick={() => setActiveGroupIndex((index) => Math.max(0, index - 1))}
                  >
                    <ChevronLeft className="mr-1 size-4" aria-hidden />
                    上一组
                  </Button>
                  {activeGroupIndex < QUESTION_GROUPS.length - 1 ? (
                    <Button
                      type="button"
                      className="h-10 rounded-xl px-5"
                      onClick={() =>
                        setActiveGroupIndex((index) => Math.min(QUESTION_GROUPS.length - 1, index + 1))
                      }
                    >
                      下一组
                      <ChevronRight className="ml-1 size-4" aria-hidden />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={loading}
                      className="h-10 rounded-xl px-5"
                      onClick={() => void onSubmit()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                          分析中…
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 size-4" aria-hidden />
                          生成报告
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>

            {error ? (
              <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive shadow-sm">
                {error}
              </p>
            ) : null}
          </section>
        </section>
      ) : result ? (
        <section className="module-card space-y-8 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-medium text-foreground">您的体质倾向</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                雷达图为问卷模型综合输出示意。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-xl gap-2 font-medium"
                disabled={exporting}
                onClick={() => void handleExportHeirloom()}
              >
                {exporting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Download className="size-4" aria-hidden />
                )}
                传家体质笺
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-xl font-medium" onClick={resetAll}>
                重新测评
              </Button>
            </div>
          </div>

          <div className="module-card p-6">
            <ConstitutionRadarChart data={radarData} />
          </div>

          <ul className="space-y-5">
            {result.constitutionTypes.map((c, idx) => {
              const pct = c.score;
              return (
                <li key={c.code} className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className={cn("font-medium", idx === 0 && "text-foreground text-base")}>{c.label}</span>
                    <span className="tabular-nums text-muted-foreground font-medium">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted/60">
                    <motion.div
                      className="h-full rounded-full bg-primary/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, pct)}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="module-card p-6">
            <p className="whitespace-pre-wrap text-sm leading-[1.9] text-foreground/90">{result.narrative}</p>
          </div>

          {result.cautions?.length ? (
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 text-xs leading-relaxed text-amber-950/90 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-100/90 shadow-sm">
              {result.cautions.map((c) => (
                <p key={c} className="mb-1 last:mb-0">{c}</p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {result ? (
        <div
          className="pointer-events-none fixed left-[-10000px] top-0 z-[-1]"
          aria-hidden
        >
          <ConstitutionHeirloomReport ref={reportRef} result={result} radarData={radarData} />
        </div>
      ) : null}
    </div>
  );
}

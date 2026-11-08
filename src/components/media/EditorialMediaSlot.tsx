"use client";

import { ImageIcon, Images, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type MediaFrame = {
  title: string;
  note: string;
};

type EditorialMediaSlotProps = {
  title: string;
  description: string;
  ratio?: string;
  className?: string;
  mode?: "single" | "carousel";
  frames?: MediaFrame[];
  footnote?: string;
};

export function EditorialMediaSlot({
  title,
  description,
  ratio = "16 / 9",
  className,
  mode = "single",
  frames,
  footnote,
}: EditorialMediaSlotProps) {
  const cards =
    frames && frames.length
      ? frames
      : [
          { title: "主视觉图", note: "建议替换为高清主题图" },
          { title: "辅助图", note: "可放细节或场景图" },
          { title: "说明图", note: "可放示意或图解" },
        ];

  return (
    <section className={cn("module-card relative overflow-hidden p-4 sm:p-5", className)}>
      <div className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-primary/[0.08] blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -left-8 bottom-0 size-20 rounded-full bg-season-accent/[0.08] blur-2xl" aria-hidden />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {mode === "carousel" ? (
                <Images className="size-4 text-season-accent/80" />
              ) : (
                <ImageIcon className="size-4 text-season-accent/80" />
              )}
              <span>{mode === "carousel" ? "Media Carousel Slot" : "Media Slot"}</span>
            </div>
            <h3 className="mt-2 font-serif text-lg font-medium tracking-[0.08em] text-foreground">
              {title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          <span className="rounded-full border border-border/60 bg-background/55 px-2.5 py-1 text-[11px] text-muted-foreground">
            比例 {ratio}
          </span>
        </div>

        <div
          className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/75 bg-[linear-gradient(155deg,rgba(255,255,255,0.8),rgba(244,248,246,0.55))] p-3 shadow-[0_10px_34px_rgba(42,50,44,0.06)]"
          style={{ aspectRatio: ratio }}
        >
          <div className="flex h-full flex-col gap-3">
            <div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(13rem,0.9fr)]">
              <div className="relative overflow-hidden rounded-[1.2rem] border border-dashed border-primary/25 bg-[radial-gradient(circle_at_22%_18%,rgba(61,107,92,0.16),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.72),rgba(230,239,235,0.48))] p-4">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Primary Visual</p>
                    <p className="mt-2 max-w-xs font-serif text-xl font-medium tracking-[0.08em] text-foreground">
                      {cards[0]?.title ?? "主视觉图"}
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {cards[0]?.note ?? "建议替换为高清主题图或主场景图。"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-primary/80">
                    <Sparkles className="size-3.5" />
                    <span>{mode === "carousel" ? "可轮播 3-5 张" : "单图位"}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {cards.slice(1, 3).map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="overflow-hidden rounded-[1.2rem] border border-dashed border-border/70 bg-background/55 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Slot {index + 2}</p>
                    <p className="mt-2 font-serif text-base font-medium tracking-[0.08em] text-foreground">{item.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {mode === "carousel" ? (
              <div className="flex items-center justify-between gap-3 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs text-muted-foreground">
                <span>轮播位已预留，建议使用 3:1 或 21:9 横图，3 到 5 张一组。</span>
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-foreground/75" />
                  <span className="size-2 rounded-full bg-foreground/25" />
                  <span className="size-2 rounded-full bg-foreground/25" />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {footnote ? (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}

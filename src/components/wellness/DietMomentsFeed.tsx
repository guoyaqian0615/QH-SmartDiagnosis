"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";

import { FavoriteStarButton } from "@/components/favorites/FavoriteStarButton";
import type { DietMomentCard } from "@/data/diet-moments-mock";
import { DIET_MOMENTS } from "@/data/diet-moments-mock";
import { cn } from "@/lib/utils";

function MomentCard({ card, className }: { card: DietMomentCard; className?: string }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-stone-200/70 bg-white/75 shadow-[0_12px_40px_rgba(42,50,44,0.06)] backdrop-blur-md dark:border-stone-500/30 dark:bg-stone-900/50",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
      <div className="space-y-3 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-sans text-[11px] font-medium text-muted-foreground">{card.author}</p>
            <h3 className="mt-1 font-serif text-[1.05rem] font-medium leading-snug tracking-[0.06em] text-foreground sm:text-[1.15rem]">
              {card.title}
            </h3>
          </div>
          <FavoriteStarButton
            className="shrink-0 text-muted-foreground hover:bg-white/60 dark:hover:bg-stone-800/60"
            item={{
              id: `diet-${card.id}`,
              kind: "diet",
              title: card.title,
              subtitle: card.blurb.slice(0, 80),
              tags: card.tags,
            }}
            label="收藏此膳方"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {card.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-[color-mix(in_srgb,var(--season-accent)_12%,white)] px-2.5 py-1 font-sans text-[12px] font-medium text-[color-mix(in_srgb,var(--season-accent)_75%,#44403c)]"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="font-sans text-[13px] font-light leading-[1.75] text-muted-foreground">{card.blurb}</p>
        <div className="flex items-center gap-4 border-t border-border/50 pt-3 font-sans text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="size-4 text-rose-400/90" aria-hidden />
            {card.likes.toLocaleString("zh-CN")}
          </span>
          <span className="text-border">·</span>
          <span>养生圈 · 示意</span>
        </div>
      </div>
    </motion.article>
  );
}

export function DietMomentsFeed({ className }: { className?: string }) {
  return (
    <section
      className={cn("relative z-10", className)}
      aria-labelledby="diet-moments-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Wellness Feed
            </p>
            <h2
              id="diet-moments-heading"
              className="museum-cn-title mt-3 text-[clamp(1.45rem,3.2vw,2rem)] leading-snug text-foreground"
            >
              膳食灵感
            </h2>
            <p className="mt-2 max-w-xl font-sans text-[14px] font-light leading-relaxed text-muted-foreground">
              像朋友圈一样滑动浏览：每道搭配功效标签，文意为科普示意，具体体质请遵医嘱。
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DIET_MOMENTS.map((card) => (
            <MomentCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

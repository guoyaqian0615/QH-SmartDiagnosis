"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import type { Season } from "@/types/season";
import type { ZenMode } from "@/types/zen";
import { cn } from "@/lib/utils";

import { FlowFieldCanvas } from "./FlowFieldCanvas";
import { QiFlow } from "./QiFlow";

type AtmosphereProps = {
  season: Season;
  /** 禅意：宣纸为亮读面，水墨为夜读面；天幕与 body 色同步 */
  zenMode?: ZenMode;
  /** scroll：随页面高度铺底的长布；viewport：固定视口；extended：超高画布（旧式 fixed 场景） */
  layout?: "scroll" | "extended" | "viewport";
};

/** 基底：多段柔过渡，避免出现「一道杠」硬边 */
function skyBase(season: Season): string {
  switch (season) {
    case "spring":
      return "linear-gradient(185deg, #f4f9f6 0%, #edf5f0 12%, #e6f0ea 28%, #dfebe4 48%, #d8e5de 68%, #d2e0d8 88%, #ccdcd4 100%)";
    case "summer":
      return "linear-gradient(185deg, #faf4ee 0%, #f5ede4 14%, #f0e6da 32%, #eadfd0 50%, #e4d8c6 70%, #dfd2be 88%, #d9ccb6 100%)";
    case "autumn":
      return "linear-gradient(185deg, #f7f0e4 0%, #f2e9da 14%, #ede2d0 32%, #e7d9c6 50%, #e1d2bc 70%, #dbcbb4 88%, #d5c4ac 100%)";
    case "winter":
      return "linear-gradient(188deg, #14181c 0%, #101418 18%, #0c1014 40%, #080c10 62%, #050608 82%, #030405 100%)";
    default:
      return "linear-gradient(185deg, #f4f9f6 0%, #edf5f0 12%, #e6f0ea 28%, #dfebe4 48%, #d8e5de 68%, #d2e0d8 88%, #ccdcd4 100%)";
  }
}

/** 漂浮的「奶油 / 水晕」层（径向叠化，推动感由 motion 完成） */
function skyBloomA(season: Season): string {
  switch (season) {
    case "spring":
      return "radial-gradient(ellipse 85% 70% at 22% 18%, rgba(220, 244, 232, 0.38) 0%, rgba(200, 232, 218, 0.16) 42%, transparent 68%)";
    case "summer":
      return "radial-gradient(ellipse 80% 65% at 18% 22%, rgba(255, 220, 200, 0.28) 0%, rgba(245, 200, 185, 0.12) 45%, transparent 70%)";
    case "autumn":
      return "radial-gradient(ellipse 82% 68% at 25% 20%, rgba(240, 210, 160, 0.3) 0%, rgba(220, 185, 130, 0.12) 44%, transparent 68%)";
    case "winter":
      return "radial-gradient(ellipse 75% 60% at 30% 25%, rgba(90, 100, 120, 0.22) 0%, rgba(50, 55, 65, 0.08) 48%, transparent 72%)";
    default:
      return "radial-gradient(ellipse 85% 70% at 22% 18%, rgba(200, 232, 214, 0.55) 0%, transparent 68%)";
  }
}

function skyBloomB(season: Season): string {
  switch (season) {
    case "spring":
      return "radial-gradient(ellipse 90% 75% at 78% 72%, rgba(200, 232, 214, 0.3) 0%, rgba(175, 218, 198, 0.12) 46%, transparent 72%)";
    case "summer":
      return "radial-gradient(ellipse 88% 70% at 82% 68%, rgba(255, 190, 175, 0.22) 0%, rgba(230, 160, 150, 0.08) 50%, transparent 74%)";
    case "autumn":
      return "radial-gradient(ellipse 88% 72% at 75% 75%, rgba(220, 175, 120, 0.24) 0%, rgba(200, 155, 95, 0.1) 48%, transparent 74%)";
    case "winter":
      return "radial-gradient(ellipse 85% 70% at 70% 78%, rgba(70, 78, 95, 0.18) 0%, rgba(35, 40, 50, 0.07) 52%, transparent 76%)";
    default:
      return "radial-gradient(ellipse 90% 75% at 78% 72%, rgba(170, 215, 195, 0.42) 0%, transparent 72%)";
  }
}

function skyBloomC(season: Season): string {
  switch (season) {
    case "spring":
      return "radial-gradient(ellipse 70% 55% at 52% 48%, rgba(225, 244, 232, 0.22) 0%, transparent 62%)";
    case "summer":
      return "radial-gradient(ellipse 68% 52% at 48% 52%, rgba(255, 230, 215, 0.15) 0%, transparent 64%)";
    case "autumn":
      return "radial-gradient(ellipse 70% 54% at 50% 50%, rgba(235, 205, 150, 0.16) 0%, transparent 64%)";
    case "winter":
      return "radial-gradient(ellipse 65% 50% at 48% 45%, rgba(60, 68, 85, 0.14) 0%, transparent 68%)";
    default:
      return "radial-gradient(ellipse 70% 55% at 52% 48%, rgba(210, 235, 220, 0.28) 0%, transparent 62%)";
  }
}

/** 水墨天幕：中性深灰为底 + 极淡月雾，季色晕降到 ~8% 不糊绿 */
function skyBaseInk(): string {
  return `linear-gradient(188deg, #282a28 0%, #1e201e 32%, #161816 100%), radial-gradient(ellipse 110% 70% at 50% 0%, rgba(190, 195, 192, 0.07), transparent 58%)`;
}

function skyBloomAInk(): string {
  return `radial-gradient(ellipse 86% 72% at 22% 20%, rgba(200, 205, 200, 0.09) 0%, rgba(50, 54, 52, 0.1) 48%, transparent 72%)`;
}

function skyBloomBInk(): string {
  return `radial-gradient(ellipse 90% 74% at 78% 68%, rgba(88, 92, 90, 0.16) 0%, rgba(30, 32, 32, 0.12) 50%, transparent 75%)`;
}

function skyBloomCInk(season: Season): string {
  const t = { spring: "100, 140, 120", summer: "180, 100, 95", autumn: "180, 150, 100", winter: "120, 130, 145" }[season];
  return `radial-gradient(ellipse 70% 56% at 50% 50%, rgba(${t}, 0.055) 0%, transparent 65%)`;
}

/**
 * 画布高于视口并向上、下各伸出一段，配合 scroll translateY 仍满屏不露边。
 * 高度用 min-h 保证长页滚动时视口内始终有足量像素。
 */
const CANVAS_EXTRA_VH = 85;

export function Atmosphere({
  season,
  zenMode = "xuan",
  layout = "viewport",
}: AtmosphereProps) {
  const { skyBaseLayer, bloomA, bloomB, bloomC } = useMemo(() => {
    if (zenMode === "ink") {
      return {
        skyBaseLayer: skyBaseInk(),
        bloomA: skyBloomAInk(),
        bloomB: skyBloomBInk(),
        bloomC: skyBloomCInk(season),
      };
    }
    const s = zenMode === "xuan" && season === "winter" ? "spring" : season;
    return {
      skyBaseLayer: skyBase(s),
      bloomA: skyBloomA(s),
      bloomB: skyBloomB(s),
      bloomC: skyBloomC(s),
    };
  }, [zenMode, season]);

  const isScroll = layout === "scroll";
  const canvasMin =
    layout === "viewport"
      ? "100dvh"
      : layout === "extended"
        ? `calc(100dvh + ${CANVAS_EXTRA_VH * 2}vh)`
        : "100%";
  const canvasTop =
    layout === "extended" ? `-${CANVAS_EXTRA_VH}vh` : "0";

  const rootClass = isScroll
    ? "pointer-events-none absolute inset-0 min-h-full w-full overflow-hidden isolate"
    : "pointer-events-none absolute left-0 right-0 w-full overflow-hidden isolate";

  return (
    <div
      className={cn(
        rootClass,
        "atmosphere-root",
        "transition-[filter,opacity] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
      )}
      style={isScroll ? undefined : { top: canvasTop, minHeight: canvasMin }}
      aria-hidden
      data-season={season}
      data-zen={zenMode}
    >
      <div className="absolute inset-0" style={{ background: skyBaseLayer }} />

      {/* 长布经纬：极淡斜纹，随页面延伸 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              118deg,
              color-mix(in srgb, var(--foreground) 14%, transparent) 0px,
              transparent 1px,
              transparent 5px,
              color-mix(in srgb, var(--foreground) 10%, transparent) 6px,
              transparent 7px,
              transparent 11px
            ),
            repeating-linear-gradient(
              32deg,
              transparent 0px,
              transparent 8px,
              color-mix(in srgb, var(--primary) 8%, transparent) 9px,
              transparent 10px,
              transparent 20px
            )
          `,
          mixBlendMode: "multiply",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-[42%] will-change-transform"
        style={{
          background: bloomA,
          backgroundRepeat: "no-repeat",
          backgroundSize: "185% 185%",
          backgroundPosition: "50% 50%",
        }}
        animate={{
          x: [-110, 96, -88, 104, -110],
          y: [-56, 44, 58, -52, -56],
          opacity: [0.48, 0.82, 0.55, 0.78, 0.48],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-[44%] will-change-transform"
        style={{
          background: bloomB,
          backgroundRepeat: "no-repeat",
          backgroundSize: "225% 225%",
          backgroundPosition: "76% 58%",
        }}
        animate={{
          x: [72, -84, 64, -70, 72],
          y: [36, -28, -44, 32, 36],
          opacity: [0.42, 0.72, 0.5, 0.68, 0.42],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
      <motion.div
        className="pointer-events-none absolute -inset-[32%] will-change-transform"
        style={{
          background: bloomC,
          backgroundRepeat: "no-repeat",
          backgroundSize: "210% 210%",
          backgroundPosition: "40% 36%",
        }}
        animate={{
          x: [-40, 52, -48, 44, -40],
          y: [28, -36, 22, -30, 28],
          opacity: [0.35, 0.62, 0.4, 0.58, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.4,
        }}
      />

      <QiFlow season={season} />

      {/* 星尘层关闭：优先消除白闪，再逐步回加细节 */}

      <div
        className="atmosphere-accent-a pointer-events-none absolute -inset-[22%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 35% 45%, color-mix(in srgb, var(--season-accent) 48%, transparent), transparent 72%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "170% 170%",
          backgroundPosition: "26% 30%",
        }}
      />
      <div
        className="atmosphere-accent-b pointer-events-none absolute -inset-[22%]"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 70% 55%, color-mix(in srgb, var(--primary) 44%, transparent), transparent 75%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "175% 175%",
          backgroundPosition: "70% 28%",
        }}
      />

      {/* 矢量流线：置于最上层，避免被气韵与高光盖住 */}
      <FlowFieldCanvas season={season} />
    </div>
  );
}

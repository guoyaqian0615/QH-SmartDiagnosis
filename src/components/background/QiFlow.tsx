"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import type { Season } from "@/types/season";

/** 气韵层：水墨慢移，极缓如「气」行于纸背 */

type InkBlob = {
  id: string;
  d: string;
  widthVw: number;
  left: string;
  top: string;
  originX: string;
  originY: string;
  driftX: [number, number, number, number, number];
  driftY: [number, number, number, number, number];
  rotate: [number, number, number, number];
  scale: [number, number, number, number];
  duration: number;
  delay: number;
  opacity: number;
};

const INK_BLOBS: InkBlob[] = [
  {
    id: "a",
    d: "M120,700 C60,480 200,200 460,220 C640,235 880,180 960,380 C1020,520 860,720 560,780 C300,830 100,760 120,700 Z",
    widthVw: 56,
    left: "-8%",
    top: "4%",
    originX: "46%",
    originY: "50%",
    driftX: [-24, 28, -18, 20, -24],
    driftY: [14, -20, 12, -10, 14],
    rotate: [0, 0, 0, 0],
    scale: [1, 1, 1, 1],
    duration: 34,
    delay: 0,
    opacity: 0.84,
  },
  {
    id: "b",
    d: "M880,160 C1000,100 1080,280 1020,440 C960,600 760,640 560,560 C380,490 320,320 400,200 C480,90 720,100 880,160 Z",
    widthVw: 52,
    left: "44%",
    top: "-12%",
    originX: "54%",
    originY: "36%",
    driftX: [24, -20, 22, -16, 24],
    driftY: [-18, 20, -14, 16, -18],
    rotate: [0, 0, 0, 0],
    scale: [1, 1, 1, 1],
    duration: 32,
    delay: 4,
    opacity: 0.8,
  },
  {
    id: "c",
    d: "M40,400 C180,260 420,300 620,220 C860,120 1040,280 1000,480 C960,660 720,720 460,760 C200,800 20,620 40,400 Z",
    widthVw: 60,
    left: "2%",
    top: "36%",
    originX: "48%",
    originY: "56%",
    driftX: [-20, -30, 20, 12, -20],
    driftY: [18, 10, -24, 14, 18],
    rotate: [0, 0, 0, 0],
    scale: [1, 1, 1, 1],
    duration: 36,
    delay: 8,
    opacity: 0.82,
  },
  {
    id: "d",
    d: "M520,880 C300,840 160,640 240,480 C300,340 480,260 700,300 C920,340 1080,500 1020,680 C960,820 720,880 520,880 Z",
    widthVw: 54,
    left: "22%",
    top: "48%",
    originX: "56%",
    originY: "74%",
    driftX: [22, -16, -26, 24, 22],
    driftY: [-16, 24, -12, 18, -16],
    rotate: [0, 0, 0, 0],
    scale: [1, 1, 1, 1],
    duration: 33,
    delay: 2,
    opacity: 0.76,
  },
];

/** 径向渐变芯色（与 flat fill 同系，用于「化开」） */
function seasonInkCores(season: Season): string[] {
  switch (season) {
    case "summer":
      return ["#b86858", "#c87868", "#d09080", "#a85850"];
    case "autumn":
      return ["#b89850", "#c8a860", "#d4b470", "#a88840"];
    case "winter":
      return ["#5a6068", "#6a7078", "#4a5058", "#788090"];
    case "spring":
    default:
      return ["#5a9078", "#6a9a88", "#7aac98", "#4a8068"];
  }
}

function seasonInkFills(season: Season): string[] {
  switch (season) {
    case "summer":
      return [
        "color-mix(in srgb, #c07060 44%, transparent)",
        "color-mix(in srgb, #d8a898 36%, transparent)",
        "color-mix(in srgb, #e8c8b8 32%, transparent)",
        "color-mix(in srgb, #b86858 36%, transparent)",
      ];
    case "autumn":
      return [
        "color-mix(in srgb, #c4a060 40%, transparent)",
        "color-mix(in srgb, #dcc890 32%, transparent)",
        "color-mix(in srgb, #e8d4a8 28%, transparent)",
        "color-mix(in srgb, #b89850 34%, transparent)",
      ];
    case "winter":
      return [
        "color-mix(in srgb, #6a6e78 36%, transparent)",
        "color-mix(in srgb, #8890a0 30%, transparent)",
        "color-mix(in srgb, #4a5058 34%, transparent)",
        "color-mix(in srgb, #707888 28%, transparent)",
      ];
    case "spring":
    default:
      return [
        "color-mix(in srgb, #6a9a88 38%, transparent)",
        "color-mix(in srgb, #8cb8a8 32%, transparent)",
        "color-mix(in srgb, #a8d0c4 28%, transparent)",
        "color-mix(in srgb, #7aac98 34%, transparent)",
      ];
  }
}

type QiFlowProps = {
  season: Season;
};

export function QiFlow({ season }: QiFlowProps) {
  const fills = useMemo(() => seasonInkFills(season), [season]);
  const cores = useMemo(() => seasonInkCores(season), [season]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
      aria-hidden
      animate={{
        opacity: [0.78, 0.94, 0.8, 0.92, 0.78],
      }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {INK_BLOBS.map((blob, i) => {
        const gid = `ink-rg-${season}-${blob.id}`;
        const core = cores[i % cores.length];

        return (
          <motion.div
            key={`${season}-${blob.id}`}
            className="absolute will-change-transform"
            style={{
              width: `${blob.widthVw}vw`,
              maxWidth: "min(78vw, 1000px)",
              left: blob.left,
              top: blob.top,
              transformOrigin: `${blob.originX} ${blob.originY}`,
            }}
            animate={{
              x: blob.driftX.map((v) => v * 1.35),
              y: blob.driftY.map((v) => v * 1.35),
              opacity: [
                blob.opacity * 0.72,
                blob.opacity * 0.98,
                blob.opacity * 0.76,
                blob.opacity * 0.94,
                blob.opacity * 0.72,
              ],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: blob.delay,
            }}
          >
            <svg
              className="h-auto w-full"
              viewBox="0 0 1200 900"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient
                  id={gid}
                  cx="38%"
                  cy="34%"
                  r="72%"
                  fx="32%"
                  fy="28%"
                >
                  <stop offset="0%" stopColor={core} stopOpacity="0.62" />
                  <stop offset="38%" stopColor={core} stopOpacity="0.28" />
                  <stop offset="68%" stopColor={core} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={core} stopOpacity="0" />
                </radialGradient>
              </defs>
              <g>
                <g transform="translate(600 450) scale(1.16) translate(-600 -450)">
                  <path d={blob.d} fill={`url(#${gid})`} opacity={0.45} />
                </g>
                <g transform="translate(600 450) scale(1.07) translate(-600 -450)">
                  <path d={blob.d} fill={fills[i % fills.length]} opacity={0.4} />
                </g>
                <path d={blob.d} fill={`url(#${gid})`} />
              </g>
            </svg>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

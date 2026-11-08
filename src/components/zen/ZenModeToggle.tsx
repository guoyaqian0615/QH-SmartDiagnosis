"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { ZenMode } from "@/types/zen";

type ZenModeToggleProps = {
  className?: string;
  /** 默认 sm；顶栏大触发区可用 md */
  size?: "sm" | "md";
  /** 在窄屏上隐藏文案 */
  withLabel?: boolean;
};

const labels: Record<ZenMode, string> = {
  xuan: "宣纸白",
  ink: "水墨暗",
};

const titles: Record<ZenMode, string> = {
  xuan: "当前：宣纸白（温和展纸，宜日光下阅读）— 切换为水墨暗",
  ink: "当前：水墨暗（夜读、弱光、墨色层晕）— 切换为宣纸白",
};

/**
 * 禅意光效：太极双色环 + 日/月意象；非高对比度暗黑，而是纸墨哲学分层。
 */
export function ZenModeToggle({
  className,
  size = "sm",
  withLabel = false,
}: ZenModeToggleProps) {
  const mode = useUIStore((s) => s.zenMode);
  const toggleZenMode = useUIStore((s) => s.toggleZenMode);
  const isInk = mode === "ink";
  const dim = size === "md" ? "h-11 w-11 min-h-[2.75rem] min-w-[2.75rem] sm:h-10 sm:w-10" : "h-9 w-9 min-h-9 min-w-9 sm:h-9 sm:w-9";
  const iconC = size === "md" ? "size-4" : "size-3.5";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {withLabel ? (
        <span className="hidden max-w-[4.5rem] truncate text-[9px] font-medium tracking-wide text-stone-500 dark:text-stone-400 sm:inline">
          {labels[mode]}
        </span>
      ) : null}
      <button
        type="button"
        onClick={toggleZenMode}
        className={cn(
          "group/taiji relative rounded-full p-[1.5px] shadow-[0_0_0_1px_rgba(120,120,120,0.1)] transition-transform duration-300 dark:shadow-[0_0_0_1px_rgba(200,200,200,0.1)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:focus-visible:ring-stone-500/40 dark:ring-offset-stone-900/80",
          "active:scale-[0.98]",
        )}
        style={{
          background:
            "conic-gradient(from -90deg, #141312 0deg, #141312 180deg, #f2efe6 180deg, #e8e3d8 360deg)",
        }}
        title={titles[mode]}
        aria-label={labels[mode]}
        aria-pressed={isInk}
      >
        <span
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-full",
            "bg-gradient-to-b from-stone-50 to-stone-100/95 dark:from-stone-800/95 dark:to-stone-900/90",
            "transition-[background,box-shadow] duration-500",
            dim,
          )}
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-15"
            style={{
              background: "radial-gradient(circle at 35% 40%, #fff, transparent 58%)",
            }}
            aria-hidden
          />
          <AnimatePresence mode="wait" initial={false}>
            {isInk ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -20, y: 4 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, rotate: 20, y: -4 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[1] text-stone-200"
              >
                <Moon
                  className={cn(
                    iconC,
                    "drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]",
                  )}
                  strokeWidth={1.75}
                />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: 20, y: 4 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, rotate: -20, y: -4 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[1] text-amber-700/90 [html[data-zen=ink]_&]:text-amber-100/80"
              >
                <Sun
                  className={cn(
                    iconC,
                    "drop-shadow-[0_0_2px_rgba(180,100,20,0.2)]",
                  )}
                  strokeWidth={1.75}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </button>
    </div>
  );
}

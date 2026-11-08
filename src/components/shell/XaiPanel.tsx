"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { LogicGraphCanvas } from "./LogicGraphCanvas";
import { useLgScreen } from "@/hooks/useLgScreen";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

export function XaiPanel() {
  const isLg = useLgScreen();
  const open = useUIStore((s) => s.xaiOpen);
  const setXaiOpen = useUIStore((s) => s.setXaiOpen);

  return (
    <>
      {open && !isLg ? (
        <button
          type="button"
          aria-label="关闭溯源面板"
          className="fixed inset-0 z-[68] bg-black/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => setXaiOpen(false)}
        />
      ) : null}
      <motion.div
        initial={false}
        animate={
          isLg
            ? {
                width: open ? "var(--xai-drawer-width)" : 0,
                opacity: open ? 1 : 0,
                marginLeft: open ? "0.75rem" : 0,
              }
            : { width: 0, opacity: 1, marginLeft: 0 }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none relative z-[70] h-full shrink-0 overflow-visible lg:pointer-events-auto lg:overflow-hidden"
      >
        <motion.aside
          initial={false}
          animate={
            isLg
              ? open
                ? { x: 0, filter: "blur(0px)", opacity: 1 }
                : { x: 20, filter: "blur(4px)", opacity: 0 }
              : open
                ? { x: 0, filter: "blur(0px)", opacity: 1 }
                : { x: "100%", filter: "blur(4px)", opacity: 0 }
          }
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "xai-drawer-shell pointer-events-auto flex h-full w-[var(--xai-drawer-width)] min-w-[var(--xai-drawer-width)] flex-col overflow-hidden",
            "max-lg:w-[min(calc(100vw-1rem),var(--xai-drawer-width))] max-lg:min-w-[min(calc(100vw-1rem),var(--xai-drawer-width))]",
            "max-lg:fixed max-lg:right-0 max-lg:top-0 max-lg:z-[70] max-lg:h-[100dvh] max-lg:max-h-[100dvh] max-lg:border-l max-lg:border-border/50 max-lg:shadow-[0_0_0_1px_rgba(0,0,0,0.04),-24px_0_48px_rgba(0,0,0,0.12)]",
            "max-lg:pt-[max(0.5rem,env(safe-area-inset-top))] max-lg:pb-[max(0.5rem,env(safe-area-inset-bottom))]",
            !open && "max-lg:pointer-events-none",
          )}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold tracking-tight">
              <Sparkles className="size-4 shrink-0 text-season-accent" />
              <span className="truncate">逻辑链</span>
            </div>
            <button
              type="button"
              onClick={() => setXaiOpen(false)}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground sm:min-h-9 sm:min-w-0 sm:px-3 sm:py-2"
            >
              收起
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-5">
            <LogicGraphCanvas className="min-h-0 flex-1 text-left" />
          </div>
        </motion.aside>
      </motion.div>
    </>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastTone } from "@/stores/toast-store";

function toneStyle(tone: ToastTone) {
  switch (tone) {
    case "success":
      return "border-emerald-400/50 bg-emerald-500/10 text-emerald-100";
    case "warning":
      return "border-amber-400/50 bg-amber-500/10 text-amber-100";
    case "error":
      return "border-rose-400/50 bg-rose-500/10 text-rose-100";
    default:
      return "border-border/60 bg-background/85 text-foreground";
  }
}

function ToneIcon({ tone }: { tone: ToastTone }) {
  if (tone === "success") return <CheckCircle2 className="size-4 text-emerald-300" />;
  if (tone === "warning") return <TriangleAlert className="size-4 text-amber-300" />;
  if (tone === "error") return <AlertCircle className="size-4 text-rose-300" />;
  return <Info className="size-4 text-season-accent" />;
}

export function ToastViewport() {
  const items = useToastStore((s) => s.items);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="pointer-events-none fixed right-3 top-[max(1rem,env(safe-area-inset-top,0px)+0.5rem)] z-[120] flex w-[min(24rem,calc(100vw-1.5rem))] flex-col gap-2 sm:right-4">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(3px)" }}
            transition={{ duration: 0.22, ease: [0.2, 0.9, 0.2, 1] }}
            className={cn(
              "pointer-events-auto rounded-xl border px-3 py-2 shadow-lg backdrop-blur-md",
              toneStyle(item.tone),
            )}
          >
            <div className="flex items-start gap-2">
              <ToneIcon tone={item.tone} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 text-xs text-muted-foreground/90">{item.description}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
                onClick={() => remove(item.id)}
                aria-label="关闭提示"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


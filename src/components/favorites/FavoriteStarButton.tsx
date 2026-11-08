"use client";

import { motion, useAnimate } from "framer-motion";
import { Star } from "lucide-react";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import {
  type FavoriteItem,
  useFavoritesStore,
} from "@/stores/favorites-store";

type FavoriteStarButtonProps = {
  item: Omit<FavoriteItem, "createdAt">;
  className?: string;
  size?: "sm" | "md";
  label?: string;
};

export function FavoriteStarButton({
  item,
  className,
  size = "md",
  label = "收藏",
}: FavoriteStarButtonProps) {
  const [scope, animate] = useAnimate();
  const [flight, setFlight] = useState<{
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null>(null);
  const toggle = useFavoritesStore((s) => s.toggle);
  const active = useFavoritesStore((s) => s.items.some((i) => i.id === item.id));

  const iconClass = size === "sm" ? "size-[1.05rem]" : "size-[1.2rem]";

  const startFlight = useCallback((clientX: number, clientY: number) => {
    const anchor = document.getElementById("favorites-nav-anchor");
    if (!anchor) return;
    const to = anchor.getBoundingClientRect();
    setFlight({
      from: { x: clientX, y: clientY },
      to: { x: to.left + to.width / 2, y: to.top + to.height / 2 },
    });
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const willAdd = !active;
    toggle(item);
    if (willAdd) {
      startFlight(e.clientX, e.clientY);
    }
    if (scope.current) {
      void animate(scope.current, { scale: [1, 1.18, 1] }, { duration: 0.32 });
    }
  }

  return (
    <>
      <button
        ref={scope}
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-transparent p-2 transition-colors",
          active
            ? "bg-amber-400/20 text-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
            : "text-muted-foreground hover:bg-muted/60 hover:text-amber-600/90",
          className,
        )}
        aria-pressed={active}
        aria-label={active ? "取消收藏" : label}
        title={active ? "已收藏" : label}
      >
        <Star
          className={cn(iconClass, active && "fill-amber-500 text-amber-600")}
          strokeWidth={1.6}
        />
      </button>
      {flight && typeof document !== "undefined"
        ? createPortal(
            <motion.div
              className="pointer-events-none fixed left-0 top-0 z-[200] text-amber-500"
              initial={{
                x: flight.from.x - 12,
                y: flight.from.y - 12,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: flight.to.x - 12,
                y: flight.to.y - 12,
                opacity: 0.15,
                scale: 0.45,
              }}
              transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
              onAnimationComplete={() => setFlight(null)}
              aria-hidden
            >
              <Star className="size-6 fill-amber-400 drop-shadow-md" strokeWidth={1.2} />
            </motion.div>,
            document.body,
          )
        : null}
    </>
  );
}

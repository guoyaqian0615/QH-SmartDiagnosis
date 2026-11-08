"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, type ReactNode } from "react";

import { Atmosphere } from "@/components/background/Atmosphere";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { syncZenFromDocument, useUIStore } from "@/stores/ui-store";

import { ZenModeToggle } from "@/components/zen/ZenModeToggle";
import { MuseumMobileDock } from "@/components/museum/MuseumMobileDock";
import { MuseumNav } from "@/components/museum/MuseumNav";

import { AppWorkspaceDock } from "./AppWorkspaceDock";
import { ModuleSideRail } from "./ModuleSideRail";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { XaiPanel } from "./XaiPanel";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isMuseumHome = pathname === "/";
  const isCoreModuleRoute = ["/clinical", "/constitution", "/knowledge", "/favorites", "/profile"].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const { season } = useSeasonTheme();
  const setXaiOpen = useUIStore((s) => s.setXaiOpen);
  const zenMode = useUIStore((s) => s.zenMode);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  useLayoutEffect(() => {
    syncZenFromDocument();
  }, []);

  useEffect(() => {
    if (isAuthPage) return;
    void fetchSession();
  }, [isAuthPage, fetchSession]);

  /** 进入智诊相关页时默认展开逻辑链，避免右侧被裁切时误以为「没有面板」 */
  useLayoutEffect(() => {
    if (pathname === "/clinical") {
      setXaiOpen(true);
    }
  }, [pathname, setXaiOpen]);

  const shellPadding = !isMuseumHome && !isAuthPage && !isCoreModuleRoute;

  return (
    <div
      className={cn(
        "relative z-0 flex w-full",
        isMuseumHome && "min-h-screen overflow-x-hidden overflow-y-auto",
        isCoreModuleRoute && "min-h-screen overflow-x-hidden overflow-y-auto",
        isAuthPage && "h-[100dvh] max-h-[100dvh] overflow-hidden app-safe-padding",
        shellPadding &&
          "h-[100dvh] max-h-[100dvh] overflow-hidden app-safe-padding sm:gap-1",
      )}
    >
      <div
        className={cn(
          "pointer-events-none z-0 overflow-hidden translate-z-0 [backface-visibility:hidden]",
          isMuseumHome
            ? "absolute inset-0 min-h-full"
            : isCoreModuleRoute
              ? "absolute inset-0 min-h-full"
              : "fixed inset-0",
        )}
      >
        <Atmosphere
          season={season}
          zenMode={zenMode}
          layout={isMuseumHome || isCoreModuleRoute ? "scroll" : "viewport"}
        />
      </div>
      {!isMuseumHome && !isCoreModuleRoute ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(900px circle at 50% 120%, var(--canvas-vignette), transparent 55%)",
          }}
          aria-hidden
        />
      ) : null}
      <AnimatePresence mode="wait">
        {isAuthPage ? (
          <motion.div
            key="route-auth"
            initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -12 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 items-center justify-center"
          >
            <div
              className="pointer-events-auto fixed right-4 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-30 sm:right-6 sm:top-6"
              data-zen-toggle-anchor
            >
              <ZenModeToggle withLabel size="md" />
            </div>
            {children}
          </motion.div>
        ) : isMuseumHome ? (
          /**
           * 首页仅用 opacity 过场，避免对子节点使用 transform / filter（否则其内 `position: fixed`
           * 的顶栏会相对本层定位，随 `overflow-y-auto` 一起滚动，无法贴在视口顶端）。
           */
          <motion.div
            key="route-museum"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full min-w-0"
          >
            {children}
          </motion.div>
        ) : isCoreModuleRoute ? (
          <motion.div
            key="route-core-module"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full min-w-0"
          >
            <div className="museum-ambient museum-airy text-foreground relative min-h-screen">
              <div className="relative z-10 mx-auto flex w-full max-w-[min(100%,106rem)] flex-col museum-gutter-x pb-28 [text-rendering:optimizeLegibility] lg:pb-0">
                <MuseumNav focusMode />
                <section className="pb-24 pt-[max(7.5rem,calc(env(safe-area-inset-top,0px)+6rem))] sm:pt-[max(8.5rem,calc(env(safe-area-inset-top,0px)+6.6rem))] lg:pb-16 lg:pt-[max(9.5rem,calc(env(safe-area-inset-top,0px)+7rem))]">
                  <div className="relative min-h-[calc(100dvh-11.5rem)] sm:min-h-[calc(100dvh-12rem)] lg:min-h-[calc(100dvh-13rem)]">
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[2rem]"
                      style={{
                        background:
                          "linear-gradient(175deg, color-mix(in_srgb,var(--background)_80%,transparent), color-mix(in_srgb,var(--background)_64%,transparent))",
                      }}
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute -left-12 -top-10 h-44 w-44 rounded-full opacity-50 blur-3xl"
                      style={{ background: "color-mix(in srgb, var(--season-accent) 30%, transparent)" }}
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full opacity-40 blur-3xl"
                      style={{ background: "color-mix(in srgb, var(--primary) 28%, transparent)" }}
                      aria-hidden
                    />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                        transition={{ duration: 0.34, ease: [0.2, 0.9, 0.2, 1] }}
                        className="relative z-10 px-2 pb-3 sm:px-4 lg:px-6"
                      >
                        <div className="flex gap-6">
                          <ModuleSideRail />
                          <div className="min-w-0 flex-1">{children}</div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              </div>
              <MuseumMobileDock />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="route-app"
            initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(10px)", y: -14 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 gap-0 overflow-hidden lg:gap-3"
          >
            <Sidebar />
            <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col gap-2 sm:gap-3">
              <Topbar />
              <main className="main-canvas-inner min-h-0 flex-1 overflow-hidden p-3 pb-[max(5.75rem,env(safe-area-inset-bottom,0px)+4.5rem)] sm:p-5 sm:pb-[max(5.75rem,env(safe-area-inset-bottom,0px)+4.5rem)] lg:p-6 lg:pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                    transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full min-h-0"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
            <div className="relative z-10 flex h-full min-w-0 shrink-0 overflow-visible">
              <XaiPanel />
            </div>
            <AppWorkspaceDock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

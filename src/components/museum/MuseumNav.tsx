"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { DbcnetMark } from "@/components/brand/DbcnetMark";
import { getDailyTcmForDate } from "@/data/daily-tcm";
import { ZenModeToggle } from "@/components/zen/ZenModeToggle";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const links = [
  { href: "#hero", label: "首页", emphasis: false },
  { href: "#daily-season", label: "时令", emphasis: false },
  { href: "/constitution", label: "体质辨识", emphasis: false },
  { href: "/clinical", label: "智诊辅助", emphasis: false },
  { href: "/knowledge", label: "知识库", emphasis: false },
] as const;

export function MuseumNav({
  className,
  focusMode = false,
}: {
  className?: string;
  focusMode?: boolean;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { themeSkinLabel } = useSeasonTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const dailyWord = today ? getDailyTcmForDate(today) : null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] museum-gutter-x pt-[max(0.75rem,env(safe-area-inset-top,0px))] lg:pt-[max(1.5rem,env(safe-area-inset-top,0px))]",
        className,
      )}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[min(100%,120rem)] min-h-[3.5rem] items-center gap-1.5 sm:min-h-[4.25rem] sm:gap-3">
        <div className="min-w-0 shrink-0 pr-0.5 -ml-1.5 sm:-ml-2 md:-ml-2.5">
          <Link
            href={isHome ? "#hero" : "/"}
            className="group flex min-w-0 max-w-[calc(100dvw-8.5rem)] items-center gap-2.5 sm:max-w-[min(18rem,42vw)] sm:gap-3.5 sm:pr-1 md:max-w-none"
            title="回到首页"
            aria-label="本草智诊，回到首页"
          >
            <DbcnetMark
              className="!h-14 !w-14 !min-h-14 !min-w-14 sm:!h-[3.75rem] sm:!w-[3.75rem] md:!h-16 md:!w-16"
              sizes="(max-width: 640px) 112px, 128px"
              priority
              aria-hidden
            />
            {!focusMode ? (
              <div className="min-w-0 text-left">
                <span className="block font-serif text-base font-medium leading-tight tracking-[0.1em] text-foreground sm:text-lg md:text-[1.4rem] md:tracking-[0.11em]">
                  本草智诊
                </span>
                <span className="mt-0.5 line-clamp-1 block text-[0.5rem] font-medium tracking-[0.14em] text-muted-foreground sm:line-clamp-none sm:text-[0.6rem] sm:leading-snug sm:tracking-[0.15em]">
                DBCNet · 文本问诊中医智能辅助
                </span>
              </div>
            ) : null}
          </Link>
        </div>

        {focusMode ? (
          <div className="ml-1 flex items-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/45 px-3 py-1.5 text-xs font-medium tracking-[0.04em] text-muted-foreground backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/70 hover:text-foreground"
              aria-label="返回首页"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              返回首页
            </Link>
          </div>
        ) : null}

        {!focusMode ? (
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center self-stretch pl-0.5 sm:pl-1">
            <div
              className={cn(
                // 👇 👇 这里我加了半透明 + 毛玻璃！！！
                "bg-white/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/30",
                "museum-glass-nav pointer-events-auto hidden w-full min-h-[2.75rem] max-w-[min(100%,40rem)] flex-1 items-stretch justify-center gap-0 rounded-2xl py-1.5 pl-2.5 pr-0 shadow-[0_12px_40px_rgba(42,50,44,0.07)] sm:rounded-3xl sm:pl-3",
                "md:min-h-[2.75rem] md:max-w-[min(100%,40rem)] md:rounded-full md:pl-3.5",
                "lg:max-w-[min(100%,50rem)] lg:min-h-[2.9rem] lg:gap-2 lg:py-2.5",
                "lg:flex lg:flex-row lg:items-center",
              )}
            >
              <div
                className="flex w-[min(100%,13.5rem)] shrink-0 flex-col justify-center border-r border-border/60 py-0.5 pr-2.5"
                title={themeSkinLabel}
              >
                <p className="min-w-0 font-serif text-[11px] leading-snug tracking-[0.05em] text-foreground sm:text-[11.5px]">
                  {dailyWord?.term ?? "载入中…"}
                </p>
              </div>
              <nav
                aria-label="首页导览"
                className="scrollbar-hide flex min-h-0 w-full min-w-0 flex-1 flex-wrap items-center justify-end gap-0.5 pl-0.5 pr-1.5 font-sans text-[10.5px] font-medium tracking-[0.03em] text-muted-foreground sm:gap-1.5 sm:pl-1.5 sm:text-xs md:gap-1.5 md:text-[12.5px] md:tracking-[0.04em] lg:justify-end lg:gap-1.5 lg:pr-2.5 lg:text-[13px]"
              >
                {links.map(({ href, label }) => {
                  const mappedHref =
                    href === "#hero"
                      ? isHome
                        ? "#hero"
                        : "/"
                      : href === "#daily-season"
                        ? isHome
                          ? "#daily-season"
                          : "/#daily-season"
                        : href;
                  return mappedHref.startsWith("/") ? (
                    <Link
                      key={href}
                      href={mappedHref}
                      className={cn(
                        "inline-flex min-h-9 shrink-0 touch-manipulation items-center justify-center rounded-full px-2 py-1.5 text-muted-foreground transition duration-200 hover:bg-muted/60 hover:text-foreground sm:min-h-0 sm:px-2.5 sm:py-2.5",
                        "md:px-3 md:py-1.5",
                        label === "智诊辅助" ? "hidden min-[400px]:inline-flex" : null,
                      )}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      key={href}
                      href={mappedHref}
                      className="inline-flex min-h-9 shrink-0 touch-manipulation items-center justify-center rounded-full px-2 py-1.5 text-muted-foreground transition duration-200 hover:bg-muted/60 hover:text-foreground sm:min-h-0 sm:px-2.5 sm:py-2.5 md:px-3 md:py-1.5"
                    >
                      {label}
                    </a>
                  );
                })}
              </nav>
            </div>
            <p
              className="-mx-0.5 min-w-0 max-w-full flex-1 text-center text-[0.5rem] font-medium leading-tight tracking-[0.1em] text-muted-foreground [text-wrap:balance] min-[400px]:text-[0.55rem] sm:mx-0 sm:max-w-[min(100%,18rem)] sm:text-xs sm:leading-snug lg:hidden"
              title="中医问诊：智诊、体质、知识、时令、膳食等"
            >
              智诊与体质
              <span className="text-muted-foreground/40">·</span>
              知识与时令
              <span className="text-muted-foreground/40">·</span>
              一站随览
            </p>
          </div>
        ) : (
          <div className="pointer-events-none ml-auto h-10 flex-1 rounded-full bg-background/20 backdrop-blur-md" />
        )}

        {!focusMode ? (
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <ZenModeToggle withLabel size="md" />
            <div className="museum-liquid-login-shell">
              <span className="museum-liquid-login-blob museum-liquid-login-blob-a" aria-hidden />
              <span className="museum-liquid-login-blob museum-liquid-login-blob-b" aria-hidden />
              <div className="relative z-[1] flex items-center gap-0.5">
                {isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="museum-liquid-login-link text-foreground inline-flex min-h-[40px] min-w-[4.5rem] items-center justify-center rounded-full px-4 py-1.5 font-sans text-[12px] font-semibold tracking-wide transition duration-300 hover:text-foreground/90 sm:min-h-[44px] sm:min-w-[5rem] sm:px-4 sm:py-2 sm:text-[12.5px]"
                  >
                    个人中心
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="inline-flex min-h-[40px] min-w-12 items-center justify-center rounded-full px-2.5 font-sans text-[11.5px] font-medium text-foreground/85 transition hover:text-foreground sm:min-h-[44px] sm:text-xs"
                    >
                      注册
                    </Link>
                    <Link
                      href="/login"
                      className="museum-liquid-login-link text-foreground inline-flex min-h-[40px] min-w-[3.5rem] items-center justify-center rounded-full px-3.5 py-1.5 font-sans text-[12px] font-semibold tracking-wide transition duration-300 hover:text-foreground/90 sm:min-h-[44px] sm:min-w-[4.5rem] sm:px-4 sm:py-2 sm:text-[12.5px]"
                    >
                      登录
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
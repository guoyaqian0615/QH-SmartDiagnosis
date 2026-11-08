"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSeasonTheme } from "@/hooks/useSeasonTheme";

// ── 十二时辰 · 子午流注数据 ────────────────────────
type HourEntry = {
  i: number;
  char: string;
  time: string;
  organ: string;
  elem: string;
  hue: string;
  tip: string;
};

const HOURS: HourEntry[] = [
  { i: 0,  char: "子", time: "23–01", organ: "胆",  elem: "木", hue: "#4e7252", tip: "宜深度睡眠，胆经当令，气血归胆以生发少阳" },
  { i: 1,  char: "丑", time: "01–03", organ: "肝",  elem: "木", hue: "#4e7252", tip: "肝经旺盛，须静卧熟睡，藏血解毒疏泄" },
  { i: 2,  char: "寅", time: "03–05", organ: "肺",  elem: "金", hue: "#6a8496", tip: "肺朝百脉，宜深缓呼吸，主气宣发卫外" },
  { i: 3,  char: "卯", time: "05–07", organ: "大肠", elem: "金", hue: "#6a8496", tip: "大肠经旺，晨起排便，疏通腑气清浊" },
  { i: 4,  char: "辰", time: "07–09", organ: "胃",  elem: "土", hue: "#9c8220", tip: "胃气充盈，适宜进食早餐，补充水谷精微" },
  { i: 5,  char: "巳", time: "09–11", organ: "脾",  elem: "土", hue: "#9c8220", tip: "脾主运化，精力旺盛，思维活跃适合工作" },
  { i: 6,  char: "午", time: "11–13", organ: "心",  elem: "火", hue: "#b03a36", tip: "心气最旺，宜小憩养神，阴阳交替之时" },
  { i: 7,  char: "未", time: "13–15", organ: "小肠", elem: "火", hue: "#b03a36", tip: "小肠分清泌浊，助消化吸收，勿过度劳累" },
  { i: 8,  char: "申", time: "15–17", organ: "膀胱", elem: "水", hue: "#325e7a", tip: "膀胱经旺，多饮水，排毒通利小便" },
  { i: 9,  char: "酉", time: "17–19", organ: "肾",  elem: "水", hue: "#325e7a", tip: "肾精收藏，宜轻缓运动，固本培元养藏" },
  { i: 10, char: "戌", time: "19–21", organ: "心包", elem: "火", hue: "#7a345c", tip: "心包经旺，散步放松，护心通脉勿动怒" },
  { i: 11, char: "亥", time: "21–23", organ: "三焦", elem: "火", hue: "#7a345c", tip: "三焦通调水道，少思静心，准备安然入眠" },
];

const ELEMENTS = [
  { elem: "木", hue: "#4e7252", organs: "肝 · 胆" },
  { elem: "火", hue: "#b03a36", organs: "心 · 小肠 · 心包 · 三焦" },
  { elem: "土", hue: "#9c8220", organs: "脾 · 胃" },
  { elem: "金", hue: "#6a8496", organs: "肺 · 大肠" },
  { elem: "水", hue: "#325e7a", organs: "肾 · 膀胱" },
];

function getActiveIndex(): number {
  const h = new Date().getHours();
  if (h === 23 || h === 0) return 0;
  if (h <= 2)  return 1;
  if (h <= 4)  return 2;
  if (h <= 6)  return 3;
  if (h <= 8)  return 4;
  if (h <= 10) return 5;
  if (h <= 12) return 6;
  if (h <= 14) return 7;
  if (h <= 16) return 8;
  if (h <= 18) return 9;
  if (h <= 20) return 10;
  return 11;
}

// ── SVG 工具函数 ────────────────────────────────────
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function donutPath(
  cx: number, cy: number,
  oR: number, iR: number,
  a0: number, a1: number,
): string {
  const [x0, y0] = polar(cx, cy, oR, a0);
  const [x1, y1] = polar(cx, cy, oR, a1);
  const [x2, y2] = polar(cx, cy, iR, a1);
  const [x3, y3] = polar(cx, cy, iR, a0);
  const lg = a1 - a0 > 180 ? 1 : 0;
  return `M${x0},${y0} A${oR},${oR},0,${lg},1,${x1},${y1} L${x2},${y2} A${iR},${iR},0,${lg},0,${x3},${y3}Z`;
}

// ── 子午流注圆盘 ────────────────────────────────────
function ZiwuClock() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dotAngle, setDotAngle] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 时辰更新
  useEffect(() => {
    setMounted(true);
    setActiveIdx(getActiveIndex());
    const t = setInterval(() => setActiveIdx(getActiveIndex()), 30_000);
    return () => clearInterval(t);
  }, []);

  // 经气流动动画
  useEffect(() => {
    let id: number;
    let t0: number | null = null;
    const loop = (now: number) => {
      if (t0 === null) t0 = now;
      setDotAngle(((now - t0) * 0.018) % 360);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const displayIdx = hoveredIdx ?? activeIdx;
  const cur = displayIdx >= 0 ? HOURS[displayIdx] : null;

  const CX = 260, CY = 260;
  const OR = 234, IR = 153;
  const GAP = 1.5;

  return (
    <div className="flex w-full max-w-[920px] flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">

      {/* ── 圆盘 SVG ── */}
      <div className="w-full max-w-[440px] shrink-0 self-center">
        <svg
          viewBox="0 0 520 520"
          className="w-full"
          role="img"
          aria-label="子午流注十二时辰经气运行图"
          style={{ filter: "drop-shadow(0 8px 36px rgba(55,38,28,0.09))" }}
        >
          <defs>
            <radialGradient id="zw-center" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(253,249,243,0.98)" />
              <stop offset="100%" stopColor="rgba(244,236,222,0.96)" />
            </radialGradient>
            <filter id="zw-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="zw-dot" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* 外装饰圆环 */}
          <circle cx={CX} cy={CY} r={OR + 16} fill="none" stroke="rgba(155,125,95,0.09)"  strokeWidth="1"   />
          <circle cx={CX} cy={CY} r={OR + 8}  fill="none" stroke="rgba(155,125,95,0.06)"  strokeWidth="0.5" />

          {/* 刻度线 */}
          {Array.from({ length: 12 }).map((_, k) => {
            const [tx1, ty1] = polar(CX, CY, OR + 3,  k * 30);
            const [tx2, ty2] = polar(CX, CY, OR + 12, k * 30);
            return (
              <line
                key={k}
                x1={tx1} y1={ty1} x2={tx2} y2={ty2}
                stroke="rgba(135,105,75,0.22)"
                strokeWidth="1"
              />
            );
          })}

          {/* ── 十二节段 ── */}
          {HOURS.map((h) => {
            const a0 = h.i * 30 + GAP / 2;
            const a1 = (h.i + 1) * 30 - GAP / 2;
            const mid = h.i * 30 + 15;
            const isActive = h.i === activeIdx;
            const isHov    = h.i === hoveredIdx;
            const lit      = isActive || isHov;
            const oR       = lit ? OR + 6 : OR;

            const path   = donutPath(CX, CY, oR, IR, a0, a1);
            const labelR = (oR + IR) / 2;
            const [lcx, lcy] = polar(CX, CY, labelR,      mid);
            const [ocx, ocy] = polar(CX, CY, labelR - 19, mid);
            const [tcx, tcy] = polar(CX, CY, labelR + 19, mid);

            return (
              <g
                key={h.i}
                onMouseEnter={() => setHoveredIdx(h.i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "default" }}
              >
                {/* 节段主体 */}
                <path
                  d={path}
                  fill={h.hue}
                  fillOpacity={lit ? 0.46 : 0.08}
                  stroke={h.hue}
                  strokeWidth={lit ? 0.9 : 0.5}
                  strokeOpacity={lit ? 0.78 : 0.28}
                  style={{ transition: "fill-opacity 0.2s ease, stroke-opacity 0.2s ease" }}
                />
                {/* 当前时辰光晕 */}
                {isActive && (
                  <path
                    d={donutPath(CX, CY, OR + 6, IR, a0, a1)}
                    fill={h.hue}
                    fillOpacity={0.11}
                    filter="url(#zw-glow)"
                  />
                )}
                {/* 时辰字 */}
                <text
                  x={lcx} y={lcy}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={lit ? "18" : "15"}
                  fontFamily="serif"
                  fill={lit ? h.hue : "rgba(60,42,32,0.65)"}
                  fontWeight={lit ? "600" : "400"}
                  style={{ transition: "all 0.2s ease" }}
                >
                  {h.char}
                </text>
                {/* 时段 */}
              </g>
            );
          })}

          {/* 内边界 */}
          <circle cx={CX} cy={CY} r={IR + 1} fill="none" stroke="rgba(145,115,85,0.18)" strokeWidth="0.5" />

          {/* 经气流动光点 */}
          {mounted && (() => {
            const [dx, dy] = polar(CX, CY, IR - 11, dotAngle);
            return (
              <>
                <circle cx={dx} cy={dy} r="3"   fill="rgba(195,148,82,0.85)" filter="url(#zw-dot)" />
                <circle cx={dx} cy={dy} r="1.6" fill="rgba(225,182,110,1)"   />
              </>
            );
          })()}

          {/* 中心圆 */}
          <circle cx={CX} cy={CY} r={IR - 2} fill="url(#zw-center)" />
          <circle cx={CX} cy={CY} r={IR - 2} fill="none" stroke="rgba(145,115,85,0.2)" strokeWidth="0.5" />

          {/* 中心内容 */}
          {cur ? (
            <>
              <text
                x={CX} y={CY - 30}
                textAnchor="middle"
                fontSize="66" fontFamily="serif"
                fill={cur.hue} fillOpacity="0.92" fontWeight="500"
              >
                {cur.char}
              </text>
              <text x={CX} y={CY + 6}  textAnchor="middle" fontSize="20"  fontFamily="serif"      fill="rgba(55,38,28,0.78)">{cur.organ}</text>
              <text x={CX} y={CY + 24} textAnchor="middle" fontSize="12.5" fontFamily="sans-serif" fill="rgba(105,78,58,0.58)" letterSpacing="1">{cur.time}</text>
              <text x={CX} y={CY + 41} textAnchor="middle" fontSize="12"   fontFamily="sans-serif" fill={cur.hue} fillOpacity="0.7" letterSpacing="2">{cur.elem}行</text>
             
            </>
          ) : (
            <>
              <text x={CX} y={CY - 8}  textAnchor="middle" fontSize="13" fontFamily="serif"      fill="rgba(85,62,46,0.52)" letterSpacing="3">子午流注</text>
              <text x={CX} y={CY + 12} textAnchor="middle" fontSize="8"  fontFamily="sans-serif" fill="rgba(105,78,58,0.36)" letterSpacing="1">经气循行时辰图</text>
            </>
          )}
        </svg>
      </div>

      {/* ── 侧边信息面板 ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">

        {/* 当前时辰说明 */}
        <div className="space-y-1.5">
          <p className="font-sans text-[10.5px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/52">
            子午流注 · 十二时辰养生
          </p>
          <h3 className="font-serif text-[1.38rem] font-medium leading-snug tracking-[0.06em] text-foreground/80">
            {cur
              ? <>{cur.char}时 · {cur.organ}经气当令</>
              : <>气随时走，顺时而养</>
            }
          </h3>
          {cur && (
            <p className="font-sans text-[0.9rem] leading-relaxed tracking-wide text-muted-foreground">
              {cur.tip}
            </p>
          )}
        </div>

        {/* 五行配脏腑 */}
        <div className="space-y-2">
          <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-muted-foreground/42">
            五行配脏腑
          </p>
          <div className="flex flex-col gap-1.5">
            {ELEMENTS.map(({ elem, hue, organs }) => (
              <div
                key={elem}
                className="flex items-center gap-2 rounded-md border px-2.5 py-1.5"
                style={{ borderColor: `${hue}28`, backgroundColor: `${hue}0a` }}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: hue }} />
                <span className="font-serif text-[12.5px] font-semibold" style={{ color: hue }}>{elem}</span>
                <span className="font-sans text-[10.5px] tracking-wide text-muted-foreground/58">{organs}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 当前时辰高亮徽章 */}
        {activeIdx >= 0 && (
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-lg border px-3 py-2.5"
            style={{
              borderColor: `${HOURS[activeIdx].hue}2e`,
              backgroundColor: `${HOURS[activeIdx].hue}0b`,
            }}
          >
            <p
              className="font-sans text-[10px] uppercase tracking-[0.28em]"
              style={{ color: HOURS[activeIdx].hue }}
            >
              正当 · {HOURS[activeIdx].char}时
            </p>
            <p className="mt-0.5 font-serif text-[14px] text-foreground/70">
              {HOURS[activeIdx].organ}经 · {HOURS[activeIdx].time}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── 印章组件（保持原版） ────────────────────────────
// ── 印章组件（已删除） ────────────────────────────
function TitleSeal() {
  return null; // 直接返回空，印章彻底消失
}

// ── 主 Hero 组件 ────────────────────────────────────
export function MuseumHero() {
  const { label } = useSeasonTheme();

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center pb-16 pt-[max(7.5rem,calc(env(safe-area-inset-top,0px)+5rem))] sm:pb-24 sm:pt-[max(10rem,calc(env(safe-area-inset-top,0px)+7rem))] lg:pb-36 lg:pt-44">

      {/* ── 眉标 ── */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.04, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full items-center justify-center gap-3"
      >
        <div className="flex flex-col gap-[4px]">
          <span className="h-[1.1rem] w-[1.5px] rounded-full bg-[color-mix(in_srgb,var(--season-accent)_55%,transparent)]" />
          <span className="h-[0.55rem] w-[1.5px] rounded-full bg-[color-mix(in_srgb,var(--season-accent)_28%,transparent)]" />
        </div>
        <p className=" text-center font-sans text-[20.5px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
        中医辨证 · 问卷体质自测
          <span className="mx-2.5 text-border">·</span>
        
        </p>
      </motion.div>

      {/* ── 主标题 + 印章 ── */}
      <div className="mt-8 flex w-full items-end justify-center gap-8 sm:mt-10 sm:items-start">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-w-0 flex-col items-center text-center"
        >
         <h1 className="font-serif text-center text-[clamp(2.6rem,6vw,4.8rem)] font-medium leading-[1.04] tracking-[0.14em] text-foreground">
  本草智诊
          </h1>
          <p className="mt-4 text-center max-w-[min(108vw,28rem)] font-sans text-[clamp(.99rem,1.7vw,1.97rem)] font-light leading-[1.92] tracking-[0.02em] text-muted-foreground">
          基于文本问诊与知识库的中医大模型辅助诊断系统

          </p>
          <p className="mt-5  text-center font-serif text-[clamp(1.5rem,2.2vw,1.1rem)] font-normal leading-[1.72] tracking-[0.09em] text-foreground/75 sm:mt-6">
            让中医可感知，可解释，可持续
          </p>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10, y: 4 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.38, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="hidden shrink-0 pb-1 sm:block"
        >
          <TitleSeal />
        </motion.div>
      </div>

      {/* ── 季节分隔线 ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.44, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 w-full origin-center"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--season-accent)_30%,transparent)] to-transparent" />
      </motion.div>

      {/* ── 子午流注时辰图 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex w-full justify-center"
      >
        <ZiwuClock />
      </motion.div>

      {/* ── CTA 按钮 ── */}
      <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
  className="mt-12 flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-8"
>
  <Button
    asChild
    size="lg"
    className="h-14 min-h-[56px] w-full rounded-full border border-[color-mix(in_srgb,var(--season-accent)_32%,#d6d3d1)] bg-[color-mix(in_srgb,var(--season-accent)_12%,#ffffff)] px-10 text-[16px] font-medium tracking-wide text-foreground shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_6px_20px_rgba(42,50,44,0.06)] transition duration-300 hover:bg-[color-mix(in_srgb,var(--season-accent)_18%,#ffffff)] active:scale-[0.99] dark:border-[color-mix(in_srgb,var(--season-accent)_40%,#3f3f3f)] dark:bg-[color-mix(in_srgb,var(--season-accent)_22%,#1a1c1a)] dark:text-primary-foreground dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_6px_20px_rgba(0,0,0,0.35)] dark:hover:bg-[color-mix(in_srgb,var(--season-accent)_32%,#222524)] sm:w-auto sm:min-w-[14rem]"
  >
    <Link href="/constitution">问卷体质测评</Link>

  </Button>
  <Button
    asChild
    size="lg"
    variant="outline"
    className="h-14 min-h-[56px] w-full rounded-full border border-stone-300/95 bg-white/70 px-10 text-[16px] font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm transition duration-300 hover:border-stone-400/90 hover:bg-white/92 active:scale-[0.99] dark:border-stone-500/40 dark:bg-stone-900/55 dark:text-foreground dark:hover:border-stone-500/50 dark:hover:bg-stone-800/65 sm:w-auto sm:min-w-[14rem]"
  >
    <Link href="#home-bento">浏览核心功能</Link>
  </Button>
</motion.div>
    </div>
  );
}

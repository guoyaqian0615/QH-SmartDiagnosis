"use client";

import { useLayoutEffect, useRef } from "react";

import type { Season } from "@/types/season";

type FlowFieldCanvasProps = {
  season: Season;
};

/** 浅色雾粒：四季略偏色，整体高明度 */
type Mist = { r: number; g: number; b: number };

function seasonMist(season: Season): Mist {
  switch (season) {
    case "summer":
      return { r: 255, g: 236, b: 228 };
    case "autumn":
      return { r: 250, g: 238, b: 222 };
    case "winter":
      return { r: 228, g: 234, b: 244 };
    case "spring":
    default:
      return { r: 232, g: 244, b: 236 };
  }
}

/** 更舒缓的流场，略像液体里缓慢扰动 */
function flowVelocity(
  x: number,
  y: number,
  tMs: number,
): { vx: number; vy: number } {
  const k = 0.0021;
  const wt = tMs * 0.0001;
  const vx =
    Math.sin(y * k + wt) * 1.2 +
    Math.cos((x * 0.71 + y * 0.53) * k * 1.1 + wt * 0.95) * 0.48;
  const vy =
    Math.cos(x * k - wt * 0.88) * 1.2 +
    Math.sin((x * 0.61 - y * 0.74) * k * 1.05 - wt * 0.82) * 0.45;
  const len = Math.hypot(vx, vy) + 1e-6;
  return { vx: vx / len, vy: vy / len };
}

type MistParticle = {
  x: number;
  y: number;
  rHalo: number;
  phase: number;
  /** 远近层次 */
  depth: number;
  /** 尺寸差异 */
  size: number;
  /** 上浮感（气泡向上升） */
  rise: number;
  /** 高光在缘上的微小偏移，避免每颗一样 */
  spec: number;
};

function particleCount(w: number, h: number): number {
  const area = Math.max(1, w * h);
  const n = Math.floor(area / 9_500);
  return Math.max(56, Math.min(160, n));
}

function initParticles(w: number, h: number): MistParticle[] {
  const n = particleCount(w, h);
  const out: MistParticle[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: Math.random() * w,
      y: Math.random() * h,
      rHalo: 8.5 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      depth: 0.5 + Math.random() * 0.5,
      size: 0.85 + Math.random() * 0.28,
      rise: 0.25 + Math.random() * 0.75,
      spec: Math.random() * Math.PI * 2,
    });
  }
  return out;
}

export function FlowFieldCanvas({ season }: FlowFieldCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mistRef = useRef(seasonMist(season));
  mistRef.current = seasonMist(season);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: MistParticle[] = [];
    let widthCss = 0;
    let heightCss = 0;
    let dpr = 1;
    let raf = 0;
    const t0 = performance.now();
    let last = t0;

    const drawFrame = (t: number) => {
      const mist = mistRef.current;
      const w = widthCss;
      const h = heightCss;
      if (w < 4 || h < 4 || particles.length === 0) return;

      /** 在保持浅色的前提下向白微抬，更容易从渐变底上浮现 */
      const air = 0.1;
      const tr = Math.round(mist.r + (255 - mist.r) * air);
      const tg = Math.round(mist.g + (255 - mist.g) * air);
      const tb = Math.round(mist.b + (255 - mist.b) * air);
      const isWinter = season === "winter";
      const breathe = (p: MistParticle) => 0.95 + 0.05 * Math.sin(t * 0.00035 + p.phase);

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const br = breathe(p);
        const s = p.size;
        const rh = p.rHalo * br * s;
        const aMul = p.depth * (0.96 + 0.04 * Math.sin(t * 0.0005 + p.phase * 1.1));

        const aInner = 0.04 * aMul;
        const aBody = 0.092 * aMul;
        const aRim = 0.12 * aMul;
        const whiteRim = (isWinter ? 0.12 : 0.14) * aMul;
        const specA = 0.2 * aMul;

        const gBody = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          Math.max(1, rh),
        );
        gBody.addColorStop(0, `rgba(${tr},${tg},${tb},${aInner * 0.55})`);
        gBody.addColorStop(0.4, `rgba(${tr},${tg},${tb},${aInner * 0.95})`);
        gBody.addColorStop(0.7, `rgba(${tr},${tg},${tb},${aBody})`);
        gBody.addColorStop(0.86, `rgba(255,255,255,${whiteRim})`);
        gBody.addColorStop(0.94, `rgba(${tr},${tg},${tb},${aRim})`);
        gBody.addColorStop(1, `rgba(${tr},${tg},${tb},0)`);

        ctx.fillStyle = gBody;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rh, 0, Math.PI * 2);
        ctx.fill();

        // 极淡描边，便于轮廓从背景里分出来
        ctx.strokeStyle = `rgba(255,255,255,${(isWinter ? 0.1 : 0.08) * aMul})`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rh, 0, Math.PI * 2);
        ctx.stroke();

        const hx = p.x - Math.cos(p.spec) * rh * 0.28;
        const hy = p.y - Math.sin(p.spec + 0.8) * rh * 0.3;
        const hR = rh * 0.2;
        const gSpec = ctx.createRadialGradient(hx, hy, 0, hx, hy, hR);
        gSpec.addColorStop(0, `rgba(255,255,255,${specA * 0.95})`);
        gSpec.addColorStop(0.5, `rgba(255,255,255,${specA * 0.28})`);
        gSpec.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gSpec;
        ctx.beginPath();
        ctx.arc(hx, hy, hR, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      let w = wrap.clientWidth;
      let h = wrap.clientHeight;
      const parent = wrap.parentElement;
      if (h < 8 && parent) {
        w = Math.max(w, parent.clientWidth);
        h = Math.max(h, parent.clientHeight);
      }
      widthCss = Math.max(1, w);
      heightCss = Math.max(1, h);
      canvas.width = Math.floor(widthCss * dpr);
      canvas.height = Math.floor(heightCss * dpr);
      canvas.style.width = `${widthCss}px`;
      canvas.style.height = `${heightCss}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = initParticles(widthCss, heightCss);
      if (reduceMotion) {
        drawFrame(performance.now() - t0);
      }
    };

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(wrap);
    resize();
    requestAnimationFrame(() => {
      resize();
    });

    if (reduceMotion) {
      return () => {
        ro.disconnect();
      };
    }

    const step = (now: number) => {
      if (document.visibilityState === "hidden") {
        raf = requestAnimationFrame(step);
        return;
      }

      const t = now - t0;
      const dt = Math.min(40, now - last) / 16.67;
      last = now;

      const w = widthCss;
      const h = heightCss;
      if (w < 4 || h < 4 || particles.length === 0) {
        raf = requestAnimationFrame(step);
        return;
      }

      const speed = season === "winter" ? 0.56 : 0.65;

      for (const p of particles) {
        let { vx, vy } = flowVelocity(p.x, p.y, t);
        vx += Math.sin(t * 0.00016 + p.phase) * 0.032;
        vy += Math.cos(t * 0.00014 + p.phase * 0.8) * 0.025;
        vy -= 0.05 * p.rise;
        const l = Math.hypot(vx, vy) + 1e-6;
        vx /= l;
        vy /= l;
        p.x += vx * speed * dt;
        p.y += vy * speed * dt;
        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;
      }

      drawFrame(t);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [season]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[6] min-h-full w-full overflow-hidden"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full min-h-full w-full min-w-full" />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export type RadarDatum = {
  label: string;
  /** 0–1，用于半径比例 */
  value: number;
};

type ConstitutionRadarChartProps = {
  data: RadarDatum[];
  className?: string;
};

const CX = 160;
const CY = 160;
const R_MAX = 118;

function pointOnRadar(
  value: number,
  index: number,
  total: number,
): { x: number; y: number } {
  const v = Math.min(1, Math.max(0, value));
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  const r = R_MAX * v;
  return {
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  };
}

export function ConstitutionRadarChart({
  data,
  className,
}: ConstitutionRadarChartProps) {
  const n = data.length || 1;
  const pointsStr = useMemo(() => {
    return data
      .map((d, i) => {
        const p = pointOnRadar(d.value, i, n);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }, [data, n]);

  const gridRings = [0.25, 0.5, 0.75, 1];
  const axisLines = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      const p = pointOnRadar(1, i, n);
      return { x2: p.x, y2: p.y };
    });
  }, [n]);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 320 320"
        className="mx-auto w-full max-w-[min(100%,20rem)] overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor="color-mix(in srgb, var(--season-accent) 55%, transparent)"
            />
            <stop
              offset="100%"
              stopColor="color-mix(in srgb, var(--primary) 45%, transparent)"
            />
          </linearGradient>
          <filter id="radar-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridRings.map((t) => (
          <polygon
            key={t}
            fill="none"
            stroke="color-mix(in srgb, var(--border) 70%, transparent)"
            strokeWidth={0.6}
            points={Array.from({ length: n }, (_, i) => {
              const p = pointOnRadar(t, i, n);
              return `${p.x},${p.y}`;
            }).join(" ")}
          />
        ))}

        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={line.x2}
            y2={line.y2}
            stroke="color-mix(in srgb, var(--border) 55%, transparent)"
            strokeWidth={0.5}
          />
        ))}

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <polygon
            points={pointsStr}
            fill="url(#radar-fill)"
            fillOpacity={0.42}
            stroke="color-mix(in srgb, var(--season-accent) 70%, white)"
            strokeWidth={1.8}
            filter="url(#radar-glow)"
          />
        </motion.g>

        {data.map((d, i) => {
          const p = pointOnRadar(d.value, i, n);
          return (
            <motion.circle
              key={d.label}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="var(--primary)"
              stroke="white"
              strokeWidth={1.2}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.06, duration: 0.4 }}
            />
          );
        })}

        {data.map((d, i) => {
          const outer = pointOnRadar(1.12, i, n);
          return (
            <text
              key={`t-${d.label}`}
              x={outer.x}
              y={outer.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="color-mix(in srgb, var(--foreground) 88%, transparent)"
              style={{ fontSize: "10px", fontFamily: "var(--font-noto-serif), serif" }}
            >
              {d.label.length > 4 ? `${d.label.slice(0, 4)}…` : d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

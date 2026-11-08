"use client";
import { useMemo } from "react";

import {
  getEdgeEndpoints,
  layoutLogicGraph,
} from "@/lib/logic-graph-layout";
import { cn } from "@/lib/utils";
import { useLogicGraphStore } from "@/stores/logic-graph-store";

function nodeColor(role: string | undefined): string {
  switch (role) {
    case "symptom":
      return "color-mix(in srgb, var(--season-accent) 75%, #647066)";
    case "syndrome":
      return "color-mix(in srgb, var(--primary) 80%, #334)";
    case "formula":
      return "color-mix(in srgb, #b42318 55%, var(--season-accent))";
    case "herb":
      return "color-mix(in srgb, var(--season-accent) 60%, #5a6)";
    default:
      return "color-mix(in srgb, var(--muted-foreground) 90%, transparent)";
  }
}

export function LogicGraphCanvas({ className }: { className?: string }) {
  const phase = useLogicGraphStore((s) => s.phase);
  const nodes = useLogicGraphStore((s) => s.nodes);
  const edges = useLogicGraphStore((s) => s.edges);
  const activeEdgeCount = useLogicGraphStore((s) => s.activeEdgeCount);

  const { positioned, viewBox, edgePaths } = useMemo(() => {
    const { positioned: p, viewBox: vb } = layoutLogicGraph(nodes);
    const ep = getEdgeEndpoints(edges, p);
    return { positioned: p, viewBox: vb, edgePaths: ep };
  }, [nodes, edges]);

  const visibleEdges = edgePaths.slice(0, activeEdgeCount);

  if (phase === "idle" && nodes.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 px-2 py-4 text-center text-[10px] text-muted-foreground",
          className,
        )}
      >
        <p className="leading-relaxed">生成辨证后展示：症状 → 证候 → 方药</p>
      </div>
    );
  }

  return (
    // 👇 这里改成迷你高度
    <div className={cn("relative flex min-h-[4rem] flex-1 flex-col", className)}>
      <p className="mb-1 px-1 text-[9px] text-muted-foreground">
        {phase === "streaming" ? "推理中..." : "推理链"}
      </p>
      {/* 👇 卡片变窄、变精致 */}
      <div className="relative flex-1 overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-sm">
        <svg
          className="h-full w-full"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {visibleEdges.map(({ edge, path }, i) => (
            <path
              key={`${edge.source}-${edge.target}-${i}`}
              d={path}
              fill="none"
              stroke="color-mix(in srgb, var(--border) 92%, transparent)"
              strokeWidth={0.5} // 变细
              strokeLinecap="round"
              opacity={0.7}
            />
          ))}

          {positioned.map((n) => (
            <g key={n.id}>
              {/* 👇 圆圈变小：r=5 */}
              <circle
                cx={n.x}
                cy={n.y}
                r={1.5}
                fill={nodeColor(n.role)}
                opacity={0.92}
              />
              {/* 👇 外圈变小：r=7 */}
              <circle
                cx={n.x}
                cy={n.y}
                r={5}
                fill="none"
                stroke="color-mix(in srgb, white 35%, transparent)"
                strokeWidth={0.4}
                opacity={0.4}
              />
              {/* 👇 文字更小 */}
              <text
                x={n.x}
                y={(n.y ?? 0) + 4}
                textAnchor="middle"
                fill="color-mix(in srgb, var(--foreground) 92%, transparent)"
                style={{
                  fontSize: "1px",
                  fontFamily: "var(--font-noto-serif), var(--font-serif-stack)",
                }}
              >
                {n.label.length > 4 ? `${n.label.slice(0, 4)}…` : n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
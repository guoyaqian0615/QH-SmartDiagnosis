"use client";

import { LayoutGroup, motion } from "framer-motion";
import { BookOpen, BrainCircuit, Camera, Lock } from "lucide-react";

import { MuseumMotionSection } from "./MuseumMotionSection";

const modules = [
  {
    title: "辨证决策台",
    desc: "对接推理接口：语义向量经 LLM 分支与知识图谱分支，在门控融合头输出证候文本；侧栏「逻辑链」承载可解释图谱（示意）。",
    icon: BrainCircuit,
    offset: "md:translate-x-3 md:-rotate-[0.5deg]",
  },
  {
    title: "体质自测",
    desc: "量表问卷采集作答，完成体质判别与风险提示；交互对齐中医体质问卷流程（示意）。",
    icon: Camera,
    offset: "md:-translate-x-4 md:translate-y-3 md:rotate-[0.5deg]",
  },
  {
    title: "中医百科",
    desc: "典籍、方药与现代研究的可视化索引（示意）",
    icon: BookOpen,
    offset: "md:translate-x-8 md:-translate-y-1 md:rotate-[0.35deg]",
  },
  {
    title: "数字病历锁",
    desc: "隐私优先的病历沙盒与授权时间窗（示意）",
    icon: Lock,
    offset: "md:-translate-x-2 md:translate-y-4 md:-rotate-[0.35deg]",
  },
] as const;

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function MuseumCoreModules() {
  return (
    <MuseumMotionSection
      id="modules"
      className="relative z-10 scroll-mt-[max(4.75rem,calc(env(safe-area-inset-top,0px)+3.5rem))] pb-32 pt-10 sm:pb-40 sm:pt-14 lg:scroll-mt-[max(6.5rem,calc(env(safe-area-inset-top,0px)+5rem))]"
    >
      <div className="mx-auto max-w-6xl min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/60 px-3.5 py-1.5 shadow-sm backdrop-blur-sm dark:border-stone-500/30 dark:bg-stone-900/45">
          <span className="h-1 w-1 rounded-full bg-[color-mix(in_srgb,var(--season-accent)_55%,#6b7c6e)] opacity-70" />
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Core Modules
          </p>
        </div>
        <h2 className="museum-cn-title mt-6 max-w-2xl text-[clamp(1.6rem,3.6vw,2.35rem)] leading-snug text-foreground">
          核心模块矩阵
        </h2>
        <p className="mt-5 max-w-xl font-sans text-[14.5px] font-light leading-[1.8] text-muted-foreground">
          非对称展陈，如博古架上的器物错落；悬停时轻托起浮，光沿边缘徐徐流动。
        </p>

        <LayoutGroup id="museum-core-cards">
          <motion.div
            className="relative mt-20 space-y-10 md:space-y-14"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
          >
            {modules.map((m) => (
              <motion.div
                key={m.title}
                layout="position"
                variants={cardVariants}
                className={`museum-glass-card group flex min-w-0 flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-9 ${m.offset}`}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
                }}
              >
                <div className="relative z-[1] max-w-lg space-y-3">
                  <h3 className="font-serif text-[clamp(1.1rem,2.1vw,1.4rem)] font-medium tracking-[0.12em] text-foreground">
                    {m.title}
                  </h3>
                  <p className="font-sans text-[13.5px] font-light leading-[1.75] text-muted-foreground">
                    {m.desc}
                  </p>
                </div>
                <div className="relative z-[1] flex shrink-0 items-center justify-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-stone-200/70 bg-white/50 shadow-sm dark:border-stone-500/35 dark:bg-stone-900/50 sm:size-16">
                    <m.icon
                      className="size-6 text-muted-foreground/50 transition duration-500 group-hover:scale-[1.04] group-hover:text-[color-mix(in_srgb,var(--season-accent)_50%,#a8a29e)] sm:size-7"
                      strokeWidth={1.15}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </LayoutGroup>
      </div>
    </MuseumMotionSection>
  );
}

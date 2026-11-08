"use client";

import { useLayoutEffect, useState } from "react";

const LG_QUERY = "(min-width: 1024px)";

/**
 * 与 Tailwind `lg` 对齐，用于在「侧栏并排 / 浮层抽屉」间切换布局。
 * 首帧按窄屏处理，useLayoutEffect 在绘制前同步为真实视口，避免错误闪烁。
 */
export function useLgScreen() {
  const [lg, setLg] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    setLg(mq.matches);
    const onChange = () => setLg(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return lg;
}

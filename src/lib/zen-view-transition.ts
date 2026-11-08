const TWEEN_MS = 550;

/**
 * 禅意光效切换：优先使用 View Transitions（整页淡变），无则退化为长一点的 CSS transition。
 * `callback` 内需同步完成 DOM（data-zen / class）+ Zustand 更新，以便浏览器正确生成新旧快照。
 */
export function withZenViewTransition(callback: () => void): void {
  if (typeof document === "undefined") {
    callback();
    return;
  }

  const d = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };

  if (typeof d.startViewTransition === "function") {
    d.startViewTransition(() => {
      callback();
    });
    return;
  }

  const root = document.documentElement;
  root.classList.add("zen-theme-tweening");
  callback();
  requestAnimationFrame(() => {
    window.setTimeout(() => {
      root.classList.remove("zen-theme-tweening");
    }, TWEEN_MS);
  });
}

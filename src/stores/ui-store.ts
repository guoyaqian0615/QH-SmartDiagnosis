import { create } from "zustand";

import { withZenViewTransition } from "@/lib/zen-view-transition";
import { ZEN_STORAGE_KEY, type ZenMode, isZenMode } from "@/types/zen";

type UIState = {
  sidebarExpanded: boolean;
  setSidebarExpanded: (value: boolean) => void;
  toggleSidebar: () => void;
  xaiOpen: boolean;
  setXaiOpen: (value: boolean) => void;
  toggleXai: () => void;
  /** 宣纸白 / 水墨暗 */
  zenMode: ZenMode;
  setZenMode: (mode: ZenMode) => void;
  toggleZenMode: () => void;
};

function applyZenToDocument(mode: ZenMode) {
  if (typeof document === "undefined") {
    return;
  }
  const h = document.documentElement;
  h.setAttribute("data-zen", mode);
  h.classList.toggle("dark", mode === "ink");
  try {
    localStorage.setItem(ZEN_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export const useUIStore = create<UIState>((set) => ({
  sidebarExpanded: false,
  setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  /** 默认展开，避免大屏误以为没有「逻辑链」侧栏（可手动收起） */
  xaiOpen: true,
  setXaiOpen: (xaiOpen) => set({ xaiOpen }),
  toggleXai: () => set((state) => ({ xaiOpen: !state.xaiOpen })),

  zenMode: "xuan",
  setZenMode: (zenMode) => {
    withZenViewTransition(() => {
      set({ zenMode });
      applyZenToDocument(zenMode);
    });
  },
  toggleZenMode: () => {
    withZenViewTransition(() => {
      set((state) => {
        const next: ZenMode = state.zenMode === "xuan" ? "ink" : "xuan";
        applyZenToDocument(next);
        return { zenMode: next };
      });
    });
  },
}));

/** 与内联脚本的 localStorage 约定同步，供水合后首帧对齐 */
export function syncZenFromDocument() {
  if (typeof document === "undefined") {
    return;
  }
  const raw = document.documentElement.getAttribute("data-zen");
  if (isZenMode(raw) && useUIStore.getState().zenMode !== raw) {
    useUIStore.setState({ zenMode: raw });
  }
}

import { create } from "zustand";

export type ToastTone = "default" | "success" | "warning" | "error";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  createdAt: number;
};

type ToastState = {
  items: ToastItem[];
  push: (input: Omit<ToastItem, "id" | "createdAt"> & { durationMs?: number }) => void;
  remove: (id: string) => void;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useToastStore = create<ToastState>()((set) => ({
  items: [],
  push: ({ title, description, tone, durationMs }) => {
    const id = uid();
    const item: ToastItem = {
      id,
      title,
      description,
      tone,
      createdAt: Date.now(),
    };
    set((s) => {
      const next = [...s.items, item];
      const maxItems = 4;
      return { items: next.slice(-maxItems) };
    });
    const ms = durationMs ?? 2800;
    window.setTimeout(() => {
      set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
    }, ms);
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));

export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    toast: (
      input: Omit<ToastItem, "id" | "createdAt"> & { durationMs?: number; tone?: ToastTone },
    ) => push({ ...input, tone: input.tone ?? "default" }),
  };
}


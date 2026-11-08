import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FavoriteKind = "formula" | "diet" | "term" | "knowledge";

export type FavoriteItem = {
  id: string;
  kind: FavoriteKind;
  title: string;
  subtitle?: string;
  tags?: string[];
  createdAt: number;
};

type FavoritesState = {
  items: FavoriteItem[];
  add: (item: Omit<FavoriteItem, "createdAt"> & { createdAt?: number }) => void;
  remove: (id: string) => void;
  toggle: (item: Omit<FavoriteItem, "createdAt"> & { createdAt?: number }) => void;
  has: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const createdAt = item.createdAt ?? Date.now();
        set((s) => {
          if (s.items.some((i) => i.id === item.id)) return s;
          return {
            items: [
              {
                ...item,
                createdAt,
              },
              ...s.items,
            ],
          };
        });
      },
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      toggle: (item) => {
        if (get().has(item.id)) {
          get().remove(item.id);
        } else {
          get().add(item);
        }
      },
      has: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: "dbcnet-favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

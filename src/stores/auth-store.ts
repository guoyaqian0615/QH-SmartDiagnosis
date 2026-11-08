import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** 已尝试与 /api/auth/me 同步（含失败） */
  sessionReady: boolean;
  fetchSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (params: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  sessionReady: false,
  fetchSession: async () => {
    try {
      const r = await fetch("/api/auth/me", { credentials: "same-origin" });
      if (!r.ok) {
        set({ isAuthenticated: false, user: null, sessionReady: true });
        return;
      }
      const d = (await r.json()) as { user: AuthUser | null };
      if (d.user) {
        set({ isAuthenticated: true, user: d.user, sessionReady: true });
      } else {
        set({ isAuthenticated: false, user: null, sessionReady: true });
      }
    } catch {
      set({ isAuthenticated: false, user: null, sessionReady: true });
    }
  },
  login: async (email, password) => {
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = (await r.json().catch(() => ({}))) as { error?: string; user?: AuthUser };
      if (!r.ok) {
        if (typeof d.error === "string" && d.error) {
          return { error: d.error };
        }
        if (r.status >= 500) {
          return { error: "服务暂不可用，请稍后重试" };
        }
        return { error: "登录失败" };
      }
      if (d.user) {
        set({ isAuthenticated: true, user: d.user, sessionReady: true });
      } else {
        set({ isAuthenticated: false, user: null, sessionReady: true });
      }
      return {};
    } catch {
      return { error: "网络异常，请检查连接后重试" };
    }
  },
  register: async ({ email, password, displayName }) => {
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    const d = (await r.json().catch(() => ({}))) as { error?: string; user?: AuthUser };
    if (!r.ok) {
      return { error: typeof d.error === "string" && d.error ? d.error : "注册失败" };
    }
    if (d.user) {
      set({ isAuthenticated: true, user: d.user, sessionReady: true });
    } else {
      set({ isAuthenticated: false, user: null, sessionReady: true });
    }
    return {};
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    set({ isAuthenticated: false, user: null, sessionReady: true });
  },
}));

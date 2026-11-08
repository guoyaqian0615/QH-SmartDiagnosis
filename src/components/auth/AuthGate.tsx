"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const sessionReady = useAuthStore((s) => s.sessionReady);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!sessionReady) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [sessionReady, isAuthenticated, router]);

  if (!sessionReady) {
    return (
      <div className="flex h-full min-h-[14rem] flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted/80" />
        <p className="text-xs text-muted-foreground">同步会话…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-full min-h-[14rem] items-center justify-center text-sm text-muted-foreground">
        正在前往登录…
      </div>
    );
  }

  return <>{children}</>;
}

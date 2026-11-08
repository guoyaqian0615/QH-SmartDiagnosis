"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

function normalizeRedirect(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  if (raw === "/login" || raw.startsWith("/login?")) return "/";
  if (raw === "/register" || raw.startsWith("/register?")) return "/";
  return raw;
}

function RedirectingCard() {
  return (
    <div className="jade-login-card mx-auto flex w-full max-w-[min(22rem,calc(100vw-2rem))] flex-col items-center rounded-[2rem] px-7 py-10 text-center sm:px-9 sm:py-12">
      <div className="h-9 w-9 animate-pulse rounded-full bg-white/35" />
      <p className="mt-5 font-serif text-lg font-medium tracking-[0.16em] text-foreground">
        正在进入
      </p>
      <p className="mt-2 text-[13px] text-muted-foreground">已检测到登录状态，正在跳转。</p>
    </div>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = normalizeRedirect(searchParams.get("from"));
  const login = useAuthStore((s) => s.login);
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const sessionReady = useAuthStore((s) => s.sessionReady);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!sessionReady) return;
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [sessionReady, isAuthenticated, router, from]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error);
        return;
      }
      router.replace(from);
    } finally {
      setSubmitting(false);
    }
  }

  if (sessionReady && isAuthenticated) {
    return <RedirectingCard />;
  }

  const regHref = from && from !== "/" ? `/register?from=${encodeURIComponent(from)}` : "/register";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="jade-login-card mx-auto w-full max-w-[min(22rem,calc(100vw-2rem))] rounded-[2rem] px-7 py-10 sm:px-9 sm:py-12"
    >
      <div className="mb-10 space-y-2 text-center">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.42em] text-muted-foreground">
        本草智诊
        </p>
        <h1 className="font-serif text-2xl font-medium tracking-[0.2em] text-foreground">欢迎回来</h1>
        <p className="font-sans text-[13px] font-light text-muted-foreground">
          用邮箱进入你的体质辨识与辨证等智能服务
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? (
          <p className="text-center text-[13px] text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <div className="space-y-2">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="邮箱"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="h-12 rounded-2xl border-white/40 bg-white/25 text-[15px] shadow-inner backdrop-blur-sm placeholder:text-muted-foreground/75 focus-visible:ring-2 focus-visible:ring-primary/35"
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="密码"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="h-12 rounded-2xl border-white/40 bg-white/25 text-[15px] shadow-inner backdrop-blur-sm placeholder:text-muted-foreground/75 focus-visible:ring-2 focus-visible:ring-primary/35"
            disabled={submitting}
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-2xl text-[15px] tracking-[0.12em] shadow-md"
        >
          {submitting ? "进入中…" : "进入"}
        </Button>
        <p className="text-center text-[13px] text-muted-foreground">
          没有账号？{" "}
          <Link
            className="font-medium text-foreground underline-offset-2 hover:underline"
            href={regHref}
          >
            注册
          </Link>
        </p>
        <p className="text-center font-sans text-[10px] leading-relaxed text-muted-foreground/90">
          账号信息存于服务数据库，请妥善设置 AUTH_SECRET 以启用会话
        </p>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/25" />
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}

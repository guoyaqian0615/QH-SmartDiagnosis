import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { createSessionToken, MAX_AGE_S, SESSION_COOKIE_NAME } from "@/lib/auth-token";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(s: string) {
  return s.trim().toLowerCase();
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string; displayName?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string; displayName?: string };
  } catch {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const email = normalizeEmail(String(body.email ?? ""));
  const password = String(body.password ?? "");
  const displayNameRaw = String(body.displayName ?? "").trim();
  const displayName =
    displayNameRaw || (email.includes("@") ? email.split("@")[0]! : email).slice(0, 32);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "请填写有效邮箱" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "密码至少 8 位" }, { status: 400 });
  }
  if (displayName.length < 1 || displayName.length > 32) {
    return NextResponse.json({ error: "称呼长度为 1～32 字" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName },
  });

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    displayName: user.displayName,
  });

  const res = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
  });

  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_S,
  });

  return res;
}

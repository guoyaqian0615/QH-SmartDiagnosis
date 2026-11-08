import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

import { createSessionToken, MAX_AGE_S, SESSION_COOKIE_NAME } from "@/lib/auth-token";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; staffId?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string; staffId?: string };
  } catch {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const raw = String(body.email ?? body.staffId ?? "").trim();
  const password = String(body.password ?? "");
  const email = raw.toLowerCase();

  if (!email || !password) {
    return NextResponse.json({ error: "请输入邮箱与密码" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }

    const ok = await compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });
    }

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
  } catch (error) {
    console.error("[auth/login] internal error", error);
    return NextResponse.json({ error: "服务暂不可用，请稍后重试" }, { status: 503 });
  }
}

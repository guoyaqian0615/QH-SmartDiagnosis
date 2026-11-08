import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth-token";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const claims = await readSessionToken(token);
    const user = await prisma.user.findUnique({
      where: { id: claims.sub },
      select: { id: true, email: true, displayName: true },
    });
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

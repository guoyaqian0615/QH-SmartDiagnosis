import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // 直接放行所有页面
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/clinical",
    "/clinical/:path*",
    "/constitution",
    "/constitution/:path*",
    "/knowledge",
    "/knowledge/:path*",
    "/favorites",
    "/favorites/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
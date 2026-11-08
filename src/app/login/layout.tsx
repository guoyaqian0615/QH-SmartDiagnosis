import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "登录 · 本草智诊",
  description: "使用邮箱登录智诊服务。",
};

export default function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "注册 · 本草智诊",
  description: "使用邮箱注册智诊账号。",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}

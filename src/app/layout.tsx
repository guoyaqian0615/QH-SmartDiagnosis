import type { Metadata, Viewport } from "next";
import { Cinzel, Noto_Serif_SC } from "next/font/google";
import localFont from "next/font/local";

import { AppShell } from "@/components/shell/AppShell";
import { ToastViewport } from "@/components/ui/ToastViewport";
import { SEASON_INLINE_INIT } from "@/lib/season-inline-script";
import { ZEN_INLINE_INIT } from "@/lib/zen-inline-script";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "本草智诊 · 中医智能辅助系统",
  description:
    "让中医可感知、可解释、可持续。基于大模型的中医文本问诊辅助诊断与体质辨识入口。",
  icons: {
    icon: [{ url: "/brand/dbcnet-mark.png", type: "image/png" }],
    apple: "/brand/dbcnet-mark.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e5efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-zen="xuan" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SEASON_INLINE_INIT }} />
        <script dangerouslySetInnerHTML={{ __html: ZEN_INLINE_INIT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${notoSerifSC.variable} min-h-screen font-sans antialiased`}
      >
        <AppShell>{children}</AppShell>
        <ToastViewport />
      </body>
    </html>
  );
}

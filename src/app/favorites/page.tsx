import type { Metadata } from "next";

import { FavoritesTimeline } from "@/components/favorites/FavoritesTimeline";

export const metadata: Metadata = {
  title: "我的收藏 · 本草智诊",
  description: "方剂、词条与膳食灵感收藏时光轴。",
};

export default function FavoritesPage() {
  return <FavoritesTimeline />;
}

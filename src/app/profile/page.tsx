import type { Metadata } from "next";

import { ProfileCenter } from "@/components/profile/ProfileCenter";

export const metadata: Metadata = {
  title: "个人中心 · 本草智诊",
  description: "查看个人信息、收藏与常用智诊入口。",
};

export default function ProfilePage() {
  return <ProfileCenter />;
}


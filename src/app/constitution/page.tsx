import type { Metadata } from "next";

import { ConstitutionWorkbench } from "@/components/constitution/ConstitutionWorkbench";

export const metadata: Metadata = {
  title: "体质辨识 · 本草智诊",
  description: "舌象与问卷多模态体质筛查；对接 POST /v1/constitution/screening。",
};

export default function ConstitutionPage() {
  return <ConstitutionWorkbench />;
}

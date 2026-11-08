import type { Metadata } from "next";

import { ClinicalWorkbench } from "@/components/clinical/ClinicalWorkbench";

export const metadata: Metadata = {
  title: "智诊辅助 · 本草智诊",
  description: "中医文本辨证与推理结果展示，可对接后端推理服务。",
};

export default function ClinicalPage() {
  return <ClinicalWorkbench />;
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardCardProps = {
  className?: string;
  children: ReactNode;
};

export function DashboardCard({ className, children }: DashboardCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl border p-5 shadow-sm transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

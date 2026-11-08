import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ModuleEmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="module-card-soft flex flex-1 flex-col items-center justify-center gap-4 border-dashed px-6 py-16 text-center">
      <span className="module-icon-pill flex size-11 items-center justify-center text-season-accent">
        <Icon className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-medium text-foreground">{title}</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Button asChild variant="secondary" className="rounded-2xl">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}


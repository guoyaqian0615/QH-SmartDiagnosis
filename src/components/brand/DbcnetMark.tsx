import Image from "next/image";

import { cn } from "@/lib/utils";

type DbcnetMarkProps = {
  className?: string;
  /** 置为 true 时由父级提供标题，img 上不加重复 alt */
  "aria-hidden"?: boolean;
  /** 传给 `next/image` 的 `sizes`（大标题栏等可覆盖） */
  sizes?: string;
  priority?: boolean;
};

/** 品牌标：使用 `public/brand/dbcnet-mark.png`（由设计稿去底导出） */
export function DbcnetMark({
  className,
  "aria-hidden": ariaHidden,
  sizes,
  priority = false,
}: DbcnetMarkProps) {
  return (
    <Image
      src="/brand/dbcnet-mark.png"
      alt={ariaHidden ? "" : "岐黄智诊"}
      width={256}
      height={256}
      className={cn(
        "h-10 w-10 min-h-10 min-w-10 object-contain drop-shadow-[0_1px_3px_rgba(15,30,25,0.18)]",
        className,
      )}
      sizes={sizes ?? "(max-width: 768px) 96px, 80px"}
      priority={priority}
      {...(ariaHidden ? { "aria-hidden": true } : {})}
    />
  );
}

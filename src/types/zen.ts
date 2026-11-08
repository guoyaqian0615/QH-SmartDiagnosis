/** 禅意光效：宣纸白（日读） / 水墨暗（夜读），区别于常规高对比度暗黑模式 */
export type ZenMode = "xuan" | "ink";

export const ZEN_STORAGE_KEY = "dbcnet-zen" as const;

export function isZenMode(v: string | null | undefined): v is ZenMode {
  return v === "xuan" || v === "ink";
}

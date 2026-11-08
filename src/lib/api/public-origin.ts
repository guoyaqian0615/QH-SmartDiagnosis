/**
 * Browser-callable inference API origin (no secrets).
 * Example: https://api.example.com
 */
export function getPublicApiOrigin(): string {
  return (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/$/, "");
}

export function hasPublicApiOrigin(): boolean {
  return getPublicApiOrigin().length > 0;
}

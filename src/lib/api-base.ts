/**
 * Base URL for API calls from the browser.
 * - Empty / unset: same origin (recommended for Next.js).
 * - Set NEXT_PUBLIC_API_BASE_URL only if the UI is hosted on a different origin than the API.
 */
export function apiUrl(path: string): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined;
  const base = typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

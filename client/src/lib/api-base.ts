/**
 * Base URL for API calls from the browser.
 * - Empty / unset: use same origin as the page (recommended for `npm run dev`).
 * - Set when the UI is served from a different origin than the API, e.g. Vite on :5173 and Express on :5000:
 *   VITE_API_BASE_URL=http://127.0.0.1:5000
 */
export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const base = typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";
  if (!base) return path.startsWith("/") ? path : `/${path}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

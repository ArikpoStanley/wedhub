/** Parse JSON API bodies; surface HTML/text errors instead of throwing opaque JSON errors. */
export async function readApiJson<T extends Record<string, unknown>>(
  res: Response,
): Promise<{ ok: boolean; status: number; data: T }> {
  const text = await res.text();
  if (!text) {
    return {
      ok: res.ok,
      status: res.status,
      data: { message: res.statusText || `HTTP ${res.status}` } as unknown as T,
    };
  }
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) as T };
  } catch {
    const snippet = text.replace(/\s+/g, " ").slice(0, 180).trim();
    const hint =
      snippet.startsWith("<!") || snippet.startsWith("<html")
        ? "Server returned a page instead of JSON. Check that the app URL matches the API (same host and port as npm run dev)."
        : snippet || `Invalid response (HTTP ${res.status})`;
    return {
      ok: false,
      status: res.status,
      data: { message: hint, success: false } as unknown as T,
    };
  }
}

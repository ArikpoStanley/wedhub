/** Resolved tenant palette for canvas / motion effects (reads :root CSS vars). */
export function weddingEffectColors(): string[] {
  if (typeof window === "undefined") {
    return ["#800000", "hsl(332, 51%, 70%)", "#fff1f2", "#fce7f3", "#5c0000", "#ffffff"];
  }
  const s = getComputedStyle(document.documentElement);
  const g = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return [
    g("--w-primary", "#800000"),
    g("--w-accent", "hsl(332, 51%, 70%)"),
    g("--w-bg", "#fff1f2"),
    g("--w-border-soft", "#fce7f3"),
    g("--w-primary-hover", "#5c0000"),
    "#ffffff",
  ];
}

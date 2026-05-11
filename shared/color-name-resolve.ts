import { normalizeHex6 } from "./wedding-palette";

/** Normalise user input for dictionary lookup: lowercase, collapse spaces. */
export function normalizeColorPhrase(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Curated wedding / Nigerian-English colour phrases → hex.
 * Browser `resolveColorName` also tries the canvas/CSS parser for standard names.
 */
const CURATED: Record<string, string> = {
  // Blues
  "navy blue": "#001f3f",
  navy: "#000080",
  "midnight blue": "#191970",
  "royal blue": "#4169e1",
  "cobalt blue": "#0047ab",
  "sky blue": "#87ceeb",
  "powder blue": "#b0e0e6",
  "baby blue": "#89cff0",
  "ice blue": "#d6ecef",
  teal: "#008080",
  turquoise: "#40e0d0",
  aqua: "#00ffff",
  cyan: "#00ffff",
  // Neutrals / greys
  ash: "#6d6e71",
  "ash grey": "#8a8d8f",
  "ash gray": "#8a8d8f",
  "light ash": "#b5b6b4",
  charcoal: "#36454f",
  graphite: "#41424c",
  silver: "#c0c0c0",
  grey: "#808080",
  gray: "#808080",
  "light grey": "#d3d3d3",
  "dark grey": "#a9a9a9",
  slate: "#708090",
  // Metallics / yellows
  gold: "#c9a227",
  "metallic gold": "#d4af37",
  "rose gold": "#b76e79",
  yellow: "#ffd700",
  champagne: "#f7e7ce",
  ivory: "#fffff0",
  cream: "#fffdd0",
  beige: "#f5f5dc",
  tan: "#d2b48c",
  bronze: "#cd7f32",
  copper: "#b87333",
  // Reds / pinks
  burgundy: "#800020",
  maroon: "#800000",
  wine: "#722f37",
  red: "#dc143c",
  crimson: "#dc143c",
  scarlet: "#ff2400",
  coral: "#ff7f50",
  blush: "#ffb6c1",
  pink: "#ffc0cb",
  "hot pink": "#ff69b4",
  "dusty rose": "#dcae96",
  rose: "#ff007f",
  mauve: "#e0b0ff",
  lilac: "#c8a2c8",
  lavender: "#e6e6fa",
  purple: "#800080",
  plum: "#8e4585",
  violet: "#8f00ff",
  // Greens
  sage: "#9dc183",
  "sage green": "#87ae73",
  "forest green": "#228b22",
  "emerald green": "#50c878",
  emerald: "#50c878",
  mint: "#98ff98",
  "mint green": "#98fb98",
  "olive green": "#808000",
  olive: "#808000",
  "bottle green": "#006a4e",
  "hunter green": "#355e3b",
  // Oranges / earth
  orange: "#ffa500",
  peach: "#ffcba4",
  terracotta: "#e2725b",
  rust: "#b7410e",
  brown: "#964b00",
  chocolate: "#7b3f00",
  coffee: "#6f4e37",
  black: "#000000",
  white: "#ffffff",
  "off white": "#faf9f6",
  // Common dress-code phrases
  "royal purple": "#7851a9",
  "electric blue": "#7df9ff",
  "nude": "#e3bc9a",
  "champagne gold": "#f7e7ce",
  fuchsia: "#ff00ff",
  magenta: "#ff00ff",
  "navy and gold": "#001f3f",
  "black and gold": "#1a1a1a",
};

/** Resolve using the curated map only (safe on server). */
export function resolveCuratedColorName(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const asHex = normalizeHex6(s);
  if (asHex) return asHex;
  const key = normalizeColorPhrase(s);
  const hit = CURATED[key];
  if (hit) return normalizeHex6(hit)!;
  const compact = key.replace(/\s/g, "");
  const hit2 = CURATED[compact];
  if (hit2) return normalizeHex6(hit2)!;
  return null;
}

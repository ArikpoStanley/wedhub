import type { SiteTheme } from "./site-schema";

export const DEFAULT_PRIMARY = "#800000";
export const DEFAULT_ACCENT = "hsl(332, 51%, 70%)";
export const DEFAULT_BACKGROUND = "#fff1f2";

export type DressCodeColor = { name: string; hex: string };

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Parse #rgb or #rrggbb to [r,g,b] or null. */
export function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.trim();
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(h);
  if (!m) return null;
  const s = m[1];
  if (s.length === 3) {
    return [
      parseInt(s[0] + s[0], 16),
      parseInt(s[1] + s[1], 16),
      parseInt(s[2] + s[2], 16),
    ];
  }
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

export function normalizeHex6(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb;
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

/** WCAG relative luminance for sRGB hex. */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const lin = rgb.map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
}

/** Bright colours (e.g. gold) use outlined chips like classic invitations. */
export function dressCodeChipVariant(hex: string): "filled" | "outlined" {
  return relativeLuminance(hex) > 0.58 ? "outlined" : "filled";
}

export function mixHexWithWhite(hex: string, whiteFraction: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return DEFAULT_BACKGROUND;
  const t = clamp(whiteFraction, 0, 1);
  const mix = (c: number) => Math.round(c * (1 - t) + 255 * t);
  return normalizeHex6(
    `#${mix(rgb[0]!).toString(16).padStart(2, "0")}${mix(rgb[1]!).toString(16).padStart(2, "0")}${mix(rgb[2]!).toString(16).padStart(2, "0")}`,
  )!;
}

function darkenHex(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const t = clamp(amount, 0, 1);
  const d = (c: number) => Math.round(c * (1 - t));
  return normalizeHex6(
    `#${d(rgb[0]!).toString(16).padStart(2, "0")}${d(rgb[1]!).toString(16).padStart(2, "0")}${d(rgb[2]!).toString(16).padStart(2, "0")}`,
  )!;
}

export type WeddingPalette = {
  primary: string;
  accent: string;
  background: string;
  primaryHover: string;
  borderSoft: string;
  dressCode: DressCodeColor[];
};

export function paletteFromTheme(theme: SiteTheme | undefined): WeddingPalette {
  const t = theme ?? {};
  const dress = (t.dressCodeColors ?? [])
    .filter((d) => d?.name?.trim() && d.hex && /^#[0-9a-fA-F]{6}$/.test(d.hex.trim()))
    .slice(0, 3)
    .map((d) => ({
      name: d.name.trim(),
      hex: normalizeHex6(d.hex.trim())!,
    }));

  const primary = t.primaryColor?.trim() || DEFAULT_PRIMARY;
  const accent = t.accentColor?.trim() || DEFAULT_ACCENT;
  const background = t.backgroundColor?.trim() || DEFAULT_BACKGROUND;

  const primaryHex = normalizeHex6(primary);
  const primaryHover = primaryHex ? darkenHex(primaryHex, 0.18) : DEFAULT_PRIMARY;
  const borderSoft = primaryHex ? mixHexWithWhite(primaryHex, 0.82) : "#fce7f3";

  return {
    primary,
    accent,
    background,
    primaryHover,
    borderSoft,
    dressCode: dress,
  };
}

/** CSS custom properties for `:root` or a wrapper (tenant wedding sites). */
export function weddingPaletteCssVars(theme: SiteTheme | undefined): Record<string, string> {
  const p = paletteFromTheme(theme);
  return {
    "--w-primary": p.primary,
    "--w-accent": p.accent,
    "--w-bg": p.background,
    "--w-primary-hover": p.primaryHover,
    "--w-border-soft": p.borderSoft,
  };
}

/** Derive theme fields from up to three resolved dress-code colours. */
export function themeFromDressCodeColors(
  resolved: DressCodeColor[],
): Pick<SiteTheme, "primaryColor" | "accentColor" | "backgroundColor" | "dressCodeColors"> {
  const list = resolved.slice(0, 3).map((d) => ({
    name: d.name,
    hex: normalizeHex6(d.hex)!,
  }));
  const primaryColor = list[0]?.hex ?? DEFAULT_PRIMARY;
  const accentColor = list[1]?.hex ?? mixHexWithWhite(primaryColor, 0.55);
  const backgroundColor =
    list.length >= 3
      ? mixHexWithWhite(list[2]!.hex, 0.88)
      : mixHexWithWhite(primaryColor, 0.92);
  return {
    dressCodeColors: list,
    primaryColor,
    accentColor,
    backgroundColor,
  };
}

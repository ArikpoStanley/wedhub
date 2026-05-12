import { normalizeHex6 } from "@shared/wedding-palette";
import { normalizeColorPhrase, resolveCuratedColorName } from "@shared/color-name-resolve";

function tryCanvasColor(input: string): string | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  try {
    ctx.fillStyle = "";
    ctx.fillStyle = input;
    const out = ctx.fillStyle as string;
    if (typeof out === "string") {
      if (/rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(out)) return null;
      const hex = normalizeHex6(out);
      if (hex) return hex;
      const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(out);
      if (m) {
        const r = Number(m[1]);
        const g = Number(m[2]);
        const b = Number(m[3]);
        return normalizeHex6(
          `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
        );
      }
    }
  } catch {
    /* invalid colour string */
  }
  return null;
}

/**
 * Resolve a colour the guest typed (e.g. “Navy blue”, “gold”, “ash”) to #rrggbb.
 * Curated phrases first, then the browser’s CSS colour parser (canvas).
 */
export function resolveColorName(input: string): string | null {
  const curated = resolveCuratedColorName(input);
  if (curated) return curated;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const canvasHit = tryCanvasColor(trimmed);
  if (canvasHit) return canvasHit;

  const compact = normalizeColorPhrase(trimmed).replace(/\s/g, "");
  return tryCanvasColor(compact);
}

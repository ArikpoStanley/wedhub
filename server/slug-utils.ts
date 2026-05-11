function normalizeToken(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Blend two first names into a short memorable slug candidate (e.g. Blessing + Marvelous → "blesmar"). */
export function suggestSlugFromNames(partnerOne: string, partnerTwo: string): string {
  const a = normalizeToken(partnerOne.split(/\s+/)[0] || "");
  const b = normalizeToken(partnerTwo.split(/\s+/)[0] || "");
  if (!a && !b) return "wedding";
  if (!a) return b.slice(0, 24) || "wedding";
  if (!b) return a.slice(0, 24) || "wedding";

  const halfA = Math.max(2, Math.ceil(a.length / 2));
  const halfB = Math.max(2, Math.ceil(b.length / 2));
  const blend = (a.slice(0, halfA) + b.slice(-halfB)).slice(0, 20);
  return blend || "wedding";
}

export function slugifyBase(input: string): string {
  const base = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "site";
}

export function buildUniqueSlugCandidates(partnerOne: string, partnerTwo: string): string[] {
  const creative = suggestSlugFromNames(partnerOne, partnerTwo);
  const hyphen = slugifyBase(`${partnerOne}-${partnerTwo}`);
  const ordered = [
    creative,
    hyphen,
    slugifyBase(partnerOne),
    slugifyBase(partnerTwo),
  ].filter((s, i, arr) => s && arr.indexOf(s) === i);
  return ordered;
}

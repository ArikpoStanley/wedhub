/**
 * Resolves the full-bleed home hero background URL.
 * Explicit `homeHeroBackgroundImageUrl` wins when it matches an uploaded gallery or hero URL.
 */
export function resolveHomeHeroBackgroundImageUrl(
  content:
    | {
        homeHeroBackgroundImageUrl?: string | null;
        heroImageUrls?: string[];
        galleryImageUrls?: string[];
      }
    | undefined
    | null
): string | null {
  const gallery = content?.galleryImageUrls?.filter(Boolean) ?? [];
  const hero = content?.heroImageUrls?.filter(Boolean) ?? [];
  const allowed = new Set<string>([...gallery, ...hero]);
  const chosen = content?.homeHeroBackgroundImageUrl?.trim();
  if (chosen && allowed.has(chosen)) return chosen;
  const firstHero = hero[0] ?? null;
  const firstGallery = gallery[0] ?? null;
  return firstHero ?? firstGallery ?? null;
}

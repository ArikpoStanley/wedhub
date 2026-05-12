/**
 * Reads Cloudinary credentials from the environment.
 * Use this when you add signed upload/delete routes (e.g. `cloudinary` SDK).
 *
 * Prefer either `CLOUDINARY_URL` alone, or the three separate variables — not both.
 */

export type CloudinaryEnv =
  | { mode: "url"; cloudinaryUrl: string }
  | { mode: "parts"; cloudName: string; apiKey: string; apiSecret: string };

/** Optional folder prefix for uploads, e.g. `weddings/site-slug`. */
export function getCloudinaryFolder(): string | undefined {
  const f = process.env.CLOUDINARY_FOLDER?.trim();
  return f || undefined;
}

export function getCloudinaryEnv(): CloudinaryEnv | null {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url) {
    return { mode: "url", cloudinaryUrl: url };
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloudName && apiKey && apiSecret) {
    return { mode: "parts", cloudName, apiKey, apiSecret };
  }
  return null;
}

import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryEnv, getCloudinaryFolder } from "./cloudinary-env";

let configured = false;

export function ensureCloudinaryConfigured(): boolean {
  if (configured) return true;
  const env = getCloudinaryEnv();
  if (!env) return false;
  if (env.mode === "url") {
    cloudinary.config({ cloudinary_url: env.cloudinaryUrl });
  } else {
    cloudinary.config({
      cloud_name: env.cloudName,
      api_key: env.apiKey,
      api_secret: env.apiSecret,
    });
  }
  configured = true;
  return true;
}

/** Upload one image buffer; returns secure HTTPS URL. */
export function uploadImageBuffer(
  buffer: Buffer,
  /** Logical subpath under optional CLOUDINARY_FOLDER, e.g. `sites/marble/gallery` */
  subfolder: string,
): Promise<string> {
  if (!ensureCloudinaryConfigured()) {
    return Promise.reject(new Error("Cloudinary is not configured"));
  }
  const root = getCloudinaryFolder();
  const folder = [root, subfolder].filter(Boolean).join("/").replace(/\/+/g, "/");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (result?.secure_url) {
          resolve(result.secure_url);
          return;
        }
        reject(new Error("Cloudinary returned no URL"));
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}

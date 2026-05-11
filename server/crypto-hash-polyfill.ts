/**
 * Vite 7+ uses `crypto.hash()` (Node 20.12+). Older 20.x needs this before Vite loads.
 */
import crypto, { createHash } from "node:crypto";

if (typeof crypto.hash !== "function") {
  Object.defineProperty(crypto, "hash", {
    value(
      algorithm: string,
      data: string | Buffer | NodeJS.ArrayBufferView,
      outputEncoding?: "hex" | "base64" | "base64url",
    ) {
      const h = createHash(algorithm);
      if (typeof data === "string") h.update(data, "utf8");
      else h.update(data);
      return outputEncoding ? h.digest(outputEncoding) : h.digest();
    },
    configurable: true,
    writable: true,
    enumerable: true,
  });
}

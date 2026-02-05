import { randomBytes } from "node:crypto";
import type { FormatEnum } from "sharp";

function genRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default function createImageNaming(prefix: string, name: string) {
  const imageId = `${prefix}-${name}-${genRandomString()}`;

  return {
    imageId: (format: keyof FormatEnum) => `${imageId}.${format}`,
    blurId: (format: keyof FormatEnum) => `${imageId}-blur.${format}`,
    srcSetId: (width: number, format: keyof FormatEnum) =>
      `${imageId}-${width}w.${format}`,
  };
}

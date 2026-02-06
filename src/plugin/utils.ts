import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

export const SUPPORTED_IMAGE_FORMATS =
  /\.(jpe?g|png|webp|avif|gif|tiff?|svg)(\?.*)?$/i;

/**
 * Strips query string from path to get the clean file path
 */
export function stripQueryString(path: string): string {
  const queryIndex = path.indexOf("?");
  return queryIndex === -1 ? path : path.slice(0, queryIndex);
}

export function isFileSupported(path: string) {
  const cleanPath = stripQueryString(path);
  const extension = extname(cleanPath);

  if (!extension) {
    return false;
  }
  return /\.(jpe?g|png|webp|avif|gif|tiff?|svg)$/i.test(extension);
}

export function getRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function readFileSafe(path: string) {
  try {
    return await readFile(path);
  } catch {
    return null;
  }
}

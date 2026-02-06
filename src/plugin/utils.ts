import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname } from "node:path";
import queryString from "query-string";
import type { ImageOptions } from "./types";

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

export async function saveFileSafe(path: string, data: Buffer) {
  // 1. Extract the directory path (e.g., "folder/subfolder")
  const dir = dirname(path);

  try {
    // 2. Ensure the directory exists
    await mkdir(dir, { recursive: true });

    // 3. Write the file
    await writeFile(path, data);
    console.log(`Successfully saved to ${path}`);
  } catch (err) {
    console.error("Failed to save file:", err);
  }
}

export function parseQuery(uri: string): {
  shouldProcess: boolean;
  path: string;
  options?: ImageOptions;
} {
  const [path, query] = uri.split("?");
  if (!query || !path) {
    return { shouldProcess: false, path: "" };
  }
  const parsed = queryString.parse(query, {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: "comma",
  });

  if ("oh" in parsed) {
    return { shouldProcess: true, options: parsed, path: path };
  } else {
    return { shouldProcess: false, path: path };
  }
}

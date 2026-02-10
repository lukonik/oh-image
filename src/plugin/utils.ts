import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import queryString from "query-string";
import type { ImageEntry, ImageOptions } from "./types";
import sharp from "sharp";

/**
 * Strips query string from path to get the clean file path
 */
export function stripQueryString(path: string): string {
  const queryIndex = path.indexOf("?");
  return queryIndex === -1 ? path : path.slice(0, queryIndex);
}

export async function getFileHash(filePath: string): Promise<string> {
  const content = await readFile(filePath);
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
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

export function queryToOptions(
  processKey: string,
  uri: string,
): {
  shouldProcess: boolean;
  path: string;
  options?: Partial<ImageOptions>;
} {
  const [path, query] = uri.split("?");
  if (!query || !path) {
    return { shouldProcess: false, path: "" };
  }
  const parsed = queryString.parse(query, {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: "comma",
    types: {
      bps: "number[]",
    },
  });

  if (processKey in parsed) {
    return { shouldProcess: true, options: parsed, path: path };
  } else {
    return { shouldProcess: false, path: path };
  }
}

export async function processImage(
  path: string,
  options: Omit<ImageEntry, "origin">,
) {
  let processed = sharp(path);

  if (options.width || options.height) {
    processed = processed.resize({
      width: options.width ?? undefined,
      height: options.height ?? undefined,
    });
  }
  if (options.format) {
    processed = processed.toFormat(options.format);
  }

  if (options.blur) {
    processed = processed.blur(options.blur);
  }

  return await processed.toBuffer();
}

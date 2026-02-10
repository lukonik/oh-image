import sharp from "sharp";
import type { ImageEntry } from "./types";

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

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
    processed = processed.toFormat(options.format, {
      quality: options.quality ?? undefined,
    });
  }

  if (options.blur) {
    processed = processed.blur(options.blur);
  }

  if (options.flip) {
    processed = processed.flip();
  }

  if (options.flop) {
    processed = processed.flop();
  }

  if (options.rotate) {
    processed = processed.rotate(options.rotate);
  }

  if (options.sharpen) {
    processed = processed.sharpen(options.sharpen);
  }

  if (options.median) {
    processed = processed.median(options.median);
  }

  if (options.gamma) {
    processed = processed.gamma(options.gamma);
  }

  if (options.negate) {
    processed = processed.negate();
  }

  if (options.normalize) {
    processed = processed.normalize();
  }

  if (options.threshold) {
    processed = processed.threshold(options.threshold);
  }

  return await processed.toBuffer();
}

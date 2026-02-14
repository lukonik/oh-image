import type { FormatEnum } from "sharp";
import type { ImageEntry } from "./types";
const PLACEHOLDER_IMG_SIZE = 8;
const PLACEHOLDER_BLUR_QUALITY = 70;

export function createImageEntries() {
  const map = new Map<string, ImageEntry>();

  return {
    get(key: string) {
      return map.get(key);
    },
    set(key: string, entry: ImageEntry) {
      map.set(key, entry);
    },
    entries() {
      return map.entries();
    },
    createMainEntry(identifier: string, entry: ImageEntry) {
      const mainEntry: ImageEntry = {
        width: entry.width,
        height: entry.height,
        format: entry.format,
        origin: entry.origin,
        // Transforms
        blur: entry.blur,
        flip: entry.flip,
        flop: entry.flop,
        rotate: entry.rotate,
        sharpen: entry.sharpen,
        median: entry.median,
        gamma: entry.gamma,
        negate: entry.negate,
        normalize: entry.normalize,
        threshold: entry.threshold,
      };
      this.set(identifier, mainEntry);
    },
    createPlaceholderEntry(
      identifier: string,
      main: ImageEntry & { width: number; height: number; format: keyof FormatEnum },
    ) {
      let placeholderHeight: number = 0;
      let placeholderWidth: number = 0;

      // Shrink the image's largest dimension
      if (main.width >= main.height) {
        placeholderWidth = PLACEHOLDER_IMG_SIZE;
        placeholderHeight = Math.max(
          Math.round((main.height / main.width) * PLACEHOLDER_IMG_SIZE),
          10,
        );
      } else {
        placeholderWidth = Math.max(
          Math.round((main.width / main.height) * PLACEHOLDER_IMG_SIZE),
          10,
        );
        placeholderHeight = PLACEHOLDER_IMG_SIZE;
      }

      const placeholderEntry: ImageEntry = {
        width: placeholderWidth,
        height: placeholderHeight,
        format: main.format,
        blur: PLACEHOLDER_BLUR_QUALITY,
        origin: main.origin,
        // Transforms
        flip: main.flip,
        flop: main.flop,
        rotate: main.rotate,
        sharpen: main.sharpen,
        median: main.median,
        gamma: main.gamma,
        negate: main.negate,
        normalize: main.normalize,
        threshold: main.threshold,
      };
      this.set(identifier, placeholderEntry);
    },
    createSrcSetEntry(identifier: string, entry: ImageEntry) {
      this.set(identifier, entry);
    },
  };
}

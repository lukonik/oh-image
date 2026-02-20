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
      this.set(identifier, entry);
    },
    createPlaceholderEntry(identifier: string, placeholder: ImageEntry) {
      this.set(identifier, placeholder);
    },
    createSrcSetEntry(identifier: string, entry: ImageEntry) {
      this.set(identifier, entry);
    },
  };
}

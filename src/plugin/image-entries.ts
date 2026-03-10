import type { ImageEntry } from "./types";

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

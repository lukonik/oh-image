import { describe, expect, it } from "vitest";
import { createImageEntries } from "../../src/plugin/image-entries";
import type { ImageEntry } from "../../src/plugin/types";

function makeEntry(overrides: Partial<ImageEntry> = {}): ImageEntry {
  return { origin: "/photo.png", width: 1920, height: 1080, format: "webp", ...overrides };
}

describe("createImageEntries", () => {
  describe("get / set", () => {
    it("returns undefined for a missing key", () => {
      const store = createImageEntries();
      expect(store.get("missing")).toBeUndefined();
    });

    it("stores and retrieves an entry", () => {
      const store = createImageEntries();
      const entry = makeEntry();
      store.set("key", entry);
      expect(store.get("key")).toBe(entry);
    });

    it("overwrites an existing entry", () => {
      const store = createImageEntries();
      store.set("key", makeEntry({ width: 100 }));
      store.set("key", makeEntry({ width: 200 }));
      expect(store.get("key")?.width).toBe(200);
    });
  });

  describe("entries", () => {
    it("returns an empty iterator when no entries exist", () => {
      const store = createImageEntries();
      expect([...store.entries()]).toEqual([]);
    });

    it("iterates over all stored entries", () => {
      const store = createImageEntries();
      store.set("a", makeEntry({ origin: "/a.png" }));
      store.set("b", makeEntry({ origin: "/b.png" }));
      const result = [...store.entries()];
      expect(result).toHaveLength(2);
      expect(result[0][0]).toBe("a");
      expect(result[1][0]).toBe("b");
    });
  });

  describe("createMainEntry", () => {
    it("stores a main entry with the correct properties", () => {
      const store = createImageEntries();
      store.createMainEntry("main-id", makeEntry());
      const entry = store.get("main-id");
      expect(entry).toEqual({
        width: 1920,
        height: 1080,
        format: "webp",
        origin: "/photo.png",
      });
    });

    it("does not include blur in main entry", () => {
      const store = createImageEntries();
      store.createMainEntry("main-id", makeEntry({ blur: 50 }));
      expect(store.get("main-id")).toHaveProperty("blur");
    });

    it("includes quality in main entry", () => {
      const store = createImageEntries();
      store.createMainEntry("main-id", makeEntry({ quality: 90 }));
      expect(store.get("main-id")?.quality).toBe(90);
    });
  });

  describe("createSrcSetEntry", () => {
    it("stores the entry as-is", () => {
      const store = createImageEntries();
      const entry = makeEntry({ width: 640 });
      store.createSrcSetEntry("srcset-id", entry);
      expect(store.get("srcset-id")).toBe(entry);
    });
  });
});

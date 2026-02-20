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

  describe("createPlaceholderEntry", () => {
    it("creates a landscape placeholder with width=8", () => {
      const store = createImageEntries();
      store.createPlaceholderEntry("ph", {
        width: 1920,
        height: 1080,
        origin: "/photo.png",
        format: "webp",
      });
      const entry = store.get("ph");
      expect(entry?.width).toBe(8);
      // height = round((1080/1920) * 8) = round(4.5) = 4, but min is 10
      expect(entry?.height).toBe(10);
    });

    it("creates a portrait placeholder with height=8", () => {
      const store = createImageEntries();
      store.createPlaceholderEntry("ph", {
        width: 1080,
        height: 1920,
        origin: "/photo.png",
        format: "webp",
      });
      const entry = store.get("ph");
      expect(entry?.height).toBe(8);
      // width = round((1080/1920) * 8) = round(4.5) = 4, but min is 10
      expect(entry?.width).toBe(10);
    });

    it("creates a square placeholder with both dimensions set", () => {
      const store = createImageEntries();
      store.createPlaceholderEntry("ph", {
        width: 500,
        height: 500,
        origin: "/photo.png",
        format: "avif",
      });
      const entry = store.get("ph");
      // width >= height, so width=8, height = round((500/500)*8) = 8, min 10
      expect(entry?.width).toBe(8);
      expect(entry?.height).toBe(10);
    });

    it("sets blur to 70", () => {
      const store = createImageEntries();
      store.createPlaceholderEntry("ph", {
        width: 1920,
        height: 1080,
        origin: "/photo.png",
        format: "webp",
      });
      expect(store.get("ph")?.blur).toBe(70);
    });

    it("preserves format and origin from input", () => {
      const store = createImageEntries();
      store.createPlaceholderEntry("ph", {
        width: 800,
        height: 600,
        origin: "/img.jpg",
        format: "avif",
      });
      const entry = store.get("ph");
      expect(entry?.format).toBe("avif");
      expect(entry?.origin).toBe("/img.jpg");
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

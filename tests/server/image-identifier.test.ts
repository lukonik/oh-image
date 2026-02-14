import { describe, expect, it } from "vitest";
import {
  createImageIdentifier,
  type IdentifierDirs,
} from "../../src/plugin/image-identifier";

const devDirs: IdentifierDirs = {
  isBuild: false,
  devDir: "/@oh-images",
  assetsDir: "assets",
  distDir: "dist",
};

const buildDirs: IdentifierDirs = {
  isBuild: true,
  devDir: "/@oh-images",
  assetsDir: "assets",
  distDir: "dist",
};

describe("createImageIdentifier", () => {
  describe("main", () => {
    it("returns dev path with main prefix in dev mode", () => {
      const id = createImageIdentifier("photo.png", "abc123", devDirs);
      expect(id.main("webp")).toBe("/@oh-images/main-abc123-photo.png.webp");
    });

    it("returns build path with main prefix in build mode", () => {
      const id = createImageIdentifier("photo.png", "abc123", buildDirs);
      expect(id.main("webp")).toBe("assets/dist/main-abc123-photo.png.webp");
    });

    it("strips directory from name, keeping only basename", () => {
      const id = createImageIdentifier("/src/images/photo.png", "abc123", devDirs);
      expect(id.main("avif")).toBe("/@oh-images/main-abc123-photo.png.avif");
    });

    it("works with different formats", () => {
      const id = createImageIdentifier("img.jpg", "hash1", devDirs);
      expect(id.main("png")).toBe("/@oh-images/main-hash1-img.jpg.png");
      expect(id.main("jpeg")).toBe("/@oh-images/main-hash1-img.jpg.jpeg");
      expect(id.main("avif")).toBe("/@oh-images/main-hash1-img.jpg.avif");
    });
  });

  describe("placeholder", () => {
    it("returns dev path with placeholder prefix in dev mode", () => {
      const id = createImageIdentifier("photo.png", "abc123", devDirs);
      expect(id.placeholder("webp")).toBe("/@oh-images/placeholder-abc123-photo.png.webp");
    });

    it("returns build path with placeholder prefix in build mode", () => {
      const id = createImageIdentifier("photo.png", "abc123", buildDirs);
      expect(id.placeholder("webp")).toBe("assets/dist/placeholder-abc123-photo.png.webp");
    });

    it("strips directory from name", () => {
      const id = createImageIdentifier("/a/b/c/photo.png", "hash", devDirs);
      expect(id.placeholder("avif")).toBe("/@oh-images/placeholder-hash-photo.png.avif");
    });
  });

  describe("srcSet", () => {
    it("returns dev path with breakpoint prefix in dev mode", () => {
      const id = createImageIdentifier("photo.png", "abc123", devDirs);
      expect(id.srcSet("webp", 640)).toBe("/@oh-images/breakpoint-640-abc123-photo.png.webp");
    });

    it("returns build path with breakpoint prefix in build mode", () => {
      const id = createImageIdentifier("photo.png", "abc123", buildDirs);
      expect(id.srcSet("webp", 640)).toBe("assets/dist/breakpoint-640-abc123-photo.png.webp");
    });

    it("includes the breakpoint value in the prefix", () => {
      const id = createImageIdentifier("img.jpg", "h1", devDirs);
      expect(id.srcSet("webp", 100)).toContain("breakpoint-100");
      expect(id.srcSet("webp", 1920)).toContain("breakpoint-1920");
    });

    it("strips directory from name", () => {
      const id = createImageIdentifier("/deep/path/img.jpg", "h1", devDirs);
      expect(id.srcSet("avif", 320)).toBe("/@oh-images/breakpoint-320-h1-img.jpg.avif");
    });
  });

  describe("unique hashes", () => {
    it("produces different ids for different hashes", () => {
      const a = createImageIdentifier("photo.png", "hash1", devDirs);
      const b = createImageIdentifier("photo.png", "hash2", devDirs);
      expect(a.main("webp")).not.toBe(b.main("webp"));
    });

    it("produces different ids for different names", () => {
      const a = createImageIdentifier("a.png", "hash", devDirs);
      const b = createImageIdentifier("b.png", "hash", devDirs);
      expect(a.main("webp")).not.toBe(b.main("webp"));
    });
  });
});

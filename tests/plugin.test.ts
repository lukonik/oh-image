import { describe, expect, it } from "vitest";
import { pathToImage } from "../src/plugin/plugin";
import { resolve } from "node:path";

describe("pathToImage", () => {
  describe("dev mode", () => {
    it("should prepend /@oh-images/ and resolve to absolute path", () => {
      const result = pathToImage("image.png", false);
      const expected = resolve("/@oh-images/image.png");
      expect(result).toBe(expected);
    });

    it("should extract basename from relative path", () => {
      const result = pathToImage("src/assets/photo.jpg", false);
      const expected = resolve("/@oh-images/photo.jpg");
      expect(result).toBe(expected);
    });

    it("should extract basename from absolute path", () => {
      const result = pathToImage("/Users/test/images/logo.webp", false);
      const expected = resolve("/@oh-images/logo.webp");
      expect(result).toBe(expected);
    });

    it("should handle URL-like paths", () => {
      const result = pathToImage("http://example.com/images/banner.png", false);
      const expected = resolve("/@oh-images/banner.png");
      expect(result).toBe(expected);
    });
  });

  describe("build mode", () => {
    it("should prepend /oh-images/ without resolving", () => {
      const result = pathToImage("image.png", true);
      expect(result).toBe("/oh-images/image.png");
    });

    it("should extract basename from relative path", () => {
      const result = pathToImage("src/assets/photo.jpg", true);
      expect(result).toBe("/oh-images/photo.jpg");
    });

    it("should extract basename from absolute path", () => {
      const result = pathToImage("/Users/test/images/logo.webp", true);
      expect(result).toBe("/oh-images/logo.webp");
    });

    it("should handle complex paths with multiple directories", () => {
      const result = pathToImage("public/assets/images/hero.png", true);
      expect(result).toBe("/oh-images/hero.png");
    });
  });
});

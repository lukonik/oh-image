import { describe, expect, it } from "vitest";
import {
  isAbsoluteUrl,
  assertPath,
  resolveComplexTransforms,
} from "../../src/react/loaders/image-loader-utils";

describe("isAbsoluteUrl", () => {
  it("returns true for http URLs", () => {
    expect(isAbsoluteUrl("http://example.com")).toBe(true);
  });

  it("returns true for https URLs", () => {
    expect(isAbsoluteUrl("https://example.com/path")).toBe(true);
  });

  it("returns false for relative paths", () => {
    expect(isAbsoluteUrl("/relative/path")).toBe(false);
  });

  it("returns false for ftp URLs", () => {
    expect(isAbsoluteUrl("ftp://example.com")).toBe(false);
  });

  it("returns false for plain strings", () => {
    expect(isAbsoluteUrl("not-a-url")).toBe(false);
  });
});

describe("assertPath", () => {
  it("throws when path is empty", () => {
    expect(() => assertPath("")).toThrow();
  });

  it("throws when path is null", () => {
    expect(() => assertPath(null)).toThrow();
  });

  it("throws when path is undefined", () => {
    expect(() => assertPath(undefined)).toThrow();
  });

  it("throws when path is whitespace only", () => {
    expect(() => assertPath("   ")).toThrow();
  });

  it("throws when path is not a valid URL", () => {
    expect(() => assertPath("not-a-url")).toThrow();
  });

  it("throws when path is a relative path", () => {
    expect(() => assertPath("/relative/path")).toThrow();
  });

  it("throws when path uses a non-http protocol", () => {
    expect(() => assertPath("ftp://example.com")).toThrow();
  });

  it("does not throw for a valid http URL", () => {
    expect(() => assertPath("http://localhost:8080")).not.toThrow();
  });

  it("does not throw for a valid https URL", () => {
    expect(() => assertPath("https://cdn.example.com")).not.toThrow();
  });
});

describe("resolveComplexTransforms", () => {
  it("resolves primitive values", () => {
    const transforms = { width: 100, height: 200 };
    const config = { optionSeparator: ":", orders: {} };
    expect(resolveComplexTransforms(transforms, config)).toEqual([
      "width:100",
      "height:200",
    ]);
  });

  it("resolves object values with order", () => {
    const transforms = {
      crop: { width: 100, height: 200, gravity: "center" },
    };
    const config = {
      optionSeparator: ":",
      orders: {
        crop: ["width", "height", "gravity"],
      },
    };
    expect(resolveComplexTransforms(transforms, config)).toEqual([
      "crop:100:200:center",
    ]);
  });

  it("handles missing values in object (undefined)", () => {
    const transforms = {
      crop: { width: 100, height: undefined, gravity: "center" },
    };
    const config = {
      optionSeparator: ":",
      orders: {
        crop: ["width", "height", "gravity"],
      },
    };
    // undefined becomes empty string based on stringifyOptions implementation
    expect(resolveComplexTransforms(transforms, config)).toEqual([
      "crop:100::center",
    ]);
  });

  it("skips object key if order is not provided", () => {
    const transforms = {
      crop: { width: 100 },
    };
    const config = {
      optionSeparator: ":",
      orders: {},
    };
    expect(resolveComplexTransforms(transforms, config)).toEqual([]);
  });

  it("skips undefined primitive values", () => {
    const transforms = { width: undefined, height: 200 };
    const config = { optionSeparator: ":", orders: {} };
    expect(resolveComplexTransforms(transforms, config)).toEqual([
      "height:200",
    ]);
  });

  it("uses custom separator", () => {
    const transforms = { width: 100 };
    const config = { optionSeparator: "/", orders: {} };
    expect(resolveComplexTransforms(transforms, config)).toEqual(["width/100"]);
  });

  it("uses custom separator for object params", () => {
    const transforms = {
      crop: { width: 100, height: 200 },
    };
    const config = {
      optionSeparator: "/",
      orders: {
        crop: ["width", "height"],
      },
    };
    expect(resolveComplexTransforms(transforms, config)).toEqual([
      "crop/100/200",
    ]);
  });
});
import { describe, expect, it } from "vitest";
import {
  normalizeLoaderTransform,
  isAbsoluteUrl,
  assertPath,
} from "../../src/react/loaders/image-loader-utils";

describe("normalizeLoaderTransform", () => {
  it("returns the string as-is when params is a string", () => {
    expect(normalizeLoaderTransform("foo=bar", "=", "/")).toBe("foo=bar");
  });

  it("transforms a record into key-separator-value pairs joined by joinSeparator", () => {
    expect(
      normalizeLoaderTransform({ width: "100", height: "200" }, ":", "/"),
    ).toBe("width:100/height:200");
  });

  it("uses custom separators", () => {
    expect(
      normalizeLoaderTransform({ a: "1", b: "2" }, "=", "&"),
    ).toBe("a=1&b=2");
  });

  it("handles a single-entry record", () => {
    expect(normalizeLoaderTransform({ key: "val" }, ":", ",")).toBe("key:val");
  });
});

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

import { describe, it, expect } from "vitest";
import { stripQueryString } from "../../src/plugin/utils";

describe("stripQueryString", () => {
  it("returns the path unchanged when there is no query string", () => {
    expect(stripQueryString("/images/photo.png")).toBe("/images/photo.png");
  });

  it("strips a simple query string", () => {
    expect(stripQueryString("/images/photo.png?$oh")).toBe("/images/photo.png");
  });

  it("strips a query string with key-value pairs", () => {
    expect(stripQueryString("/img.jpg?width=100&height=200")).toBe("/img.jpg");
  });

  it("handles an empty path with a query string", () => {
    expect(stripQueryString("?query")).toBe("");
  });

  it("only strips at the first question mark", () => {
    expect(stripQueryString("/path?a=1?b=2")).toBe("/path");
  });

  it("returns an empty string as-is", () => {
    expect(stripQueryString("")).toBe("");
  });

  it("handles a path ending with a question mark", () => {
    expect(stripQueryString("/img.jpg?")).toBe("/img.jpg");
  });
});

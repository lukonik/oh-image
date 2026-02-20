import type { ImageOptions } from "../../src/plugin/types";
import { queryToOptions } from "../../src/plugin/utils";
import { describe, expect, it } from "vitest";
const PROCESS_KEY = "$oh";

describe("queryToOptions", () => {
  function qs(uri: string) {
    return queryToOptions(PROCESS_KEY, uri);
  }

  const qsParam = <T extends ImageOptions, K extends keyof T>(
    key: K,
    value: T[K],
    uri: string,
  ) => {
    const processed = qs(uri);
    expect(processed.shouldProcess).toBeTruthy();
    expect(processed.options).toBeDefined();
    if (Array.isArray(value)) {
      expect(processed.options![key as keyof ImageOptions]).toEqual(value);
    } else {
      expect(processed.options![key as keyof ImageOptions]).toBe(value);
    }
  };

  it("should return shouldProcess false, when no path and query provided", () => {
    expect(qs("").shouldProcess).toBeFalsy();
    expect(qs("image.jpg").shouldProcess).toBeFalsy();
    expect(qs("image.jpg?").shouldProcess).toBeFalsy();
    expect(qs("image.jpg?blur=50").shouldProcess).toBeFalsy();
    expect(qs("image.jpg$oh?blur=50").shouldProcess).toBeFalsy();
  });
  it("should return options, if $oh is provided in query", () => {
    expect(qs("image.jpg?$oh").options).toBeTruthy();
    expect(qs("image.jpg?blur=50&$oh").options).toBeTruthy();
  });
  it("should return no options,if $oh is not provided in query", () => {
    expect(qs("image.jpg").options).toBeFalsy();
    expect(qs("image.jpg?blur=50").options).toBeFalsy();
  });

  it("should return path, when $oh is provided", () => {
    expect(qs("image.jpg?$oh").path).toBe("image.jpg");
    expect(qs("image.jpg?blur=50&$oh").path).toBe("image.jpg");
  });

  it("should not return path, when $oh is not provided", () => {
    expect(qs("image.jpg").path).toBe("");
    expect(qs("image.jpg?blur=50").path).toBe("");
  });

  it("quality", () => {
    qsParam("quality", undefined, "image.jpg?$oh");
    qsParam("quality", null, "image.jpg?$oh&quality");
    qsParam("quality", 100, "image.jpg?$oh&quality=100");
  });

  it("width", () => {
    qsParam("width", undefined, "image.jpg?$oh");
    qsParam("width", null, "image.jpg?$oh&width");
    qsParam("width", 100, "image.jpg?$oh&width=100");
  });

  it("height", () => {
    qsParam("height", undefined, "image.jpg?$oh");
    qsParam("height", null, "image.jpg?$oh&height");
    qsParam("height", 200, "image.jpg?$oh&height=200");
  });

  it("format", () => {
    qsParam("format", undefined, "image.jpg?$oh");
    qsParam("format", null, "image.jpg?$oh&format");
    qsParam("format", "jpeg", "image.jpg?$oh&format=jpeg");
  });

  it("placeholder", () => {
    qsParam("placeholder", undefined, "image.jpg?$oh");
    qsParam("placeholder", true, "image.jpg?$oh&placeholder");
    qsParam("placeholder", true, "image.jpg?$oh&placeholder=true");
    qsParam("placeholder", false, "image.jpg?$oh&placeholder=false");
  });

  it("breakpoints", () => {
    qsParam("breakpoints", undefined, "image.jpg?$oh");
    qsParam("breakpoints", null, "image.jpg?$oh&breakpoints");
    qsParam("breakpoints", [100, 200], "image.jpg?$oh&breakpoints=100,200");
    qsParam("breakpoints", [200], "image.jpg?$oh&breakpoints=200");
  });

  it("blur", () => {
    qsParam("blur", undefined, "image.jpg?$oh");
    qsParam("blur", null, "image.jpg?$oh&blur");
    qsParam("blur", 10, "image.jpg?$oh&blur=10");
  });

  it("flip", () => {
    qsParam("flip", undefined, "image.jpg?$oh");
    qsParam("flip", true, "image.jpg?$oh&flip");
    qsParam("flip", true, "image.jpg?$oh&flip=true");
    qsParam("flip", false, "image.jpg?$oh&flip=false");
  });

  it("flop", () => {
    qsParam("flop", undefined, "image.jpg?$oh");
    qsParam("flop", true, "image.jpg?$oh&flop");
    qsParam("flop", true, "image.jpg?$oh&flop=true");
    qsParam("flop", false, "image.jpg?$oh&flop=false");
  });

  it("rotate", () => {
    qsParam("rotate", undefined, "image.jpg?$oh");
    qsParam("rotate", null, "image.jpg?$oh&rotate");
    qsParam("rotate", 90, "image.jpg?$oh&rotate=90");
  });

  it("sharpen", () => {
    qsParam("sharpen", undefined, "image.jpg?$oh");
    qsParam("sharpen", null, "image.jpg?$oh&sharpen");
    qsParam("sharpen", 1, "image.jpg?$oh&sharpen=1");
  });

  it("median", () => {
    qsParam("median", undefined, "image.jpg?$oh");
    qsParam("median", null, "image.jpg?$oh&median");
    qsParam("median", 3, "image.jpg?$oh&median=3");
  });

  it("gamma", () => {
    qsParam("gamma", undefined, "image.jpg?$oh");
    qsParam("gamma", null, "image.jpg?$oh&gamma");
    qsParam("gamma", 2.2, "image.jpg?$oh&gamma=2.2");
  });

  it("negate", () => {
    qsParam("negate", undefined, "image.jpg?$oh");
    qsParam("negate", true, "image.jpg?$oh&negate");
    qsParam("negate", true, "image.jpg?$oh&negate=true");
    qsParam("negate", false, "image.jpg?$oh&negate=false");
  });

  it("normalize", () => {
    qsParam("normalize", undefined, "image.jpg?$oh");
    qsParam("normalize", true, "image.jpg?$oh&normalize");
    qsParam("normalize", true, "image.jpg?$oh&normalize=true");
    qsParam("normalize", false, "image.jpg?$oh&normalize=false");
  });

  it("threshold", () => {
    qsParam("threshold", undefined, "image.jpg?$oh");
    qsParam("threshold", null, "image.jpg?$oh&threshold");
    qsParam("threshold", 128, "image.jpg?$oh&threshold=128");
  });
});

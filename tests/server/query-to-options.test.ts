import { ImageOptions } from "../../src/plugin/types";
import { queryToOptions } from "../../src/plugin/utils";
import { describe, expect, it } from "vitest";
const PROCESS_KEY = "$oh";

//  types: {
//       breakpoints: "number[]",
//       blur: "number",
//       flip: "boolean",
//       flop: "boolean",
//       rotate: "number",
//       sharpen: "number",
//       median: "number",
//       gamma: "number",
//       negate: "boolean",
//       normalize: "boolean",
//       threshold: "number",
//     },

// RETURN TYPE
//  {
//   shouldProcess: boolean;
//   path: string;
//   options?: Partial<ImageOptions>;
//   queryString: string;
// }

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
  it("should return true, if $oh is provided in query", () => {
    expect(qs("image.jpg?$oh").shouldProcess).toBeTruthy();
    expect(qs("image.jpg?blur=50&$oh").shouldProcess).toBeTruthy();
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
  
});

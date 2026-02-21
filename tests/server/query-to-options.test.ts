import type { ImageQueryParamsTransforms, PlaceholderTransforms } from "../../src/plugin/types";
import { queryToOptions } from "../../src/plugin/utils";
import { describe, expect, it } from "vitest";
const PROCESS_KEY = "$oh";

describe("queryToOptions", () => {
  function qs(uri: string) {
    return queryToOptions(PROCESS_KEY, uri);
  }

  const qsParam = <T extends ImageQueryParamsTransforms, K extends keyof T>(
    key: K,
    value: T[K],
    uri: string,
  ) => {
    const processed = qs(uri);
    expect(processed.shouldProcess).toBeTruthy();
    if (processed.shouldProcess) {
      expect(processed.transforms).toBeDefined();
      if (Array.isArray(value)) {
        expect((processed.transforms as any)![key as any]).toEqual(value);
      } else {
        expect((processed.transforms as any)![key as any]).toBe(value);
      }
    }
  };

  const qsParamPL = <T extends PlaceholderTransforms, K extends keyof T>(
    key: K,
    value: T[K],
    uri: string,
  ) => {
    const processed = qs(uri);
    expect(processed.shouldProcess).toBeTruthy();
    if (processed.shouldProcess) {
      expect(processed.placeholder).toBeDefined();
      if (Array.isArray(value)) {
        expect((processed.placeholder as any)![key as any]).toEqual(value);
      } else {
        expect((processed.placeholder as any)![key as any]).toBe(value);
      }
    }
  };

  it("should return shouldProcess false, when no path and query provided", () => {
    expect(qs("").shouldProcess).toBeFalsy();
    expect(qs("image.jpg").shouldProcess).toBeFalsy();
    expect(qs("image.jpg?").shouldProcess).toBeFalsy();
    expect(qs("image.jpg?blur=50").shouldProcess).toBeFalsy();
    expect(qs("image.jpg$oh?blur=50").shouldProcess).toBeFalsy();
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

  it("pl_show", () => {
    qsParamPL("show", undefined, "image.jpg?$oh");
    qsParamPL("show", true, `image.jpg?$oh&pl_show`);
    qsParamPL("show", true, `image.jpg?$oh&pl_show=${true}`);
    qsParamPL("show", false, `image.jpg?$oh&pl_show=${false}`);
  });

  // Params check

  function checkParam(key: any, value: any) {
    it(key, () => {
      qsParam(key, undefined, "image.jpg?$oh");
      qsParam(key, null, `image.jpg?$oh&${key}`);
      qsParam(key, value, `image.jpg?$oh&${key}=${value}`);
    });

    it("pl_" + key, () => {
      qsParamPL(key, undefined, "image.jpg?$oh");
      qsParamPL(key, null, `image.jpg?$oh&pl_${key}`);
      qsParamPL(key, value, `image.jpg?$oh&pl_${key}=${value}`);
    });
  }

  function checkBooleanParam(key: any) {
    it(key, () => {
      qsParam(key, undefined, "image.jpg?$oh");
      qsParam(key, true, `image.jpg?$oh&${key}`);
      qsParam(key, true, `image.jpg?$oh&${key}=${true}`);
      qsParam(key, false, `image.jpg?$oh&${key}=${false}`);
    });

    it("pl_" + key, () => {
      qsParamPL(key, undefined, "image.jpg?$oh");
      qsParamPL(key, true, `image.jpg?$oh&pl_${key}`);
      qsParamPL(key, true, `image.jpg?$oh&pl_${key}=${true}`);
      qsParamPL(key, false, `image.jpg?$oh&pl_${key}=${false}`);
    });
  }

  checkParam("quality", 100);
  checkParam("width", 200);
  checkParam("height", 217);
  checkParam("format", "png");
  checkParam("blur", 50);
  checkBooleanParam("flip");
  checkBooleanParam("flop");
  checkParam("rotate", 27);
  checkParam("sharpen", 1);
  checkParam("median", 3);
  checkParam("gamma", 2.2);
  checkBooleanParam("negate");
  checkBooleanParam("normalize");
  checkParam("threshold", 128);
});

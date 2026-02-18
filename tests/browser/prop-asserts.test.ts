import { describe, expect, it } from "vitest";
import {
  assertLoadingProp,
  assertDecodingProp,
  assertFetchPriorityProp,
  assertFillProp,
  assertDimensionsProp,
} from "../../src/react/prop-asserts";
import type { ImageProps } from "../../src/react/types";

function makeProps(overrides: Partial<ImageProps> = {}): ImageProps {
  return { src: "image.jpg", alt: "test", ...overrides };
}

const objectSrc = {
  src: "/image.jpg",
  width: 100,
  height: 100,
  srcSets: "/image-50.jpg 50w",
};

const mockLoader = () => "http://cdn.example.com/image.jpg";

describe("assertLoadingProp", () => {
  it("throws when both loading and priority are set", () => {
    expect(() =>
      assertLoadingProp(makeProps({ loading: "lazy", priority: true })),
    ).toThrow();
  });

  it("does not throw when only loading is set", () => {
    expect(() =>
      assertLoadingProp(makeProps({ loading: "lazy" })),
    ).not.toThrow();
  });

  it("does not throw when only priority is set", () => {
    expect(() => assertLoadingProp(makeProps({ priority: true }))).not.toThrow();
  });
});

describe("assertDecodingProp", () => {
  it("throws when both decoding and priority are set", () => {
    expect(() =>
      assertDecodingProp(makeProps({ decoding: "sync", priority: true })),
    ).toThrow();
  });

  it("does not throw when only decoding is set", () => {
    expect(() =>
      assertDecodingProp(makeProps({ decoding: "async" })),
    ).not.toThrow();
  });

  it("does not throw when only priority is set", () => {
    expect(() => assertDecodingProp(makeProps({ priority: true }))).not.toThrow();
  });
});

describe("assertFetchPriorityProp", () => {
  it("throws when both fetchPriority and priority are set", () => {
    expect(() =>
      assertFetchPriorityProp(makeProps({ fetchPriority: "low", priority: true })),
    ).toThrow();
  });

  it("does not throw when only fetchPriority is set", () => {
    expect(() =>
      assertFetchPriorityProp(makeProps({ fetchPriority: "high" })),
    ).not.toThrow();
  });

  it("does not throw when only priority is set", () => {
    expect(() =>
      assertFetchPriorityProp(makeProps({ priority: true })),
    ).not.toThrow();
  });
});


describe("assertFillProp", () => {
  it("throws when fill is used with width", () => {
    expect(() =>
      assertFillProp(makeProps({ fill: true, width: 100 })),
    ).toThrow();
  });

  it("throws when fill is used with height", () => {
    expect(() =>
      assertFillProp(makeProps({ fill: true, height: 100 })),
    ).toThrow();
  });

  it("does not throw when fill is used without dimensions", () => {
    expect(() => assertFillProp(makeProps({ fill: true }))).not.toThrow();
  });

  it("does not throw when dimensions are used without fill", () => {
    expect(() =>
      assertFillProp(makeProps({ width: 100, height: 100 })),
    ).not.toThrow();
  });
});

describe("assertDimensionsProp", () => {
  it("throws when string src has no dimensions and no fill", () => {
    expect(() => assertDimensionsProp(makeProps())).toThrow();
  });

  it("does not throw when width and height are provided", () => {
    expect(() =>
      assertDimensionsProp(makeProps({ width: 100, height: 100 })),
    ).not.toThrow();
  });

  it("does not throw when fill is true", () => {
    expect(() => assertDimensionsProp(makeProps({ fill: true }))).not.toThrow();
  });

  it("does not throw when src is an object", () => {
    expect(() =>
      assertDimensionsProp(makeProps({ src: objectSrc })),
    ).not.toThrow();
  });
});

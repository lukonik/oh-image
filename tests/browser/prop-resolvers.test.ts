import { describe, expect, it } from "vitest";
import {
    resolveLoading,
    resolveSizes,
} from "../../src/react/prop-resolvers";
import type { ImageProps } from "../../src/react/types";

function makeProps(overrides: Partial<ImageProps> = {}): ImageProps {
  return { src: "image.jpg", alt: "test", ...overrides };
}

describe("resolveLoading", () => {
  it("returns 'lazy' by default", () => {
    expect(resolveLoading(makeProps())).toBe("lazy");
  });

  it("returns the provided loading value when not asap", () => {
    expect(resolveLoading(makeProps({ loading: "eager" }))).toBe("eager");
  });

  it("returns 'eager' when asap is true, ignoring loading prop", () => {
    expect(resolveLoading(makeProps({ asap: true }))).toBe("eager");
  });

  it("returns 'eager' when asap is true even if loading is 'lazy'", () => {
    expect(resolveLoading(makeProps({ asap: true, loading: "lazy" }))).toBe(
      "eager"
    );
  });
});

describe("resolveSizes", () => {
  it("returns undefined when no sizes, no fill, and no srcSet", () => {
    expect(resolveSizes(makeProps())).toBeUndefined();
  });

  it("prefixes sizes with 'auto, ' for lazy-loaded images with explicit sizes", () => {
    expect(resolveSizes(makeProps({ sizes: "50vw" }))).toBe("auto, 50vw");
  });

  it("does not prefix sizes with 'auto, ' for eager-loaded images", () => {
    expect(resolveSizes(makeProps({ sizes: "50vw", loading: "eager" }))).toBe(
      "50vw"
    );
  });

  it("defaults sizes to '100vw' when fill is true, and prefixes with 'auto, ' for lazy", () => {
    expect(resolveSizes(makeProps({ fill: true }))).toBe("auto, 100vw");
  });

  it("defaults sizes to '100vw' when fill is true and does not prefix for eager", () => {
    expect(
      resolveSizes(makeProps({ fill: true, loading: "eager" }))
    ).toBe("100vw");
  });

  it("uses explicit sizes over fill default", () => {
    expect(resolveSizes(makeProps({ fill: true, sizes: "50vw" }))).toBe(
      "auto, 50vw"
    );
  });

  it("sets sizes to 'auto, 100vw' for lazy images with a valid width-descriptor srcSet", () => {
    expect(resolveSizes(makeProps({ srcSet: "200w, 400w" }))).toBe(
      "auto, 100vw"
    );
  });

  it("does not set sizes for eager images with a valid width-descriptor srcSet", () => {
    expect(
      resolveSizes(makeProps({ srcSet: "200w, 400w", loading: "eager" }))
    ).toBeUndefined();
  });

  it("does not set sizes for srcSet using pixel-density descriptors", () => {
    expect(resolveSizes(makeProps({ srcSet: "image.jpg 2x" }))).toBeUndefined();
  });

  it("does not set sizes when asap is true, even with a valid width-descriptor srcSet", () => {
    expect(
      resolveSizes(makeProps({ asap: true, srcSet: "200w, 400w" }))
    ).toBeUndefined();
  });
});

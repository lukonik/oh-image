import { describe, expect, it } from "vitest";
import {
  resolveLoading,
  resolveSizes,
  resolveDecoding,
  resolveFetchPriority,
  resolveSrcSet,
  resolveSrc,
  resolveWidth,
  resolveHeight
} from "../../src/react/prop-resolvers";
import type { ImageProps } from "../../src/react/types";

function makeProps(overrides: Partial<ImageProps> = {}): ImageProps {
  return { src: "image.jpg", alt: "test", ...overrides };
}

describe("resolveLoading", () => {
  it("returns 'lazy' by default", () => {
    expect(resolveLoading(makeProps())).toBe("lazy");
  });

  it("returns the provided loading value when not priority", () => {
    expect(resolveLoading(makeProps({ loading: "eager" }))).toBe("eager");
  });

  it("returns 'eager' when priority is true, ignoring loading prop", () => {
    expect(resolveLoading(makeProps({ priority: true }))).toBe("eager");
  });

  it("returns 'eager' when priority is true even if loading is 'lazy'", () => {
    expect(resolveLoading(makeProps({ priority: true, loading: "lazy" }))).toBe(
      "eager",
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
      "50vw",
    );
  });

  it("defaults sizes to '100vw' when fill is true, and prefixes with 'auto, ' for lazy", () => {
    expect(resolveSizes(makeProps({ fill: true }))).toBe("auto, 100vw");
  });

  it("defaults sizes to '100vw' when fill is true and does not prefix for eager", () => {
    expect(resolveSizes(makeProps({ fill: true, loading: "eager" }))).toBe(
      "100vw",
    );
  });

  it("uses explicit sizes over fill default", () => {
    expect(resolveSizes(makeProps({ fill: true, sizes: "50vw" }))).toBe(
      "auto, 50vw",
    );
  });

  it("sets sizes to 'auto, 100vw' for lazy images with a valid width-descriptor srcSet", () => {
    expect(resolveSizes(makeProps({ srcSet: "200w, 400w" }))).toBe(
      "auto, 100vw",
    );
  });

  it("does not set sizes for eager images with a valid width-descriptor srcSet", () => {
    expect(
      resolveSizes(makeProps({ srcSet: "200w, 400w", loading: "eager" })),
    ).toBeUndefined();
  });

  it("does not set sizes for srcSet using pixel-density descriptors", () => {
    expect(resolveSizes(makeProps({ srcSet: "image.jpg 2x" }))).toBeUndefined();
  });

  it("does not set sizes when priority is true, even with a valid width-descriptor srcSet", () => {
    expect(
      resolveSizes(makeProps({ priority: true, srcSet: "200w, 400w" })),
    ).toBeUndefined();
  });
});

const objectSrc = {
  src: "/image.jpg",
  width: 500,
  height: 600,
  srcSets: "/image-50.jpg 50w, /image-100.jpg 100w",
  placeholderUrl: "/blur.jpg",
};

const mockLoader = (opts: {
  src: string;
  width?: number | null;
  height?: number | null;
  isPlaceholder?: boolean;
}) => `http://cdn.test/resize/${opts.width ?? "auto"}/${opts.src}`;

describe("resolveDecoding", () => {
  it("returns 'async' when priority is true", () => {
    expect(resolveDecoding(makeProps({ priority: true }))).toBe("async");
  });

  it("returns the provided decoding value when not priority", () => {
    expect(resolveDecoding(makeProps({ decoding: "sync" }))).toBe("sync");
  });

  it("returns undefined when no decoding and no priority", () => {
    expect(resolveDecoding(makeProps())).toBeUndefined();
  });
});

describe("resolveFetchPriority", () => {
  it("returns 'high' when priority is true", () => {
    expect(resolveFetchPriority(makeProps({ priority: true }))).toBe("high");
  });

  it("returns the provided fetchPriority when not priority", () => {
    expect(resolveFetchPriority(makeProps({ fetchPriority: "low" }))).toBe(
      "low",
    );
  });

  it("returns 'auto' by default", () => {
    expect(resolveFetchPriority(makeProps())).toBe("auto");
  });
});

describe("resolveSrcSet", () => {
  it("returns explicit srcSet when provided", () => {
    expect(resolveSrcSet(makeProps({ srcSet: "a.jpg 1x" }))).toBe("a.jpg 1x");
  });

  it("returns srcSets from object src", () => {
    expect(resolveSrcSet(makeProps({ src: objectSrc }))).toBe(
      objectSrc.srcSets,
    );
  });

  it("returns undefined when no breakpoints and string src", () => {
    expect(resolveSrcSet(makeProps())).toBeUndefined();
  });

  it("generates srcSet from breakpoints and loader", () => {
    const result = resolveSrcSet(
      makeProps({ breakpoints: [100, 200], loader: mockLoader }),
    );
    expect(result).toBe(
      "http://cdn.test/resize/100/image.jpg 100w, http://cdn.test/resize/200/image.jpg 200w",
    );
  });

  it("returns undefined when breakpoints exist but no loader", () => {
    expect(
      resolveSrcSet(makeProps({ breakpoints: [100, 200] })),
    ).toBeUndefined();
  });

  it("prefers object src srcSets over breakpoints", () => {
    expect(
      resolveSrcSet(
        makeProps({ src: objectSrc, breakpoints: [100], loader: mockLoader }),
      ),
    ).toBe(objectSrc.srcSets);
  });
});

describe("resolveSrc", () => {
  it("returns src string as-is when no loader", () => {
    expect(resolveSrc(makeProps())).toBe("image.jpg");
  });

  it("extracts src from object src", () => {
    expect(resolveSrc(makeProps({ src: objectSrc }))).toBe("/image.jpg");
  });

  it("runs string src through loader", () => {
    expect(resolveSrc(makeProps({ loader: mockLoader, width: 300 }))).toBe(
      "http://cdn.test/resize/300/image.jpg",
    );
  });
});

describe("resolveWidth", () => {
  it("returns explicit width when provided", () => {
    expect(resolveWidth(makeProps({ width: 100 }))).toBe(100);
  });

  it("extracts width from object src", () => {
    expect(resolveWidth(makeProps({ src: objectSrc }))).toBe(500);
  });

  it("returns undefined when no width and string src", () => {
    expect(resolveWidth(makeProps())).toBeUndefined();
  });
});

describe("resolveHeight", () => {
  it("returns explicit height when provided", () => {
    expect(resolveHeight(makeProps({ height: 200 }))).toBe(200);
  });

  it("extracts height from object src", () => {
    expect(resolveHeight(makeProps({ src: objectSrc }))).toBe(600);
  });

  it("returns undefined when no height and string src", () => {
    expect(resolveHeight(makeProps())).toBeUndefined();
  });
});

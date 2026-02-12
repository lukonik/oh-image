import type { ImageProps } from "./types";

/**
 * RegExpr to determine whether a src in a srcset is using width descriptors.
 * Should match something like: "100w, 200w".
 */
const VALID_WIDTH_DESCRIPTOR_SRCSET = /^((\s*\d+w\s*(,|$)){1,})$/;

export function resolveOptions(prop: ImageProps) {
  const { src, ...rest } = prop;
  const resolved = { ...rest } as Omit<ImageProps, "src"> & {
    src: string;
    srcSet?: string;
  };
  if (typeof src === "object") {
    resolved.src = src.src;
    resolved.width ??= src.width;
    resolved.height ??= src.height;
    resolved.srcSet ??= src.srcSets;
    resolved.placeholderUrl ??= src.placeholderUrl;
  } else {
    resolved.src = src;
  }

  if (prop.asap) {
    resolved.decoding = "async";
    resolved.loading = "eager";
    resolved.fetchPriority = "high";
  }

  resolved.sizes = resolveSizes(prop);
  resolved.loading = resolveLoading(prop);

  return resolved;
}

export function resolveLoading(prop: ImageProps) {
  if (!prop.asap && prop.loading !== undefined) {
    return prop.loading;
  }
  return prop.asap ? "eager" : "lazy";
}

export function resolveSizes(prop: ImageProps) {
  const loading = resolveLoading(prop);
  let sizes = prop.sizes;

  if (prop.fill) {
    sizes ||= "100vw";
  }

  if (sizes) {
    if (loading === "lazy") {
      sizes = "auto, " + sizes;
    }
  } else {
    if (
      prop.srcSet &&
      VALID_WIDTH_DESCRIPTOR_SRCSET.test(prop.srcSet) &&
      loading === "lazy"
    ) {
      sizes = "auto, 100vw";
    }
  }

  return sizes;
}

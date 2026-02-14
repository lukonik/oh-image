import type { ImageContextValue } from "./image-context";
import type { ImageProps } from "./types";

/**
 * RegExpr to determine whether a src in a srcset is using width descriptors.
 * Should match something like: "100w, 200w".
 */
const VALID_WIDTH_DESCRIPTOR_SRCSET = /^((\s*\d+w\s*(,|$)){1,})$/;

export function resolveOptions(
  prop: ImageProps,
  defaultOptions: ImageContextValue,
) {
  const resolved = { ...defaultOptions, ...prop } as Omit<ImageProps, "src"> & {
    src: string;
    srcSet?: string | undefined;
  };

  resolved.decoding = resolveDecoding(resolved);
  resolved.fetchPriority = resolveFetchPriority(resolved);
  resolved.loading = resolveLoading(resolved);
  resolved.srcSet = resolveSrcSet(resolved);
  resolved.sizes = resolveSizes(resolved, resolved.srcSet, resolved.loading);
  resolved.placeholderUrl = resolvePlaceholderURL(resolved);
  resolved.height = resolveHeight(resolved);
  resolved.width = resolveWidth(resolved);
  resolved.src = resolveSrc(resolved);
  return resolved;
}

export function resolveDecoding(prop: ImageProps) {
  return prop.asap ? "async" : prop.decoding;
}

export function resolveFetchPriority(prop: ImageProps) {
  if (prop.asap) {
    return "high";
  }
  return prop.fetchPriority ?? "auto";
}

export function resolveSrcSet(prop: ImageProps) {
  if (prop.srcSet) {
    return prop.srcSet;
  }

  // If src is an object and srcSets is defined,
  // srcSets takes priority over breakpoints.
  // Even if breakpoints are defined, srcSets must match src
  // to ensure the correct files are generated at build time.
  if (typeof prop.src === "object") {
    return prop.src.srcSets;
  }

  if (!prop.breakpoints) {
    return undefined;
  }

  const baseSrc = prop.src;
  const entries: string[] = [];

  for (const breakpoint of prop.breakpoints) {
    if (prop.loader) {
      entries.push(
        `${prop.loader({
          src: baseSrc,
          width: breakpoint,
          height: prop.height,
          isPlaceholder: false,
        })} ${breakpoint}w`,
      );
    }
  }

  if (entries.length === 0) {
    return undefined;
  }

  return entries.join(", ");
}

export function resolveLoading(prop: ImageProps) {
  if (!prop.asap && prop.loading !== undefined) {
    return prop.loading;
  }
  return prop.asap ? "eager" : "lazy";
}

export function resolveSizes(
  prop: ImageProps,
  resolvedSrcSet?: string,
  resolvedLoading?: string,
) {
  const loading = resolvedLoading ?? resolveLoading(prop);
  const srcSet = resolvedSrcSet ?? prop.srcSet;
  let sizes = prop.sizes;

  if (prop.fill) {
    sizes ||= "100vw";
  }

  if (sizes) {
    if (loading === "lazy") {
      sizes = "auto, " + sizes;
    }
  } else {
    if (srcSet && VALID_WIDTH_DESCRIPTOR_SRCSET.test(srcSet) && loading === "lazy") {
      sizes = "auto, 100vw";
    }
  }

  return sizes;
}

export function resolveSrc(prop: ImageProps) {
  if (typeof prop.src === "object") {
    return prop.src.src;
  }
  if (prop.loader) {
    return prop.loader({
      src: prop.src,
      width: prop.width,
      height: prop.height,
    });
  }
  return prop.src;
}

export function resolveWidth(prop: ImageProps) {
  if (prop.width) {
    return prop.width;
  }
  if (typeof prop.src === "object") {
    return prop.src.width;
  }
  return undefined;
}

export function resolveHeight(prop: ImageProps) {
  if (prop.height) {
    return prop.height;
  }
  if (typeof prop.src === "object") {
    return prop.src.height;
  }
  return undefined;
}

export function resolvePlaceholderURL(prop: ImageProps) {
  if (prop.placeholderUrl) {
    return prop.placeholderUrl;
  }
  if (typeof prop.src === "object") {
    return prop.src.placeholderUrl;
  }
  if (prop.loader) {
    return prop.loader({
      isPlaceholder: true,
      src: prop.src,
      width: prop.width,
      height: prop.height,
    });
  }
  return undefined;
}

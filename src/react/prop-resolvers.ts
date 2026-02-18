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
  resolved.placeholder = resolvePlaceholder(resolved, resolved.src);
  resolved.height = resolveHeight(resolved);
  resolved.width = resolveWidth(resolved);
  resolved.src = resolveSrc(resolved) as string;
  return resolved;
}

export function resolveDecoding(prop: ImageProps) {
  return prop.priority ? "async" : prop.decoding;
}

export function resolveFetchPriority(prop: ImageProps) {
  if (prop.priority) {
    return "high";
  }
  return prop.fetchPriority ?? "auto";
}

export function resolveSrcSet(prop: ImageProps) {
  if (prop.srcSet) {
    return prop.srcSet;
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
  const priority = prop.priority;
  if (!priority && prop.loading !== undefined) {
    return prop.loading;
  }
  return priority ? "eager" : "lazy";
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
    if (
      srcSet &&
      VALID_WIDTH_DESCRIPTOR_SRCSET.test(srcSet) &&
      loading === "lazy"
    ) {
      sizes = "auto, 100vw";
    }
  }

  return sizes;
}

export function resolveSrc(prop: ImageProps) {
  if (prop.loader) {
    return prop.loader({
      src: prop.src,
      width: prop.width,
      height: prop.height,
    });
  }
  return prop.src as string;
}

export function resolveWidth(prop: ImageProps) {
  if (prop.width) {
    return prop.width;
  }
  return undefined;
}

export function resolveHeight(prop: ImageProps) {
  if (prop.height) {
    return prop.height;
  }

  return undefined;
}

export function resolvePlaceholder(prop: ImageProps, src: string) {
  if (!prop.placeholder) {
    return null;
  }

  if (typeof prop.placeholder === "string") {
    return prop.placeholder;
  }

  if (prop.loader) {
    return prop.loader({
      src: src,
      isPlaceholder: true,
      width: prop.width,
      height: prop.height,
    });
  }

  return null;
}

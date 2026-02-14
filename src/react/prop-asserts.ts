import type { ImageProps } from "./types";

export function assertProps(prop: ImageProps) {
  try {
    assertLoadingProp(prop);
    assertDecodingProp(prop);
    assertFetchPriorityProp(prop);
    assertBreakpointsProp(prop);
    assertFillProp(prop);
    assertDimensionsProp(prop);
  } catch (err) {
    const message = err instanceof Error ? err.message : err;
    console.warn(message);
  }
}

export function assert(
  assertion: () => boolean | undefined | null,
  message: string | false,
) {
  if (import.meta.env.DEV) {
    if (assertion()) {
      throw new Error(message || undefined);
    }
  }
}

export function assertLoadingProp(prop: ImageProps) {
  assert(
    () => prop.loading && prop.asap,
    import.meta.env.DEV &&
      `Do not use \`loading\` on a asap image — asap images are always eagerly loaded.`,
  );
}

export function assertDecodingProp(prop: ImageProps) {
  assert(
    () => prop.decoding && prop.asap,
    import.meta.env.DEV &&
      `Do not use \`decoding\` on a asap image — asap images always use async decoding.`,
  );
}

export function assertFetchPriorityProp(prop: ImageProps) {
  assert(
    () => prop.fetchPriority && prop.asap,
    import.meta.env.DEV &&
      `Do not use \`fetchPriority\` on a asap image — asap images always use high fetch priority.`,
  );
}

export function assertBreakpointsProp(prop: ImageProps) {
  assert(
    () => prop.breakpoints && typeof prop.src === "object",
    import.meta.env.DEV &&
      `Do not use \`breakpoints\` when \`src\` is an imported image — the image's built-in srcSets are used instead.`,
  );
  assert(
    () => prop.breakpoints && typeof prop.src === "string" && !prop.loader,
    import.meta.env.DEV &&
      `Do not use \`breakpoints\` without a \`loader\` — breakpoints require a loader to generate srcSet entries.`,
  );
}

export function assertFillProp(prop: ImageProps) {
  assert(
    () => prop.fill && (prop.width !== undefined || prop.height !== undefined),
    import.meta.env.DEV &&
      `Do not use \`width\` or \`height\` with \`fill\` — fill mode makes the image fill its container.`,
  );
}

export function assertDimensionsProp(prop: ImageProps) {
  assert(
    () =>
      typeof prop.src === "string" &&
      !prop.fill &&
      prop.width === undefined &&
      prop.height === undefined,
    import.meta.env.DEV &&
      `Image is missing \`width\` and \`height\` props. Either provide dimensions, use \`fill\`, or use an imported image source.`,
  );
}

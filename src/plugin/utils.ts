import queryString from "query-string";
import type {
  ImageQueryParamsTransforms,
  ImageTransforms,
  PlaceholderTransforms,
  PluginConfig,
  PluginTransforms,
} from "./types";
import { extname } from "path";
import type { FormatEnum } from "sharp";

/**
 * Strips query string from path to get the clean file path
 */
export function stripQueryString(path: string): string {
  const queryIndex = path.indexOf("?");
  return queryIndex === -1 ? path : path.slice(0, queryIndex);
}

type QueryOptionsReturn =
  | {
      shouldProcess: false;
    }
  | {
      shouldProcess: true;
      path: string;
      queryString: string;
      transforms: ImageTransforms;
      placeholder: PlaceholderTransforms;
    };

export function queryToOptions(
  processKey: string,
  uri: string,
): QueryOptionsReturn {
  const [path, query] = uri.split("?");
  if (!query || !path) {
    return { shouldProcess: false };
  }
  const parsed = queryString.parse(query, {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: "comma",
    types: {
      width: "number",
      height: "number",
      format: "string",
      placeholder: "boolean",
      breakpoints: "number[]",
      blur: "number",
      flip: "boolean",
      flop: "boolean",
      rotate: "number",
      sharpen: "number",
      median: "number",
      gamma: "number",
      negate: "boolean",
      normalize: "boolean",
      threshold: "number",
      quality: "number",

      pl_width: "number",
      pl_height: "number",
      pl_format: "string",
      pl_blur: "number",
      pl_flip: "boolean",
      pl_flop: "boolean",
      pl_rotate: "number",
      pl_sharpen: "number",
      pl_median: "number",
      pl_gamma: "number",
      pl_negate: "boolean",
      pl_normalize: "boolean",
      pl_threshold: "number",
      pl_quality: "number",
    } satisfies Record<
      keyof Required<ImageQueryParamsTransforms>,
      "boolean" | "number" | "string" | "string[]" | "number[]"
    >,
  }) as unknown as ImageQueryParamsTransforms;

  if (processKey in parsed) {
    const transforms: ImageTransforms = {};
    const placeholder: PlaceholderTransforms = {};

    // Filter and split keys
    Object.entries(parsed).forEach(([key, value]) => {
      if (key.startsWith("pl_")) {
        // Remove 'pl_' prefix and add to placeholder object
        const cleanKey = key.replace("pl_", "") as keyof PlaceholderTransforms;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (placeholder as any)[cleanKey] = value;
      } else {
        // Add standard keys to transforms object
        const transformKey = key as keyof ImageTransforms;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (transforms as any)[transformKey] = value;
      }
    });
    return {
      shouldProcess: true,
      transforms: transforms,
      placeholder: placeholder,
      path: path,
      queryString: query,
    };
  } else {
    return { shouldProcess: false };
  }
}

/** returns ext of file. removes '.' */
export function getCleanExt(filepath: string) {
  const ext = extname(filepath);
  return ext.startsWith(".") ? ext.slice(1) : ext;
}

export function resolveTransforms(
  options: ImageTransforms | undefined,
  defaults: PluginTransforms | undefined,
  metadata: { width: number; height: number },
  fileFormat: string,
) {
  const resolved = {
    ...defaults,
    ...options,
  };

  // Ensure these are never null/undefined by falling back to metadata
  const width = options?.width ?? defaults?.width ?? metadata.width;
  const height = options?.height ?? defaults?.height ?? metadata.height;
  const format = options?.format ?? defaults?.format ?? fileFormat ?? "webp";

  return {
    ...resolved,
    width,
    height,
    format,
  } as Omit<ImageTransforms, "breakpoints"> & {
    width: number;
    height: number;
    format: keyof FormatEnum;
  };
}

export function resolveShowPlaceholder(
  parsed: PlaceholderTransforms,
  config: PluginConfig,
) {
  if (parsed.pl_show || config.showPlaceholder) {
    return true;
  }
  return false;
}

export function resolvePlaceholderTransforms(
  options: PlaceholderTransforms | undefined,
  defaults: PlaceholderTransforms | undefined,
  metadata: { width: number; height: number },
) {
  const resolved = {
    ...defaults,
    ...options,
  };

  // Ensure these are never null/undefined by falling back to metadata
  const width = options?.width ?? defaults?.width ?? metadata.width;
  const height = options?.height ?? defaults?.height ?? metadata.height;
  const format = options?.format ?? defaults?.format ?? "webp";

  return {
    ...resolved,
    width,
    height,
    format,
  } as ImageTransforms & {
    width: number;
    height: number;
    format: keyof FormatEnum;
  };
}

export function resolveBreakpointTransforms(
  options: PlaceholderTransforms | undefined,
  defaults: PlaceholderTransforms | undefined,
  width: number,
) {
  const resolved = {
    ...defaults,
    ...options,
  };

  // height and width should be deleted
  // because breakpoin't cant' have a height

  delete resolved["height"];
  delete resolved["width"];

  const format = "webp";

  return {
    ...resolved,
    width,
    format,
  } as Omit<ImageTransforms, "width" | "height"> & {
    width: number;
    format: keyof FormatEnum;
  };
}

export function resolveBreakpoints(
  options: ImageTransforms | undefined,
  config: PluginConfig,
) {
  return options?.breakpoints ?? config.breakpoints;
}

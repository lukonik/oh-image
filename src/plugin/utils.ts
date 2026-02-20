import queryString from "query-string";
import type {
  ImageQueryParamsTransforms,
  ImageTransforms,
  PlaceholderTransforms,
} from "./types";

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

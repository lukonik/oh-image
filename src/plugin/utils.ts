import queryString from "query-string";
import type { ImageOptions } from "./types";

/**
 * Strips query string from path to get the clean file path
 */
export function stripQueryString(path: string): string {
  const queryIndex = path.indexOf("?");
  return queryIndex === -1 ? path : path.slice(0, queryIndex);
}

export function queryToOptions(
  processKey: string,
  uri: string,
): {
  shouldProcess: boolean;
  path: string;
  options?: Partial<ImageOptions>;
} {
  const [path, query] = uri.split("?");
  if (!query || !path) {
    return { shouldProcess: false, path: "" };
  }
  const parsed = queryString.parse(query, {
    parseBooleans: true,
    parseNumbers: true,
    arrayFormat: "comma",
    types: {
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
    },
  });

  if (processKey in parsed) {
    return { shouldProcess: true, options: parsed, path: path };
  } else {
    return { shouldProcess: false, path: path };
  }
}

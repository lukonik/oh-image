import queryString from "query-string";
import type { ImageTransforms } from "./types";

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
  options?: Partial<ImageTransforms>;
  queryString: string;
} {
  const [path, query] = uri.split("?");
  if (!query || !path) {
    return { shouldProcess: false, path: "", queryString: "" };
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
    } satisfies Record<
      keyof Required<ImageTransforms>,
      "boolean" | "number" | "string" | "string[]" | "number[]"
    >,
  });

  if (processKey in parsed) {
    return {
      shouldProcess: true,
      options: parsed,
      path: path,
      queryString: query,
    };
  } else {
    return { shouldProcess: false, path: "", queryString: query };
  }
}

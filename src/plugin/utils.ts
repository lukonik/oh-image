import { randomBytes } from "node:crypto";
import type { ImageOptions } from "./types";

export function mergeConfig<T>(base: T, ovverides: T) {
  return { ...base, ...ovverides };
}

export function getRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export interface ParsedImport {
  filePath: string;
  options: ImageOptions;
  shouldProcess: boolean;
}

/**
 * Parses an import path with query parameters.
 * Format: someimage.png?oh&blur=true&breakpoints=640,750,828
 * The "oh" query param indicates the image should be processed.
 */
export function parseImageImport(id: string): ParsedImport {
  const queryIndex = id.indexOf("?");

  if (queryIndex === -1) {
    return { filePath: id, options: {}, shouldProcess: false };
  }

  const filePath = id.slice(0, queryIndex);
  const queryString = id.slice(queryIndex + 1);

  const params = new URLSearchParams(queryString);

  // Check if "oh" is the first param (indicates processing is needed)
  const shouldProcess = queryString.startsWith("oh");

  if (!shouldProcess) {
    return { filePath, options: {}, shouldProcess: false };
  }

  const options: ImageOptions = {};

  // Parse blur option
  const blurParam = params.get("blur");
  if (blurParam !== null) {
    options.blur = blurParam === "" || blurParam === "true";
  }

  // Parse breakpoints option (comma-separated numbers)
  const breakpointsParam = params.get("breakpoints");
  if (breakpointsParam) {
    options.breakpoints = breakpointsParam
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  // Parse width option
  const widthParam = params.get("width");
  if (widthParam) {
    const width = parseInt(widthParam, 10);
    if (!isNaN(width)) {
      options.width = width;
    }
  }

  // Parse height option
  const heightParam = params.get("height");
  if (heightParam) {
    const height = parseInt(heightParam, 10);
    if (!isNaN(height)) {
      options.height = height;
    }
  }

  // Parse format option
  const formatParam = params.get("format");
  if (formatParam && formatParam.length > 0) {
    options.format = formatParam as NonNullable<ImageOptions["format"]>;
  }

  return { filePath, options, shouldProcess };
}

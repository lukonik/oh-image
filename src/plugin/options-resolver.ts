import type { FormatEnum, ResizeOptions } from "sharp";
import type { OhImageOptions } from "./types";

export function queryToOptions(source: string): OhImageOptions {
  const options: OhImageOptions = {};

  // Remove leading ? if present
  const queryString = source.startsWith("?") ? source.slice(1) : source;

  if (!queryString) {
    return options;
  }

  // Parse query parameters
  const params = new URLSearchParams(queryString);

  // Parse size
  if (params.has("size")) {
    const size = parseInt(params.get("size")!, 10);
    if (!isNaN(size) && size > 0) {
      options.size = size;
    }
  }

  // Parse width
  if (params.has("width")) {
    const width = parseInt(params.get("width")!, 10);
    if (!isNaN(width) && width > 0) {
      options.width = width;
    }
  }

  // Parse height
  if (params.has("height")) {
    const height = parseInt(params.get("height")!, 10);
    if (!isNaN(height) && height > 0) {
      options.height = height;
    }
  }

  // Parse format
  if (params.has("format")) {
    const format = params.get("format")!;
    if (format) {
      options.format = format as keyof FormatEnum;
    }
  }

  // Parse blur
  if (params.has("blur")) {
    const blurValue = params.get("blur")!;
    if (blurValue === "true" || blurValue === "") {
      options.blur = true;
    } else if (blurValue === "false") {
      options.blur = false;
    } else {
      const blurNum = parseFloat(blurValue);
      if (!isNaN(blurNum) && blurNum > 0) {
        options.blur = blurNum;
      }
    }
  }

  return options;
}

export function getResizeOptions(
  options: OhImageOptions,
): ResizeOptions | undefined | number {
  if (options.size !== undefined) {
    return options.size;
  }

  if (options.width === undefined && options.height === undefined) {
    return undefined;
  }

  return {
    width: options.width,
    height: options.height,
  };
}

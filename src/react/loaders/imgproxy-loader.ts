import { assertPath, normalizeLoaderParams } from "./image-loader-utils";
import type { ImageLoader, ImageLoaderOptions } from "../types";
import {
  type ImgproxyLoaderOptions,
  useImgproxyContext,
} from "./imgproxy-context";

export {
  ImgproxyLoaderProvider,
  useImgproxyContext,
  type ImgproxyLoaderOptions,
} from "./imgproxy-context";

export function useImgproxyLoader(
  options?: Partial<ImgproxyLoaderOptions>,
): ImageLoader {
  const defaultOptions = useImgproxyContext();

  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };
  assertPath(resolvedOptions.path);

  return (imageOptions: ImageLoaderOptions) => {
    const parts: string[] = [];
    const format = resolvedOptions.format;
    const paramsSeparator = resolvedOptions.paramsSeparator ?? "/";

    if (format) {
      parts.push(`format:${format}`);
    }

    if (imageOptions.width) {
      parts.push(`width:${imageOptions.width}`);
    }

    if (imageOptions.height) {
      parts.push(`height:${imageOptions.height}`);
    }

    if (imageOptions.isPlaceholder) {
      if (resolvedOptions.placeholderParams) {
        const placeholderParams = normalizeLoaderParams(
          resolvedOptions.placeholderParams,
          ":",
        );
        parts.push(...placeholderParams);
      }
    } else {
      if (resolvedOptions.params) {
        const params = normalizeLoaderParams(resolvedOptions.params, ":");
        parts.push(...params);
      }
    }

    const processingOptions = parts.join(paramsSeparator);
    return `${resolvedOptions.path}/${processingOptions}/plain/${imageOptions.src}`;
  };
}

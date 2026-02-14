import { assertPath, normalizeLoaderParams } from "./image-loader-utils";
import type { ImageLoader, ImageLoaderOptions } from "../types";
import {
  type CloudflareLoaderOptions,
  useCloudflareContext,
} from "./cloudflare-context";

export {
  CloudflareLoaderProvider,
  useCloudflareContext,
  type CloudflareLoaderOptions,
} from "./cloudflare-context";

export function useCloudflareLoader(
  options?: Partial<CloudflareLoaderOptions>,
): ImageLoader {
  const defaultOptions = useCloudflareContext();

  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };
  assertPath(resolvedOptions.path);

  return (imageOptions: ImageLoaderOptions) => {
    const parts: string[] = [];
    const format = resolvedOptions.format;
    if (format) {
      parts.push(`format=${format}`);
    }

    if (imageOptions.width) {
      parts.push(`width=${imageOptions.width}`);
    }

    if (imageOptions.height) {
      parts.push(`height=${imageOptions.height}`);
    }

    if (resolvedOptions.params) {
      parts.push(...normalizeLoaderParams(resolvedOptions.params, "="));
    }

    if (imageOptions.isPlaceholder) {
      if (resolvedOptions.placeholderParams) {
        const placeholderParams = normalizeLoaderParams(
          resolvedOptions.placeholderParams,
          "=",
        );
        parts.push(...placeholderParams);
      }
    } else {
      if (resolvedOptions.params) {
        const params = normalizeLoaderParams(resolvedOptions.params, "=");
        parts.push(...params);
      }
    }

    const processingOptions = parts.join(",");

    return `${resolvedOptions.path}/cdn-cgi/image/${processingOptions}/${imageOptions.src}`;
  };
}

import { assertPath, normalizeLoaderParams } from "./image-loader-utils";
import type { ImageLoader, ImageLoaderOptions } from "../types";
import {
  type CloudinaryLoaderOptions,
  useCloudinaryContext,
} from "./cloudinary-context";

export {
  CloudinaryLoaderProvider,
  useCloudinaryContext,
  type CloudinaryLoaderOptions,
} from "./cloudinary-context";

export function useCloudinaryLoader(
  options?: Partial<CloudinaryLoaderOptions>,
): ImageLoader {
  const defaultOptions = useCloudinaryContext();

  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };
  assertPath(resolvedOptions.path);

  return (imageOptions: ImageLoaderOptions) => {
    // Format
    const parts = [];
    const format = `f_${resolvedOptions.format}`;
    parts.push(`${format}`);

    if (imageOptions.width) {
      parts.push(`w_${imageOptions.width}`);
    }

    if (imageOptions.height) {
      parts.push(`h_${imageOptions.height}`);
    }

    if (imageOptions.isPlaceholder) {
      if (resolvedOptions.placeholderParams) {
        const placeholderParams = normalizeLoaderParams(
          resolvedOptions.placeholderParams,
          "",
        );
        parts.push(...placeholderParams);
      }
    } else {
      if (resolvedOptions.params) {
        const params = normalizeLoaderParams(resolvedOptions.params, "");
        parts.push(...params);
      }
    }

    let src = imageOptions.src;
    if (src.startsWith("/")) {
      src = src.slice(1);
    }

    const basePath = resolvedOptions.path.endsWith("/")
      ? resolvedOptions.path.slice(0, -1)
      : resolvedOptions.path;

    const params = parts.join(",");

    return `${basePath}/image/upload/${params}/${src}`;
  };
}

import { assertPath, normalizeLoaderParams } from "./image-loader-utils";
import type { ImageLoader, ImageLoaderOptions } from "../types";
import { createContext, useContext } from "react";

export interface CloudflareLoaderOptions {
  path: string;
  placeholder: boolean;
  format: string;
  params?: Record<string, string>;
  placeholderParams?: Record<string, string>;
  breakpoints?: number[];
}

const CloudflareContext = createContext<CloudflareLoaderOptions>({
  path: "",
  placeholder: true,
  format: "auto",
  placeholderParams: {
    quality: "low",
  },
});

export function useCloudflareContext() {
  return useContext(CloudflareContext);
}

export function CloudflareLoaderProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Partial<CloudflareLoaderOptions>) {
  const ctx = useCloudflareContext();
  return (
    <CloudflareContext.Provider value={{ ...ctx, ...props }}>
      {children}
    </CloudflareContext.Provider>
  );
}

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

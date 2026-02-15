import { assertPath, normalizeLoaderParams } from "./image-loader-utils";
import type { ImageLoader, ImageLoaderOptions } from "../types";
import { createContext, useContext } from "react";

export interface ImgproxyLoaderOptions {
  path: string;
  placeholder: boolean;
  format: string;
  params?: Record<string, string>;
  placeholderParams?: Record<string, string>;
  breakpoints?: number[];
  paramsSeparator?: string;
}

const ImgproxyContext = createContext<ImgproxyLoaderOptions>({
  path: "",
  placeholder: true,
  format: "webp",
  placeholderParams: {
    quality: "1",
  },
});

export function useImgproxyContext() {
  return useContext(ImgproxyContext);
}

export function ImgproxyLoaderProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Partial<ImgproxyLoaderOptions>) {
  const ctx = useImgproxyContext();
  return (
    <ImgproxyContext.Provider value={{ ...ctx, ...props }}>
      {children}
    </ImgproxyContext.Provider>
  );
}


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

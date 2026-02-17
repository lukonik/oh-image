import { assertPath, resolveTransforms } from "./image-loader-utils";
import type { ImageLoader, ImageLoaderOptions } from "../types";
import { createContext, useContext } from "react";

export interface CloudinaryLoaderOptions {
  path: string;
  placeholder: boolean;
  format: string;
  params?: Record<string, string>;
  placeholderParams?: Record<string, string>;
  breakpoints?: number[];
}

const CloudinaryContext = createContext<CloudinaryLoaderOptions>({
  path: "",
  placeholder: true,
  format: "auto",
  placeholderParams: {
    e_blur: ":1000",
    q: "_1",
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export function useCloudinaryContext() {
  return useContext(CloudinaryContext);
}

export function CloudinaryLoaderProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Partial<CloudinaryLoaderOptions>) {
  const ctx = useCloudinaryContext();
  return (
    <CloudinaryContext.Provider value={{ ...ctx, ...props }}>
      {children}
    </CloudinaryContext.Provider>
  );
}

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

    if (resolvedOptions.params) {
      const params = resolveTransforms(resolvedOptions.params, "");
      parts.push(...params);
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

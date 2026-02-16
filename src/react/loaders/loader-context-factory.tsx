import { createContext, useContext } from "react";
import type { BaseGlobalLoaderOptions } from "./base-loader-options";
import type { ImageLoaderOptions } from "../types";

export default function loaderContextFactory<
  K,
  T extends BaseGlobalLoaderOptions<K>,
>(
  defaults: T,
  optionSeparator: string,
  urlResolver: (
    path: string,
    transforms: K,
    imageOptions: ImageLoaderOptions,
    params: string[],
  ) => string,
) {
  const loaderContext = createContext<T>(defaults);

  function useLoaderContext() {
    return useContext(loaderContext);
  }

  function LoaderProvider({
    children,
    ...props
  }: {
    children: React.ReactNode;
  } & Partial<T>) {
    const ctx = useLoaderContext();
    return (
      <loaderContext.Provider value={{ ...ctx, ...props }}>
        {children}
      </loaderContext.Provider>
    );
  }

  function useLoader(options?: T) {
    const context = useLoaderContext();
    const path = options?.path || context.path;
    const transforms = {
      ...context.transforms,
      ...options?.transforms,
    } as K;
    if (!path) {
      throw new Error("Path is required");
    }
    return (imageOptions: ImageLoaderOptions) => {
      const params: string[] = [];
      if (imageOptions.width) {
        params.push("width" + optionSeparator + imageOptions.width);
      }

      if (imageOptions.height) {
        params.push("height" + optionSeparator + imageOptions.height);
      }
      urlResolver(path, transforms, imageOptions, params);
    };
  }

  function usePlaceholder(options?: T) {
    const context = useLoaderContext();
    const path = options?.path || context.path;
    const transforms = {
      ...context.placeholderTransforms,
      ...options?.transforms,
    } as K;
    if (!path) {
      throw new Error("Path is required");
    }
    return (imageOptions: ImageLoaderOptions) =>
      urlResolver(path, transforms, imageOptions);
  }
  return {
    LoaderProvider,
    loaderContext,
    useLoaderContext,
    useLoader,
    usePlaceholder,
  };
}

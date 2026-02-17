import { createContext, useContext } from "react";
import type { BaseGlobalLoaderOptions } from "./base-loader-options";
import type { ImageLoaderOptions } from "../types";

export type LoaderParamsResolver<K> = (options: {
  path: string;
  transforms: K;
  imageOptions: ImageLoaderOptions;
  params: string[];
  optionSeparator: string;
  paramSeparator: string;
}) => string[];

export type LoaderUrlResolved = (options: {
  imageOptions: ImageLoaderOptions;
  params: string;
  path: string;
}) => string;

export default function loaderFactory<K, T extends BaseGlobalLoaderOptions<K>>(
  defaults: T,
  config: {
    optionSeparator: string;
    paramSeparator: string;
  },
  paramsResolver: LoaderParamsResolver<K>,
  urlResolver: LoaderUrlResolved,
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

  const loader = (isPlaceholder: boolean) => (options?: T) => {
    const context = useLoaderContext();
    const path = options?.path || context.path;
    const defaultTransform = isPlaceholder
      ? context.placeholderTransforms
      : context.transforms;
    const transforms = {
      ...defaultTransform,
      ...options?.transforms,
    } as K;
    if (!path) {
      throw new Error("Path is required");
    }
    return (imageOptions: ImageLoaderOptions) => {
      const params: string[] = [];
      if (imageOptions.width) {
        params.push("width" + config.optionSeparator + imageOptions.width);
      }

      if (imageOptions.height) {
        params.push("height" + config.optionSeparator + imageOptions.height);
      }
      const resolvedParams = paramsResolver({
        path,
        transforms,
        imageOptions,
        params,
        optionSeparator: config.optionSeparator,
        paramSeparator: config.paramSeparator,
      }).join(config.paramSeparator);

      return urlResolver({
        imageOptions,
        params: resolvedParams,
        path,
      });
    };
  };

  const useLoader = loader(false);
  const usePlaceholder = loader(true);

  return {
    LoaderProvider,
    loaderContext,
    useLoaderContext,
    useLoader,
    usePlaceholder,
  };
}

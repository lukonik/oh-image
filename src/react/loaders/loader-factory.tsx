import { createContext, useContext } from "react";
import type {
  BaseGlobalLoaderOptions,
  BaseLoaderTransforms,
} from "./base-loader-options";
import type { ImageLoaderOptions } from "../types";
import { resolveTransform } from "./transforms-resolver";
import type {
  LoaderFactoryConfig,
  LoaderUrlResolved,
} from "./loader-factory-types";

export default function loaderFactory<
  K extends BaseLoaderTransforms,
  T extends BaseGlobalLoaderOptions<K>,
>(defaults: T, config: LoaderFactoryConfig, urlResolver: LoaderUrlResolved) {
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
      console.warn("Path is not provided");
      return () => undefined;
    }
    return (imageOptions: ImageLoaderOptions) => {
      const params: string[] = [];
      if (imageOptions.width) {
        params.push("width" + config.optionSeparator + imageOptions.width);
      }

      if (imageOptions.height) {
        params.push("height" + config.optionSeparator + imageOptions.height);
      }

      const resolvedTransforms = resolveTransform<K>(
        transforms,
        config,
      );

      const resolvedParams = [...params, ...resolvedTransforms].join(
        config.paramSeparator,
      );

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

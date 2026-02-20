import { createContext, useContext } from "react";
import type {
  BaseGlobalLoaderOptions,
  BaseLoaderTransforms,
} from "./base-loader-options";
import type { ImageLoaderOptions } from "../react/types";
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

  const loader = () => (options?: T) => {
    const context = useLoaderContext();
    const path = options?.path || context.path;

    if (!path) {
      console.warn("Path is not provided");
      return () => undefined;
    }
    return (imageOptions: ImageLoaderOptions) => {
      const defaultTransform = imageOptions.isPlaceholder
        ? context.placeholder
        : context.transforms;
      const optionTransforms = imageOptions.isPlaceholder
        ? options?.placeholder
        : options?.transforms;

      const params: string[] = [];
      const sizes: Record<string, number> = {};

      if (imageOptions.width) {
        const widthKey = config.widthKey ?? "width";
        sizes[widthKey] = imageOptions.width;
      }

      if (imageOptions.height) {
        const heightKey = config.heightKey ?? "height";
        sizes[heightKey] = imageOptions.height;
      }

      const transforms = {
        ...sizes,
        ...defaultTransform,
        ...optionTransforms,
      } as K;

      const resolvedTransforms = resolveTransform<K>(transforms, config);

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

  const useLoader = loader();

  return {
    LoaderProvider,
    loaderContext,
    useLoaderContext,
    useLoader,
  };
}

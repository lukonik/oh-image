import { createContext, useContext } from "react";
import type {
  BaseGlobalLoaderOptions,
  BaseLoaderTransforms,
} from "./base-loader-options";
import type { ImageLoaderOptions } from "../types";
import { resolveComplexTransforms } from "./image-loader-utils";

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

// orders: Record<any, string[]>;
//     customResolver?: Partial<
//       Record<
//         KnownKeys<T>,
//         (key: string, value: any) => string | undefined | null
//       >
//     >

export default function loaderFactory<
  K extends BaseLoaderTransforms,
  T extends BaseGlobalLoaderOptions<K>,
>(
  defaults: T,
  config: {
    optionSeparator: string;
    paramSeparator: string;
    orders?: any;
    customResolver?: any;
  },
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

      const resolvedParams = resolveComplexTransforms<K>(transforms, {
        optionSeparator: config.optionSeparator,
        orders: config.orders,
        customResolver: config.customResolver,
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

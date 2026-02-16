import { createContext, useContext } from "react";
import type { BaseGlobalLoaderOptions } from "../base-loader-options";

export default function loaderContextFactory<
  T extends BaseGlobalLoaderOptions<unknown>,
>(defaults: T) {
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

  return {
    LoaderProvider,
    loaderContext,
    useLoaderContext,
  };
}

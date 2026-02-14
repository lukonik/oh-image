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

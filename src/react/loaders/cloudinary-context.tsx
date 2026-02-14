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

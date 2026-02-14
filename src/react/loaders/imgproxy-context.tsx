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

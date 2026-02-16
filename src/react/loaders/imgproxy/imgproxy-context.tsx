import { createContext, useContext } from "react";
import type {
  ImgproxyGlobalOptions
} from "./imgproxy-options";

const ImgproxyContext = createContext<ImgproxyGlobalOptions>({
  transforms: {
    format: "webp",
  },
  placeholderTransforms: {
    quality: 10,
    format: "webp",
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
} & Partial<ImgproxyGlobalOptions>) {
  const ctx = useImgproxyContext();
  return (
    <ImgproxyContext.Provider value={{ ...ctx, ...props }}>
      {children}
    </ImgproxyContext.Provider>
  );
}

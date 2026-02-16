import { createContext, useContext } from "react";
import type {
  ImgproxyGlobalOptions,
  ImgproxyOptions,
} from "./imgproxy-options";

const ImgproxyContext = createContext<ImgproxyGlobalOptions>({
  path: "",
  placeholderTransforms: {
    quality: 10,
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
} & Partial<ImgproxyOptions>) {
  const ctx = useImgproxyContext();
  return (
    <ImgproxyContext.Provider value={{ ...ctx, ...props }}>
      {children}
    </ImgproxyContext.Provider>
  );
}

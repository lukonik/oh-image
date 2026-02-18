import { createContext, useContext } from "react";
import type { ImageProps } from "./types";
import type { ImageLoader } from "./types";

export interface ImageContextValue extends Pick<
  ImageProps,
  "loading" | "placeholder"
> {
  breakpoints: number[];
  loader: ImageLoader | null;
}

const ImageContext = createContext<ImageContextValue>({
  breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
  loading: "lazy",
  loader: null,
  placeholder: true,
});

export function useImageContext() {
  return useContext(ImageContext);
}

export function ImageProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & Partial<ImageContextValue>) {
  const ctx = useImageContext();
  return (
    <ImageContext.Provider value={{ ...ctx, ...props }}>
      {children}
    </ImageContext.Provider>
  );
}

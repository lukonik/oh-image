import type { ImageLoaderOptions } from "../../types";
import { createImgproxyUrl } from "./create-imgproxy-url";
import { useImgproxyContext } from "./imgproxy-context";
import type { ImgproxyOptions } from "./imgproxy-options";

export function useImgproxyLoader(options: ImgproxyOptions) {
  const context = useImgproxyContext();
  const resolvedOptions = {
    ...context,
    ...options,
  };
  return (imageOptions: ImageLoaderOptions) =>
    createImgproxyUrl(resolvedOptions, imageOptions);
}

import type { ImageLoaderOptions } from "../../types";
import { createImgproxyUrl } from "./create-imgproxy-url";
import { useImgproxyContext } from "./imgproxy-context";
import type { ImgproxyOptions } from "./imgproxy-options";

export function useImgproxyPlaceholder(options?: ImgproxyOptions) {
  const context = useImgproxyContext();
  const path = options?.path || context.path;
  const transforms = {
    ...context.placeholderTransforms,
    ...options?.transforms,
  };
  return (imageOptions: ImageLoaderOptions) =>
    createImgproxyUrl(path, transforms, imageOptions);
}

export { Image } from "./image";
export { useImgLoaded } from "./use-img-loaded";
export type {
  ImageProps,
  ImageLoaderOptions,
  ImageLoader,
  ImageSrcType,
} from "./types";

export { ImageProvider, useImageContext } from "./image-context";

/** Imgproxy exports */
export type {
  ImgproxyOptions,
  ImgproxyGlobalOptions,
  ImgproxyTransforms,
} from "./loaders/imgproxy/imgproxy-options";
export {
  useImgproxyContext,
  useImgproxyLoader,
  useImgproxyPlaceholder,
  ImgproxyLoaderProvider
} from "./loaders/imgproxy/imgproxy-loader";
export {
  type CloudflareLoaderOptions,
  useCloudflareContext,
  useCloudflareLoader,
  CloudflareLoaderProvider,
} from "./loaders/cloudflare-loader";

export {
  type CloudinaryLoaderOptions,
  useCloudinaryContext,
  useCloudinaryLoader,
  CloudinaryLoaderProvider,
} from "./loaders/cloudinary-loader";

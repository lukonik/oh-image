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
  ImgproxyLoaderProvider,
} from "./loaders/imgproxy/imgproxy-loader";

/** Cloudflare exports */
export type {
  CloudflareGlobalOptions,
  CloudflareOptions,
  CloudflareTransforms,
} from "./loaders/cloudflare/cloudflare-options";
export {
  useCloudflareContext,
  useCloudflarePlaceholder,
  useCloudflareLoader,
  CloudflareLoaderProvider,
} from "./loaders/cloudflare/cloudflare-loader";

export {
  type CloudinaryLoaderOptions,
  useCloudinaryContext,
  useCloudinaryLoader,
  CloudinaryLoaderProvider,
} from "./loaders/cloudinary-loader";

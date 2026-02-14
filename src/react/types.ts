import type { ImgHTMLAttributes } from "react";

export interface ImageLoaderOptions {
  src: string;
  width?: number | null | undefined;
  height?: number | null | undefined;
  isPlaceholder?: boolean;
}

export type ImageLoader = (options: ImageLoaderOptions) => string;

export type ImageSrcType = string | ImageSrc;

export interface ImageProps extends Partial<
  Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    | "fetchPriority"
    | "decoding"
    | "loading"
    | "srcSet"
    | "className"
    | "sizes"
    | "style"
  >
> {
  /** Alternative text for the image, required for accessibility. Use an empty string for decorative images. */
  alt: string;
  /** Configures the Image component to load the image immediately. */
  asap?: boolean;

  /** */
  src: ImageSrcType;

  /** The URL of the placeholder image to display while loading. */
  placeholderUrl?: string | undefined;

  /**
   * Sets the image to "fill mode", which eliminates the height/width requirement and adds
   * styles such that the image fills its containing element.
   */
  fill?: boolean;

  loader?: ImageLoader | null;

  width?: number | undefined;

  height?: number | undefined;

  breakpoints?: number[];
}

import type { ImgHTMLAttributes } from "react";

/**
 * Image source type - can be either a simple URL string or a full ImageSrc object
 */
type ImageSrcType = string | ImageSrc;

/**
 * Optimized image source with multiple responsive variants
 */
export interface ImageSrc {
  /** Original image width in pixels */
  width: number;
  /** Original image height in pixels */
  height: number;
  /** Optional low-quality placeholder image URL for blur-up effect */
  placeholderUrl?: string;
  /** Array of responsive image variants for different screen sizes */
  srcSets: string;
  /** Primary image source URL */
  src: string;
}


export interface ImageProps extends Partial<
  Pick<
    ImgHTMLAttributes<HTMLImageElement>,
    | "alt"
    | "fetchPriority"
    | "decoding"
    | "loading"
    | "height"
    | "width"
    | "srcSet"
    | "className"
    | "sizes"
    | "style"
  >
> {
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
}

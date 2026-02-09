import type { ImgHTMLAttributes } from "react";

type ImageSrcType = string | ImageSrc;

export interface ImageSrc {
  width: number;

  height: number;

  placeholderUrl?: string;

  srcSets: string;

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

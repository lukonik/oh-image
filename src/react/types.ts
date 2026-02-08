import type { CSSProperties } from "react";

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
  srcSets: ImageSrcSet[];
  /** Primary image source URL */
  src: string;
}

/**
 * Single responsive image variant in a srcset
 */
export interface ImageSrcSet {
  /** Width descriptor (e.g., "1920w") */
  width: string;
  /** Image URL for this variant */
  src: string;
}

/**
 * Props for the optimized Image component
 * Extends standard HTML image attributes with optimization features
 */
export interface ImageProps extends Partial<
  Pick<
    HTMLImageElement,
    | "alt"
    | "fetchPriority"
    | "decoding"
    | "loading"
    | "height"
    | "width"
    | "srcset"
    | "className"
    | "sizes"
  >
> {
  /** Load the image immediately, bypassing lazy loading */
  asap?: boolean;
  /** Image source - either a URL string or ImageSrc object with responsive variants */
  src: ImageSrcType;
  /** Override placeholder URL (takes precedence over ImageSrc.placeholderUrl) */
  placeholderUrl?: string | undefined;
  /** Enable blur-up placeholder effect during image loading */
  placeholder?: boolean;
  /** Inline CSS styles */
  style?: CSSProperties;
  /** Make image fill its container (position: absolute) */
  fill?: boolean;
}

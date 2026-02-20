import type { FormatEnum } from "sharp";

export interface ImageTransforms {
  /** Target width for the processed image in pixels */
  width?: number | null;

  /** Target height for the processed image in pixels */
  height?: number | null;

  /** Output format for the main image (e.g., 'webp', 'avif', 'png') */
  format?: keyof FormatEnum | null;

  /** Whether to generate a placeholder image for lazy loading */
  placeholder?: boolean;

  /** Breakpoints array - widths in pixels for responsive srcSet generation */
  breakpoints?: number[] | null;

  /** Blur the image */
  blur?: number | null;

  /** Flip the image vertically */
  flip?: boolean | null;

  /** Flop the image horizontally */
  flop?: boolean | null;

  /** Rotate the image */
  rotate?: number | null;

  /** Sharpen the image */
  sharpen?: number | null;

  /** Apply median filter */
  median?: number | null;

  /** Apply gamma correction */
  gamma?: number | null;

  /** Negate the image */
  negate?: boolean | null;

  /** Normalize the image */
  normalize?: boolean | null;

  /** Apply threshold */
  threshold?: number | null;
}

export type PlaceholderTransforms = Omit<
  ImageTransforms,
  "placeholder" | "breakpoints"
>;

export interface PluginConfig extends Required<
  Pick<ImageTransforms, "placeholder" | "breakpoints" | "format">
> {
  /** Directory name where processed images will be output during build */
  distDir: string;
}

export interface ImageEntry {
  origin: string;
  width?: number | null | undefined;
  height?: number | null | undefined;
  format?: keyof FormatEnum | null | undefined;
  // Transfroms
  blur?: number | null | undefined;
  flip?: boolean | null | undefined;
  flop?: boolean | null | undefined;
  rotate?: number | null | undefined;
  sharpen?: number | null | undefined;
  median?: number | null | undefined;
  gamma?: number | null | undefined;
  negate?: boolean | null | undefined;
  normalize?: boolean | null | undefined;
  threshold?: number | null | undefined;
}

export interface ImageSrc {
  width?: number | undefined;
  height?: number | undefined;
  src: string;
  srcSet?: string;
  placeholder?: string;
}

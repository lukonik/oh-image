import type { FormatEnum } from "sharp";

type PrefixedPlaceholderTransforms = {
  [K in keyof PlaceholderTransforms as `pl_${K & string}`]: PlaceholderTransforms[K];
};

export type ImageQueryParamsTransforms = ImageTransforms &
  PrefixedPlaceholderTransforms;

export type ImageTransforms = Partial<{
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

  /** Apply quality */
  quality?: number | null;
}>;

export type PlaceholderTransforms = Omit<
  ImageTransforms,
  "placeholder" | "breakpoints"
> & { show?: boolean };

export type PluginTransforms = Omit<ImageTransforms, "breakpoints">;
export type PluginPlaceholderTransforms = Omit<
  PlaceholderTransforms,
  "pl_show"
>;

export interface PluginConfig {
  distDir: string;
  transforms?: PluginTransforms;
  placeholder?: PluginPlaceholderTransforms;
  breakpoints?: number[];
  pl_show?: boolean;
}

export interface ImageEntry extends Partial<
  Omit<ImageTransforms, "breakpoints" | "placeholder">
> {
  origin: string;
}

export interface ImageSrc {
  width?: number | undefined;
  height?: number | undefined;
  src: string;
  srcSet?: string;
  placeholder?: string;
}

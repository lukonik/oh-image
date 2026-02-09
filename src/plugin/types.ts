import type { FormatEnum } from "sharp";

export interface PluginConfig extends Required<
  Pick<ImageOptions, "placeholder" | "bps" | "format">
> {
  /** Directory name where processed images will be output during build */
  distDir: string;
}

export interface ImageEntry {
  origin: string;
  blur?: number | null;
  width?: number | null | undefined;
  height?: number | null | undefined;
  format?: keyof FormatEnum | null;
}

export interface ImageOptions {
  /** Target width for the processed image in pixels */
  width?: number | null;

  /** Target height for the processed image in pixels */
  height?: number | null;

  /** Output format for the main image (e.g., 'webp', 'avif', 'png') */
  format?: keyof FormatEnum | null;

  /** Blur amount (true for default blur, or a number for sigma value) */
  blur?: number | boolean;

  /** Whether to generate a placeholder image for lazy loading */
  placeholder?: boolean;

  /** Breakpoints array - widths in pixels for responsive srcSet generation */
  bps?: number[];
}

export interface ImageSrc {
  /** Original width of the source image in pixels */
  width: number;
  /** Original height of the source image in pixels */
  height: number;
  /** URL to the placeholder image (if placeholder was enabled) */
  placeholderUrl?: string;
  /** Array of responsive image sources at different breakpoints */
  srcSets: string;
  /** URL to the main processed image */
  src: string;
}

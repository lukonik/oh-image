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
  format?: keyof FormatEnum | null | undefined;
}

export interface ImageOptions {
  /** Target width for the processed image in pixels */
  width?: number | null;

  /** Target height for the processed image in pixels */
  height?: number | null;

  /** Output format for the main image (e.g., 'webp', 'avif', 'png') */
  format?: keyof FormatEnum | null;

  /** Whether to generate a placeholder image for lazy loading */
  placeholder?: boolean;

  /** Breakpoints array - widths in pixels for responsive srcSet generation */
  bps?: number[];
}


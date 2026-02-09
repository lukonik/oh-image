import type { FormatEnum } from "sharp";

/**
 * Configuration options for the oh-image Vite plugin.
 * Extends ImageOptions with all properties required, plus plugin-specific settings.
 */
export interface PluginConfig extends Required<ImageOptions> {
  /** Directory name where processed images will be output during build */
  distDir: string;
}

/**
 * Represents a single image entry to be processed.
 * Used internally to track image transformations in the plugin.
 */
export interface ImageEntry extends Pick<
  ImageOptions,
  "width" | "height" | "format" | "blur"
> {
  /** Absolute path to the original source image file */
  origin: string;
}

/**
 * Options for image processing and transformation.
 * Can be passed via query parameters or plugin configuration.
 */
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
  /** Width of the placeholder image in pixels */
  placeholderW?: number;
  /** Height of the placeholder image in pixels */
  placeholderH?: number;
  /** Output format for the placeholder image */
  placeholderF?: keyof FormatEnum;
  /** Blur setting for the placeholder (true for default, or sigma value) */
  placeholderB: boolean | number;
  /** Breakpoints array - widths in pixels for responsive srcSet generation */
  bps?: number[];
  /** Output format for srcSet images */
  srcSetsF: keyof FormatEnum;
}

/**
 * The processed image source object returned by the plugin.
 * Contains all URLs and metadata needed for responsive image rendering.
 */
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

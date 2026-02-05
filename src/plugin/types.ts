import type { FormatEnum } from "sharp";

export interface ProcessedImage {
  src: string;
  blur?: string;
  width: number;
  height: number;
  srcSets: string[];
}

export interface OhImagePluginConfig extends OhImageOptions {
  cacheDir: string;
  distDir: string;
  prefix: string;
}

export interface OhImageOptions {
  size?: number;
  width?: number | undefined;
  height?: number | undefined;
  format?: keyof FormatEnum;
  blur?: boolean | number;
  srcSetFormat?: keyof FormatEnum;
  blurFormat?: keyof FormatEnum;
  breakpoints?: number[];
}

export interface ImageSrc {
  width: number;
  height: number;
  blurUrl?: string;
  srcSets: string[];
  src: string;
  format: keyof FormatEnum;
}

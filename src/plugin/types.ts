import type { FormatEnum } from "sharp";

export interface PluginConfig extends ImageOptions {
  distDir: string;
}

export interface ImageOptions {
  breakpoints?: number[];
  placeholder?: boolean;
  width?: number;
  height?: number;
  format?: keyof FormatEnum;
}

export interface ImageSrcSet {
  width: string;
  src: string;
}

export interface ImageSrc {
  width: number;
  height: number;
  placeholderUrl?: string;
  srcSets: ImageSrcSet[];
  src: string;
}

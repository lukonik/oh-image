import type { FormatEnum } from "sharp";

export interface PluginConfig extends ImageOptions {
  cacheDir: string;
  distDir: string;
}

export interface ImageOptions {
  breakpoints?: number[];
  blur?: boolean;
  width?: number;
  height?: number;
  format?: keyof FormatEnum;
}

export interface ImageSrc {
  width: number;
  height: number;
  blurUrl?: string;
  srcSets: string[];
  src: string;
  format: keyof FormatEnum;
}

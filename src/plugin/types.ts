import type { FormatEnum } from "sharp";

export interface ProcessedImage {
  src: string;
  blur?: string;
  width: number;
  height: number;
  srcSets: string[];
}

export interface PluginConfig {
  cacheDir: string;
  distDir: string;
  breakpoints?: number[];
  blur?: boolean;
}

export interface ImageSrc {
  width: number;
  height: number;
  blurUrl?: string;
  srcSets: string[];
  src: string;
  format: keyof FormatEnum;
}

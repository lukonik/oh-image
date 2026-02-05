import type { FormatEnum } from "sharp";

export interface ProcessedImage {
  src: string;
  blur?: string;
  width: number;
  height: number;
  srcSets: string[];
}

export interface OhImageConfig {
  format?: keyof FormatEnum;
  quality?: number;
  blur?: boolean | number;
  blurResize?: number;
}

export interface OhImagePluginConfig extends OhImageConfig {
  cacheDir?: string;
  cachePrefix?: string;
  blurFormat: keyof FormatEnum;
  distDir?: string;
}

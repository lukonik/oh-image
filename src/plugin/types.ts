import type { FormatEnum } from "sharp";

export interface ProcessedImage {
  src: string;
  blur?: string;
  width: number;
  height: number;
  srcSets: string[];
}

export interface OhImagePluginConfig {
  cacheDir: string;
  distDir: string;
  prefix: string;
}

export interface OhImageOptions {
  size?: number;
  width?: number;
  height?: number;
  format?: keyof FormatEnum;
  blur?: boolean | number;
}

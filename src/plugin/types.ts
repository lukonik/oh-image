import type { FormatEnum } from "sharp";

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

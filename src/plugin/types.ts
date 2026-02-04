import type { FormatEnum } from "sharp";

export interface OhImageConfig {
  format?: keyof FormatEnum;
  quality?: number;
  blur?: boolean | number;
  blurResize?: number;
}

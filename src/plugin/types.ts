import type { FormatEnum } from "sharp";

export interface PluginConfig extends Required<ImageOptions> {
  distDir: string;
}

export interface ImageEntry extends Pick<
  ImageOptions,
  "width" | "height" | "format" | "blur"
> {
  origin: string;
}

export interface ImageOptions {
  width?: number | null;
  height?: number | null;
  format?: keyof FormatEnum | null;
  blur?: number | boolean;
  placeholder?: boolean;
  placeholderW?: number;
  placeholderH?: number;
  placeholderF?: keyof FormatEnum;
  placeholderB: boolean | number;
  bps?: number[];
  srcSetsF: keyof FormatEnum;
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

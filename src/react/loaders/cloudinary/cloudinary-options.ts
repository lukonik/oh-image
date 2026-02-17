import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
  BaseLoaderTransforms,
} from "../base-loader-options";

export interface CloudinaryTransforms extends BaseLoaderTransforms {
  anim?: boolean;
  background?: string;
  blur?: number;
  brightness?: number;
  compression?: boolean;
  contrast?: number;
  dpr?: number;
  dprs?: number[];
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  format?: "auto" | "avif" | "webp" | "json";
  gamma?: number;
  gravity?: "auto" | "left" | "right" | "top" | "bottom" | string;
  height?: number;
  width?: number;
  widths?: number[];
  maxWidth?: number;
  metadata?: "keep" | "copyright" | "none";
  quality?: number;
  rotate?: number;
  sharpen?: number;
  trim?: string;
  redirectOnError?: boolean;
}

export type CloudinaryOptions = BaseLoaderOptions<CloudinaryTransforms>;
export type CloudinaryGlobalOptions =
  BaseGlobalLoaderOptions<CloudinaryTransforms>;

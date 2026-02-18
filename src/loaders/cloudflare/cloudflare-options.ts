import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
  BaseLoaderTransforms,
} from "../base-loader-options";

export type CloudflareTransforms = BaseLoaderTransforms &
  Partial<{
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
  }>;

export type CloudflareOptions = BaseLoaderOptions<CloudflareTransforms>;
export type CloudflareGlobalOptions =
  BaseGlobalLoaderOptions<CloudflareTransforms>;

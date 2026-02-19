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
    compression?: "fast";
    contrast?: number;
    dpr?: number;
    dprs?: number[];
    flip?: "h" | "v" | "hv";
    fit?: "scale-down" | "contain" | "cover" | "crop" | "pad" | "squeeze";
    format?: "auto" | "avif" | "webp" | "jpeg" | "baseline-jpeg";
    gamma?: number;
    gravity?: "auto" | "left" | "right" | "top" | "bottom" | string;
    height?: number;
    width?: number;
    widths?: number[];
    maxWidth?: number;
    metadata?: "keep" | "copyright" | "none";
    quality?: number | "high" | "medium-high" | "medium-low" | "low";
    rotate?: number;
    sharpen?: number;
    trim?: string;
    onerror: "redirect";
  }>;

export type CloudflareOptions = BaseLoaderOptions<CloudflareTransforms>;
export type CloudflareGlobalOptions =
  BaseGlobalLoaderOptions<CloudflareTransforms>;

import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type NetlifyTransforms = Partial<{
  w: number;
  h: number;
  fit: "contain" | "cover" | "fill";
  position: "top" | "bottom" | "left" | "right" | "center";
  fm: "avif" | "webp" | "jpg" | "png" | "gif" | "blurhash";
  q: number;
}>;

export type NetlifyOptions = BaseLoaderOptions<NetlifyTransforms>;
export type NetlifyGlobalOptions = BaseGlobalLoaderOptions<NetlifyTransforms>;

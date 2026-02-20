import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type NetlifyTransforms = Partial<{
  w: number;
  h: number;
  fit: "cover" | "contain" | "fill" | "inside" | "outside";
  fm: "avif" | "webp" | "jpg" | "png" | "gif" | "blurhash";
  q: number;
  position:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right";
}>;

export type NetlifyOptions = BaseLoaderOptions<NetlifyTransforms>;
export type NetlifyGlobalOptions = BaseGlobalLoaderOptions<NetlifyTransforms>;

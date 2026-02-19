import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type ContentfulTransforms = Partial<{
  /**
   * convert the image to a specific format
   */
  fm: "jpg" | "png" | "webp" | "gif" | "avif" | "tiff";

  /**
   * converts image format to specific type
   * progressive: for jpg image
   * png8: for png image
   */
  fl: "progressive" | "png8";

  /** width of the image */
  w: number;

  /** height of the image */
  h: number;

  /** resizing behavior */
  fit: "pad" | "fill" | "scale" | "crop" | "thumb";

  /** focus area */
  f:
    | "center"
    | "top"
    | "right"
    | "left"
    | "bottom"
    | "top_right"
    | "top_left"
    | "bottom_right"
    | "bottom_left"
    | "face";

  /** corner radius */
  r: number | "max";

  /** quality of image */
  q: number;

  /** background color */
  bg: string;
}>;

export type ContentfulOptions = BaseLoaderOptions<ContentfulTransforms>;
export type ContentfulGlobalOptions =
  BaseGlobalLoaderOptions<ContentfulTransforms>;

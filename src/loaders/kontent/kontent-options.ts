import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type KontentTransforms = Partial<{
  /** Resize the width of the image in pixels. */
  w?: number;

  /** Resize the height of the image in pixels. */
  h?: number;

  /** Serve correctly sized images for devices that expose a device pixel ratio. */
  dpr?: number;

  /** Set how the image will fit within the size bounds provided. */
  fit?:
    | "clamp"
    | "clip"
    | "crop"
    | "facearea"
    | "fill"
    | "fillmax"
    | "max"
    | "min"
    | "scale";

  /** * Select a sub-region of the source image to use for processing.
   * Expected format: "x,y,width,height"
   */
  rect?: [number, number, number, number];

  /** * Focal point crop: Choose the point of interest (x, y coordinates and zoom).
   * fp-x and fp-y are typically 0.0 to 1.0.
   */
  "fp-x"?: number;
  "fp-y"?: number;
  "fp-z"?: number;

  smart?: boolean | "face" | "edges" | "objects";

  /** Fill transparent areas of the image with the specified color (e.g., 'FFF' or 'red'). */
  bg?: string;

  /** Specify the output format to convert the image to. */
  fm?: "webp" | "jpg" | "png" | "gif" | "avif" | "jp2";

  /** Optimize image compression (1-100) for lossy formats. */
  q?: number;

  /** Enable delivery of lossless images in supported formats. */
  lossless?: boolean;

  /** Automatic delivery of optimized formats like WebP based on browser support. */
  auto?: "format" | "compress" | "enhance";
}>;

export type KontentOptions = BaseLoaderOptions<KontentTransforms>;
export type KontentGlobalOptions = BaseGlobalLoaderOptions<KontentTransforms>;

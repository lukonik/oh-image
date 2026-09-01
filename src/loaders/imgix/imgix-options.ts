import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type ImgixFormat =
  | "jpeg"
  | "jpg"
  | "png"
  | "webp"
  | "avif"
  | "gif"
  | "json"
  | "mp4"
  | "webm"
  | "pjpg"
  | "jp2"
  | "jxr"
  | "png8"
  | "png32"
  | "blurhash";

export type ImgixAuto = "true" | "format" | "compress" | "enhance" | "redeye";

export type ImgixTransforms = Partial<{
  /** Width of the image in pixels */
  w?: number;

  /** Height of the image in pixels */
  h?: number;

  /**
   * Aspect ratio, defined as width:height (e.g. "16:9")
   */
  ar?: string;

  /**
   * Fit mode to use when resizing
   */
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

  /**
   * Crop mode to use when resizing (e.g. "top,left", "faces", "entropy")
   */
  crop?: string;

  /**
   * Device pixel ratio
   */
  dpr?: number;

  /**
   * Quality level (1-100)
   */
  q?: number;

  /**
   * Output format for the image
   */
  fm?: ImgixFormat;

  /**
   * Automatic optimizations to apply (e.g. "format,compress")
   */
  auto?:
    | ImgixAuto
    | `${ImgixAuto},${ImgixAuto}`
    | `${ImgixAuto},${ImgixAuto},${ImgixAuto}`
    | `${ImgixAuto},${ImgixAuto},${ImgixAuto},${ImgixAuto}`
    | (string & {});

  /**
   * Contrast adjustment (-100 to 100)
   */
  con?: number;

  /**
   * Exposure adjustment (-100 to 100)
   */
  exp?: number;

  /**
   * Saturation adjustment (-100 to 100)
   */
  sat?: number;

  /**
   * Blur radius (0.5 to 2000)
   */
  blur?: number;

  /**
   * Sharpening amount (0 to 100)
   */
  sharp?: number;

  /**
   * Sepia tone effect (0 to 100)
   */
  sepia?: number;

  /**
   * Background color in RGB/Hex or color keyword (e.g. "fff", "red")
   */
  bg?: string;

  /**
   * Border size and color (e.g. "10px,red")
   */
  border?: string;

  /**
   * Text overlay string
   */
  txt?: string;

  /**
   * Font for text overlay
   */
  txtFont?: string;

  /**
   * Color of text overlay
   */
  txtColor?: string;

  /**
   * Font size for text overlay
   */
  txtSize?: number;

  /**
   * Alignment for text overlay
   */
  txtAlign?: "center" | "left" | "right";

  /**
   * Watermark image URL
   */
  mark?: string;

  /**
   * Watermark transparency level (0-100)
   */
  markAlpha?: number;

  /**
   * Rotation angle (degrees)
   */
  rot?: number;

  /**
   * Flip mode ("h", "v", or "hv")
   */
  flip?: "h" | "v" | "hv";

  /**
   * Gaussian blur radius
   */
  gaussblur?: number;

  /**
   * Noise reduction amount
   */
  noise?: number;

  /**
   * Strip image metadata (EXIF, etc.)
   */
  strip?: boolean;

  /**
   * Select a sub-region of the source image [x, y, width, height]
   */
  rect?: [number, number, number, number];

  /**
   * Focal point X coordinate (0.0 to 1.0)
   */
  "fp-x"?: number;

  /**
   * Focal point Y coordinate (0.0 to 1.0)
   */
  "fp-y"?: number;

  /**
   * Focal point zoom level (1.0 to 10.0)
   */
  "fp-z"?: number;

  /**
   * Lossless compression mode
   */
  lossless?: boolean;

  /**
   * Invert image colors
   */
  invert?: boolean;

  /**
   * Gamma correction (-100 to 100)
   */
  gam?: number;
}>;

export type ImgixOptions = BaseLoaderOptions<ImgixTransforms>;
export type ImgixGlobalOptions = BaseGlobalLoaderOptions<ImgixTransforms>;

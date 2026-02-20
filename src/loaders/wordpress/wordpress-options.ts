import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
} from "../base-loader-options";

export type WordpressTransforms = Partial<{
  /* image width in pixels */
  w: number;

  /* image height in pixels */
  h: number;

  /* crop mode; accepts number values as percentages or, string values as pixels, example:160px */
  crop: [number | string, number | string, number | string, number | string];

  /* resize to exact dimensions, e.g. "300,200" */
  resize: [number, number];

  /* fit image within dimensions, e.g. "300,200" */
  fit: [number, number];

  /* Add black letterboxing effect to images */
  lb: [number, number];

  /* Remove black letterboxing effect from images with ulb */
  ulb: boolean;

  /* The filter parameter is used to apply one of multiple filters */
  filter:
    | "negate"
    | "grayscale"
    | "sepia"
    | "edgedetect"
    | "emboss"
    | "blurgaussian"
    | "blurselective"
    | "meanremoval";

  /* Adjust the brightness of an image */
  brightness: number;

  /* Adjust the contrast of an image */
  contrast: number;

  /* Add color hues to an image with colorize by passing a comma separated list of red, green, and blue (RGB) */
  colorize: [number, number, number];

  /* The smooth parameter can be used to smooth out the image. */
  smooth: number;

  /*  zoom the image. */
  zoom: number;

  /* the quality output of the images */
  quality: number;

  /* parameter to control whether the Image CDN may serve a lossy-compressed version of an image */
  allow_lossy: 1;

  /* strip image metadata */
  strip: "all" | "none";
}>;

export type WordpressOptions = BaseLoaderOptions<WordpressTransforms>;
export type WordpressGlobalOptions =
  BaseGlobalLoaderOptions<WordpressTransforms>;

export const imgproxy = {
  slug: "imgproxy",
  name: "Imgproxy",
  title: "Imgproxy Loader",
  link: "https://docs.imgproxy.net/",
  defaults: `
  {
    transforms: {
      format: "webp",
    },
    placeholderTransforms: {
      quality: 10,
      format: "webp",
    },
  },
  `,
  interface: `type ResizeType = "fit" | "fill" | "fill-down" | "force" | "auto";
type ResizeAlgorithm = "nearest" | "linear" | "cubic" | "lanczos2" | "lanczos3";
type GravityType =
  | "no"
  | "so"
  | "ea"
  | "we"
  | "noea"
  | "nowe"
  | "soea"
  | "sowe"
  | "ce";

interface ResizeOptions {
  resizing_type?: ResizeType;
  width?: number;
  height?: number;
  enlarge?: boolean;
  extend?: boolean;
}

interface SizeOptions {
  width?: number;
  height?: number;
  enlarge?: boolean;
  extend?: boolean;
}

interface ExtendOptions {
  extend?: boolean;
  gravity?: GravityType;
}

interface GravityOptions {
  type: GravityType;
  x_offset?: number;
  y_offset?: number;
}

interface CropOptions {
  width: number;
  height: number;
  gravity?: GravityType;
}

interface TrimOptions {
  threshold: number;
  color?: string;
  equal_hor?: boolean;
  equal_ver?: boolean;
}

interface PaddingOptions {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface BackgroundOptions {
  r: number;
  g: number;
  b: number;
}

interface AdjustOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

interface BlurDetectionsOptions {
  sigma: number;
  class_names: string[];
}

interface DrawDetectionsOptions {
  draw: boolean;
  class_names: string[];
}

interface WatermarkOptions {
  opacity: number;
  position?: GravityType | "re";
  x_offset?: number;
  y_offset?: number;
  scale?: number;
}

interface WatermarkSizeOptions {
  width: number;
  height: number;
}

interface UnsharpeningOptions {
  mode?: string;
  weight?: number;
  dividor?: number;
}

interface AutoqualityOptions {
  method?: string;
  target?: number;
  min_quality?: number;
  max_quality?: number;
  allowed_error?: number;
}

interface JpegOptions {
  progressive?: boolean;
  no_subsample?: boolean;
  trellis_quant?: boolean;
  overshoot_deringing?: boolean;
  optimize_scans?: boolean;
  quant_table?: number;
}

interface PngOptions {
  interlaced?: boolean;
  quantize?: boolean;
  quantization_colors?: number;
}

export interface ImgproxyTransforms {
  resize?: ResizeOptions;
  size?: SizeOptions;
  resizing_type?: ResizeType;
  resizing_algorithm?: ResizeAlgorithm;
  width?: number;
  height?: number;
  "min-width"?: number;
  "min-height"?: number;
  zoom?: number | { x: number; y: number };
  dpr?: number;
  enlarge?: boolean;
  extend?: boolean | ExtendOptions;
  gravity?: GravityOptions;
  crop?: CropOptions;
  trim?: TrimOptions;
  padding?: PaddingOptions;
  auto_rotate?: boolean;
  rotate?: number;
  background?: string | BackgroundOptions;
  background_alpha?: number;
  adjust?: AdjustOptions;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  blur?: number;
  sharpen?: number;
  pixelate?: number;
  unsharpening?: UnsharpeningOptions;
  blur_detections?: BlurDetectionsOptions;
  draw_detections?: DrawDetectionsOptions;
  watermark?: WatermarkOptions;
  watermark_url?: string;
  watermark_text?: string;
  watermark_size?: WatermarkSizeOptions;
  style?: string;
  strip_metadata?: boolean;
  keep_copyright?: boolean;
  strip_color_profile?: boolean;
  enforce_thumbnail?: boolean;
  return_attachment?: boolean;
  quality?: number;
  format_quality?: Record<string, number>;
  autoquality?: AutoqualityOptions;
  max_bytes?: number;
  jpeg_options?: JpegOptions;
  png_options?: PngOptions;
  format?: string;
  page?: number;
  video_thumbnail_second?: number;
  fallback_image_url?: string;
  skip_processing?: string[];
  cachebuster?: string;
  expires?: number;
  filename?: string;
  preset?: string[];
}`,
};

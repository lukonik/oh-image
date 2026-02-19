import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
  BaseLoaderTransforms,
} from "../base-loader-options";

type ResizeType = "fit" | "fill" | "fill-down" | "force" | "auto";
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
  gravity?: GravityOptions;
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
  class_names?: string[];
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

export type ImgproxyTransforms = BaseLoaderTransforms &
  Partial<{
    /**
     * Defines the resizing type, width, height, enlarge, and extend.
     * All arguments are optional and can be omitted to use their default values.
     */
    resize: ResizeOptions;

    /**
     * Defines the width, height, enlarge, and extend.
     * All arguments are optional and can be omitted to use their default values.
     */
    size: SizeOptions;

    /**
     * Defines how imgproxy will resize the source image.
     * Default: fit
     */
    resizing_type: ResizeType;

    /**
     * Defines the algorithm that imgproxy will use for resizing.
     * Default: lanczos3
     */
    resizing_algorithm: ResizeAlgorithm;

    /**
     * Defines the width of the resulting image.
     * Default: 0
     */
    width: number;

    /**
     * Defines the height of the resulting image.
     * Default: 0
     */
    height: number;

    /**
     * Defines the minimum width of the resulting image.
     * Default: 0
     */
    "min-width": number;

    /**
     * Defines the minimum height of the resulting image.
     * Default: 0
     */
    "min-height": number;

    /**
     * When set, imgproxy will multiply the image dimensions according to these factors.
     * Default: 1
     */
    zoom: number | { x: number; y: number };

    /**
     * When set, imgproxy will multiply the image dimensions according to this factor for HiDPI (Retina) devices.
     * Default: 1
     */
    dpr: number;

    /**
     * When set to true, imgproxy will enlarge the image if it is smaller than the given size.
     * Default: false
     */
    enlarge: boolean;

    /**
     * When set to true, imgproxy will extend the image if it is smaller than the given size.
     * Can also specify gravity.
     * Default: false:ce:0:0
     */
    extend: boolean | ExtendOptions;

    /**
     * When imgproxy needs to cut some parts of the image, it is guided by the gravity option.
     * Default: ce:0:0
     */
    gravity: GravityOptions;

    /**
     * Defines an area of the image to be processed (crop before resize).
     */
    crop: CropOptions;

    /**
     * Removes surrounding background.
     */
    trim: TrimOptions;

    /**
     * Defines padding size.
     */
    padding: PaddingOptions;

    /**
     * When set to true, imgproxy will automatically rotate images based on the EXIF Orientation parameter.
     */
    auto_rotate: boolean;

    /**
     * Rotates the image on the specified angle.
     * Default: 0
     */
    rotate: number;

    /**
     * When set, imgproxy will fill the resulting image background with the specified color.
     * Default: disabled
     */
    background: string | BackgroundOptions;

    /**
     * Adds an alpha channel to background.
     * Default: 1
     */
    background_alpha: number;

    /**
     * Defines the brightness, contrast, and saturation.
     */
    adjust: AdjustOptions;

    /**
     * When set, imgproxy will adjust brightness of the resulting image.
     * Default: 0
     */
    brightness: number;

    /**
     * When set, imgproxy will adjust the contrast of the resulting image.
     * Default: 1
     */
    contrast: number;

    /**
     * When set, imgproxy will adjust saturation of the resulting image.
     * Default: 1
     */
    saturation: number;

    /**
     * When set, imgproxy will apply a gaussian blur filter to the resulting image.
     * Default: disabled
     */
    blur: number;

    /**
     * When set, imgproxy will apply the sharpen filter to the resulting image.
     * Default: disabled
     */
    sharpen: number;

    /**
     * When set, imgproxy will apply the pixelate filter to the resulting image.
     * Default: disabled
     */
    pixelate: number;

    /**
     * Allows redefining unsharpening options.
     */
    unsharpening: UnsharpeningOptions;

    /**
     * imgproxy detects objects of the provided classes and blurs them.
     */
    blur_detections: BlurDetectionsOptions;

    /**
     * When draw is set to true, imgproxy detects objects of the provided classes and draws their bounding boxes.
     */
    draw_detections: DrawDetectionsOptions;

    /**
     * Places a watermark on the processed image.
     * Default: disabled
     */
    watermark: WatermarkOptions;

    /**
     * When set, imgproxy will use the image from the specified URL as a watermark.
     * Default: blank
     */
    watermark_url: string;

    /**
     * When set, imgproxy will generate an image from the provided text and use it as a watermark.
     * Default: blank
     */
    watermark_text: string;

    /**
     * Defines the desired width and height of the watermark.
     * Default: 0:0
     */
    watermark_size: WatermarkSizeOptions;

    /**
     * When set, imgproxy will prepend a <style> node with the provided content to the <svg> node.
     * Default: blank
     */
    style: string;

    /**
     * When set to true, imgproxy will strip the metadata (EXIF, IPTC, etc.) on JPEG and WebP output images.
     */
    strip_metadata: boolean;

    /**
     * When set to true, imgproxy will not remove copyright info while stripping metadata.
     */
    keep_copyright: boolean;

    /**
     * When set to true, imgproxy will transform the embedded color profile (ICC) to sRGB and remove it from the image.
     */
    strip_color_profile: boolean;

    /**
     * When set to true and the source image has an embedded thumbnail, imgproxy will always use the embedded thumbnail.
     */
    enforce_thumbnail: boolean;

    /**
     * When set to true, imgproxy will return attachment in the Content-Disposition header.
     */
    return_attachment: boolean;

    /**
     * Redefines quality of the resulting image, as a percentage.
     * Default: 0
     */
    quality: number;

    /**
     * Adds or redefines IMGPROXY_FORMAT_QUALITY values.
     */
    format_quality: Record<string, number>;

    /**
     * Redefines autoquality settings.
     */
    autoquality: AutoqualityOptions;

    /**
     * When set, imgproxy automatically degrades the quality of the image until the image size is under the specified amount of bytes.
     * Default: 0
     */
    max_bytes: number;

    /**
     * Allows redefining JPEG saving options.
     */
    jpeg_options: JpegOptions;

    /**
     * Allows redefining PNG saving options.
     */
    png_options: PngOptions;

    /**
     * Specifies the resulting image format.
     * Default: jpg
     */
    format: string;

    /**
     * When a source image supports pagination or animation, this option allows specifying the page to use it on.
     * Default: 0
     */
    page: number;

    /**
     * Allows redefining IMGPROXY_VIDEO_THUMBNAIL_SECOND config.
     */
    video_thumbnail_second: number;

    /**
     * You can use a custom fallback image by specifying its URL.
     * Default: blank
     */
    fallback_image_url: string;

    /**
     * When set, imgproxy will skip the processing of the listed formats.
     * Default: empty
     */
    skip_processing: string[];

    /**
     * Cache buster doesn't affect image processing but its changing allows for bypassing the CDN, proxy server and browser cache.
     * Default: empty
     */
    cachebuster: string;

    /**
     * When set, imgproxy will check the provided unix timestamp and return 404 when expired.
     * Default: empty
     */
    expires: number;

    /**
     * Defines a filename for the Content-Disposition header.
     * Default: empty
     */
    filename: string;

    /**
     * Defines a list of presets to be used by imgproxy.
     * Default: empty
     */
    preset: string[];

    dpi: number;
  }>;

export type ImgproxyOptions = BaseLoaderOptions<ImgproxyTransforms>;
export type ImgproxyGlobalOptions = BaseGlobalLoaderOptions<ImgproxyTransforms>;

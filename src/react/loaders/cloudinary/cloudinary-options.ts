import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
  BaseLoaderTransforms,
} from "../base-loader-options";

type BACKGROUND_MODE =
  | "border"
  | "predominant"
  | "border_contrast"
  | "predominant_contrast"
  | "predominant_gradient"
  | "predominant_gradient_contrast"
  | "border_gradient"
  | "border_gradient_contrast";

type ANGLE_MODE = "vflip" | "hflip" | "ignore" | "auto_right" | "auto_left";

type CROP_MODE =
  | "auto"
  | "auto_pad"
  | "crop"
  | "fill"
  | "fill_pad"
  | "fit"
  | "imagga_crop"
  | "imagga_scale"
  | "lfill"
  | "limit"
  | "lpad"
  | "mfit"
  | "mpad"
  | "pad"
  | "scale"
  | "thumb";

type COLOR_SPACE =
  | "sRGB"
  | "tinysrgb"
  | "cmyk"
  | "no_cmyk"
  | "keep_cmyk"
  | "truecolor";

type ART_FILTER =
  | "al_dente"
  | "athena"
  | "audrey"
  | "aurora"
  | "daguerre"
  | "eucalyptus"
  | "fes"
  | "frost"
  | "hairspray"
  | "hokusai"
  | "incognito"
  | "linen"
  | "peacock"
  | "primavera"
  | "quartz"
  | "red_rock"
  | "refresh"
  | "sizzle"
  | "sonnet"
  | "ukulele"
  | "zorro";

type FORMAT_TYPE =
  | "3ds" // 3DS Max
  | "ai" // Adobe Illustrator
  | "avif" // AVIF Image
  | "bmp" // Bitmap
  | "bw" // Browzwear
  | "djvu" // DjVu
  | "dng" // Digital Negative
  | "eps" // Encapsulated PostScript
  | "fbx" // Filmbox 3D
  | "flif" // Free Lossless Image Format
  | "gif" // GIF (Static & Animated)
  | "glb" // Binary glTF
  | "gltf" // GL Transmission Format
  | "heif" // High Efficiency Image File
  | "heic" // High Efficiency Image Coding
  | "ico" // Icon
  | "indd" // Adobe InDesign
  | "jp2" // JPEG 2000
  | "jpg" // JPEG
  | "jpeg" // JPEG
  | "jxl" // JPEG XL
  | "obj" // Wavefront OBJ
  | "pdf" // Portable Document Format
  | "ply" // Polygon File Format
  | "png" // Portable Network Graphics
  | "psd" // Photoshop Document
  | "raw" // Generic Raw (arw, cr2, cr3)
  | "svg" // Scalable Vector Graphics
  | "tga" // Truevision TGA
  | "tif" // Tagged Image File Format
  | "tiff" // Tagged Image File Format
  | "u3ma" // Fabric file
  | "usdz" // Universal Scene Description
  | "wdp" // JPEG XR
  | "webp"; // WebP (Static & Animated)
export interface CloudinaryTransforms extends BaseLoaderTransforms {
  a?: number | ANGLE_MODE | string;
  mode?: string; //TODO
  ar?: string | number;
  b?: string;
  b_auto?: {
    mode: BACKGROUND_MODE;
    number: number;
    direction: string;
    color: string;
  };
  b_gen_fill?: {
    prompt: string;
    seed: number;
  };
  bl?: string;
  c?: CROP_MODE;
  co?: COLOR_SPACE;
  d?: string;
  dn?: number;
  dpr?: number | "auto";
  e_accelerate?: number | boolean;
  e_adv_redeye?: boolean;
  anti_removal?: number | boolean;
  art?: ART_FILTER;
  e_auto_brightness?: boolean | number;
  e_auto_color?: boolean | number;
  e_auto_contrast?: boolean | number;
  e_auto_enhance?: boolean | number;
  f?: FORMAT_TYPE;
  w?: number;
  h?: number;
  z?: number;
}

export type CloudinaryOptions = BaseLoaderOptions<CloudinaryTransforms>;
export type CloudinaryGlobalOptions =
  BaseGlobalLoaderOptions<CloudinaryTransforms>;

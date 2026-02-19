import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
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

export type CloudinaryTransforms = Partial<{
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
  bo?: string;
  c?: CROP_MODE;
  co?: string;
  cs?: COLOR_SPACE;
  d?: string;
  dl?: number | string;
  dn?: number;
  dpr?: number | "auto";
  du?: number | string;
  e?: string;
  e_accelerate?: number | boolean;
  e_adv_redeye?: boolean;
  anti_removal?: number | boolean;
  art?: ART_FILTER;
  e_art?: ART_FILTER;
  e_auto_brightness?: boolean | number;
  e_auto_color?: boolean | number;
  e_auto_contrast?: boolean | number;
  e_auto_enhance?: boolean | number;
  e_background_removal?: boolean | string;
  e_blur?: number | boolean;
  e_blur_faces?: number | boolean;
  e_blur_region?: number | boolean;
  e_brightness?: number | boolean;
  e_cartoonify?: number | string;
  e_colorize?: number | boolean;
  e_contrast?: number | boolean;
  e_distort?: string;
  e_drop_shadow?: number | string;
  e_gamma?: number | boolean;
  e_gradient_fade?: number | boolean;
  e_grayscale?: boolean;
  e_hue?: number | boolean;
  e_improve?: boolean | string;
  e_make_transparent?: number | string;
  e_negate?: boolean;
  e_oil_paint?: number | boolean;
  e_pixelate?: number | boolean;
  e_pixelate_faces?: number | boolean;
  e_pixelate_region?: number | boolean;
  e_redeye?: boolean;
  e_saturation?: number | boolean;
  e_screen?: boolean;
  e_sepia?: number | boolean;
  e_shadow?: number | string;
  e_sharpen?: number | boolean;
  e_shear?: string;
  e_simulate_colorblind?: string;
  e_tint?: string;
  e_trim?: number | string;
  e_unsharp_mask?: number | string;
  e_vectorize?: number | string;
  e_vignette?: number | boolean;
  e_volume_mute?: boolean;
  eo?: number | string;
  f?: FORMAT_TYPE;
  fl?: string | string[];
  g?: string;
  h?: number;
  l?: string;
  o?: number | string;
  p?: string;
  pg?: number | string;
  q?: number | "auto" | string;
  r?: number | "max" | string;
  so?: number | string;
  u?: string;
  w?: number;
  x?: number | string;
  y?: number | string;
  z?: number;
}>;

export type CloudinaryOptions = BaseLoaderOptions<CloudinaryTransforms>;
export type CloudinaryGlobalOptions =
  BaseGlobalLoaderOptions<CloudinaryTransforms>;

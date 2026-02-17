import {
  type CloudinaryTransforms,
  type CloudinaryGlobalOptions,
} from "./cloudinary-options";
import loaderFactory from "../loader-factory";
import { resolveComplexTransforms } from "../image-loader-utils";

function customResolver(key: string, value: any) {
  if (typeof value === "boolean") {
    return value ? key : undefined;
  }
  return `${key}:${value}`;
}

export const {
  useLoaderContext: useCloudinaryContext,
  LoaderProvider: CloudinaryLoaderProvider,
  useLoader: useCloudinaryLoader,
  usePlaceholder: useCloudinaryPlaceholder,
} = loaderFactory<CloudinaryTransforms, CloudinaryGlobalOptions>(
  {
    transforms: {
      f: "webp",
    },
    placeholderTransforms: {
      q: 10,
      f: "webp",
    },
  },
  {
    optionSeparator: "_",
    paramSeparator: ",",
  },
  ({ transforms, optionSeparator }) =>
    resolveComplexTransforms<CloudinaryTransforms>(transforms, {
      optionSeparator: optionSeparator,
      orders: {
        b_auto: ["mode", "number", "direction", "color"],
        b_gen_fill: ["prompt", "seed"],
      },
      customResolver: {
        art: customResolver,
        e_accelerate: customResolver,
        e_adv_redeye: customResolver,
        e_art: customResolver,
        e_auto_brightness: customResolver,
        e_auto_color: customResolver,
        e_auto_contrast: customResolver,
        e_auto_enhance: customResolver,
        e_background_removal: customResolver,
        e_blur: customResolver,
        e_blur_faces: customResolver,
        e_blur_region: customResolver,
        e_brightness: customResolver,
        e_cartoonify: customResolver,
        e_colorize: customResolver,
        e_contrast: customResolver,
        e_distort: customResolver,
        e_drop_shadow: customResolver,
        e_gamma: customResolver,
        e_gradient_fade: customResolver,
        e_grayscale: customResolver,
        e_hue: customResolver,
        e_improve: customResolver,
        e_make_transparent: customResolver,
        e_negate: customResolver,
        e_oil_paint: customResolver,
        e_pixelate: customResolver,
        e_pixelate_faces: customResolver,
        e_pixelate_region: customResolver,
        e_redeye: customResolver,
        e_saturation: customResolver,
        e_screen: customResolver,
        e_sepia: customResolver,
        e_shadow: customResolver,
        e_sharpen: customResolver,
        e_shear: customResolver,
        e_simulate_colorblind: customResolver,
        e_tint: customResolver,
        e_trim: customResolver,
        e_unsharp_mask: customResolver,
        e_vectorize: customResolver,
        e_vignette: customResolver,
        e_volume_mute: customResolver,
      },
    }),
  ({ path, params, imageOptions }) =>
    `${path}/image/upload/${params}/${imageOptions.src}`,
);

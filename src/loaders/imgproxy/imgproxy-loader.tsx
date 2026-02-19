import {
  type ImgproxyTransforms,
  type ImgproxyGlobalOptions,
} from "./imgproxy-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useImgproxyContext,
  LoaderProvider: ImgproxyLoaderProvider,
  useLoader: useImgproxyLoader,
} = loaderFactory<ImgproxyTransforms, ImgproxyGlobalOptions>(
  {
    transforms: {
      format: "webp",
    },
    placeholder: {
      quality: 10,
      format: "webp",
    },
  },
  {
    passBooleanValue: true,
    optionSeparator: ":",
    paramSeparator: "/",
    orders: {
      duotone: {
        orders: ["intensity", "color1", "color2"],
      },
      extend_aspect_ratio: {
        orders: ["extend", "gravity"],
        childrenOrders: {
          gravity: {
            orders: ["type", "x_offset", "y_offset"],
          },
        },
      },
      resize: {
        orders: ["resizing_type", "width", "height", "enlarge", "extend"],
      },
      size: { orders: ["width", "height", "enlarge", "extend"] },
      extend: { orders: ["extend", "gravity"] },
      gravity: { orders: ["type", "x_offset", "y_offset"] },
      crop: {
        orders: ["width", "height", "gravity"],
        childrenOrders: {
          gravity: {
            orders: ["type", "x_offset", "y_offset"],
          },
        },
      },
      trim: { orders: ["threshold", "color", "equal_hor", "equal_ver"] },
      padding: { orders: ["top", "right", "bottom", "left"] },
      background: { orders: ["r", "g", "b"] },
      adjust: { orders: ["brightness", "contrast", "saturation"] },
      blur_detections: { orders: ["sigma", "class_names"] },
      draw_detections: { orders: ["draw", "class_names"] },
      watermark: {
        orders: ["opacity", "position", "x_offset", "y_offset", "scale"],
      },
      watermark_size: { orders: ["width", "height"] },
      unsharpening: { orders: ["mode", "weight", "dividor"] },
      autoquality: {
        orders: [
          "method",
          "target",
          "min_quality",
          "max_quality",
          "allowed_error",
        ],
      },
      jpeg_options: {
        orders: [
          "progressive",
          "no_subsample",
          "trellis_quant",
          "overshoot_deringing",
          "optimize_scans",
          "quant_table",
        ],
      },
      png_options: {
        orders: ["interlaced", "quantize", "quantization_colors"],
      },
      zoom: { orders: ["x", "y"] },
    },
  },
  ({ path, params, imageOptions }) =>
    `${path}/${params}/plain/${imageOptions.src}`,
);

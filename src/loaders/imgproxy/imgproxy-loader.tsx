import {
  type ImgproxyTransforms,
  type ImgproxyGlobalOptions,
} from "./imgproxy-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useImgproxyContext,
  LoaderProvider: ImgproxyLoaderProvider,
  useLoader: useImgproxyLoader,
  usePlaceholder: useImgproxyPlaceholder,
} = loaderFactory<ImgproxyTransforms, ImgproxyGlobalOptions>(
  {
    transforms: {
      format: "webp",
    },
    placeholderTransforms: {
      quality: 10,
      format: "webp",
    },
  },
  {
    optionSeparator: ":",
    paramSeparator: "/",
    orders: {
      resize: ["resizing_type", "width", "height", "enlarge", "extend"],
      size: ["width", "height", "enlarge", "extend"],
      extend: ["extend", "gravity"],
      gravity: ["type", "x_offset", "y_offset"],
      crop: ["width", "height", "gravity"],
      trim: ["threshold", "color", "equal_hor", "equal_ver"],
      padding: ["top", "right", "bottom", "left"],
      background: ["r", "g", "b"],
      adjust: ["brightness", "contrast", "saturation"],
      blur_detections: ["sigma", "class_names"],
      draw_detections: ["draw", "class_names"],
      watermark: ["opacity", "position", "x_offset", "y_offset", "scale"],
      watermark_size: ["width", "height"],
      unsharpening: ["mode", "weight", "dividor"],
      autoquality: [
        "method",
        "target",
        "min_quality",
        "max_quality",
        "allowed_error",
      ],
      jpeg_options: [
        "progressive",
        "no_subsample",
        "trellis_quant",
        "overshoot_deringing",
        "optimize_scans",
        "quant_table",
      ],
      png_options: ["interlaced", "quantize", "quantization_colors"],
      zoom: ["x", "y"],
    },
  },
  ({ path, params, imageOptions }) =>
    `${path}/${params}/plain/${imageOptions.src}`,
);

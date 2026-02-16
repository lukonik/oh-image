import type { ImageLoaderOptions } from "../../types";
import { resolveDeprecatedParams } from "../loader-utils";
import type { ImgproxyOptions } from "./imgproxy-options";
type ImgproxyTransforms = NonNullable<ImgproxyOptions["transforms"]>;
const IMGPROXY_OBJECT_OPTIONS_ORDER: any[] = [
  {
    optionName: "trim",
    order: ["threshold", "color", "equal_hor", "equal_ver"],
  },
  {
    optionName: "padding",
    order: ["top", "right", "bottom", "left"],
  },
  {
    optionName: "background",
    order: ["r", "g", "b"],
  },
  {
    optionName: "adjust",
    order: ["brightness", "contrast", "saturation"],
  },
  {
    optionName: "blur_detections",
    order: ["sigma", "class_names"],
  },
  {
    optionName: "draw_detections",
    order: ["draw", "class_names"],
  },
  {
    optionName: "watermark",
    order: ["opacity", "position", "x_offset", "y_offset", "scale"],
  },
  {
    optionName: "watermark_size",
    order: ["width", "height"],
  },
  {
    optionName: "unsharpening",
    order: ["mode", "weight", "dividor"],
  },
  {
    optionName: "autoquality",
    order: ["method", "target", "min_quality", "max_quality", "allowed_error"],
  },
  {
    optionName: "jpeg_options",
    order: [
      "progressive",
      "no_subsample",
      "trellis_quant",
      "overshoot_deringing",
      "optimize_scans",
      "quant_table",
    ],
  },
  {
    optionName: "png_options",
    order: ["interlaced", "quantize", "quantization_colors"],
  },
  {
    optionName: "zoom",
    order: ["x", "y"],
  },
];

const stringifyOptions = (
  opCode: string,
  values: Array<string | number | boolean | undefined>,
): string => {
  return [
    opCode,
    ...values.map((v) => (v == null ? "" : encodeURIComponent(v))),
  ]
    .join(":")
    .replace(/:+$/, "");
};

const resolveObjectParam = <T extends keyof ImgproxyTransforms>(
  key: T,
  source: ImgproxyTransforms[T],
) => {
  // options must be in specific order so we have to manually construct options
  if (source === undefined) {
    return;
  }
  if (key === "size") {
    const tSource = source as ImgproxyTransforms["size"];
    if (!tSource) {
      return;
    }
    return stringifyOptions(key, [
      tSource.width,
      tSource.height,
      tSource.enlarge,
      tSource.extend,
    ]);
  }
  if (key === "resize") {
    const tSource = source as ImgproxyTransforms["resize"];
    if (!tSource) {
      return;
    }
    return stringifyOptions(key, [
      tSource.resizing_type,
      tSource.width,
      tSource.height,
      tSource.enlarge,
      tSource.extend,
    ]);
  }

  if (key === "extend") {
    const tSource = source as ImgproxyTransforms["extend"];
    if (!tSource) {
      return;
    }
    if (typeof tSource === "boolean") {
      return stringifyOptions(key, [tSource]);
    }
    return stringifyOptions(key, [tSource.extend, tSource.gravity]);
  }

  if (key === "gravity") {
    const tSource = source as ImgproxyTransforms["gravity"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.type,
      tSource.x_offset,
      tSource.y_offset,
    ]);
  }

  if (key === "crop") {
    const tSource = source as ImgproxyTransforms["crop"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.width,
      tSource.height,
      tSource.gravity,
    ]);
  }

  if (key === "trim") {
    const tSource = source as ImgproxyTransforms["trim"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.threshold,
      tSource.color,
      tSource.equal_hor,
      tSource.equal_ver,
    ]);
  }
};

const resolveTransforms = (transforms: ImgproxyOptions["transforms"]) => {
  if (!transforms) {
    return "";
  }
  const params: string[] = [];
  for (const key of Object.keys(transforms)) {
    const value = transforms[key as keyof ImgproxyOptions["transforms"]];
    if (value === undefined) {
      continue;
    }
    if (typeof value === "object") {
      params.push(resolveObjectParam(key, value));
    } else {
      params.push(stringifyOptions(key, [value]));
    }
  }

  return params;
};

export function createImgproxyUrl(
  options: ImgproxyOptions,
  imageOptions: ImageLoaderOptions,
) {
  const params: string[] = [];
  if (imageOptions.width) {
    params.push(stringifyOptions("width", [imageOptions.width]));
  }

  if (imageOptions.height) {
    params.push(stringifyOptions("height", [imageOptions.height]));
  }

  params.push(...resolveTransforms(options.transforms));

  // resolve deprecated params, will be removed in future
  if (options.params) {
    params.push(...resolveDeprecatedParams(options.params, ":"));
  }

  const stringifiedParams = params.join("/");

  return `${options.path}/${stringifiedParams}/plain/${imageOptions.src}`;
}

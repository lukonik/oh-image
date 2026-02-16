import type { ImageLoaderOptions } from "../../types";
import { resolveDeprecatedParams } from "../loader-utils";
import type { ImgproxyOptions } from "./imgproxy-options";
type ImgproxyTransforms = NonNullable<ImgproxyOptions["transforms"]>;

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

  if (key === "padding") {
    const tSource = source as ImgproxyTransforms["padding"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.top,
      tSource.right,
      tSource.bottom,
      tSource.left,
    ]);
  }

  if (key === "background") {
    const tSource = source as ImgproxyTransforms["background"];
    if (!tSource) {
      return;
    }

    if (typeof tSource === "string") {
      return stringifyOptions(key, [tSource]);
    }

    return stringifyOptions(key, [tSource.r, tSource.g, tSource.b]);
  }

  if (key === "adjust") {
    const tSource = source as ImgproxyTransforms["adjust"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.brightness,
      tSource.contrast,
      tSource.saturation,
    ]);
  }
  if (key === "blur_detections") {
    const tSource = source as ImgproxyTransforms["blur_detections"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [tSource.sigma, ...tSource.class_names]);
  }

  if (key === "draw_detections") {
    const tSource = source as ImgproxyTransforms["draw_detections"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [tSource.draw, ...tSource.class_names]);
  }

  if (key === "watermark") {
    const tSource = source as ImgproxyTransforms["watermark"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.opacity,
      tSource.position,
      tSource.x_offset,
      tSource.y_offset,
      tSource.scale,
    ]);
  }

  if (key === "watermark_size") {
    const tSource = source as ImgproxyTransforms["watermark_size"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [tSource.width, tSource.height]);
  }

  if (key === "unsharpening") {
    const tSource = source as ImgproxyTransforms["unsharpening"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.mode,
      tSource.weight,
      tSource.dividor,
    ]);
  }

  if (key === "autoquality") {
    const tSource = source as ImgproxyTransforms["autoquality"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.method,
      tSource.target,
      tSource.min_quality,
      tSource.max_quality,
      tSource.allowed_error,
    ]);
  }

  if (key === "jpeg_options") {
    const tSource = source as ImgproxyTransforms["jpeg_options"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.progressive,
      tSource.no_subsample,
      tSource.trellis_quant,
      tSource.overshoot_deringing,
      tSource.optimize_scans,
      tSource.quant_table,
    ]);
  }

  if (key === "png_options") {
    const tSource = source as ImgproxyTransforms["png_options"];
    if (!tSource) {
      return;
    }

    return stringifyOptions(key, [
      tSource.interlaced,
      tSource.quantize,
      tSource.quantization_colors,
    ]);
  }

  if (key === "zoom") {
    const tSource = source as ImgproxyTransforms["zoom"];
    if (!tSource) {
      return;
    }

    if (typeof tSource === "number") {
      return stringifyOptions(key, [tSource]);
    }

    return stringifyOptions(key, [tSource.x, tSource.y]);
  }

  return;
};

const resolveTransforms = (transforms: ImgproxyOptions["transforms"]) => {
  if (!transforms) {
    return "";
  }
  const params: string[] = [];
  for (const key of Object.keys(transforms)) {
    const value = transforms[key as keyof ImgproxyOptions["transforms"]];
    const keyCast = key as keyof ImgproxyOptions["transforms"];

    if (value === undefined) {
      continue;
    }
    if (typeof value === "object") {
      const objectParams = resolveObjectParam(keyCast, value);
      if (objectParams) {
        params.push(objectParams);
      }
    } else {
      params.push(stringifyOptions(key, [value]));
    }
  }

  return params;
};

export function createImgproxyUrl(
  path: string | undefined,
  transforms: ImgproxyTransforms,
  imageOptions: ImageLoaderOptions,
) {
  if (!path) {
    throw new Error("Path must be provided");
  }
  const params: string[] = [];

  params.push(...resolveTransforms(transforms));

  // resolve deprecated params, will be removed in future
  if (params) {
    params.push(...resolveDeprecatedParams(params, ":"));
  }

  const stringifiedParams = params.join("/");

  return `${path}/${stringifiedParams}/plain/${imageOptions.src}`;
}

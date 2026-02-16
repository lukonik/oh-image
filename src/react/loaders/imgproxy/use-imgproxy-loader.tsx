import type { ImageLoaderOptions } from "../../types";
import { resolveDeprecatedParams } from "../loader-utils";
import { useImgproxyContext } from "./imgproxy-context";
import type { ImgproxyOptions } from "./imgproxy-options";

type ImgproxyTransforms = NonNullable<ImgproxyOptions["transforms"]>;

type ImgproxyObjectOption = {
  [K in keyof ImgproxyTransforms]: NonNullable<
    ImgproxyTransforms[K]
  > extends infer V
    ? V extends Array<any>
      ? never
      : V extends object
        ? {
            optionName: K;
            order: (keyof V)[];
          }
        : never
    : never;
}[keyof ImgproxyTransforms];

const IMGPROXY_OBJECT_OPTIONS_ORDER: ImgproxyObjectOption[] = [
  {
    optionName: "resize",
    order: ["resizing_type", "width", "height", "enlarge", "extend"],
  },
  {
    optionName: "size",
    order: ["width", "height", "enlarge", "extend"],
  },
  {
    optionName: "extend",
    order: ["extend", "gravity"],
  },
  {
    optionName: "gravity",
    order: ["type", "x_offset", "y_offset"],
  },
  {
    optionName: "crop",
    order: ["width", "height", "gravity"],
  },
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

const camelToSnake = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const resolveParam = (key: string, value: unknown) => {
  return `${camelToSnake(key)}:${value}`;
};

const resolveObjectParam = (key: string, source: Record<string, unknown>) => {
  const options = IMGPROXY_OBJECT_OPTIONS_ORDER.find(
    (option) => option!.optionName === key,
  );

  if (!options) {
    console.warn(
      `Unknown option: ${key}. If this option should be supported but is not yet available in oh-image, please open a GitHub issue at: https://github.com/lukonik/oh-image`,
    );
    return "";
  }

  const params: string[] = [`${camelToSnake(key)}`];

  for (const key of options.order) {
    const value = source[key];
    if (value === undefined) {
      params.push(":");
    } else {
      params.push((":" + value) as string);
    }
  }
  return params.join("");
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
      params.push(resolveParam(key, value));
    }
  }

  return params;
};

export function useImgproxyLoader(options: ImgproxyOptions) {
  const context = useImgproxyContext();
  const resolvedOptions = {
    ...context,
    ...options,
  };
  return (imageOptions: ImageLoaderOptions) => {
    const params: string[] = [];
    if (imageOptions.width) {
      params.push(resolveParam("width", imageOptions.width));
    }

    if (imageOptions.height) {
      params.push(resolveParam("height", imageOptions.height));
    }

    params.push(...resolveTransforms(resolvedOptions.transforms));

    // resolve deprecated params, will be removed in future
    if (options.params) {
      params.push(...resolveDeprecatedParams(options.params, ":"));
    }

    const stringifiedParams = params.join("/");

    return `${resolvedOptions.path}/${stringifiedParams}/plain/${imageOptions.src}`;
  };
}

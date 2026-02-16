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
    order: ["resizingType", "width", "height", "enlarge", "extend"],
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
    order: ["type", "xOffset", "yOffset"],
  },
  {
    optionName: "crop",
    order: ["width", "height", "gravity"],
  },
  {
    optionName: "trim",
    order: ["threshold", "color", "equalHor", "equalVer"],
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
    optionName: "blurDetections",
    order: ["sigma", "classNames"],
  },
  {
    optionName: "drawDetections",
    order: ["draw", "classNames"],
  },
  {
    optionName: "watermark",
    order: ["opacity", "position", "xOffset", "yOffset", "scale"],
  },
  {
    optionName: "watermarkSize",
    order: ["width", "height"],
  },
  {
    optionName: "unsharpening",
    order: ["mode", "weight", "dividor"],
  },
  {
    optionName: "autoquality",
    order: ["method", "target", "minQuality", "maxQuality", "allowedError"],
  },
  {
    optionName: "jpegOptions",
    order: [
      "progressive",
      "noSubsample",
      "trellisQuant",
      "overshootDeringing",
      "optimizeScans",
      "quantTable",
    ],
  },
  {
    optionName: "pngOptions",
    order: ["interlaced", "quantize", "quantizationColors"],
  },
  {
    optionName: "zoom",
    order: ["x", "y"],
  },
];

export function resolveParam(key: string, value: unknown) {
  return `${key}:${value}`;
}



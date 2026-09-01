export const imgix = {
  slug: "imgix",
  name: "Imgix",
  title: "Imgix Loader",
  urlSchema: "<path>/<src>?<params>",
  defaults: `
  {
    transforms: {
      auto: "format,compress",
    },
    placeholder: {
      q: 10,
      auto: "format,compress",
    },
  }
  `,
  link: "https://docs.imgix.com/apis/rendering",
  interface: `{
  w?: number;

  h?: number;

  ar?: string;

  fit?:
    | "clamp"
    | "clip"
    | "crop"
    | "facearea"
    | "fill"
    | "fillmax"
    | "max"
    | "min"
    | "scale";

  crop?: string;

  dpr?: number;

  q?: number;

  fm?:
    | "jpeg"
    | "jpg"
    | "png"
    | "webp"
    | "avif"
    | "gif"
    | "json"
    | "mp4"
    | "webm"
    | "pjpg"
    | "jp2"
    | "jxr"
    | "png8"
    | "png32"
    | "blurhash";

  auto?:
    | "true"
    | "format"
    | "compress"
    | "enhance"
    | "redeye"
    | string;

  con?: number;

  exp?: number;

  sat?: number;

  blur?: number;

  sharp?: number;

  sepia?: number;

  bg?: string;

  border?: string;

  txt?: string;

  txtFont?: string;

  txtColor?: string;

  txtSize?: number;

  txtAlign?: "center" | "left" | "right";

  mark?: string;

  markAlpha?: number;

  rot?: number;

  flip?: "h" | "v" | "hv";

  gaussblur?: number;

  noise?: number;

  strip?: boolean;

  rect?: [number, number, number, number];

  "fp-x"?: number;

  "fp-y"?: number;

  "fp-z"?: number;

  lossless?: boolean;

  invert?: boolean;

  gam?: number;
  }`,
};

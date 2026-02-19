export const cloudinary = {
  slug: "kontent",
  name: "Kontent",
  title: "Kontent Loader",
  urlSchema: "<path>/<src>?<params>",
  defaults: `
  {
    transforms: {
      auto: "format",
    },
    placeholder: {
      q: 10,
      auto: "format",
    },
  }
  `,
  link: "https://kontent.ai/learn/docs/apis/image-transformation-api",
  interface: `{
  w?: number;

  h?: number;

  dpr?: number;

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

  rect?: [number, number, number, number];

  "fp-x"?: number;
  "fp-y"?: number;
  "fp-z"?: number;

  smart?: boolean | "face" | "edges" | "objects";

  bg?: string;

  fm?: "webp" | "jpg" | "png" | "gif" | "avif" | "jp2";

  q?: number;

  lossless?: boolean;

  auto?: "format" | "compress" | "enhance";
  }`,
};

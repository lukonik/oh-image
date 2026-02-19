export const cloudflare = {
  slug: "cloudflare",
  name: "Cloudflare",
  title: "Cloudflare Loader",
  urlSchema: "<path>/cdn-cgi/image/<params>/<src>",
  defaults: `
  {
    transforms: {
      format: "auto",
    },
    placeholder: {
      quality: 10,
      format: "auto",
    },
  }
  `,
  link: "https://developers.cloudflare.com/images/transform-images/",
  interface: `
  {
     anim: boolean;
    background: string;
    blur: number;
    brightness: number;
    compression: "fast";
    contrast: number;
    dpr: number;
    flip: "h" | "v" | "hv";
    fit: "scale-down" | "contain" | "cover" | "crop" | "pad" | "squeeze";
    format: "auto" | "avif" | "webp" | "jpeg" | "baseline-jpeg";
    gamma: number;
    gravity: "auto" | "left" | "right" | "top" | "bottom" | string;
    height: number;
    width: number;
    maxWidth: number;
    metadata: "keep" | "copyright" | "none";
    quality: number | "high" | "medium-high" | "medium-low" | "low";
    rotate: number;
    sharpen: number;
    trim: [number, number, number, number];
    zoom: number;
    saturation: number;
    segment: "foreground";
    onerror: "redirect";
    "slow-connection-quality": number;
  }`,
};

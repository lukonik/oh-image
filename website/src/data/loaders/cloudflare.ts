export const cloudflare = {
  slug: "cloudflare",
  name: "Cloudflare",
  title: "Cloudflare Loader",
  defaults: `
  {
    transforms: {
      format: "auto",
    },
    placeholderTransforms: {
      quality: 10,
      format: "auto",
    },
  }
  `,
  link: "https://developers.cloudflare.com/images/transform-images/",
  interface: `export interface CloudflareTransforms {
  anim?: boolean;
  background?: string;
  blur?: number;
  brightness?: number;
  compression?: boolean;
  contrast?: number;
  dpr?: number;
  dprs?: number[];
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  format?: "auto" | "avif" | "webp" | "json";
  gamma?: number;
  gravity?: "auto" | "left" | "right" | "top" | "bottom" | string;
  height?: number;
  width?: number;
  widths?: number[];
  maxWidth?: number;
  metadata?: "keep" | "copyright" | "none";
  quality?: number;
  rotate?: number;
  sharpen?: number;
  trim?: string;
}`,
};

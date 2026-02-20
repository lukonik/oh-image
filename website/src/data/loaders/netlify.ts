export const netlify = {
  slug: "netlify",
  name: "Netlify",
  title: "Netlify Loader",
  urlSchema: "<path>?url=<src>&<params>",
  defaults: `
  {
    path: "/.netlify/images",
    transforms: {
      fm: "webp",
    },
    placeholder: {
      fm: "blurhash",
    },
  }
  `,
  link: "https://docs.netlify.com/build/image-cdn/overview/",
  interface: `
{
  w: number;
  h: number;
  fit: "contain" | "cover" | "fill";
  position: "top" | "bottom" | "left" | "right" | "center";
  fm: "avif" | "webp" | "jpg" | "png" | "gif" | "blurhash";
  q: number;
}`,
};

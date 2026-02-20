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
      q: 10,
      fm: "webp",
    },
  }
  `,
  link: "https://docs.netlify.com/build/image-cdn/overview/",
  interface: `
  {
    w: number;
    h: number;
    fit: "cover" | "contain" | "fill" | "inside" | "outside";
    fm: "avif" | "webp" | "jpg" | "png" | "gif";
    q: number;
    position:
      | "center"
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "top_left"
      | "top_right"
      | "bottom_left"
      | "bottom_right";
  }`,
};

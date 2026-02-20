export const wordpress = {
  slug: "wordpress",
  name: "Wordpress",
  title: "WordPress Loader",
  urlSchema: "<path>/<src>?<params>",
  defaults: `
  {
    transforms: {
      format: "webp",
    },
    placeholder: {
      quality: 10,
      format: "webp",
    },
  },
  `,
  link: "https://developer.wordpress.com/docs/developer-tools/site-accelerator-api/",
  interface: `{
  /** image width in pixels */
  w: number;

  /** image height in pixels */
  h: number;

  /** crop mode; accepts common values such as true, false, center, top, left */
  crop: string | boolean;

  /** resize to exact dimensions, e.g. "300,200" */
  resize: string;

  /** fit image within dimensions, e.g. "300,200" */
  fit: string;

  /** image quality (1-100) */
  quality: number;

  /** output format */
  format: "jpg" | "png" | "webp" | "avif";

  /** strip image metadata */
  strip: "all" | "info";

  /** zoom multiplier */
  zoom: number;

  /** enforce HTTPS in result URL */
  ssl: 0 | 1;
}`,
};

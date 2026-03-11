import { cloudflare } from "./cloudflare";
import { contentful } from "./contentful";
import { imgproxy } from "./imgproxy";
import { kontent } from "./kontent";
import { wordpress } from "./wordpress";
import { netlify } from "./netlify";
export const loaders = [
  kontent,
  cloudflare,
  imgproxy,
  contentful,
  wordpress,
  netlify,
];

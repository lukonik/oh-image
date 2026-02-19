import { cloudflare } from "./cloudflare";
import { cloudinary } from "./cloudinary";
import { contentful } from "./contentful";
import { imgproxy } from "./imgproxy";
import { kontent } from "./kontent";
export const loaders = [kontent, cloudflare, imgproxy, cloudinary, contentful];

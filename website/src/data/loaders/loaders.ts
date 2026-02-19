import { cloudflare } from "./cloudflare";
import { cloudinary } from "./cloudinary";
import { imgproxy } from "./imgproxy";
import { kontent } from "./kontent";

export const loaders = [kontent, cloudflare, imgproxy, cloudinary];

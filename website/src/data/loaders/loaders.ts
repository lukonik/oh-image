import { cloudflare } from "./cloudflare";
import { cloudinary } from "./cloudinary";
import { imgproxy } from "./imgproxy";

export const loaders = [cloudflare, imgproxy, cloudinary];

import type { ImageLoaderOptions } from "../../types";
import { normalizeTransforms } from "../image-loader-utils";
import type { CloudflareTransforms } from "./cloudflare-options";

const SEPARATOR = "=";

export default function createCloudflareUrl(
  path: string | undefined,
  transforms: CloudflareTransforms,
  imageOptions: ImageLoaderOptions,
) {
  const params: string[] = [];
  if (imageOptions.width) {
    params.push(`width=${imageOptions.width}`);
  }
  if (imageOptions.height) {
    params.push(`width=${imageOptions.height}`);
  }

  params.push(...normalizeTransforms(transforms, SEPARATOR));
  const paramsStringified= params.join(",")
  return `${path}/cdn-cgi/image/${paramsStringified}/${imageOptions.src}`;
}

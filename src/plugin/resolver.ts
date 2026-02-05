import { extname } from "node:path";

export const SUPPORTED_IMAGE_FORMATS = /\.(jpe?g|png|webp|avif|gif|tiff?|svg)$/i;

export function isFileSupported(path: string) {
  const extension = extname(path);

  if (!extension) {
    return false;
  }
  return SUPPORTED_IMAGE_FORMATS.test(extension); // pad to 1 to remove .
}


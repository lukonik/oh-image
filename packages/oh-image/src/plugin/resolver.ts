import { extname } from "pathe";
const SHARP_SUPPORTED_FORMATS = new Set([
  // Input formats supported by Sharp
  "jpeg",
  "jpg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff",
  "tif",
  "svg",
  "heif",
  "heic",
  "raw",
  "jp2",
  "jpx",
  "j2k",
  "j2c",
]);

export function isSupportedFile(path: string) {
  const ext = extname(path);
  if (!ext) return false;
  return SHARP_SUPPORTED_FORMATS.has(ext.slice(1)); //ext is returned wit ., it is sliced for correct check
}


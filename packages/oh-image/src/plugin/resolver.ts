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

export class Resolver {
  constructor(private path: string) {}

  isSupportedFile() {
    const ext = this.path.split(".").pop()?.toLowerCase();
    if (!ext) return false;
    return SHARP_SUPPORTED_FORMATS.has(ext);
  }

  
}

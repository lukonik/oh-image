import sharp, { type FormatEnum, type ResizeOptions } from "sharp";

interface ProcessOptions {
  resize?: ResizeOptions | number | undefined;
  blur?: boolean | number | undefined;
  format?: keyof FormatEnum | undefined;
}

const process = (path: string, options: ProcessOptions) => {
  let image = sharp(path);
  if (options.resize !== undefined) {
    image = image.resize(options.resize);
  }
  if (options.blur !== undefined) {
    image = image.blur(options.blur);
  }
  if (options.format !== undefined) {
    image = image.toFormat(options.format);
  }
  return image;
};

const metadata = (path: string) => sharp(path).metadata();

export { process, metadata };

import sharp, { type FormatEnum, type ResizeOptions } from "sharp";

type ResizeParams = Parameters<sharp.Sharp["resize"]>[0];
type BlurParams = Parameters<sharp.Sharp["blur"]>[0];
type FormatParamsType = keyof FormatEnum;
type FormatParamsOptions = Parameters<sharp.Sharp["toFormat"]>[1];

interface ProcessOptions {
  resize?: ResizeOptions | number | undefined;
  blur?: BlurParams;
  format?: keyof FormatEnum | undefined;
  formatOptions?: FormatParamsOptions;
}

export default function createImageProcessor() {
  return {
    metadata: (path: string) => sharp(path).metadata(),
    process: (path: string, options: ProcessOptions) => {
      let image = sharp(path);
      if (options.resize !== undefined) {
        image = image.resize(options.resize);
      }
      if (options.blur !== undefined) {
        image = image.blur(options.blur);
      }
      if (options.format !== undefined) {
        image = image.toFormat(options.format, options.formatOptions);
      }

      return image;
    },
  };
}

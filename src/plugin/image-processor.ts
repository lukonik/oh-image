import sharp from "sharp";

class Processor {
  private _sharp: sharp.Sharp;
  constructor(path: string) {
    this._sharp = sharp(path);
  }

  resize(size: number) {
    this._sharp.resize(size);
    return this;
  }
  toFormat(format: keyof sharp.FormatEnum, options?: { quality?: number }) {
    this._sharp.toFormat(format, options);
    return this;
  }

  blur(sigma?: number) {
    this._sharp.blur(sigma);
    return this;
  }

  stream(): NodeJS.ReadableStream {
    return this._sharp;
  }
}

export default function createImageProcessor() {
  return {
    metadata: (path: string) => sharp(path).metadata(),
    process: (path: string) => new Processor(path),
  };
}

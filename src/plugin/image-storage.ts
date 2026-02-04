import { basename, extname, join, parse } from "node:path";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";
import { get, put } from "cacache";
import { generateRandomString } from "./utils";
import type { OhImageConfig } from "./types";
interface ImageValue {
  width: number;
  height: number;
  src: string;
  blur: string | null;
}

const BLUR_FORMAT = "webp";
const CACHE_DIR = "oh-image";
export class ImageStorage {
  private _store = new Map<string, ImageValue>();
  private _cacheDir: string;
  constructor(root: string) {
    this._cacheDir = join(root, ".cache", CACHE_DIR);
  }

  private getBase(id: string) {
    return parse(id).name;
  }

  private createImagePipe(
    path: string,
    id: string,
    config: Required<OhImageConfig>,
  ) {
    const pipe = sharp(path);
    pipe.toFormat(config.format, { quality: config.quality });
    return pipeline(pipe, put.stream(this._cacheDir, id));
  }

  private createBlurPipe(
    path: string,
    id: string,
    config: Required<OhImageConfig>,
  ) {
    return pipeline(
      sharp(path).resize(config.blurResize).blur(config.blur).toFormat("webp"),
      put.stream(this._cacheDir, id),
    );
  }

  private genBlurId(id: string) {
    return `${id}-blur`;
  }

  private genId(id: string) {
    return `${CACHE_DIR}-${id}-${generateRandomString()}`;
  }

  isStorageUrl(url: string) {
    return url.includes(CACHE_DIR);
  }

  async create(path: string, config: Required<OhImageConfig>) {
    const { name } = parse(path);
    const base = this.getBase(path);

    const genId = this.genId(name);
    const genIdWithFormat = `${genId}.${config.format}`;
    const imagePipe = this.createImagePipe(path, genIdWithFormat, config);

    const blurId = `${this.genBlurId(genId)}.${BLUR_FORMAT}`;
    const blurPipe = config.blur
      ? this.createBlurPipe(path, blurId, config)
      : null;

    const [metadata] = await Promise.all([
      sharp(path).metadata(),
      ...[imagePipe, blurPipe].filter(Boolean),
    ]);

    const image: ImageValue = {
      width: metadata.width || 0,
      height: metadata.height || 0,
      src: genIdWithFormat,
      blur: blurId,
    };
    this._store.set(base, image);
    return image;
  }

  getImageStream(url: string) {
    const base = basename(url);
    return {
      stream: get.stream(this._cacheDir, base),
      ext: extname(base).slice(1),
    };
  }
}

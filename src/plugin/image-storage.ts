import { basename, join, parse } from "node:path";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";
import { get, put } from "cacache";
import { generateRandomString } from "./utils";
interface ImageValue {
  width: number;
  height: number;
  src: string;
  blur: string;
}

export class ImageStorage {
  private _store = new Map<string, ImageValue>();
  private _cacheDir: string;
  constructor(root: string) {
    this._cacheDir = join(root, ".cache", "oh-image");
  }

  private getBase(id: string) {
    return parse(id).name;
  }

  async create(path: string) {
    const base = this.getBase(path);

    const metadata = await sharp(path).metadata();

    const format = "webp";

    const genId = `oh-image-${base}-${generateRandomString()}.${format}`;
    console.log(genId);
    await pipeline(
      sharp(path).toFormat(format),
      put.stream(this._cacheDir, genId),
    );

    const blurId = `${genId}-blur.${format}`;

    await pipeline(
      sharp(path).resize(100).blur(10).toFormat(format),
      put.stream(this._cacheDir, blurId),
    );

    const image: ImageValue = {
      width: metadata.width || 0,
      height: metadata.height || 0,
      src: genId,
      blur: blurId,
    };
    this._store.set(base, image);
    return image;
  }

  getImage(url: string) {
    const base = basename(url);
    get.info(this._cacheDir, base).then((data) => {
      console.log("base: ", base, " size: ", (data.size ?? 0) / 1024, "KB");
    });
    return get.stream(this._cacheDir, base);
  }
}

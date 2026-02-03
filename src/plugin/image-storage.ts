import { basename, join } from "node:path";
import sharp from "sharp";
import { put, get } from "cacache";
import { nanoid } from "nanoid";
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

  async create(id: string) {
    const base = basename(id);

    const metadata = await sharp(id).metadata();

    const format = "webp";

    const genId = `${id}-${nanoid()}.${format}`;

    await sharp(id).toFormat(format).pipe(put.stream(this._cacheDir, genId));

    const blurId = `${id}-blur.${format}`;

    await sharp(id).resize(200, 200).pipe(put.stream(this._cacheDir, blurId));

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
    return get.stream(this._cacheDir, base);
  }
}

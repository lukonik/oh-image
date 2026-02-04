import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { basename, extname, join, parse } from "node:path";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";
import { get, put, rm } from "cacache";
import { generateRandomString } from "./utils";
import type { OhImageConfig, OhImagePluginConfig } from "./types";
interface ImageValue {
  width: number;
  height: number;
  src: string;
  blur: string | null;
  srcSet: string[];
}

export class ImageStorage {
  private _store = new Set<ImageValue>();
  constructor(private config: Required<OhImagePluginConfig>) {}

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
    return pipeline(pipe, put.stream(this.config.cacheDir, id));
  }

  private createBlurPipe(
    path: string,
    id: string,
    config: Required<OhImageConfig>,
  ) {
    return pipeline(
      sharp(path)
        .resize(config.blurResize)
        .blur(config.blur)
        .toFormat(this.config.blurFormat),
      put.stream(this.config.cacheDir, id),
    );
  }

  private genBlurId(id: string) {
    return `${id}-blur`;
  }

  private genId(id: string) {
    return `${this.config.cachePrefix}-${id}-${generateRandomString()}`;
  }

  isStorageUrl(url: string) {
    return url.includes(this.config.cachePrefix);
  }

  async create(path: string, config: OhImageConfig) {
    const configWithDefaults = this.mergeConfigs(config);
    const { name } = parse(path);
    const base = this.getBase(path);

    const genId = this.genId(name);
    const genIdWithFormat = `${genId}.${config.format}`;
    const imagePipe = this.createImagePipe(
      path,
      genIdWithFormat,
      configWithDefaults,
    );

    const blurId = `${this.genBlurId(genId)}.${this.config.blurFormat}`;
    const blurPipe = config.blur
      ? this.createBlurPipe(path, blurId, configWithDefaults)
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
      srcSet: [],
    };
    this._store.add(image);
    return image;
  }

  getImageStream(url: string) {
    const base = basename(url);
    return {
      stream: get.stream(this.config.cacheDir, base),
      ext: extname(base).slice(1),
    };
  }

  private mergeConfigs(config: OhImageConfig): Required<OhImageConfig> {
    return { ...this.config, ...config };
  }

  async writeToDist() {
    await mkdir(this.config.distDir, { recursive: true });

    const writePromises: Promise<void>[] = [];

    for (const image of this._store) {
      writePromises.push(
        pipeline(
          get.stream(this.config.cacheDir, image.src),
          createWriteStream(join(this.config.distDir, image.src)),
        ),
      );

      if (image.blur) {
        writePromises.push(
          pipeline(
            get.stream(this.config.cacheDir, image.blur),
            createWriteStream(join(this.config.distDir, image.blur)),
          ),
        );
      }

      for (const srcSetImage of image.srcSet) {
        writePromises.push(
          pipeline(
            get.stream(this.config.cacheDir, srcSetImage),
            createWriteStream(join(this.config.distDir, srcSetImage)),
          ),
        );
      }
    }

    await Promise.all(writePromises);
  }

  async clearCache() {
    this._store.clear();
    await rm.all(this.config.cacheDir);
  }
}

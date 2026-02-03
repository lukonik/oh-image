import { outputFile } from "fs-extra/esm";
import { readFile } from "fs/promises";
import { join } from "path";

export class ImageCache {
  private _dir: string;
  constructor(root: string) {
    this._dir = join(root, "node_modules", ".cache", "oh-image");
  }

  private getPath(id: string) {
    return join(this._dir, id);
  }

  async get(id: string) {
    return await readFile(this.getPath(id));
  }

  async set(id: string, buffer: Buffer) {
    await outputFile(this.getPath(id), buffer);
  }
}

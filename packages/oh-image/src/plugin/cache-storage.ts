import { BaseStorage } from "./base-storage";
import { join, basename } from "pathe";
import { getRoot } from "./context";
import { outputFile, pathExists } from "fs-extra";
import { readFile } from "fs/promises";
export class CacheStorage extends BaseStorage {
  private _dir = join(getRoot(), "node_modules", ".cache", "oh-image");

  private getPath(id: string) {
    return join(this._dir, id);
  }
  async get(url: string) {
    const base = basename(url);
    const path = this.getPath(base);
    const fileExists = await pathExists(path);
    if (fileExists) {
      const file = await readFile(path);
      return file;
    }
    return null;
  }

  async set(id: string, buffer: Buffer) {
    await outputFile(this.getPath(id), buffer);
  }
}

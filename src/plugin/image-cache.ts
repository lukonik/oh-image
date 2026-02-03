import { join } from "path";
import { put, get } from "cacache";

export class ImageCache {
  private _dir: string;
  constructor(root: string) {
    this._dir = join(root, ".cache", "oh-image");
  }

  async get(id: string) {
    const info = await get.info(this._dir, id);
    if(!info){
      return null
    }
    return await get(this._dir, id);
  }

  async set(id: string, buffer: Buffer) {
    await put(this._dir, id, buffer);
    return join(this._dir, id);
  }
}

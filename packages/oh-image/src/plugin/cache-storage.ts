import { BaseStorage } from "./base-storage";

export class CacheStorage extends BaseStorage {
  private _cache = new Map<string, Buffer>();
  get(id: string) {
    console.log(this._cache)
    return this._cache.get(id);
  }

  set(id: string, buffer: Buffer) {
    this._cache.set(id, buffer);
  }
}

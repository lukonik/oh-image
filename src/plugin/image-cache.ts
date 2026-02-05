import { createReadStream, createWriteStream, mkdirSync } from "fs";
import { mkdir, rm, access } from "fs/promises";
import { join } from "path";

export default function createImageCache(cacheDir: string) {
  mkdirSync(cacheDir, { recursive: true });

  return {
    async getStream(key: string) {
      const filePath = join(cacheDir, key);
      await access(filePath);
      return createReadStream(filePath);
    },
    put(key: string) {
      const filePath = join(cacheDir, key);
      return createWriteStream(filePath);
    },
    async deleteAll() {
      await rm(cacheDir, { recursive: true, force: true });
      await mkdir(cacheDir, { recursive: true });
    },
  };
}

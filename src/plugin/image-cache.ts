import { mkdirSync } from "node:fs";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

export default function createImageCache(cacheDir: string) {
  return {
    async read(key: string) {
      const filePath = join(cacheDir, key);
      try {
        await access(filePath);
        return await readFile(filePath);
      } catch {
        return null;
      }
    },
    async write(key: string, data: Parameters<typeof writeFile>[1]) {
      const filePath = join(cacheDir, key);
      await writeFile(filePath, data);
    },
    async clear() {
      await rm(cacheDir, { recursive: true, force: true });
      mkdirSync(cacheDir, { recursive: true });
    },
  };
}

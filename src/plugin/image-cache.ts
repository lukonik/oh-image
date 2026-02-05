import { get, put, rm } from "cacache";

export default function createImageCache(cacheDir: string) {
  return {
    async getSream(key: string) {
      return get.stream(cacheDir, key);
    },
    put(key: string) {
      return put.stream(cacheDir, key);
    },
    deleteAll() {
      rm.all(cacheDir);
    },
  };
}

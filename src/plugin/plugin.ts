import type { Plugin } from "vite";
import { isFileSupported } from "./resolver";
import { ImageStorage } from "./image-storage";

const CACHE_PREFIX = "/oh-image/";

export function ohImage() {
  let storage!: ImageStorage;
  return {
    name: "oh-image",
    configResolved(config) {
      storage = new ImageStorage(config.root);
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        next()
        if (!req.url?.startsWith(CACHE_PREFIX)) {
          return next();
        }

        const id = req.url.slice(CACHE_PREFIX.length);
        try {
          res.pipe(storage.getImage(id))
          res.setHeader("Content-Type", "image/webp");
        } catch {
          next();
        }
      });
    },
    async load(id) {
      if (!isFileSupported(id)) {
        return null;
      }
      const image = await storage.create(id);
      return `export default ${JSON.stringify(image)}`;
    },
  } satisfies Plugin;
}

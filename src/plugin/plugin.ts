import type { Plugin } from "vite";
import { isFileSupported } from "./resolver";
import { ImageStorage } from "./image-storage";

const CACHE_PREFIX = "oh-image";

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
        if (!req.url?.includes(CACHE_PREFIX) || !isFileSupported(req.url)) {
          return next();
        }

        try {
          if (!req.url.includes("blur")) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
          const stream = storage.getImage(req.url);
          res.setHeader("Content-Type", "image/webp");
          stream.on("error", (err) => {
            console.error(err);
            next();
          });
          stream.pipe(res);
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

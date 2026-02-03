import type { Plugin } from "vite";
import { ImageCache } from "./image-cache";
import { isFileSupported } from "./resolver";

export function ohImage() {
  let imageCache!: ImageCache;
  return {
    name: "oh-image",
    configResolved(config) {
      imageCache = new ImageCache(config.root);
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !isFileSupported(req.url)) {
          return next();
        }
        
      });
    },
    transform(code, id) {
      if (isFileSupported(id)) {
        return code;
      }
      return code;
    },
  } satisfies Plugin;
}

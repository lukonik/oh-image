import type { Plugin } from "vite";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
import { ImageStorage } from "./image-storage";
import { pipeline } from "node:stream/promises";

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
        const url = req.url;
        if (!url || !isFileSupported(url) || !storage.isStorageUrl(url)) {
          return next();
        }

        try {
          const { stream, ext } = storage.getImageStream(url);
          res.setHeader("Content-Type", `image/${ext}`);
          await pipeline(stream, res);
        } catch {
          next();
        }
      });
    },
    load: {
      filter: {
        id: SUPPORTED_IMAGE_FORMATS,
      },
      async handler(id, options) {
        const image = await storage.create(id, {
          blur: true,
          blurResize: 100,
          format: "webp",
          quality: 100,
        });
        return `export default ${JSON.stringify(image)}`;
      },
    },
  } satisfies Plugin;
}

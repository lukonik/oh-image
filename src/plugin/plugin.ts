import { mergeConfig, type Plugin } from "vite";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
import { ImageStorage } from "./image-storage";
import { pipeline } from "node:stream/promises";
import type { OhImagePluginConfig } from "./types";
import createImageService, { type ImageService } from "./image-service";
import { queryToOptions } from "./options-resolver";

const DEFAULT_CONFIGS: OhImagePluginConfig = {
  cacheDir: "/node_modules/.cache/oh-image",
  distDir: "oh-image",
  prefix: "oh-image",
};

export function ohImage(options?: Partial<OhImagePluginConfig>) {
  const pluginConfig = mergeConfig(
    DEFAULT_CONFIGS,
    options ?? {},
    false,
  ) as OhImagePluginConfig;
  let service!: ImageService;

  let storage!: ImageStorage;
  return {
    name: "oh-image",
    configResolved(config) {
      service = createImageService(config.command === "build", pluginConfig);
    },
    enforce: "pre",
    async buildStart() {
      await storage.clearCache();
    },
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
      async handler(id) {
        const image = await storage.create(id, {
          blur: true,
          blurResize: 100,
          format: "webp",
          quality: 100,
        });
        const options = queryToOptions(id);

        const mergeOptions = mergeConfig(pluginConfig, options, false);

        service.process(id, mergeOptions);

        return `export default ${JSON.stringify(image)}`;
      },
    },
    async closeBundle() {
      await storage.writeToDist();
    },
  } satisfies Plugin;
}

import { mergeConfig, type Plugin } from "vite";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
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

  return {
    name: "oh-image",
    async configResolved() {
      service = await createImageService(pluginConfig);
    },
    enforce: "pre",
    async buildStart() {
      await service.reset();
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (
          !url ||
          !isFileSupported(url) ||
          !url.includes(pluginConfig.prefix)
        ) {
          return next();
        }
        try {
          const { stream, format } = await service.getImageStream(url);
          res.setHeader("Content-Type", `image/${format}`);
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
        const options = queryToOptions(id);

        const mergeOptions = mergeConfig(pluginConfig, options, false);

        const image = await service.process(id, mergeOptions);

        return `export default ${JSON.stringify(image)}`;
      },
    },
    async closeBundle() {
      // await storage.writeToDist();
    },
  } satisfies Plugin;
}

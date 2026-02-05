import { defineConfig, getDistPath } from "./config";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
import { create, getImage, writeToDist } from "./service";
import { clearDist } from "./cache";
import type { OhImagePluginConfig } from "./types";
import type { Plugin } from "vite";

const DEFAULT_CONFIGS: OhImagePluginConfig = {
  cacheDir: ".cache/oh-image",
  distDir: "oh-image",
  prefix: "oh-image",
  blur: true,
  breakpoints: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
};

export function ohImage(options?: Partial<OhImagePluginConfig>) {
  const pluginOptions = { ...DEFAULT_CONFIGS, ...options };

  return {
    name: "oh-image",
    configResolved(config) {
      defineConfig(config, {
        cacheDir: pluginOptions.cacheDir,
        distDir: pluginOptions.distDir,
      });
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        // Only handle our virtual path /@oh-image/*
        if (!url?.startsWith("/@oh-image/") || !isFileSupported(url)) {
          return next();
        }

        try {
          const { data, format } = await getImage(url);
          res.setHeader("Content-Type", `image/${format}`);
          res.end(data);
        } catch (err) {
          console.error("[oh-image]", err);
          next();
        }
      });
    },
    load: {
      filter: {
        id: SUPPORTED_IMAGE_FORMATS,
      },
      async handler(id) {
        const image = await create(id, {
          blur: pluginOptions.blur === true,
          breakpoints: pluginOptions.breakpoints,
        });
        return `export default ${JSON.stringify(image)}`;
      },
    },
    async writeBundle() {
      const distPath = getDistPath();
      await clearDist();
      const count = await writeToDist(distPath);
      console.log(`[oh-image] Wrote ${count} images to ${distPath}`);
    },
  } satisfies Plugin;
}

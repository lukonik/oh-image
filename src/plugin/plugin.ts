import { defineConfig, getDistPath } from "./config";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
import { create, getImage, createCachePath } from "./service";
import { clearDist, read, write } from "./cache";
import registry from "./registry";
import { process } from "./processor";
import type { OhImagePluginConfig } from "./types";
import type { Plugin } from "vite";
import { basename, join } from "node:path";

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
      // Process all registered images and write to dist
      const distPath = getDistPath();
      await clearDist();

      for (const [url, imageInfo] of registry.all()) {
        const filename = basename(url);
        const cachePath = createCachePath(filename);
        const distFilePath = join(distPath, filename);

        // Try cache first
        const buffer = await read(cachePath);

        if (buffer) {
          // Write cached image to dist
          await write(distFilePath, buffer);
        } else {
          // Process the image
          const processed = process(imageInfo.origin, {
            resize: imageInfo.width,
          });
          const newBuffer = await processed.toBuffer();
          // Write to cache for future builds
          await write(cachePath, newBuffer);
          // Write to dist
          await write(distFilePath, newBuffer);
        }
      }

      console.log(`[oh-image] Wrote ${[...registry.all()].length} images to ${distPath}`);
    },
  } satisfies Plugin;
}

import { defineConfig, getDefaultImageOptions, getDistPath } from "./config";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
import { create, getImage, writeToDist } from "./service";
import { clearDist } from "./cache";
import type { Plugin } from "vite";
import type { ImageOptions, PluginConfig } from "./types";
import { parseFromId } from "./query-parser";

export function ohImage(options?: Partial<PluginConfig>) {
  return {
    name: "oh-image",
    configResolved(config) {
      defineConfig(config, options);
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
        const queryOptions = parseFromId(id) as ImageOptions | null;
        if (queryOptions === null || !("oh" in queryOptions)) {
          return null;
        }

        const mergedOptions = { ...getDefaultImageOptions(), ...queryOptions };
        const image = await create(filePath, mergedOptions);
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

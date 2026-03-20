import { basename, extname, join } from "pathe";
import type { PluginConfig } from "./types";
import { readFileSafe, saveFileSafe } from "./file-utils";
import { createImageEntries } from "./image-entries";
import type { Plugin } from "vite";
import { processImage } from "./image-process";
import {
  handleImageLoad,
  handleWriteBundle,
  DEFAULT_CONFIGS,
  DEV_DIR,
  SUPPORTED_IMAGE_FORMATS,
} from "./core";

export { SUPPORTED_IMAGE_FORMATS, DEV_DIR };

export function ohImage(options?: Partial<PluginConfig>): Plugin {
  let isBuild = false;
  let assetsDir!: string;
  let outDir!: string;
  let cacheDir!: string;
  const imageEntries = createImageEntries();
  const config = { ...DEFAULT_CONFIGS, ...options };

  return {
    name: "oh-image",
    configResolved(viteConfig) {
      cacheDir = join(viteConfig.cacheDir, DEV_DIR);
      isBuild = viteConfig.command === "build";
      assetsDir = viteConfig.build.assetsDir;
      outDir = config.outDir
        ? join(viteConfig.root, config.outDir)
        : join(viteConfig.root, viteConfig.build.outDir);
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        if (!url?.includes(DEV_DIR) || !SUPPORTED_IMAGE_FORMATS.test(url)) {
          return next();
        }
        const fileId = basename(url);
        const path = join(cacheDir, fileId);
        const ext = extname(url).slice(1); // pad to get only ext
        // if image is not found, we need to find origin process it and save it in cache
        // because images are lazy loaded
        const imageEntry = imageEntries.get(url);
        if (!imageEntry) {
          console.warn("Image entry not found with id: " + url);
          return next();
        }
        const image = await readFileSafe(path);

        if (image) {
          res.setHeader("Content-Type", `image/${ext}`);
          res.end(image);
          return;
        }

        const processed = await processImage(imageEntry.origin, imageEntry);

        await saveFileSafe(path, processed);
        res.setHeader("Content-Type", `image/${ext}`);
        res.end(processed);
      });
    },
    async load(id) {
      try {
        const src = await handleImageLoad({
          id,
          config,
          imageEntries,
          isBuild,
          assetsDir,
        });

        if (!src) {
          return null;
        }

        return `
               import { __imageFactory } from "@lonik/oh-image/react";

           export default __imageFactory(${JSON.stringify({ width: src.width, height: src.height, src: src.src, srcSet: src.srcSet, placeholder: src.placeholder })})
`;
      } catch (err) {
        if (err instanceof Error) {
          // TypeScript now knows 'err' is an Error object
          console.error(`Couldn't load image: ${id}. Error: ${err.message}`);
          this.error(err.message);
        } else {
          // Handle cases where something weird was thrown (strings, etc.)
          this.error(String(err));
        }
      }
    },
    async writeBundle() {
      await handleWriteBundle(imageEntries, outDir);
    },
  };
}

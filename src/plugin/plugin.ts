import { defineConfig } from "./config";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./utils";
import type { Plugin, ResolvedConfig } from "vite";
import type { PluginConfig } from "./types";
import type { FormatEnum } from "sharp";
import { basename, join, resolve } from "node:path";

const DEFAULT_CONFIGS: PluginConfig = {
  cacheDir: "",
  distDir: "oh-image",
  breakpoints: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  blur: true,
  format: "webp",
};

interface ImageEntry {
  width?: number;
  height?: number;
  format?: keyof FormatEnum;
}

const DEV_SERVER_PREFIX = "/@oh-images/";
const DIST_ASSETS_PREFIX = "/oh-images/";

/**
 * returns path to resolve the file
 * @param uri id or url
 * @returns
 */
export function pathToImage(uri: string, isBuild: boolean) {
  // uri, can be URL (dev server) or id from import
  // take basename (file name + ext) and use it as unique identifier
  const fileId = basename(uri);

  // depending on it is build or dev, the file path would be from either cache, or from dist folder
  const rootPath = isBuild ? `${DIST_ASSETS_PREFIX}` : `${DEV_SERVER_PREFIX}`;

  // join path to get final full path
  const path = join(rootPath, fileId);

  // if it is dev add resolve path, to be able to get file propelry from file system
  if (!isBuild) {
    return resolve(path);
  }
  // if not return existing path, because server will handle mapping
  return path;
}

export function ohImage(options?: Partial<PluginConfig>) {
  const config = { ...DEFAULT_CONFIGS, options };
  let resolvedConfig: ResolvedConfig;
  let isBuild = false;
  const imageEntries = new Map<string, ImageEntry>();

  return {
    name: "oh-image",
    configResolved(config) {
      resolvedConfig = config;
      isBuild = resolvedConfig.command === "build";
      defineConfig(config, options);
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (!url?.startsWith(DEV_SERVER_PREFIX) || !isFileSupported(url)) {
          return next();
        }

        // try {
        //   const file = await res.setHeader("Content-Type", `image/${format}`);
        //   res.end(data);
        // } catch (err) {
        //   console.error("[oh-image]", err);
        //   next();
        // }
      });
    },
    load: {
      filter: {
        id: SUPPORTED_IMAGE_FORMATS,
      },
      async handler(id) {},
    },
    async writeBundle() {},
  } satisfies Plugin;
}

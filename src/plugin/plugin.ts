import {
  getRandomString,
  isFileSupported,
  parseQuery,
  readFileSafe,
  saveFileSafe,
  SUPPORTED_IMAGE_FORMATS,
} from "./utils";
import { createLogger, type Plugin } from "vite";
import type { ImageSrc, PluginConfig } from "./types";
import type { FormatEnum } from "sharp";
import { basename, extname, join, parse } from "node:path";
import sharp from "sharp";

const DEFAULT_CONFIGS: PluginConfig = {
  distDir: "oh-image",
  breakpoints: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  format: "webp",
};

interface ImageEntry {
  width?: number;
  height?: number;
  format?: keyof FormatEnum;
  origin: string;
}

const DEV_DIR = "/@oh-images/";
const BUILD_DIR = "/@oh-images/";

const logger = createLogger();

export function ohImage() {
  let isBuild = false;
  let assetsDir!: string;
  let outDir!: string;
  let cacheDir!: string;
  const imageEntries = new Map<string, ImageEntry>();

  /**
   * used for dev server to match url to path
   * @param url
   */
  function urlToPath(url: string) {
    const fileId = basename(url);
    return join(cacheDir, fileId);
  }

  function genIdentifier(
    uri: string,
    format: keyof FormatEnum,
    prefix: string,
  ) {
    const fileId = basename(uri);
    const uniqueFileId = `${prefix}-${getRandomString()}-${fileId}.${format}`;
    // for dev server the identifier will be  the fileId, with prefix so server middleware identifies correct request
    if (!isBuild) {
      return join(DEV_DIR, uniqueFileId);
    }

    // for build the joined path is returned with DEV_SERVER_PREFIX and assets that server will handle properly
    return join(assetsDir, BUILD_DIR, uniqueFileId);
  }

  return {
    name: "oh-image",
    configResolved(viteConfig) {
      cacheDir = join(viteConfig.cacheDir, DEV_DIR);
      isBuild = viteConfig.command === "build";
      assetsDir = viteConfig.build.assetsDir;
      outDir = viteConfig.build.outDir;

      // isBuild = resolvedConfig.command === "build";
      // assetsDir = resolvedConfig.build.assetsDir;
      // defineConfig(config, options);
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (!url?.includes(DEV_DIR) || !isFileSupported(url)) {
          return next();
        }

        const path = urlToPath(url);
        const ext = extname(url).slice(1); // pad to get only ext
        const image = await readFileSafe(path);

        if (image) {
          res.setHeader("Content-Type", `image/${ext}`);
          res.end(image);
          return;
        }

        // if image is not found, we need to find origin process it and save it in cache
        // because images are lazy loaded

        const imageEntry = imageEntries.get(url);
        if (!imageEntry) {
          logger.warn("Image entry not found with id: " + url);
          next();
          return;
        }

        const processed = await sharp(imageEntry.origin).resize(100).toBuffer();

        await saveFileSafe(path, processed);
        res.setHeader("Content-Type", `image/${ext}`);
        res.end(processed);
      });
    },
    load: {
      filter: {
        id: SUPPORTED_IMAGE_FORMATS,
      },
      async handler(id) {
        const parsed = parseQuery(id);
        if (!parsed.shouldProcess) {
          return null;
        }

        const origin = parsed.path; // origin is the actual file path
        const { name, ext } = parse(parsed.path);
        const { width, height } = await sharp(parsed.path).metadata();
        const format = ext.slice(1) as keyof FormatEnum;

        const mainIdentifier = genIdentifier(name, format, "main");
        const mainEntry: ImageEntry = {
          width,
          height,
          format: format,
          origin: origin,
        };

        imageEntries.set(mainIdentifier, mainEntry);

        const src: ImageSrc = {
          width,
          height,
          src: mainIdentifier,
          srcSets: [],
        };

        // if placeholder is specified as placeholder as well
        if (parsed.options?.placeholder) {
          const mainIdentifier = genIdentifier(name, format, "placeholder");
          const placeholderEntry: ImageEntry = {
            width: 100,
            height: 100,
            format: format,
            origin: origin,
          };
          imageEntries.set(mainIdentifier, placeholderEntry);
          src.placeholderUrl = mainIdentifier;
        }

        return `export default ${JSON.stringify(src)};`;
      },
    },
    async writeBundle() {
      for (const [key, value] of imageEntries) {
        const processed = await sharp(value.origin).resize(100).toBuffer();
        const outputPath = join(outDir, key);
        await saveFileSafe(outputPath, processed);
      }
    },
  } satisfies Plugin;
}

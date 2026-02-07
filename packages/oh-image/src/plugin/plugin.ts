import {
  getRandomString,
  queryToOptions,
  processImage,
  readFileSafe,
  saveFileSafe,
} from "./utils";
import { type Plugin } from "vite";
import pLimit from "p-limit";
import type { ImageEntry, ImageSrc, PluginConfig } from "./types";
import type { FormatEnum } from "sharp";
import { basename, extname, join, parse } from "node:path";
import sharp from "sharp";

const PROCESS_KEY = "oh";

const DEFAULT_CONFIGS: PluginConfig = {
  distDir: "oh-image",
  bps: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
  format: "webp",
  blur: false,
  width: null,
  height: null,
  placeholder: false,
  placeholderH: 100,
  placeholderW: 100,
  placeholderB: true,
  placeholderF: "webp",
  srcSetsF: "webp",
};

export const SUPPORTED_IMAGE_FORMATS =
  /\.(jpe?g|png|webp|avif|gif|tiff?|svg)(\?.*)?$/i;

const DEV_DIR = "/@oh-images/";
const BUILD_DIR = "/@oh-images/";

export function ohImage(options?: Partial<PluginConfig>) {
  let isBuild = false;
  let assetsDir!: string;
  let outDir!: string;
  let cacheDir!: string;
  const imageEntries = new Map<string, ImageEntry>();
  const config = { ...DEFAULT_CONFIGS, ...options };

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
      outDir = join(viteConfig.root, viteConfig.build.outDir);
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (!url?.includes(DEV_DIR) || !SUPPORTED_IMAGE_FORMATS.test(url)) {
          return next();
        }

        const path = urlToPath(url);
        const ext = extname(url).slice(1); // pad to get only ext
        const image = await readFileSafe(path);

        // if image is not found, we need to find origin process it and save it in cache
        // because images are lazy loaded
        const imageEntry = imageEntries.get(url);
        if (!imageEntry) {
          console.warn("Image entry not found with id: " + url);
          next();
          return;
        }

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
    load: {
      filter: {
        id: SUPPORTED_IMAGE_FORMATS,
      },
      async handler(id) {
        try {
          const parsed = queryToOptions(PROCESS_KEY, id);
          if (!parsed.shouldProcess) {
            return null;
          }
          const origin = parsed.path; // origin is the actual file path
          const { name, ext } = parse(parsed.path);
          const metadata = await sharp(parsed.path).metadata();

          const mergedOptions = {
            ...config,
            ...parsed.options,
          };

          const format =
            mergedOptions.format ?? (ext.slice(1) as keyof FormatEnum);

          const mainIdentifier = genIdentifier(name, format, "main");
          const mainEntry: ImageEntry = {
            width: mergedOptions.width,
            height: mergedOptions.height,
            blur: mergedOptions.blur,
            format: mergedOptions.format, // here format can be null as long as
            // there is format in name
            origin: origin,
          };
          imageEntries.set(mainIdentifier, mainEntry);

          const src: ImageSrc = {
            width: metadata.width,
            height: metadata.height,
            src: mainIdentifier,
            srcSets: [],
          };

          // if placeholder is specified as placeholder as well
          if (parsed.options?.placeholder) {
            const placeholderIdentifier = genIdentifier(
              name,
              mergedOptions.placeholderF,
              "placeholder",
            );
            const placeholderEntry: ImageEntry = {
              width: mergedOptions.placeholderW,
              height: mergedOptions.placeholderH,
              format: mergedOptions.placeholderF,
              blur: mergedOptions.placeholderB,
              origin: origin,
            };
            imageEntries.set(placeholderIdentifier, placeholderEntry);
            src.placeholderUrl = mainIdentifier;
          }

          if (mergedOptions.bps) {
            for (const breakpoint of mergedOptions.bps) {
              const srcSetIdentifier = genIdentifier(
                name,
                mergedOptions.srcSetsF,
                `breakpoint-${breakpoint}`,
              );
              const srcSetEntry: ImageEntry = {
                width: breakpoint,
                format: mergedOptions.srcSetsF,
                origin: origin,
              };
              imageEntries.set(srcSetIdentifier, srcSetEntry);
              src.srcSets.push({
                src: srcSetIdentifier,
                width: `${breakpoint}w`,
              });
            }
          }

          return `export default ${JSON.stringify(src)};`;
        } catch (err) {
          console.error(`Couldn't load image with id: ${id} error:${err}`);
          return null;
        }
      },
    },
    async writeBundle() {
      const limit = pLimit(30);
      const tasks = Array.from(imageEntries, ([key, value]) =>
        limit(async () => {
          const processed = await processImage(value.origin, value);
          const outputPath = join(outDir, key);
          await saveFileSafe(outputPath, processed);
        }),
      );
      await Promise.all(tasks);
    },
  } satisfies Plugin;
}

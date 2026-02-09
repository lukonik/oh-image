import { basename, extname, join, parse } from "node:path";
import type { ImageEntry, PluginConfig } from "./types";
import {
  getFileHash,
  processImage,
  queryToOptions,
  readFileSafe,
  saveFileSafe,
} from "./utils";
import type { FormatEnum } from "sharp";
import type { Plugin } from "vite";
import pLimit from "p-limit";
import sharp from "sharp";
import type { ImageSrc } from "../client";

const DEFAULT_IMAGE_FORMAT: keyof FormatEnum = "webp";
const PLACEHOLDER_IMG_SIZE = 8;
const PLACEHOLDER_BLUR_QUALITY = 70;

const DEFAULT_CONFIGS: PluginConfig = {
  distDir: "oh-images",
  bps: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
  format: "webp",
  placeholder: false,
};
const PROCESS_KEY = "oh";

export const SUPPORTED_IMAGE_FORMATS =
  /\.(jpe?g|png|webp|avif|gif|svg)(\?.*)?$/i;

const DEV_DIR = "/@oh-images/";

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
    hash: string,
  ) {
    const fileId = basename(uri);
    const uniqueFileId = `${prefix}-${hash}-${fileId}.${format}`;
    // for dev server the identifier will be  the fileId, with prefix so server middleware identifies correct request
    if (!isBuild) {
      return join(DEV_DIR, uniqueFileId);
    }

    // for build the joined path is returned with DIST_DIR and assets that server will handle properly
    return join(assetsDir, config.distDir, uniqueFileId);
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

          const hash = await getFileHash(origin);

          const mergedOptions = {
            ...config,
            ...parsed.options,
          };

          const format =
            mergedOptions.format ?? (ext.slice(1) as keyof FormatEnum);

          const mainIdentifier = genIdentifier(name, format, "main", hash);
          const mainEntry: ImageEntry = {
            width: mergedOptions.width,
            height: mergedOptions.height,
            format: mergedOptions.format, // here format can be null as long as
            // there is format in name
            origin: origin,
          };
          imageEntries.set(mainIdentifier, mainEntry);

          const src: ImageSrc = {
            width: metadata.width,
            height: metadata.height,
            src: mainIdentifier,
            srcSets: "",
          };

          // if placeholder is specified as placeholder as well
          if (parsed.options?.placeholder) {
            let placeholderHeight: number = 0;
            let placeholderWidth: number = 0;

            // Shrink the image's largest dimension
            if (metadata.width >= metadata.height) {
              placeholderWidth = PLACEHOLDER_IMG_SIZE;
              placeholderHeight = Math.max(
                Math.round(
                  (metadata.height / metadata.width) * PLACEHOLDER_IMG_SIZE,
                ),
                1,
              );
            } else {
              placeholderWidth = Math.max(
                Math.round(
                  (metadata.width / metadata.height) * PLACEHOLDER_IMG_SIZE,
                ),
                1,
              );
              placeholderHeight = PLACEHOLDER_IMG_SIZE;
            }
            const placeholderIdentifier = genIdentifier(
              name,
              DEFAULT_IMAGE_FORMAT,
              "placeholder",
              hash,
            );
            const placeholderEntry: ImageEntry = {
              width: placeholderWidth,
              height: placeholderHeight,
              format: DEFAULT_IMAGE_FORMAT,
              blur: PLACEHOLDER_BLUR_QUALITY,
              origin: origin,
            };
            imageEntries.set(placeholderIdentifier, placeholderEntry);
            src.placeholderUrl = placeholderIdentifier;
          }

          if (mergedOptions.bps) {
            const srcSets: string[] = [];
            for (const breakpoint of mergedOptions.bps) {
              const srcSetIdentifier = genIdentifier(
                name,
                DEFAULT_IMAGE_FORMAT,
                `breakpoint-${breakpoint}`,
                hash,
              );
              const srcSetEntry: ImageEntry = {
                width: breakpoint,
                format: DEFAULT_IMAGE_FORMAT,
                origin: origin,
              };
              imageEntries.set(srcSetIdentifier, srcSetEntry);
              srcSets.push(`${srcSetIdentifier} ${breakpoint}w`);
            }
            src.srcSets = srcSets.join(", ");
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

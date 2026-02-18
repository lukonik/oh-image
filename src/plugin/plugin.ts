import { basename, extname, join, parse } from "node:path";
import type { PluginConfig, ImageSrc } from "./types";
import { queryToOptions } from "./utils";
import { getFileHash, readFileSafe, saveFileSafe } from "./file-utils";
import { createImageIdentifier } from "./image-identifier";
import { createImageEntries } from "./image-entries";
import type { FormatEnum } from "sharp";
import type { Plugin } from "vite";
import pLimit from "p-limit";
import sharp from "sharp";
import { processImage } from "./image-process";

const DEFAULT_IMAGE_FORMAT: keyof FormatEnum = "webp";

const DEFAULT_CONFIGS: PluginConfig = {
  distDir: "oh-images",
  breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
  format: "webp",
  placeholder: true,
};
const PROCESS_KEY = "oh";

export const SUPPORTED_IMAGE_FORMATS =
  /\.(jpe?g|png|webp|avif|gif|svg)(\?.*)?$/i;

export const DEV_DIR = "/@oh-images/";

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
      outDir = join(viteConfig.root, viteConfig.build.outDir);
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

          const hash = await getFileHash(origin, parsed.queryString);

          const mergedOptions = {
            ...config,
            ...parsed.options,
          };

          const format =
            mergedOptions.format ?? (ext.slice(1) as keyof FormatEnum);
          const identifier = createImageIdentifier(name, hash, {
            isBuild,
            devDir: DEV_DIR,
            assetsDir,
            distDir: config.distDir,
          });

          const mainIdentifier = identifier.main(format);
          imageEntries.createMainEntry(mainIdentifier, {
            width: mergedOptions.width,
            height: mergedOptions.height,
            format: mergedOptions.format,
            origin: origin,
            blur: mergedOptions.blur,
            flip: mergedOptions.flip,
            flop: mergedOptions.flop,
            rotate: mergedOptions.rotate,
            sharpen: mergedOptions.sharpen,
            median: mergedOptions.median,
            gamma: mergedOptions.gamma,
            negate: mergedOptions.negate,
            normalize: mergedOptions.normalize,
            threshold: mergedOptions.threshold,
          });

          const src: ImageSrc = {
            width: metadata.width,
            height: metadata.height,
            src: mainIdentifier,
            srcSet: "",
          };

          // if placeholder is specified as placeholder as well
          if (mergedOptions.placeholder) {
            const placeholderIdentifier =
              identifier.placeholder(DEFAULT_IMAGE_FORMAT);
            imageEntries.createPlaceholderEntry(placeholderIdentifier, {
              width: metadata.width!,
              height: metadata.height!,
              format: DEFAULT_IMAGE_FORMAT,
              origin: origin,
              flip: mergedOptions.flip,
              flop: mergedOptions.flop,
              rotate: mergedOptions.rotate,
              sharpen: mergedOptions.sharpen,
              median: mergedOptions.median,
              gamma: mergedOptions.gamma,
              negate: mergedOptions.negate,
              normalize: mergedOptions.normalize,
              threshold: mergedOptions.threshold,
            });
            src.placeholder = placeholderIdentifier;
          }

          if (mergedOptions.breakpoints) {
            const srcSets: string[] = [];
            for (const breakpoint of mergedOptions.breakpoints) {
              const srcSetIdentifier = identifier.srcSet(
                DEFAULT_IMAGE_FORMAT,
                breakpoint,
              );
              imageEntries.createSrcSetEntry(srcSetIdentifier, {
                width: breakpoint,
                format: DEFAULT_IMAGE_FORMAT,
                origin: origin,
                blur: mergedOptions.blur,
                flip: mergedOptions.flip,
                flop: mergedOptions.flop,
                rotate: mergedOptions.rotate,
                sharpen: mergedOptions.sharpen,
                median: mergedOptions.median,
                gamma: mergedOptions.gamma,
                negate: mergedOptions.negate,
                normalize: mergedOptions.normalize,
                threshold: mergedOptions.threshold,
              });
              srcSets.push(`${srcSetIdentifier} ${breakpoint}w`);
            }
            src.srcSet = srcSets.join(", ");
          }

          return `
               import { __imageFactory } from "@lonik/oh-image/react";

           export default __imageFactory(${JSON.stringify({ width: src.width, height: src.height, src: src.src, srcSet: src.srcSet, placeholder: src.placeholder, alt: "" })})
`;
        } catch (err) {
          console.error(`Couldn't load image with id: ${id} error:${err}`);
          return null;
        }
      },
    },
    async writeBundle() {
      const limit = pLimit(30);
      const tasks = Array.from(imageEntries.entries(), ([key, value]) =>
        limit(async () => {
          const processed = await processImage(value.origin, value);
          const outputPath = join(outDir, key);
          await saveFileSafe(outputPath, processed);
        }),
      );
      await Promise.all(tasks);
    },
  };
}

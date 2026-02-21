import { basename, extname, join, parse } from "node:path";
import type { PluginConfig, ImageSrc, ImageEntry } from "./types";
import {
  getCleanExt,
  queryToOptions,
  resolveBreakpoints,
  resolveBreakpointTransforms,
  resolvePlaceholderTransforms,
  resolveShowPlaceholder,
  resolveTransforms,
} from "./utils";
import { getFileHash, readFileSafe, saveFileSafe } from "./file-utils";
import { createImageIdentifier } from "./image-identifier";
import { createImageEntries } from "./image-entries";
import type { Plugin } from "vite";
import pLimit from "p-limit";
import sharp from "sharp";
import { processImage } from "./image-process";

const DEFAULT_CONFIGS: PluginConfig = {
  distDir: "oh-images",
  breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
  transforms: {
    format: "webp",
  },
  pl_show: true,
  placeholder: {
    quality: 10,
    blur: 50,
    format: "webp",
  },
};
const PROCESS_KEY = "$oh";

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
    async load(id) {
      if (!SUPPORTED_IMAGE_FORMATS.test(id)) {
        return null;
      }
      try {
        const parsed = queryToOptions(PROCESS_KEY, id);
        if (!parsed.shouldProcess) {
          return null;
        }
        const origin = parsed.path; // origin is the actual file path
        const { name } = parse(parsed.path);
        const metadata = await sharp(parsed.path).metadata();
        const ext = getCleanExt(parsed.path);

        const hash = await getFileHash(origin, parsed.queryString);

        const transforms = resolveTransforms(
          parsed.transforms,
          config.transforms,
          metadata,
          ext,
        );

        const identifier = createImageIdentifier(name, hash, {
          isBuild,
          devDir: DEV_DIR,
          assetsDir,
          distDir: config.distDir,
        });

        const mainIdentifier = identifier.main(transforms.format);
        const mainEntry: ImageEntry = {
          ...transforms,
          origin,
        };
        imageEntries.createMainEntry(mainIdentifier, mainEntry);

        const src: ImageSrc = {
          width: transforms.width,
          height: transforms.height,
          src: mainIdentifier,
          srcSet: "",
        };
        // if placeholder is specified as placeholder as well
        const pl_show = resolveShowPlaceholder(parsed.placeholder, config);
        if (pl_show) {
          const placeholderTransforms = resolvePlaceholderTransforms(
            parsed.placeholder,
            config.placeholder,
            metadata,
          );
          const placeholderEntry: ImageEntry = {
            ...placeholderTransforms,
            origin: origin,
          };
          const placeholderIdentifier = identifier.placeholder(
            placeholderTransforms.format,
          );
          imageEntries.createPlaceholderEntry(
            placeholderIdentifier,
            placeholderEntry,
          );
          src.placeholder = placeholderIdentifier;
        }

        const breakpoints = resolveBreakpoints(transforms, config);
        if (breakpoints) {
          const srcSets: string[] = [];
          for (const breakpoint of breakpoints) {
            const breakpointTransforms = resolveBreakpointTransforms(
              parsed.transforms,
              config.transforms,
              breakpoint,
            );
            const srcSetIdentifier = identifier.srcSet(
              breakpointTransforms.format,
              breakpoint,
            );
            const breakpointEntry: ImageEntry = {
              ...breakpointTransforms,
              origin: origin,
            };
            imageEntries.createSrcSetEntry(srcSetIdentifier, breakpointEntry);
            srcSets.push(`${srcSetIdentifier} ${breakpoint}w`);
          }
          src.srcSet = srcSets.join(", ");
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

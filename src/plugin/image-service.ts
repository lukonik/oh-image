import createImageCache from "./image-cache";
import { createImageDescriptor } from "./image-descriptor";
import createImageNaming from "./image-naming";
import createImageProcessor from "./image-processor";
import createImageRegistry from "./image-registry";
import type {
  OhImageOptions,
  OhImagePluginConfig,
  ProcessedImage,
} from "./types";
import { getResizeOptions } from "./options-resolver";
import { parse, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

export type ImageService = ReturnType<typeof createImageService>;

export default function createImageService(config: OhImagePluginConfig) {
  const processor = createImageProcessor();
  const registry = createImageRegistry();
  const cache = createImageCache(config.cacheDir);

  return {
    create: async (id: string, options: OhImageOptions) => {
      const parsedId = parse(id);
      const naming = createImageNaming(config.prefix, parsedId.name);
      const metadata = await processor.metadata(id);
      const format = options.format ?? metadata.format;
      // add main image registry
      registry.add(naming.imageId(format), {
        src: naming.imageId(format),
        width: metadata.width,
        height: metadata.height,
        origin: id,
        format: format,
      });
      const processedImage: ProcessedImage = {
        width: metadata.width,
        height: metadata.height,
        src: naming.imageId(format),
        srcSets: [],
      };

      if (options.blur) {
        const blurId = naming.blurId("webp");
        registry.add(blurId, {
          src: blurId,
          origin: id,
          width: 100,
          height: 100,
          blur: options.blur,
        });
      }

      if (options.breakpoints) {
        for (const breakpoint of options.breakpoints) {
          const srcSetId = naming.srcSetId(breakpoint, "webp");
          processedImage.srcSets.push(srcSetId);
          registry.add(srcSetId, {
            src: srcSetId,
            width: breakpoint,
            origin: id,
          });
        }
      }

      return processedImage;
    },

    getImage: async (url: string) => {
      const { fullName, ext } = createImageDescriptor(url);
      const file = await cache.read(fullName);

      if (file) {
        return { data: file, format: ext };
      }

      const registeredImage = registry.get(fullName);
      if (!registeredImage) {
        throw new Error(`Image ${fullName} not found`);
      }
      const resizeOption = getResizeOptions({
        width: registeredImage.width,
        height: registeredImage.height,
      });
      const image = await processor.process(registeredImage.origin, {
        resize: resizeOption,
        format: "webp",
      });
      await cache.write(fullName, image);

      return { data: await cache.read(fullName), format: ext.slice(1) };
    },
    async reset() {
      await cache.clear();
    },

    async writeToDist() {
      console.log("CREATING DIST")
      await mkdir(config.distDir, { recursive: true });

      for (const [id, registeredImage] of registry.all()) {
        const cachedFile = await cache.read(id);

        if (cachedFile) {
          await writeFile(join(config.distDir, id), cachedFile);
          continue;
        }

        const resizeOption = getResizeOptions({
          width: registeredImage.width,
          height: registeredImage.height,
        });

        const image = await processor.process(registeredImage.origin, {
          resize: resizeOption,
          blur: registeredImage.blur === true ? 10 : registeredImage.blur || undefined,
          format: registeredImage.format ?? "webp",
        });

        await cache.write(id, image);
        await writeFile(join(config.distDir, id), image);
      }
    },
  };
}

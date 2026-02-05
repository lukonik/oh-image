import createImageCache from "./image-cache";
import { ImageDescriptor } from "./image-descriptor";
import createImageNaming from "./image-naming";
import createImageProcessor from "./image-processor";
import createImageRegistry from "./image-registry";
import type {
  OhImageOptions,
  OhImagePluginConfig,
  ProcessedImage,
} from "./types";
import { getResizeOptions } from "./options-resolver";
import { basename, parse } from "node:path";

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
      registry.add(naming.imageId, {
        src: `${naming.imageId}.${format}`,
        width: metadata.width,
        height: metadata.height,
        origin: id,
      });
      const processedImage: ProcessedImage = {
        width: metadata.width,
        height: metadata.height,
        src: `${naming.imageId}.${format}`,
        srcSets: [],
      };

      if (options.blur) {
        // const blurId = naming.blurId();
        // registry.add(blurId, {
        //   src: blurId,
        // });
      }

      if (options.breakpoints) {
        for (const breakpoint of options.breakpoints) {
          const srcSetId = naming.srcSetId(breakpoint);
          processedImage.srcSets.push(srcSetId);
          registry.add(naming.imageId, {
            src: srcSetId,
            width: breakpoint,
            origin: id,
          });
        }
      }

      return processedImage;
    },

    processOld: async (id: string, options: OhImageOptions) => {
      const descriptor = ImageDescriptor.fromId(id);
      const naming = createImageNaming(config.prefix, descriptor.name);
      const metadata = await processor.metadata(descriptor.path);
      const format = options.format ?? metadata.format;
      const processedImage: ProcessedImage = {
        width: metadata.width,
        height: metadata.height,
        src: `${naming.imageId}.${format}`,
        srcSets: [],
      };
      const image = await processor.process(descriptor.path, {
        format: options.format,
        resize: getResizeOptions(options),
      });
      await cache.write(`${naming.imageId}.${format}`, image);

      if (options.blur) {
        const blurId = naming.blurId();
        const blurImage = await processor.process(descriptor.path, {
          blur: options.blur,
          format: "webp",
        });
        await cache.write(blurId, blurImage);
        processedImage.blur = blurId;
      }

      if (options.breakpoints) {
        const srcSetResults = await Promise.all(
          options.breakpoints.map(async (breakpoint) => {
            const srcSetId = naming.srcSetId(breakpoint);
            const srcSetImage = await processor.process(descriptor.path, {
              resize: breakpoint,
              format: "webp",
            });
            await cache.write(srcSetId, srcSetImage);
            return srcSetId;
          }),
        );
        processedImage.srcSets.push(...srcSetResults);
      }

      registry.add(processedImage);
      return processedImage;
    },
    getImage: async (url: string) => {
      const { ext,name } = parse(url);
      const fullName = basename(url);
      const file = await cache.read(fullName);

      if (file) {
        return { data: file, format: ext.slice(1) };
      }

      const registeredImage = registry.get(name);
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
  };
}

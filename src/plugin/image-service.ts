import { pipeline } from "node:stream/promises";
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

export type ImageService = ReturnType<typeof createImageService>;

export default function createImageService(
  isBuild: boolean,
  config: OhImagePluginConfig,
) {
  const processor = createImageProcessor();
  const registry = createImageRegistry();
  const cache = createImageCache("");
  const srcPrefix = config.prefix;
  //  isBuild ? config.distDir : config.cacheDir;

  return {
    process: async (id: string, options: OhImageOptions) => {
      const descriptor = ImageDescriptor.fromId(id);
      const naming = createImageNaming(srcPrefix, descriptor.name);
      const metadata = await processor.metadata(descriptor.path);
      const format = options.format ?? metadata.format;
      const processedImage: ProcessedImage = {
        width: metadata.width,
        height: metadata.height,
        src: `${naming.imageId}.${format}`,
        srcSets: [],
      };
      await pipeline(
        processor.process(descriptor.path, {
          format: options.format,
          resize: getResizeOptions(options),
        }),
        cache.put(naming.imageId),
      );

      if (options.blur) {
        const blurId = naming.blurId();
        await pipeline(
          processor.process(descriptor.path, {
            blur: options.blur,
            format: "webp",
          }),
          cache.put(blurId),
        );
        processedImage.blur = blurId;
      }

      registry.add(processedImage);
    },
  };
}

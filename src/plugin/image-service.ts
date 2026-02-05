import { pipeline } from "node:stream/promises";
import createImageCache from "./image-cache";
import { ImageDescriptor } from "./image-descriptor";
import createImageNaming from "./image-naming";
import createImageProcessor from "./image-processor";
import createImageRegistry from "./image-registry";

export default function createImageService() {
  const processor = createImageProcessor();
  const registry = createImageRegistry();
  const cache = createImageCache("");
  const naming = createImageNaming("");

  const generateSrcSets = () => {};

  return {
    process: async (id: string) => {
      const descriptor = ImageDescriptor.fromId(id);
      const imageId = naming.image(descriptor.name);
      const metadata = await processor.metadata(descriptor.path);
      await pipeline(
        processor.process(descriptor.path).toFormat("webp").stream(),
        cache.put(imageId),
      );

      const blurId = naming.blur(imageId);
      await pipeline(
        processor
          .process(descriptor.path)
          .blur()
          .resize(100)
          .toFormat("webp")
          .stream(),
        cache.put(blurId),
      );

      const breakpoints = [
        16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920,
      ];

      const srcSets = breakpoints.map((b) => naming.srcSet(imageId, b));

      await Promise.all(
        breakpoints.map((b, i) =>
          pipeline(
            processor
              .process(descriptor.path)
              .resize(b)
              .toFormat("webp")
              .stream(),
            cache.put(srcSets[i]!),
          ),
        ),
      );

      registry.add({
        src: naming.withFormat(imageId, "webp"),
        blur: naming.withFormat(blurId, "webp"),
        srcSets: srcSets,
        width: metadata.width || 0,
        height: metadata.height || 0,
      });
    },
  };
}

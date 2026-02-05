import type { ProcessedImage } from "./types";

export default function createImageRegistry() {
  const _images = new Set<ProcessedImage>();

  return {
    add: (image: ProcessedImage) => _images.add(image),
    all: () => _images.entries(),
  };
}

import type { RegisteredImage } from "./types";

export default function createImageRegistry() {
  const _images = new Map<string, RegisteredImage>();

  return {
    add: (id: string, image: RegisteredImage) => _images.set(id, image),
    all: () => _images.entries(),
    get: (id: string) => _images.get(id),
  };
}

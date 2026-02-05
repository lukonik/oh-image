import type { FormatEnum } from "sharp";

interface RegisteredImage {
  width?: number;
  height?: number;
  blur?: boolean | number;
  origin: string;
  src: string;
  format?: keyof FormatEnum | undefined;
}

/**
 * Image registry that keeps all the images
 * blur,srcSet and default images will be kept here
 * @returns
 */
export default function createImageRegistry() {
  const _images = new Map<string, RegisteredImage>();

  return {
    add: (id: string, image: RegisteredImage) => _images.set(id, image),
    all: () => _images.entries(),
    get: (id: string) => _images.get(id),
  };
}

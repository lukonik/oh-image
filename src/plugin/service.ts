import { basename, join, parse } from "node:path";
import { metadata, process } from "./processor";
import registry from "./registry";
import { getRandomString } from "./utils";
import type { FormatEnum } from "sharp";
import { getImageUrlPath, getCachePath } from "./config";
import { read, write } from "./cache";

interface ServiceImage {
  width: number;
  height: number;
  blurUrl?: string;
  srcSets: string[];
  src: string;
  format: keyof FormatEnum;
}

interface ServiceOptions {
  breakpoints?: number[] | undefined;
  blur?: boolean | undefined;
}

/** Creates a URL path for the browser to request */
function createImageUrl(name: string) {
  return `${getImageUrlPath()}/${name}`;
}

/** Creates a filesystem path for caching */
function createCachePath(name: string) {
  return join(getCachePath(), name);
}

const create = async (id: string, options: ServiceOptions) => {
  const { width, height } = await metadata(id);
  const { ext } = parse(id);
  const filename = `${getRandomString()}${ext}`;
  const src = createImageUrl(filename);

  const serviceImage: ServiceImage = {
    height,
    src,
    width,
    srcSets: [],
    format: "webp",
  };

  // Registry uses URL paths as keys (what the browser requests)
  registry.add(src, {
    width,
    height,
    origin: id,
    format: ext.slice(1),
  });

  if (options.blur) {
    const blurFilename = `${getRandomString()}-blur${ext}`;
    const blurUrl = createImageUrl(blurFilename);
    serviceImage.blurUrl = blurUrl;
    registry.add(blurUrl, {
      width: 100,
      height: 100,
      origin: id,
      format: "webp",
    });
  }

  if (options.breakpoints) {
    for (const breakpoint of options.breakpoints) {
      const srcSetFilename = `${getRandomString()}-${breakpoint}w${ext}`;
      const srcSetUrl = createImageUrl(srcSetFilename);
      serviceImage.srcSets.push(srcSetUrl);
      registry.add(srcSetUrl, {
        width: breakpoint,
        height: breakpoint,
        origin: id,
        format: "webp",
      });
    }
  }

  return serviceImage;
};

/** Get image for dev server - processes on demand */
const getImage = async (url: string) => {
  // Extract filename from URL path (e.g., "/@oh-image/abc123.jpg" -> "abc123.jpg")
  const filename = basename(url);
  const cachePath = createCachePath(filename);

  // Registry is keyed by URL path
  const registryImage = registry.get(url);
  if (!registryImage) {
    throw new Error(`Image not found in registry: ${url}`);
  }

  // Try to read from cache first
  const cached = await read(cachePath);
  if (cached) {
    return { data: cached, format: registryImage.format };
  }

  // Process the image
  const processed = await process(registryImage.origin, {
    resize: registryImage.width,
  });
  const buffer = await processed.toBuffer();

  // Write to cache
  await write(cachePath, buffer);

  return { data: buffer, format: registryImage.format };
};

export { create, getImage, createCachePath };

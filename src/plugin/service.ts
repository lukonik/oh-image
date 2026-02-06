import { basename, join, parse } from "node:path";
import { metadata, process } from "./processor";
import registry from "./registry";
import { getRandomString } from "./utils";
import type { FormatEnum } from "sharp";
import { getImageUrlPath, getCachePath } from "./config";
import { read, write } from "./cache";
import type { ImageSrc } from "./types";

interface ServiceOptions {
  bps?: number[] | undefined;
  blur?: boolean | undefined;
  width?: number | undefined;
  height?: number | undefined;
  format?: keyof FormatEnum | undefined;
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
  const originalMetadata = await metadata(id);
  const { ext } = parse(id);
  const filename = `${getRandomString()}${ext}`;
  const src = createImageUrl(filename);

  // Use options width/height if provided, otherwise use original dimensions
  const width = options.width ?? originalMetadata.width;
  const height = options.height ?? originalMetadata.height;
  const format = options.format ?? "webp";

  const serviceImage: ImageSrc = {
    height,
    src,
    width,
    srcSets: [],
    format,
  };

  // Registry uses URL paths as keys (what the browser requests)
  registry.add(src, {
    width,
    height,
    origin: id,
    format,
  });

  if (options.blur) {
    const blurFilename = `${getRandomString()}-blur${ext}`;
    const blurUrl = createImageUrl(blurFilename);
    serviceImage.blurUrl = blurUrl;
    registry.add(blurUrl, {
      width: 100,
      height: 100,
      origin: id,
      format,
    });
  }

  if (options.bps) {
    for (const breakpoint of options.bps) {
      const srcSetFilename = `${getRandomString()}-${breakpoint}w${ext}`;
      const srcSetUrl = createImageUrl(srcSetFilename);
      serviceImage.srcSets.push(srcSetUrl);
      registry.add(srcSetUrl, {
        width: breakpoint,
        height: breakpoint,
        origin: id,
        format,
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
  const processed = process(registryImage.origin, {
    resize: {
      width: registryImage.width,
      height: registryImage.height,
    },
    format: registryImage.format as keyof FormatEnum,
  });
  const buffer = await processed.toBuffer();

  // Write to cache
  await write(cachePath, buffer);

  return { data: buffer, format: registryImage.format };
};

/** Write all registered images to dist folder for production build */
const writeToDist = async (distPath: string) => {
  for (const [url, imageInfo] of registry.all()) {
    const filename = basename(url);
    const cachePath = createCachePath(filename);
    const distFilePath = join(distPath, filename);

    // Try cache first
    const buffer = await read(cachePath);

    if (buffer) {
      // Write cached image to dist
      await write(distFilePath, buffer);
    } else {
      // Process the image
      const processed = process(imageInfo.origin, {
        resize: {
          width: imageInfo.width,
          height: imageInfo.height,
        },
        format: imageInfo.format as keyof FormatEnum,
      });
      const newBuffer = await processed.toBuffer();
      // Write to cache for future builds
      await write(cachePath, newBuffer);
      // Write to dist
      await write(distFilePath, newBuffer);
    }
  }

  return registry.size();
};

export { create, getImage, createCachePath, writeToDist };

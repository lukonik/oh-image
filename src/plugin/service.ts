import { basename, format, join, parse } from "node:path";
import { metadata, process } from "./processor";
import registry from "./registry";
import { getRandomString } from "./utils";
import type { FormatEnum } from "sharp";
import { getImagePath, getViteConfig } from "./config";
import { read, write } from "./cache";

interface ServiceImage {
  width: number;
  height: number;
  blurUrl?: string;
  srcSets: string[];
  src: string;
  format: keyof FormatEnum;
}

const breakpoints = [1200, 1400, 1800, 600, 200];

interface ServiceOptions {
  breakpoints?: number[];
  blur?: boolean;
}

function createImagePath(name: string) {
  return `${getImagePath()}/${name}`;
}

const create = async (id: string, options: ServiceOptions) => {
  const { width, height } = await metadata(id);
  const { ext } = parse(id);
  const src = createImagePath(`${getRandomString()}${ext}`);

  const serviceImage: ServiceImage = {
    height,
    src,
    width,
    srcSets: [],
    format: "webp",
  };

  registry.add(src, {
    width,
    height,
    origin: id,
    format: ext.slice(1),
  });

  if (options.blur) {
    const blurId = createImagePath(`${getRandomString()}-blur${ext}`);
    serviceImage.blurUrl = blurId;
    registry.add(blurId, {
      width: 100,
      height: 100,
      origin: id,
      format: "webp",
    });
  }

  if (options.breakpoints) {
    for (const breakpoint of options.breakpoints) {
      const srcSetId = createImagePath(
        `${getRandomString()}-${breakpoint}w${ext}`,
      );
      serviceImage.srcSets.push(srcSetId);
      registry.add(srcSetId, {
        width: breakpoint,
        height: breakpoint,
        origin: id,
        format: "webp",
      });
    }
  }

  return serviceImage;
};

const getImage = async (id: string) => {
  const base = basename(id);
  const fullPath = createImagePath(base);
  const resolvedFullPath = join(getViteConfig().root, fullPath);
  const image = await read(resolvedFullPath);
  const registryImage = registry.get(resolvedFullPath);
  if (!registryImage) {
    throw new Error(`Image ${fullPath} not found`);
  }
  if (image) {
    return { data: image, format: registryImage.format };
  }

  const processed = await process(registryImage.origin, {});

  await write(fullPath, processed);

  return { data: processed, format };
};

export { create, getImage };

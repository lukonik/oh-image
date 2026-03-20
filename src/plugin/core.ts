import { parse, join } from "pathe";
import type { PluginConfig, ImageSrc, ImageEntry } from "./types";
import {
  getCleanExt,
  queryToOptions,
  resolveBreakpoints,
  resolveBreakpointTransforms,
  resolvePlaceholderTransforms,
  resolveShowPlaceholder,
  resolveTransforms,
} from "./utils";
import { getFileHash, saveFileSafe } from "./file-utils";
import { createImageIdentifier } from "./image-identifier";
import type { createImageEntries } from "./image-entries";
import pLimit from "p-limit";
import sharp from "sharp";
import { processImage } from "./image-process";

export const PROCESS_KEY = "$oh";

export const SUPPORTED_IMAGE_FORMATS =
  /\.(jpe?g|png|webp|avif|gif|svg)(\?.*)?$/i;

export const DEV_DIR = "/@oh-images/";

export const DEFAULT_CONFIGS: PluginConfig = {
  distDir: "oh-images",
  breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
  transforms: {
    format: "webp",
  },
  pl_show: true,
  placeholder: {
    quality: 10,
    blur: 50,
    format: "webp",
  },
};

export async function handleImageLoad({
  id,
  config,
  imageEntries,
  isBuild,
  assetsDir,
}: {
  id: string;
  config: PluginConfig;
  imageEntries: ReturnType<typeof createImageEntries>;
  isBuild: boolean;
  assetsDir: string;
}): Promise<ImageSrc | null> {
  if (!SUPPORTED_IMAGE_FORMATS.test(id)) {
    return null;
  }
  const parsed = queryToOptions(PROCESS_KEY, id);
  if (!parsed.shouldProcess) {
    return null;
  }
  const origin = parsed.path; // origin is the actual file path
  const { name } = parse(parsed.path);
  const metadata = await sharp(parsed.path).metadata();
  const ext = getCleanExt(parsed.path);

  const hash = await getFileHash(origin, parsed.queryString);

  const transforms = resolveTransforms(
    parsed.transforms,
    config.transforms,
    metadata,
    ext,
  );

  const identifier = createImageIdentifier(name, hash, {
    isBuild,
    devDir: DEV_DIR,
    assetsDir,
    distDir: config.distDir,
  });

  const mainIdentifier = identifier.main(transforms.format);
  const mainEntry: ImageEntry = {
    ...transforms,
    origin,
  };
  imageEntries.createMainEntry(mainIdentifier, mainEntry);

  const src: ImageSrc = {
    width: transforms.width,
    height: transforms.height,
    src: mainIdentifier,
    srcSet: "",
  };
  // if placeholder is specified as placeholder as well
  const pl_show = resolveShowPlaceholder(parsed.placeholder, config);
  if (pl_show) {
    const placeholderTransforms = resolvePlaceholderTransforms(
      parsed.placeholder,
      config.placeholder,
      metadata,
    );
    const placeholderEntry: ImageEntry = {
      ...placeholderTransforms,
      origin: origin,
    };
    const placeholderIdentifier = identifier.placeholder(
      placeholderTransforms.format,
    );
    imageEntries.createPlaceholderEntry(
      placeholderIdentifier,
      placeholderEntry,
    );
    src.placeholder = placeholderIdentifier;
  }

  const breakpoints = resolveBreakpoints(transforms, config);
  if (breakpoints) {
    const srcSets: string[] = [];
    for (const breakpoint of breakpoints) {
      const breakpointTransforms = resolveBreakpointTransforms(
        parsed.transforms,
        config.transforms,
        breakpoint,
      );
      const srcSetIdentifier = identifier.srcSet(
        breakpointTransforms.format,
        breakpoint,
      );
      const breakpointEntry: ImageEntry = {
        ...breakpointTransforms,
        origin: origin,
      };
      imageEntries.createSrcSetEntry(srcSetIdentifier, breakpointEntry);
      srcSets.push(`${srcSetIdentifier} ${breakpoint}w`);
    }
    src.srcSet = srcSets.join(", ");
  }

  return src;
}

export async function handleWriteBundle(
  imageEntries: ReturnType<typeof createImageEntries>,
  outDir: string
) {
  const limit = pLimit(30);
  const tasks = Array.from(imageEntries.entries(), ([key, value]) =>
    limit(async () => {
      const processed = await processImage(value.origin, value);
      const outputPath = join(outDir, key);
      await saveFileSafe(outputPath, processed);
    }),
  );
  await Promise.all(tasks);
}

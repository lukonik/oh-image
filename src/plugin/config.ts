import { normalize, resolve } from "node:path";
import type { ResolvedConfig } from "vite";
import type { PluginConfig } from "./types";

const CONFIG: PluginConfig = {
  cacheDir: "",
  distDir: "oh-image",
  breakpoints: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  blur: true,
};

let resolvedConfig!: ResolvedConfig;

const defineConfig = (
  viteConfig: ResolvedConfig,
  config?: Partial<PluginConfig>,
) => {
  CONFIG.cacheDir = normalize(config?.cacheDir ?? ".cache/oh-image");
  CONFIG.distDir = config?.distDir ?? "oh-image";
  resolvedConfig = viteConfig;
};

const getConfigValue = <K extends keyof PluginConfig>(
  key: K,
): PluginConfig[K] => {
  return CONFIG[key];
};

const getViteConfig = () => {
  return resolvedConfig;
};

const isBuild = () => resolvedConfig.command === "build";

/** Returns the URL path used in generated code (what the browser requests) */
const getImageUrlPath = () => {
  const base = resolvedConfig.base ?? "/";
  return isBuild()
    ? `${base}${CONFIG.distDir}` // e.g., "/oh-image" or "/base/oh-image"
    : `/@oh-image`; // Dev server virtual path
};

/** Returns the filesystem path for caching processed images */
const getCachePath = () => {
  return resolve(resolvedConfig.root, CONFIG.cacheDir);
};

/** Returns the filesystem path for build output */
const getDistPath = () => {
  return resolve(
    resolvedConfig.root,
    resolvedConfig.build.outDir,
    CONFIG.distDir,
  );
};

export {
  defineConfig,
  getConfigValue,
  getViteConfig,
  getImageUrlPath,
  getCachePath,
  getDistPath,
  isBuild,
};

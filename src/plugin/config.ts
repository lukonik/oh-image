import { normalize, resolve } from "node:path";
import type { ResolvedConfig } from "vite";

export interface Config {
  cacheDir: string;
  distDir: string;
  breakpoints?: string[];
  blur?: boolean;
}

const CONFIG: Config = {
  cacheDir: "",
  distDir: "oh-image",
};

let resolvedConfig!: ResolvedConfig;

const defineConfig = (viteConfig: ResolvedConfig, config: Partial<Config>) => {
  CONFIG.cacheDir = normalize(config.cacheDir ?? ".cache/oh-image");
  CONFIG.distDir = config.distDir ?? "oh-image";
  resolvedConfig = viteConfig;
};

const getConfigValue = <K extends keyof Config>(key: K): Config[K] => {
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
  return resolve(resolvedConfig.root, resolvedConfig.build.outDir, CONFIG.distDir);
};

export { defineConfig, getConfigValue, getViteConfig, getImageUrlPath, getCachePath, getDistPath, isBuild };

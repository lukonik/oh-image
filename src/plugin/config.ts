import { normalize } from "node:path";
import type { ResolvedConfig } from "vite";

export interface Config {
  cacheDir: string;
  breakpoints?: string[];
  blur?: boolean;
}

const CONFIG: Config = {
  cacheDir: "",
};

let resolvedConfig!: ResolvedConfig;

const defineConfig = (viteConfig: ResolvedConfig, config: Config) => {
  CONFIG.cacheDir = normalize(config.cacheDir);
  resolvedConfig = viteConfig;
};

const getConfigValue = <K extends keyof Config>(key: K): Config[K] => {
  return CONFIG[key];
};

const getViteConfig = () => {
  return resolvedConfig;
};

const getImagePath = () => {
  return resolvedConfig.command === "build"
    ? getConfigValue("cacheDir")
    : getConfigValue("cacheDir");
};


export { defineConfig, getConfigValue, getViteConfig, getImagePath };

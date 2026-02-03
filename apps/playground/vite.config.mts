/// <reference types='vitest' />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { ohImage } from "../../packages/oh-image/src/plugin";
export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: "../../node_modules/.vite/apps/playground",
  server: {
    port: 4200,
    host: "localhost",
  },
  preview: {
    port: 4200,
    host: "localhost",
  },
  plugins: [
    tsconfigPaths({
      configNames: ["tsconfig.app.json", "../../tsconfig.base.json"],
    }),
    react(),
    ohImage(),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));

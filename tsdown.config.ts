import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "neutral",
  entry: {
    plugin: "src/plugin/index.ts",
    react: "src/react/index.ts",
  },
  external: [
    "react",
    "react-dom",
    "node:path",
    "node:fs",
    "node:fs/promises",
    "cacache",
    "node:crypto",
    "sharp",
    "path",
    "node:stream/promises",
  ],
});

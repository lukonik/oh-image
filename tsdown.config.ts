import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "node",
  entry: {
    plugin: "src/plugin/index.ts",
    react: "src/react/index.ts",
  },
  external: [
    "react",
    "react-dom",
    "cacache",
    "node:path",
    "node:crypto",
    "node:fs",
    "node:fs/promises",
    "query-string",
  ],
});

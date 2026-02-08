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
    "node:crypto",
    "node:fs",
    "p-limit",
    "node:fs/promises",
    'query-string'
  ],
});

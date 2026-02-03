import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "neutral",
  entry: {
    plugin: "src/plugin/index.ts",
    react: "src/react/index.ts",
  },
});

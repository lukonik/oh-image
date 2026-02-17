import { defineConfig } from "tsdown";
import { copyFileSync } from "node:fs";

export default defineConfig({
  platform: "neutral",
  entry: {
    plugin: "src/plugin/index.ts",
    react: "src/react/index.ts",
    cloudflare: "src/loaders/cloudflare/index.ts",
    cloudinary: "src/loaders/cloudinary/index.ts",
    imgproxy: "src/loaders/imgproxy/index.ts",
  },
  dts: true,
  external: [
    "react",
    "react-dom",
    "node:path",
    "node:crypto",
    "node:fs",
    "p-limit",
    "node:fs/promises",
    "query-string",
  ],
  onSuccess: () => {
    copyFileSync("src/client.d.ts", "dist/client.d.ts");
    copyFileSync("README.md", "dist/README.md");
  },
});

import type { Plugin } from "vite";
import { Resolver } from "./resolver";
import { BundleOptimizer } from "./bundle-optimizer";
import fs from "node:fs/promises";

export function ohImage() {
  return {
    name: "vite-plugin-oh-image",
    async transform(code, id) {
      const resolver = new Resolver(id);
      const optimizer = new BundleOptimizer(id);
      if (!resolver.isSupportedFile()) {
        return code;
      }
      console.log(code);
      const buffer = await optimizer.blur();
      await fs.writeFile(id.replace(".png", "") + "-blur.webp", buffer);
      return `export default ${JSON.stringify("/@fs" + id.replace(".png", "") + "-blur.webp")}`;
    },
  } satisfies Plugin;
}

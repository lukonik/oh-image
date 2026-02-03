import { basename } from "node:path";
import type { Plugin } from "vite";
import { BundleOptimizer } from "./bundle-optimizer";
import { CacheStorage } from "./cache-storage";
import { Resolver } from "./resolver";

export function ohImage() {
  const cacheStorage = new CacheStorage();
  let isDev = false;

  return {
    name: "vite-plugin-oh-image",
    config(_config, { command }) {
      isDev = command === "serve";
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.endsWith(".png") || req.url?.endsWith(".webp")) {
          const buffer = await cacheStorage.get(req.url);
          if (buffer) {
            res.setHeader("Content-Type", "image/webp");
            res.end(buffer);
          } else {
            next();
          }
        } else {
          next();
        }
      });
    },
    async transform(code, id) {
      const resolver = new Resolver(id);
      const optimizer = new BundleOptimizer(id);
      if (!resolver.isSupportedFile()) {
        return code;
      }
      const buffer = await optimizer.blur();
      if (isDev) {
        // Extract filename from absolute path and create URL path
        const filename = basename(id);
        const urlPath = "/" + filename.replace(".png", "-blur.webp");
        console.log("Storing with key:", urlPath);
        cacheStorage.set(urlPath, buffer);

        // Return the transformed module that exports the blurred image URL
        return {
          code: `export default "${urlPath}"`,
          map: null,
        };
      }

      return code;
    },
  } satisfies Plugin;
}

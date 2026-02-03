import { basename } from "node:path";
import type { Plugin } from "vite";
import { BundleOptimizer } from "./bundle-optimizer";
import { CacheStorage } from "./cache-storage";
import { isSupportedFile } from "./resolver";
import { join } from "pathe";
import { Optimizer } from "./optimizer";
import { readFile } from "node:fs/promises";

export function ohImage() {
  const cacheStorage = new CacheStorage();
  let isDev = false;
  let rootDir = "";

  return {
    name: "vite-plugin-oh-image",
    configResolved(config) {
      rootDir = config.root;
      isDev = config.command === "serve";
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        console.log("HELLO")
        // if (req.url && isSupportedFile(req.url)) {
        //   const file = await cacheStorage.get(req.url);
        //   if (file) {
        //     res.setHeader("Content-Type", "image/png");
        //     res.end(file);
        //     return;
        //   }
        //   const base = basename(req.url);
        //   const filePath = join(rootDir, base);
        //   const newFile = await readFile(filePath);
        //   const optimizer = new Optimizer(filePath);
        //   await cacheStorage.set(base, await optimizer.blur());

        //   res.setHeader("Content-Type", "image/png");
        //   res.end(newFile);
        //   return;
        // }
        next();
      });
    },
    async transform(code, id) {
      // const optimizer = new BundleOptimizer(id);
      // if (!resolver.isSupportedFile()) {
      //   return code;
      // }
      // const buffer = await optimizer.blur();
      // if (isDev) {
      //   // Extract filename from absolute path and create URL path
      //   const filename = basename(id);
      //   const urlPath = "/" + filename.replace(".png", "-blur.webp");
      //   console.log("Storing with key:", urlPath);
      //   cacheStorage.set(urlPath, buffer);

      //   // Return the transformed module that exports the blurred image URL
      //   return {
      //     code: `export default "${urlPath}"`,
      //     map: null,
      //   };
      // }

      return code;
    },
  } satisfies Plugin;
}

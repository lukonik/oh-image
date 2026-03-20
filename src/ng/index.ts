import { join } from "pathe";
import type { Plugin, PluginBuild } from "esbuild";
import { createImageEntries } from "../plugin/image-entries";
import {
  handleImageLoad,
  handleWriteBundle,
  DEFAULT_CONFIGS
} from "../plugin/core";
import type { PluginConfig } from "../plugin/types";

export function ohImageEsbuild(options?: Partial<PluginConfig>): Plugin {
  return {
    name: "oh-image",
    setup(build: PluginBuild) {
      const isBuild = true; // esbuild is usually a build process
      const assetsDir = "assets"; // default assets dir
      let outDir = build.initialOptions.outdir || "dist";

      const imageEntries = createImageEntries();
      const config = { ...DEFAULT_CONFIGS, ...options };

      if (config.outDir) {
        outDir = config.outDir; // fallback to config outDir
      }

      // We need to resolve the module so esbuild doesn't throw a "file not found"
      // error when it sees a query parameter like "?$oh"
      build.onResolve({ filter: /\.\w+\?\$oh$/ }, (args) => {
        // Here we just attach the query string to the resolved path
        // It might require specific logic depending on how imports are written,
        // but typically joining resolveDir and path works if it's a relative import.
        return {
          path: join(args.resolveDir, args.path),
          namespace: "oh-image",
        };
      });

      // Filter matches our supported image formats with the ?$oh query
      build.onLoad({ filter: /.*/, namespace: "oh-image" }, async (args) => {
        try {
          const src = await handleImageLoad({
            id: args.path, // esbuild args.path contains the full resolved path
            config,
            imageEntries,
            isBuild,
            assetsDir,
          });

          if (!src) {
            return null;
          }

          // Return the object string as export default for Angular
          return {
            contents: `export default ${JSON.stringify({
              width: src.width,
              height: src.height,
              src: src.src,
              srcSet: src.srcSet,
              placeholder: src.placeholder,
            })};`,
            loader: "js",
          };
        } catch (err) {
          if (err instanceof Error) {
            console.error(
              `Couldn't load image: ${args.path}. Error: ${err.message}`
            );
            return { errors: [{ text: err.message }] };
          }
          return { errors: [{ text: String(err) }] };
        }
      });

      build.onEnd(async () => {
        await handleWriteBundle(imageEntries, outDir);
      });
    },
  };
}

import { defineConfig } from "./config";
import { isFileSupported, SUPPORTED_IMAGE_FORMATS } from "./resolver";
import { create, getImage } from "./service";
import type { OhImagePluginConfig } from "./types";
import type { Plugin } from "vite";

const DEFAULT_CONFIGS: OhImagePluginConfig = {
  cacheDir: ".cache/oh-image",
  distDir: "oh-image",
  prefix: "oh-image",
  blur: true,
  breakpoints: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
};

export function ohImage(options?: Partial<OhImagePluginConfig>) {
  return {
    name: "oh-image",
    configResolved(config) {
      defineConfig(config, {
        cacheDir: ".cache/oh-image",
      });
    },
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;

        if (!url || !isFileSupported(url)) {
          return next();
        }

        const { data, format } = await getImage(url);
        res.setHeader("Content-Type", `image/${format}`);
        res.end(data);
      });
    },
    load: {
      filter: {
        id: SUPPORTED_IMAGE_FORMATS,
      },
      async handler(id) {
        const image = await create(id, {
          blur: true,
          breakpoints: [20, 30, 40, 50],
        });
        return `export default ${JSON.stringify(image)}`;
      },
    },
  } satisfies Plugin;
}

// export function ohImage(options?: Partial<OhImagePluginConfig>) {
//   const pluginConfig = mergeConfig(
//     DEFAULT_CONFIGS,
//     options ?? {},
//   ) as OhImagePluginConfig;
//   let service!: ImageService;

//   return {
//     name: "oh-image",
//     async configResolved(config) {
//       const resolvedConfig = {
//         ...pluginConfig,
//         cacheDir: resolve(config.root, pluginConfig.cacheDir),
//         distDir: resolve(config.build.outDir, pluginConfig.distDir),
//       } satisfies OhImagePluginConfig;
//       service = createImageService(resolvedConfig);
//     },
//     enforce: "pre",
//     async buildStart() {
//       await service.reset();
//     },
//     configureServer(server) {
//       server.middlewares.use(async (req, res, next) => {
//         const url = req.url;

//         if (
//           !url ||
//           !isFileSupported(url) ||
//           !url.includes(pluginConfig.prefix)
//         ) {
//           return next();
//         }
//         try {
//           const { data, format } = await service.getImage(url);
//           res.setHeader("Content-Type", `image/${format}`);
//           res.end(data);
//         } catch (err) {
//           console.error(err);
//           next();
//         }
//       });
//     },
//     load: {
//       filter: {
//         id: SUPPORTED_IMAGE_FORMATS,
//       },
//       async handler(id) {
//         const options = queryToOptions(id);

//         const mergeOptions = mergeConfig(pluginConfig, options);

//         const image = await service.create(id, mergeOptions);

//         return `export default ${JSON.stringify(image)}`;
//       },
//     },
//     async writeBundle() {
//       await service.writeToDist();
//     },
//   } satisfies Plugin;
// }

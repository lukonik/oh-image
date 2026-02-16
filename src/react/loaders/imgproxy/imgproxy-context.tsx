import type { ImgproxyGlobalOptions } from "./imgproxy-options";
import loaderContextFactory from "./loader-context-factory";

export const {
  useLoaderContext: useImgproxyContext,
  LoaderProvider: ImgproxyLoaderProvider,
} = loaderContextFactory<ImgproxyGlobalOptions>({
  transforms: {
    format: "webp",
  },
  placeholderTransforms: {
    quality: 10,
    format: "webp",
  },
});

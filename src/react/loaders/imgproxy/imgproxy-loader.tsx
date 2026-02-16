import {
  type ImgproxyTransforms,
  type ImgproxyGlobalOptions,
} from "./imgproxy-options";
import loaderContextFactory from "../loader-context-factory";
import { createImgproxyUrl } from "./create-imgproxy-url";

export const {
  useLoaderContext: useImgproxyContext,
  LoaderProvider: ImgproxyLoaderProvider,
  useLoader: useImgproxyLoader,
  usePlaceholder: useImgproxyPlaceholder,
} = loaderContextFactory<ImgproxyTransforms, ImgproxyGlobalOptions>(
  {
    transforms: {
      format: "webp",
    },
    placeholderTransforms: {
      quality: 10,
      format: "webp",
    },
  },
  ":",
  createImgproxyUrl,
);

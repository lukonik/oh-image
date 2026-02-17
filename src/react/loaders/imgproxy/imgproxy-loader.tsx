import {
  type ImgproxyTransforms,
  type ImgproxyGlobalOptions,
} from "./imgproxy-options";
import loaderFactory from "../loader-factory";
import { createImgproxyUrl } from "./create-imgproxy-url";

export const {
  useLoaderContext: useImgproxyContext,
  LoaderProvider: ImgproxyLoaderProvider,
  useLoader: useImgproxyLoader,
  usePlaceholder: useImgproxyPlaceholder,
} = loaderFactory<ImgproxyTransforms, ImgproxyGlobalOptions>(
  {
    transforms: {
      format: "webp",
    },
    placeholderTransforms: {
      quality: 10,
      format: "webp",
    },
  },
  {
    optionSeparator: ":",
    paramSeparator: "/",
  },
  createImgproxyUrl,
  ({ path, params, imageOptions }) => `${path}/${params}/plain/${imageOptions.src}`,
);

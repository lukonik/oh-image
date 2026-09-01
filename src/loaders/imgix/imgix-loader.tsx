import {
  type ImgixTransforms,
  type ImgixGlobalOptions,
} from "./imgix-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useImgixContext,
  LoaderProvider: ImgixLoaderProvider,
  useLoader: useImgixLoader,
} = loaderFactory<ImgixTransforms, ImgixGlobalOptions>(
  {
    transforms: {
      auto: "format,compress",
    },
    placeholder: {
      q: 10,
      auto: "format,compress",
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: "&",
    widthKey: "w",
    heightKey: "h",
    passBooleanValue: true,
    arrayItemSeparator: ",",
  },
  ({ path, params, imageOptions }) =>
    params
      ? `${path}/${imageOptions.src}?${params}`
      : `${path}/${imageOptions.src}`,
);

import {
  type WordpressTransforms,
  type WordpressGlobalOptions,
} from "./wordpress-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useWordpressContext,
  LoaderProvider: WordpressLoaderProvider,
  useLoader: useWordpressLoader,
} = loaderFactory<WordpressTransforms, WordpressGlobalOptions>(
  {
    transforms: {
      format: "webp",
    },
    placeholder: {
      quality: 10,
      format: "webp",
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: "&",
    widthKey: "w",
    heightKey: "h",
    passBooleanValue: true,
    customResolver: {},
  },
  ({ path, params, imageOptions }) => `${path}/${imageOptions.src}?${params}`,
);

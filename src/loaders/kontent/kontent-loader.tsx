import {
  type KontentTransforms,
  type KontentGlobalOptions,
} from "./kontent-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useKontentContext,
  LoaderProvider: KontentLoaderProvider,
  useLoader: useKontentLoader,
} = loaderFactory<KontentTransforms, KontentGlobalOptions>(
  {
    transforms: {
      auto: "format",
    },
    placeholder: {
      q: 10,
      auto: "format",
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: "&",
    passBooleanValue: true,
  },
  ({ path, params, imageOptions }) => `${path}/${imageOptions.src}?${params}`,
);

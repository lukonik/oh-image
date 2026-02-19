import {
  type ContentfulTransforms,
  type ContentfulGlobalOptions,
} from "./contentful-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useContentfulContext,
  LoaderProvider: ContentfulLoaderProvider,
  useLoader: useContentfulLoader,
} = loaderFactory<ContentfulTransforms, ContentfulGlobalOptions>(
  {
    transforms: {
      fm: "webp",
    },
    placeholder: {
      q: 10,
      fm: "webp",
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

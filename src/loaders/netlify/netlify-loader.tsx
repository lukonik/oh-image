import {
  type NetlifyTransforms,
  type NetlifyGlobalOptions,
} from "./netlify-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useNetlifyContext,
  LoaderProvider: NetlifyLoaderProvider,
  useLoader: useNetlifyLoader,
} = loaderFactory<NetlifyTransforms, NetlifyGlobalOptions>(
  {
    path: "/.netlify/images",
    transforms: {
      fm: "webp",
    },
    placeholder: {
      fm: "blurhash",
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: "&",
    widthKey: "w",
    heightKey: "h",
  },
  ({ path, params, imageOptions }) => {
    const searchParams = new URLSearchParams(params);
    searchParams.set("url", imageOptions.src);
    return `${path}?${searchParams.toString()}`;
  },
);

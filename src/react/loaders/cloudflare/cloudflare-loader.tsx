import {
  type CloudflareTransforms,
  type CloudflareGlobalOptions,
} from "./cloudflare-options";
import loaderFactory from "../loader-factory";
import { resolveTransforms } from "../image-loader-utils";

export const {
  useLoaderContext: useCloudflareContext,
  LoaderProvider: CloudflareLoaderProvider,
  useLoader: useCloudflareLoader,
  usePlaceholder: useCloudflarePlaceholder,
} = loaderFactory<CloudflareTransforms, CloudflareGlobalOptions>(
  {
    transforms: {
      format: "auto",
    },
    placeholderTransforms: {
      quality: 10,
      format: "auto",
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: ",",
  },
  ({ transforms, optionSeparator }) =>
    resolveTransforms(transforms, optionSeparator),
  ({ path, params, imageOptions }) =>
    `${path}/cdn-cgi/image/${params}/${imageOptions.src}`,
);

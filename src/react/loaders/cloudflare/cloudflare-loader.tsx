import {
  type CloudflareTransforms,
  type CloudflareGlobalOptions,
} from "./cloudflare-options";
import loaderFactory from "../loader-factory";
import { normalizeTransforms } from "../image-loader-utils";

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
    normalizeTransforms(transforms, optionSeparator),
  ({ path, params, imageOptions }) =>
    `${path}/cdn-cgi/image/${params}/${imageOptions.src}`,
);

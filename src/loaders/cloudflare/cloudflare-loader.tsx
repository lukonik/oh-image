import {
  type CloudflareTransforms,
  type CloudflareGlobalOptions,
} from "./cloudflare-options";
import loaderFactory from "../loader-factory";

export const {
  useLoaderContext: useCloudflareContext,
  LoaderProvider: CloudflareLoaderProvider,
  useLoader: useCloudflareLoader,
} = loaderFactory<CloudflareTransforms, CloudflareGlobalOptions>(
  {
    transforms: {
      format: "auto",
    },
    placeholder: {
      quality: 10,
      format: "auto",
    },
  },
  {
    optionSeparator: "=",
    paramSeparator: ",",
  },
  ({ path, params, imageOptions }) =>
    `${path}/cdn-cgi/image/${params}/${imageOptions.src}`,
);

import {
    type CloudflareTransforms,
    type CloudflareGlobalOptions,
} from "./cloudflare-options";
import loaderContextFactory from "../loader-context-factory";
import { createCloudflareUrl } from "./create-Cloudflare-url";

export const {
  useLoaderContext: useCloudflareContext,
  LoaderProvider: CloudflareLoaderProvider,
  useLoader: useCloudflareLoader,
  usePlaceholder: useCloudflarePlaceholder,
} = loaderContextFactory<CloudflareTransforms, CloudflareGlobalOptions>(
  {
    transforms: {
      format: "webp",
    },
    placeholderTransforms: {
      quality: 10,
      format: "webp",
    },
  },
  createCloudflareUrl,
);

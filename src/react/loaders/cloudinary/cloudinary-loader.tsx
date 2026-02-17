import {
  type CloudinaryTransforms,
  type CloudinaryGlobalOptions,
} from "./cloudinary-options";
import loaderFactory from "../loader-factory";
import { normalizeTransforms } from "../image-loader-utils";

export const {
  useLoaderContext: useCloudinaryContext,
  LoaderProvider: CloudinaryLoaderProvider,
  useLoader: useCloudinaryLoader,
  usePlaceholder: useCloudinaryPlaceholder,
} = loaderFactory<CloudinaryTransforms, CloudinaryGlobalOptions>(
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

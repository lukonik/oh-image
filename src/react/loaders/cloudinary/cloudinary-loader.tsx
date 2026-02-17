import {
  type CloudinaryTransforms,
  type CloudinaryGlobalOptions,
} from "./cloudinary-options";
import loaderFactory from "../loader-factory";
import { normalizeLoaderParams } from "../image-loader-utils";

export const {
  useLoaderContext: useCloudinaryContext,
  LoaderProvider: CloudinaryLoaderProvider,
  useLoader: useCloudinaryLoader,
  usePlaceholder: useCloudinaryPlaceholder,
} = loaderFactory<CloudinaryTransforms, CloudinaryGlobalOptions>(
  {
    transforms: {
      f: "webp",
    },
    placeholderTransforms: {
      q: 10,
      f: "webp",
    },
  },
  {
    optionSeparator: "_",
    paramSeparator: ",",
  },
  ({ transforms, optionSeparator }) =>
    normalizeLoaderParams(transforms, optionSeparator),
  ({ path, params, imageOptions }) =>
    `${path}/image/upload/${params}/${imageOptions.src}`,
);

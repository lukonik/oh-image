import {
  type CloudinaryTransforms,
  type CloudinaryGlobalOptions,
} from "./cloudinary-options";
import loaderFactory from "../loader-factory";
import { resolveComplexTransforms } from "../image-loader-utils";

function customResolver(key: string, value: any) {
  if (typeof value === "boolean") {
    return key;
  }
  return `${key}:${value}`;
}

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
    resolveComplexTransforms<CloudinaryTransforms>(transforms, {
      optionSeparator: optionSeparator,
      orders: {},
      customResolver: {
        e_accelerate: customResolver,
        e_auto_brightness: customResolver,
      },
    }),
  ({ path, params, imageOptions }) =>
    `${path}/image/upload/${params}/${imageOptions.src}`,
);

import { createContext, useContext } from "react";
import type { Cloudinary } from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/format";
import { auto as qAuto } from "@cloudinary/url-gen/qualifiers/quality";
import type { ImageLoaderOptions } from "../../react/types";
import type {
  CloudinaryLoaderHookOptions,
  CloudinaryTransforms,
} from "./cloudinary-options";

interface CloudinaryLoaderContext {
  cld?: Cloudinary;
  transforms?: CloudinaryTransforms | undefined;
  placeholder?: CloudinaryTransforms | undefined;
}

const Context = createContext<CloudinaryLoaderContext>({
  transforms: (img) => img.delivery(quality(qAuto())).delivery(format(auto())),
  placeholder: (img) =>
    img
      .resize(scale().width(10))
      .delivery(quality("auto:low"))
      .delivery(format(auto())),
});

export function CloudinaryLoaderProvider({
  client,
  children,
  transforms,
  placeholder,
}: {
  client: Cloudinary;
  children: React.ReactNode;
  transforms?: CloudinaryTransforms;
  placeholder?: CloudinaryTransforms;
}) {
  return (
    <Context.Provider value={{ cld: client, transforms, placeholder }}>
      {children}
    </Context.Provider>
  );
}

export function useCloudinaryLoader(
  options?: CloudinaryLoaderHookOptions | CloudinaryTransforms,
) {
  const {
    cld,
    transforms: defaultTransforms,
    placeholder: defaultPlaceholder,
  } = useContext(Context);

  if (!cld) {
    throw new Error(
      "Cloudinary client is not provided. Please wrap your app with CloudinaryLoaderProvider.",
    );
  }

  // Normalize options
  let transforms: CloudinaryTransforms | undefined;
  let placeholder: CloudinaryTransforms | undefined;

  if (typeof options === "function") {
    transforms = options;
  } else if (options) {
    transforms = options.transforms;
    placeholder = options.placeholder;
  }

  return (imageOptions: ImageLoaderOptions) => {
    const img = cld.image(imageOptions.src);

    const isPlaceholder = imageOptions.isPlaceholder;

    // Apply default/context transforms first
    if (isPlaceholder) {
      if (defaultPlaceholder) {
        defaultPlaceholder(img);
      }
    } else {
      if (defaultTransforms) {
        defaultTransforms(img);
      }
    }

    // Apply hook-level transforms (overrides or additions)
    if (isPlaceholder && placeholder) {
      placeholder(img);
    } else if (!isPlaceholder && transforms) {
      transforms(img);
    }

    // Apply specific image options (width/height from props overrides/adds to resize)
    const resizeAction = scale();
    let hasResize = false;

    if (imageOptions.width) {
      resizeAction.width(imageOptions.width);
      hasResize = true;
    }
    if (imageOptions.height) {
      resizeAction.height(imageOptions.height);
      hasResize = true;
    }

    if (hasResize) {
      img.resize(resizeAction);
    }

    return img.toURL();
  };
}

export const useCloudinaryContext = () => useContext(Context);

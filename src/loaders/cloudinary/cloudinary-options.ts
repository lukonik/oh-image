import type { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";

export type CloudinaryTransforms = (img: CloudinaryImage) => CloudinaryImage;

export type CloudinaryGlobalOptions = {
  cld: Cloudinary;
};

export interface CloudinaryLoaderHookOptions {
  transforms?: CloudinaryTransforms;
  placeholder?: CloudinaryTransforms;
}

export interface CloudinaryLoaderProviderProps {
  client: Cloudinary;
  children: React.ReactNode;
  transforms?: CloudinaryTransforms;
  placeholder?: CloudinaryTransforms;
}

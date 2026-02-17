import type {
  BaseGlobalLoaderOptions,
  BaseLoaderOptions,
  BaseLoaderTransforms,
} from "../base-loader-options";

export interface CloudinaryTransforms extends BaseLoaderTransforms {
  
}

export type CloudinaryOptions = BaseLoaderOptions<CloudinaryTransforms>;
export type CloudinaryGlobalOptions =
  BaseGlobalLoaderOptions<CloudinaryTransforms>;

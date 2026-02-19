export interface BaseLoaderOptions<T> {
  path?: string;
  transforms?: T;
}

export interface BaseGlobalLoaderOptions<T> extends BaseLoaderOptions<T> {
  placeholder?: T;
}

export interface BaseLoaderTransforms {}

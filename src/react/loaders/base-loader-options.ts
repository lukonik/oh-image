export interface BaseLoaderOptions<T> {
  path?: string;
  transforms?: T;

  /** @deprecated Use `transforms` instead. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
}

export interface BaseGlobalLoaderOptions<T> extends BaseLoaderOptions<T> {
  placeholderTransforms?: T;
}

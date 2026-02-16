export interface BaseLoaderOptions<T, K> {
  placeholder?: boolean | K;
  path?: string;
  transforms?: T;

  /** @deprecated Use `transforms` instead. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
}

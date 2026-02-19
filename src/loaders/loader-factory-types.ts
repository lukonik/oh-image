import type { ImageLoaderOptions } from "../react/types";

export type LoaderCustomResolver = Record<string, LoaderCustomResolverFn>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoaderCustomResolverFn = (key: string, value: any) => string | undefined;

export interface LoaderFactoryConfig {
  optionSeparator: string;
  paramSeparator: string;
  orders?: LoaderOrders;
  customResolver?: LoaderCustomResolver;
  widthKey?: string;
  heightKey?: string;
  /* if true passes param value true/false instead of passing just key
     @example: true /rotate:true/ instead of /rotate
  */
  passBooleanValue?: boolean; 
}

export type LoaderParamsResolver<K> = (options: {
  path: string;
  transforms: K;
  imageOptions: ImageLoaderOptions;
  params: string[];
  optionSeparator: string;
  paramSeparator: string;
}) => string[];

export type LoaderUrlResolved = (options: {
  imageOptions: ImageLoaderOptions;
  params: string;
  path: string;
}) => string;

export type LoaderOrders = Record<string, string[]>;

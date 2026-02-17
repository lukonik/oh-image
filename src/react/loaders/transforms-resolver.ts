import { assert } from "../prop-asserts";
import type { BaseLoaderTransforms } from "./base-loader-options";
import type { LoaderFactoryConfig } from "./loader-factory-types";

export function resolveTransforms(
  params: Record<string, string>,
  separator: string,
): string[] {
  return Object.entries(params).map(
    ([key, value]) => `${key}${separator}${value}`,
  );
}

const stringifyOptions = (
  opCode: string,
  values: Array<string | number | boolean | undefined>,
  separator: string,
): string => {
  return [
    opCode,
    ...values.map((v) => (v == null ? "" : encodeURIComponent(v))),
  ].join(separator);
};

const resolveObjectParam = (
  key: string,
  value: Record<string, unknown>,
  order: string[] | undefined,
  separator: string,
): string | undefined => {
  if (!order) {
    return;
  }
  const values = order.map((k) => value[k]) as string[];
  return stringifyOptions(key, values, separator);
};

export function resolveTransform<T extends BaseLoaderTransforms>(
  transforms: T,
  config: LoaderFactoryConfig,
): string[] {
  if (!transforms) {
    return [];
  }
  const params: string[] = [];
  for (const key of Object.keys(transforms)) {
    const value = transforms[key as keyof T];

    if (value === undefined) {
      continue;
    }
    const type = typeof value;

    if (config.customResolver) {
      const resolverFn = config.customResolver[key];
      if (resolverFn) {
        const resolvedValue = resolverFn(key, value);
        if (resolvedValue !== undefined) {
          params.push(resolvedValue);
        }
        continue;
      }
    }

    switch (type) {
      case "boolean": {
        if (value === true) {
          params.push(key);
        }
        break;
      }
      case "object": {
        const objectParams = resolveObjectParam(
          key,
          value,
          config?.orders?.[key],
          config.optionSeparator,
        );
        if (objectParams) {
          params.push(objectParams);
        }
        break;
      }
      default: {
        params.push(stringifyOptions(key, [value], config.optionSeparator));
        break;
      }
    }
  }

  return params;
}

export function isAbsoluteUrl(src: string): boolean {
  return /^https?:\/\//.test(src);
}

export function assertPath(path: string | null | undefined) {
  assert(() => !path?.trim(), import.meta.env.DEV && `Path is required`);

  assert(
    () => {
      try {
        new URL(path!);
        return !isAbsoluteUrl(path!);
      } catch {
        return true;
      }
    },
    import.meta.env.DEV && `Path is invalid url: ${path}`,
  );
}

import { assert } from "../prop-asserts";
import type { BaseLoaderTransforms } from "./base-loader-options";

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
  // .replace(/:+$/, "");
};

const resolveObjectParam = (
  key: string,
  value: any,
  order: string[] | undefined,
  separator: string,
): string | undefined => {
  if (!order) {
    return;
  }
  const values = order.map((k) => value[k]);
  return stringifyOptions(key, values, separator);
};

type KnownKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : K]: T[K];
};

export function resolveComplexTransforms<T extends BaseLoaderTransforms>(
  transforms: T,
  config: {
    optionSeparator: string;
    orders: Record<any, string[]> | undefined;
    customResolver?: Partial<
      Record<
        KnownKeys<T>,
        (key: string, value: any) => string | undefined | null
      >
    >;
  },
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

    if (config.customResolver && (config.customResolver as any)[key]) {
      const resolved = (config.customResolver as any)[key](key, value);
      if (resolved) {
        params.push(resolved);
      }
      continue;
    }

    switch (type) {
      case "boolean": {
        if (value === true) {
          params.push(key);
        }
        break;
      }
      case "object": {
        const order = (config.orders as any)[key];
        const objectParams = resolveObjectParam(
          key,
          value,
          order,
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

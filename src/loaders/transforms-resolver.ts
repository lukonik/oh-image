import type { BaseLoaderTransforms } from "./base-loader-options";
import type { LoaderFactoryConfig, LoaderOrders } from "./loader-factory-types";

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
  arraySeparator?: string,
): string => {
  return [
    opCode,
    ...values.map((v) => {
      if (v == null) {
        return "";
      }
      if (Array.isArray(v)) {
        return v
          .map((val) => (val))
          .join(arraySeparator ?? separator);
      }

      return (v);
    }),
  ].join(separator);
};

const resolveObjectParam = (
  key: string,
  value: Record<string, unknown>,
  orderConfig: LoaderOrders[string] | undefined,
  separator: string,
): string | undefined => {
  if (!orderConfig) {
    return;
  }
  const { orders, childrenOrders } = orderConfig;

  const values = orders.map((k) => {
    const val = value[k];

    if (val === undefined || val === null) {
      return "";
    }

    if (
      childrenOrders &&
      childrenOrders[k] &&
      typeof val === "object" &&
      !Array.isArray(val)
    ) {
      const childOrder = childrenOrders[k];
      const childValues = childOrder.orders.map(
        (childKey) => (val as Record<string, unknown>)[childKey],
      );

      return childValues
        .map((v) => {
          if (v == null) {
            return "";
          }
          if (Array.isArray(v)) {
            return v
              .map((val) => (String(val)))
              .join(separator);
          }
          return (String(v));
        })
        .join(separator);
    }

    if (Array.isArray(val)) {
      return val.map((v) => (String(v))).join(separator);
    }

    return (String(val));
  });

  return [key, ...values].join(separator);
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
          if (config.passBooleanValue) {
            params.push(stringifyOptions(key, [value], config.optionSeparator));
          } else {
            params.push(key);
          }
        }
        break;
      }
      case "object": {
        if (Array.isArray(value)) {
          params.push(
            stringifyOptions(
              key,
              [value],
              config.optionSeparator,
              config.arrayItemSeparator,
            ),
          );
        } else {
          const objectParams = resolveObjectParam(
            key,
            value as Record<string, unknown>,
            config?.orders?.[key],
            config.optionSeparator,
          );
          if (objectParams) {
            params.push(objectParams);
          }
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

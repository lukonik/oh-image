import { assert } from "../prop-asserts";

export function normalizeTransforms<T extends Record<string, string>>(
  params: T,
  separator: string,
): string[] {
  return Object.entries(params).map(
    ([key, value]) => `${key}${separator}${value}`,
  );
}

export function normalizeLoaderParams(
  params: Record<string, string>,
  separator: string,
): string[] {
  return Object.entries(params).map(
    ([key, value]) => `${key}${separator}${value}`,
  );
}

export function normalizeLoaderTransform(
  params: string | Record<string, string>,
  keySeparator: string,
  joinSeparator: string,
): string {
  if (typeof params === "string") {
    return params;
  }

  return normalizeLoaderParams(params, keySeparator).join(joinSeparator);
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

import { assert } from "../prop-asserts";

export function normalizeLoaderParams(
  params: Record<string, string>,
  separator: string,
): string[] {
  return Object.entries(params).map(
    ([key, value]) => `${key}${separator}${value}`,
  );
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

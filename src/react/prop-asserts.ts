import type { ImageProps } from "./types";

export function assertProps(prop: ImageProps) {
  assertLoadingProp(prop);
}

function assert(assertion: () => boolean | undefined | null, message: string) {
  if (import.meta.env.DEV) {
    if (assertion()) {
      throw new Error(message);
    }
  }
}

export function assertLoadingProp(prop: ImageProps) {
  assert(
    () => prop.loading && prop.asap,
    `Do not use \`loading\` on a asap image — asap images are always eagerly loaded.`,
  );
}

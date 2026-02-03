import type { Plugin } from "vite";

export function ohImage() {
  return {
    name: "oh-image",
    transform(code, id, options) {
      return code;
    },
  } satisfies Plugin;
}

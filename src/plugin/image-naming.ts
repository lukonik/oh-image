import { randomBytes } from "node:crypto";

function genRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default function createImageNaming(prefix: string) {
  return {
    image: (name: string) => `${prefix}-${name}-${genRandomString()}`,
    blur: (imageId: string) => `${imageId}-blur`,
    srcSet: (imageId: string, width: number) => `${imageId}-${width}w`,
    withFormat: (id: string, format: string) => `${id}.${format}`,
  };
}

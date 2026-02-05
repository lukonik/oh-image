import { randomBytes } from "node:crypto";

function genRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default function createImageNaming(prefix: string, name: string) {
  const imageId = `${prefix}-${name}-${genRandomString()}`;

  return {
    imageId,
    blurId: () => `${imageId}-blur`,
    srcSetId: (width: number) => `${imageId}-${width}w`,
  };
}

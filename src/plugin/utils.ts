import { randomBytes } from "node:crypto";

export function mergeConfig<T>(base: T, ovverides: T) {
  return { ...base, ...ovverides };
}

export function getRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

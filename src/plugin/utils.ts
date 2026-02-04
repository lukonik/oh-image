import { randomBytes } from "node:crypto";

/**
 * generates random url-safe string
 * @param length
 * @returns
 */
export function generateRandomString(length: number = 32) {
  return randomBytes(Math.ceil((length * 3) / 4))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

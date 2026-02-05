import { getConfigValue } from "./config";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const read = async (key: string) => {
  const filePath = resolve(key);
  try {
    await access(filePath);
    return await readFile(filePath);
  } catch {
    return null;
  }
};
const write = async (key: string, data: Parameters<typeof writeFile>[1]) => {
  const filePath = resolve(key);
  await writeFile(filePath, data);
};

const clear = async () => {
  await rm(resolve(getConfigValue("cacheDir")), { recursive: true, force: true });
  mkdirSync(resolve(getConfigValue("cacheDir")), { recursive: true });
};

export { read, write, clear };

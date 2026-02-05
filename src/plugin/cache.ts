import { getCachePath, getDistPath } from "./config";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const read = async (filePath: string) => {
  try {
    await access(filePath);
    return await readFile(filePath);
  } catch {
    return null;
  }
};

const write = async (filePath: string, data: Parameters<typeof writeFile>[1]) => {
  // Ensure directory exists
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, data);
};

const clearCache = async () => {
  const cachePath = getCachePath();
  await rm(cachePath, { recursive: true, force: true });
  await mkdir(cachePath, { recursive: true });
};

const clearDist = async () => {
  const distPath = getDistPath();
  await rm(distPath, { recursive: true, force: true });
  await mkdir(distPath, { recursive: true });
};

export { read, write, clearCache, clearDist };

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function getFileHash(filePath: string): Promise<string> {
  const content = await readFile(filePath);
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

export async function readFileSafe(path: string) {
  try {
    return await readFile(path);
  } catch {
    return null;
  }
}

export async function saveFileSafe(path: string, data: Buffer) {
  // 1. Extract the directory path (e.g., "folder/subfolder")
  const dir = dirname(path);

  try {
    // 2. Ensure the directory exists
    await mkdir(dir, { recursive: true });

    // 3. Write the file
    await writeFile(path, data);
  } catch (err) {
    console.error("Failed to save file:", err);
  }
}

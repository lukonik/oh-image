import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSafe } from "../src/plugin/utils";
import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("readFileSafe", () => {
  const testDir = join(tmpdir(), "oh-image-tests");
  const testFilePath = join(testDir, "test-image.png");
  const testContent = Buffer.from("fake image content");

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
    await writeFile(testFilePath, testContent);
  });

  afterEach(async () => {
    try {
      await unlink(testFilePath);
    } catch {
      // ignore cleanup errors
    }
  });

  it("should read existing file and return its content", async () => {
    const result = await readFileSafe(testFilePath);
    expect(result).toEqual(testContent);
  });

  it("should return null when file does not exist", async () => {
    const result = await readFileSafe("/non/existent/path/image.png");
    expect(result).toBeNull();
  });

  it("should return null on permission errors", async () => {
    const result = await readFileSafe("/root/protected/file.png");
    expect(result).toBeNull();
  });
});
import { vol } from "memfs";
import { describe, expect, it } from "vitest";
import {
  getFileHash,
  readFileSafe,
  saveFileSafe,
} from "../../src/plugin/file-utils";

describe("readFileSafe", () => {
  it("not found should return null", async () => {
    const result = await readFileSafe("test.png");
    expect(result).toBeNull();
  });
  it("should reutrn content if file exists", async () => {
    await saveFileSafe("demo.text", Buffer.from("hello world"));
    const result = await readFileSafe("demo.text");
    expect(result).toEqual(Buffer.from("hello world"));
  });
});

describe("saveFileSafe", () => {
  it("should create parent directories recursively", async () => {
    await saveFileSafe("/a/b/c/file.txt", Buffer.from("data"));
    const result = await readFileSafe("/a/b/c/file.txt");
    expect(result).toEqual(Buffer.from("data"));
  });

  it("should overwrite an existing file", async () => {
    await saveFileSafe("/file.txt", Buffer.from("old"));
    await saveFileSafe("/file.txt", Buffer.from("new"));
    const result = await readFileSafe("/file.txt");
    expect(result).toEqual(Buffer.from("new"));
  });

  it("should not throw on write failure", async () => {
    vol.fromJSON({ "/readonly": null });
    await expect(
      saveFileSafe("/readonly/file.txt", Buffer.from("data")),
    ).resolves.toBeUndefined();
  });
});

describe("getFileHash", () => {
  it("should return a 16-character hex string", async () => {
    await saveFileSafe("/hash.txt", Buffer.from("hello"));
    const hash = await getFileHash("/hash.txt");
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it("should return the same hash for the same content", async () => {
    await saveFileSafe("/a.txt", Buffer.from("same"));
    await saveFileSafe("/b.txt", Buffer.from("same"));
    expect(await getFileHash("/a.txt")).toBe(await getFileHash("/b.txt"));
  });

  it("should return different hashes for different content", async () => {
    await saveFileSafe("/x.txt", Buffer.from("foo"));
    await saveFileSafe("/y.txt", Buffer.from("bar"));
    expect(await getFileHash("/x.txt")).not.toBe(await getFileHash("/y.txt"));
  });
});

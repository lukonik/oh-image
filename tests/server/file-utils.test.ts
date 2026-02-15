import { vol } from "memfs";
import { describe, expect, it } from "vitest";
import {
  readFileSafe,
  saveFileSafe
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



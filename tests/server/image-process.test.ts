import { beforeEach, describe, expect, it, vi } from "vitest";
import { processImage } from "../../src/plugin/image-process";
import { sharpInstance } from "./setup";
describe("imageProcess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const testImage = "test.png";
  it("should call format if format option is passed", async () => {
    await processImage(testImage, { format: "webp" });
    expect(sharpInstance.toFormat).toBeCalled();
  });
  it("should call blur if blur option is passed", async () => {
    await processImage(testImage, { blur: 30 });
    expect(sharpInstance.blur).toBeCalledWith(30);
  });
  it("should call resize if width is provided", async () => {
    await processImage(testImage, { width: 100 });
    expect(sharpInstance.resize).toBeCalledWith({
      width: 100,
    });
  });
  it("should call resize if height is provided", async () => {
    await processImage(testImage, { height: 100 });
    expect(sharpInstance.resize).toBeCalledWith({
      height: 100,
    });
  });
  it("should call resize if both is provided", async () => {
    await processImage(testImage, { width: 100, height: 100 });
    expect(sharpInstance.resize).toBeCalledWith({
      width: 100,
      height: 100,
    });
  });
  it("should return buffer on return", async () => {
    const buffer = await processImage(testImage, {});
    expect(buffer).toBeInstanceOf(Buffer);
  });
});

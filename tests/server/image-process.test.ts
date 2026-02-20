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

  it("should call flip if flip option is passed", async () => {
    await processImage(testImage, { flip: true });
    expect(sharpInstance.flip).toBeCalled();
  });
  it("should call flop if flop option is passed", async () => {
    await processImage(testImage, { flop: true });
    expect(sharpInstance.flop).toBeCalled();
  });
  it("should call rotate if rotate option is passed", async () => {
    await processImage(testImage, { rotate: 90 });
    expect(sharpInstance.rotate).toBeCalledWith(90);
  });
  it("should call sharpen if sharpen option is passed", async () => {
    await processImage(testImage, { sharpen: 1 });
    expect(sharpInstance.sharpen).toBeCalledWith(1);
  });
  it("should call median if median option is passed", async () => {
    await processImage(testImage, { median: 3 });
    expect(sharpInstance.median).toBeCalledWith(3);
  });
  it("should call gamma if gamma option is passed", async () => {
    await processImage(testImage, { gamma: 2.2 });
    expect(sharpInstance.gamma).toBeCalledWith(2.2);
  });
  it("should call negate if negate option is passed", async () => {
    await processImage(testImage, { negate: true });
    expect(sharpInstance.negate).toBeCalled();
  });
  it("should call normalize if normalize option is passed", async () => {
    await processImage(testImage, { normalize: true });
    expect(sharpInstance.normalize).toBeCalled();
  });
  it("should call threshold if threshold option is passed", async () => {
    await processImage(testImage, { threshold: 128 });
    expect(sharpInstance.threshold).toBeCalledWith(128);
  });

  it("should return buffer on return", async () => {
    const buffer = await processImage(testImage, {});
    expect(buffer).toBeInstanceOf(Buffer);
  });
});

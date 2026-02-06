import { beforeEach, describe, it, vi, expect } from "vitest";
const mockToFormat = vi.fn().mockReturnThis();
const mockResize = vi.fn().mockReturnThis();
const mockBlur = vi.fn().mockReturnThis();
const mockToBuffer = vi.fn().mockResolvedValue(Buffer.from("mock-image"));
const mockSharp = vi.fn(() => ({
  resize: mockResize,
  toBuffer: mockToBuffer,
  toFormat: mockToFormat,
  blur: mockBlur,
}));
vi.mock("sharp", () => {
  return {
    default: mockSharp,
  };
});

describe("processImage", async () => {
  const { processImage } = await import("../../src/plugin/utils");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should use path with sharp", async () => {
    await processImage("/test/image.png", {});
    expect(mockSharp).toHaveBeenNthCalledWith(1, "/test/image.png");
  });

  it("should call toFormat when format is specified", async () => {
    await processImage("/test/image.png", {
      format: "webp",
    });

    expect(mockToFormat).toHaveBeenCalledWith("webp");
  });

  it("should call resize when width or height is specified", async () => {
    await processImage("/test/image.png", {
      width: 200,
      height: 150,
    });

    expect(mockResize).toHaveBeenCalledWith({ width: 200, height: 150 });
  });

  it("should call blur when blur is specified", async () => {
    await processImage("/test/image.png", {
      blur: 5,
    });

    expect(mockBlur).toHaveBeenCalledWith(5);
  });
});

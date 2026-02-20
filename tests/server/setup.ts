import { beforeEach, vi } from "vitest";
import { vol } from "memfs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
  vol.reset();
});

export const sharpInstance = {
  resize: vi.fn().mockReturnThis(),
  toFormat: vi.fn().mockReturnThis(),
  blur: vi.fn().mockReturnThis(),
  toBuffer: vi.fn().mockResolvedValue(Buffer.from("")),
  metadata: vi.fn().mockResolvedValue("HELLO"),
  flip: vi.fn().mockReturnThis(),
  flop: vi.fn().mockReturnThis(),
  rotate: vi.fn().mockReturnThis(),
  sharpen: vi.fn().mockReturnThis(),
  median: vi.fn().mockReturnThis(),
  gamma: vi.fn().mockReturnThis(),
  negate: vi.fn().mockReturnThis(),
  normalize: vi.fn().mockReturnThis(),
  threshold: vi.fn().mockReturnThis(),
};

vi.mock("sharp", () => ({
  default: vi.fn(() => sharpInstance),
}));

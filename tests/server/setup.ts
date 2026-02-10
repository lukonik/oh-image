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
};

vi.mock("sharp", () => ({
  default: vi.fn(() => sharpInstance),
}));

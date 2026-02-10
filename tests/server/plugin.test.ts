import { describe, it } from "vitest";
import sharp from "sharp";
describe("plugin", () => {
  it("true", async () => {
    const res = await sharp("/test.jpg").metadata();
    console.log(res);
  });
});

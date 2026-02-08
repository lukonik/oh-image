import { describe, expect, it } from "vitest";
import { isFileSupported } from "../src/plugin/utils";

describe("resolver", () => {
  describe("isFileSupported", () => {
    function assertIsSupported(type: string) {
      it("should return true on type " + type, () => {
        expect(isFileSupported("test-image" + type)).toBe(true);
      });
    }
    assertIsSupported(".png");
    assertIsSupported(".jpg");
    assertIsSupported(".jpeg");
    assertIsSupported(".webp");
    assertIsSupported(".avif");
    assertIsSupported(".gif");
    assertIsSupported(".tiff");
    assertIsSupported(".svg");
    function assertIsNotSupported(type: string) {
      it("should return false on type " + type, () => {
        expect(isFileSupported("test-image" + type)).toBe(false);
      });
    }
    assertIsNotSupported(".txt");
    assertIsNotSupported(".pdf");
    assertIsNotSupported(".doc");
    assertIsNotSupported(".docx");
    assertIsNotSupported(".xls");
    assertIsNotSupported(".xlsx");
  });
});

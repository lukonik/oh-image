import { describe, it } from "vitest";
import { expectLoaderToPassParamFactory } from "./loaders-utils";
import { useImgproxyLoader } from "../../../src/loaders/imgproxy/imgproxy-loader";
import type { ImgproxyTransforms } from "../../../src/loaders/imgproxy/imgproxy-options";
import { chai } from "vitest";
chai.config.truncateThreshold = 100000;
describe("imgproxy", () => {
  let expectParam = expectLoaderToPassParamFactory<ImgproxyTransforms>(
    (options) => useImgproxyLoader(options),
    "/",
  );

  describe("Adjust", () => {
    it("Uses Proper Identifier", async () => {
      await expectParam(
        {
          adjust: {},
        },
        "adjust:::",
      );
    });

    it("Applies Modifier", async () => {
      await expectParam(
        {
          adjust: {
            brightness: 12,
            contrast: 34,
            saturation: 56,
          },
        },
        "adjust:12:34:56",
      );
    });
  });

  describe("Auto Rotate", () => {
    it("Uses Proper Identifier", async () => {
      await expectParam(
        {
          auto_rotate: true,
        },
        "auto_rotate:true",
      );
    });

    it("Applies Modifier", async () => {
      await expectParam(
        {
          auto_rotate: false,
        },
        "auto_rotate:false",
      );
    });
  });

  describe("Background", () => {
    it("Applies Modifier (RGB)", async () => {
      await expectParam(
        { background: { r: 12, g: 23, b: 45 } },
        "background:12:23:45",
      );
    });

    it("Applies Modifier (Hex Encoded)", async () => {
      await expectParam(
        {
          background: "123456",
        },
        "background:123456",
      );
    });
  });

  describe("Background Alpha", () => {
    it("Applies Modifier", async () => {
      await expectParam(
        {
          background_alpha: 23,
        },
        "background_alpha:23",
      );
    });
  });

  describe("Blur", () => {
    it("Applies Modifier", async () => {
      await expectParam(
        {
          blur: 10,
        },
        "blur:10",
      );
    });
  });

  describe("Blur Detection", () => {
    it("Uses Proper Identifier", async () => {
      await expectParam(
        {
          blur_detections: {
            sigma: 12,
          },
        },
        "blur_detections:12:",
      );
    });

    it("Applies Modifier", async () => {
      await expectParam(
        {
          blur_detections: {
            sigma: 10,
            class_names: ["foo", "bar"],
          },
        },
        "blur_detections:10:foo:bar",
      );
    });

    describe("Brightness", async () => {
      it("Uses Proper Identifier", async () => {
        await expectParam(
          {
            brightness: 10,
          },
          "brightness:10",
        );
      });
    });

    describe("Cache Buster", async () => {
      it("Uses Proper Identifier", async () => {
        await expectParam(
          {
            cachebuster: "foo",
          },
          "cachebuster:foo",
        );
      });
    });

    describe("Contrast", async () => {
      it("Uses Proper Identifier", async () => {
        await expectParam(
          {
            contrast: 0.5,
          },
          "contrast:0.5",
        );
      });
    });

    describe("Crop", () => {
      it("Applies Modifier", async () => {
        await expectParam(
          {
            crop: {
              width: 12,
              height: 34,
              gravity: {
                type: "ce" as const,
                x_offset: 56,
                y_offset: 78,
              },
            },
          },
          "crop:12:34:ce:56:78",
        );
      });

      it("Omits Gravity If Not Specified", async () => {
        await expectParam(
          {
            crop: {
              width: 12,
              height: 34,
            },
          },
          "crop:12:34:",
        );
      });

      describe("DPI", () => {
        it("Applies Modifier", async () => {
          await expectParam(
            {
              dpi: 1200,
            },
            "dpi:1200",
          );
        });
      });
    });
  });
});

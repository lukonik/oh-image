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

      describe("DPR", () => {
        it("Applies Modifier", async () => {
          await expectParam(
            {
              dpr: 2,
            },
            "dpr:2",
          );
        });
      });

      describe("Draw Detection", () => {
        it("Applies Modifier", async () => {
          await expectParam(
            {
              draw_detections: {
                draw: true,
                class_names: ["foo", "bar"],
              },
            },
            "draw_detections:true:foo:bar",
          );
        });

        it("Applies Empty Modifier", async () => {
          await expectParam(
            {
              draw_detections: {
                draw: true,
              },
            },
            "draw_detections:true:",
          );
        });
      });

      describe("Duotone", () => {
        it("Applies default modifier", async () => {
          await expectParam(
            {
              duotone: {},
            },
            "duotone:::",
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              duotone: {
                intensity: 0.7,
                color1: "ff0000",
                color2: "00ff00",
              },
            },
            "duotone:0.7:ff0000:00ff00",
          );
        });

        it("Applies Modifier with partial intensity", async () => {
          await expectParam(
            {
              duotone: {
                intensity: 1.0,
                color2: "ffffff",
              },
            },
            "duotone:1::ffffff",
          );
        });
      });

      describe("Enforce Thumbnail", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              enforce_thumbnail: true,
            },
            "enforce_thumbnail",
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              enforce_thumbnail: true,
            },
            "enforce_thumbnail:true",
          );
        });
      });

      describe("Enlarge", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              enlarge: true,
            },
            "enlarge",
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              enlarge: true,
            },
            "enlarge:true",
          );
        });
      });

      describe("Expires", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              expires: Date.now(),
            },
            "expires",
            true,
          );
        });

        it("Applies Modifier (Date)", async () => {
          const date = new Date();
          await expectParam(
            {
              expires: date.getTime(),
            },
            `expires:${Math.floor(date.getTime())}`,
          );
        });

        it("Applies Modifier (Epoch)", async () => {
          await expectParam(
            {
              expires: 123,
            },
            `expires:123`,
          );
        });
      });

      describe("Extend", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              extend: true,
            },
            `extend`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              extend: true,
            },
            `extend:true`,
          );
        });
      });

      describe("Extend Aspect Ratio", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              extend_aspect_ratio: {
                extend: true,
              },
            },
            `extend_aspect_ratio`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              extend_aspect_ratio: {
                extend: true,
              },
            },
            `extend_aspect_ratio:true:`,
          );
        });

        it("Applies Gravity Type", async () => {
          await expectParam(
            {
              extend_aspect_ratio: {
                extend: true,
                gravity: {
                  type: "no",
                },
              },
            },
            `extend_aspect_ratio:true:no::`,
          );
        });

        it("Applies Gravity Offset", async () => {
          await expectParam(
            {
              extend_aspect_ratio: {
                extend: true,
                gravity: {
                  type: "ce",
                  x_offset: 50,
                  y_offset: 10,
                },
              },
            },
            `extend_aspect_ratio:true:ce:50:10`,
          );
        });
      });

      describe("Fallback Image URL", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              fallback_image_url: "http://test.test",
            },
            `fallback_image_url`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          const url = "https://test.test";

          await expectParam(
            {
              fallback_image_url: url,
            },
            `fallback_image_url:${encodeURIComponent(url)}`,
          );
        });
      });
    });
  });
});

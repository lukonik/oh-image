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

      describe("Filename", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              filename: "foo.png",
            },
            `filename`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              filename: "foo.png",
            },
            `filename:foo.png`,
          );
        });
      });

      describe("Format Quality", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              format_quality: {},
            },
            `format_quality`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              format_quality: {
                png: 10,
                jpeg: 14,
              },
            },
            `format_quality:png:10:jpeg:14`,
          );
        });
      });

      describe("Format", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              format: "png",
            },
            `format`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              format: "png",
            },
            `format:png`,
          );
        });
      });

      describe("Gradient", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              gradient: {
                opacity: 1,
              },
            },
            `gradient`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              gradient: {
                opacity: 1,
                direction: "up",
                color: "ff0000",
                start: 1.3,
                stop: 1.6,
              },
            },
            `gradient:1:ff0000:up:1.3:1.6`,
          );
        });

        it("Applies default values", async () => {
          await expectParam(
            {
              gradient: {
                opacity: 1,
              },
            },
            `gradient:1::::`,
          );
        });
      });

      describe("Monochrome", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              monochrome: {
                intensity: 0,
              },
            },
            `monochrome`,
            true,
          );
        });

        it("Applies Modifier Without Color", async () => {
          await expectParam(
            {
              monochrome: {
                intensity: 0.3,
              },
            },
            `monochrome:0.3:`,
          );
        });

        it("Applies Modifier With Color", async () => {
          await expectParam(
            {
              monochrome: {
                intensity: 0.3,
                color: "ff0000",
              },
            },
            `monochrome:0.3:ff0000`,
          );
        });
      });

      describe("Padding", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              padding: { top: 12 },
            },
            `padding`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              padding: { top: 12, right: 34, left: 56, bottom: 78 },
            },
            `padding:12:34:78:56`,
          );
        });
      });

      describe("Gravity", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              gravity: {
                type: "no",
              },
            },
            `gravity`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              gravity: {
                type: "nowe",
                x_offset: 12,
                y_offset: 34,
              },
            },
            `gravity:nowe:12:34`,
          );
        });

        it("Omits offsets if not specified", async () => {
          await expectParam(
            {
              gravity: {
                type: "nowe",
              },
            },
            `gravity:nowe::`,
          );
        });
      });

      describe("hashsum", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              hashsum: {
                hashsum: "abc",
                type: "md5",
              },
            },
            `hashsum`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              hashsum: {
                hashsum: "abc",
                type: "sha256",
              },
            },
            `hashsum:sha256:abc`,
          );
        });

        it("Applies Defaults", async () => {
          await expectParam(
            {
              hashsum: {
                hashsum: "abc",
                type: "none",
              },
            },
            `hashsum:none:abc`,
          );
        });
      });

      describe("JPEG Options", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              jpeg_options: {
                quant_table: 2,
              },
            },
            `jpeg_options`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              jpeg_options: {
                progressive: true,
                no_subsample: true,
                trellis_quant: true,
                overshoot_deringing: true,
                optimize_scans: true,
                quant_table: 2,
              },
            },
            `jpeg_options:true:true:true:true:true:2`,
          );
        });
      });

      describe("Keep Copyright", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              keep_copyright: true,
            },
            `keep_copyright`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              keep_copyright: true,
            },
            `keep_copyright:true`,
          );
        });
      });

      describe("Max Bytes", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              max_bytes: 150,
            },
            `max_bytes`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              max_bytes: 250,
            },
            `max_bytes:250`,
          );
        });
      });

      describe("Min Height", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              "min-height": 500,
            },
            `min-height`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              "min-height": 500,
            },
            `min-height:500`,
          );
        });
      });

      describe("Min Width", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              "min-width": 147,
            },
            `min-width`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              "min-width": 148,
            },
            `min-width:148`,
          );
        });
      });

      describe("Pixelate", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              pixelate: 147,
            },
            `pixelate`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              pixelate: 148,
            },
            `pixelate:148`,
          );
        });
      });

      describe("PNG Options", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              png_options: {
                interlaced: true,
              },
            },
            `png_options`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              png_options: {
                interlaced: true,
                quantization_colors: 3,
                quantize: true,
              },
            },
            `png_options:true:true:3`,
          );
        });
      });

      describe("Preset", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              preset: ["foobar"],
            },
            `preset`,
            true,
          );
        });

        it("Applies Modifier (Single Preset)", async () => {
          await expectParam(
            {
              preset: ["foobar"],
            },
            `preset:foobar`,
          );
        });

        it("Applies Modifier (Multiple Presets)", async () => {
          await expectParam(
            {
              preset: ["foobar1", "foobar2"],
            },
            `preset:foobar1:foobar2`,
          );
        });
      });

      describe("Raw", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              raw: true,
            },
            `raw`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              raw: true,
            },
            `raw:true`,
          );
        });
      });

      describe("Return Attachment", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              return_attachment: true,
            },
            `return_attachment`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              return_attachment: true,
            },
            `return_attachment:true`,
          );
        });
      });

      describe("Quality", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              quality: 150,
            },
            `quality`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              quality: 350,
            },
            `quality:350`,
          );
        });
      });

      describe("Resize", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              resize: {},
            },
            `resize`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              resize: {
                resizing_type: "fill",
                width: 12,
                height: 34,
              },
            },
            `resize:fill:12:34`,
            true,
          );
        });
      });

      describe("Resizing Algorithm", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              resizing_algorithm: "lanczos3",
            },
            `resizing_algorithm`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              resizing_algorithm: "lanczos2",
            },
            `resizing_algorithm:lanczos2`,
          );
        });
      });

      describe("Rotate", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              rotate: 196,
            },
            `rotate`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              rotate: 266,
            },
            `rotate:266`,
          );
        });
      });

      describe("Saturation", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              saturation: 196,
            },
            `saturation`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              saturation: 266,
            },
            `saturation:266`,
          );
        });
      });

      describe("Sharpen", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              sharpen: 196,
            },
            `sharpen`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              sharpen: 266,
            },
            `sharpen:266`,
          );
        });
      });

      describe("Skip Processing", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              skip_processing: [],
            },
            `skip_processing`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              skip_processing: ["png", "jpg"],
            },
            `skip_processing:png:jpg`,
          );
        });
      });

      describe("Strip Color Profile", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              strip_color_profile: true,
            },
            `strip_color_profile`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              strip_color_profile: true,
            },
            `strip_color_profile:true`,
          );
        });
      });

      describe("Strip Metadata", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              strip_metadata: true,
            },
            `strip_metadata`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              strip_metadata: true,
            },
            `strip_metadata:true`,
          );
        });
      });

      describe("Style", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              style: "",
            },
            `style`,
            true,
          );
        });

        it("Applies Modifier (String)", async () => {
          await expectParam(
            {
              style: "foo,bar",
            },
            `style:${encodeURIComponent("foo,bar")}`,
          );
          // expect(pb().style("foobar")).toIncludeModifier(
          //   "st:" + base64urlEncode(utf8encode("foobar")),
          // );
        });
      });

      describe("Trim", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              trim: {
                threshold: 12,
              },
            },
            `trim`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              trim: {
                threshold: 12,
                color: "123123",
                equal_hor: true,
                equal_ver: false,
              },
            },
            `trim:12:123123:true:false`,
          );
        });
      });

      describe("Unsharpen Masking", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              unsharpening: {
                mode: "always",
              },
            },
            `unsharpening`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              unsharpening: {
                mode: "sharpen",
                weight: 12,
                dividor: 34,
              },
            },
            `unsharpening:sharpen:12:34`,
          );
        });
      });

      describe("Watermark Shadow", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              watermark_shadow: 0.5,
            },
            `watermark_shadow`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              watermark_shadow: 0.5,
            },
            `watermark_shadow:0.5`,
          );
        });
      });

      describe("Watermark Size", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              watermark_size: {
                width: 12,
                height: 34,
              },
            },
            `watermark_size`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              watermark_size: {
                width: 12,
                height: 34,
              },
            },
            `watermark_size:12:34`,
          );
        });
      });

      describe("Watermark Text", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              watermark_text: "test",
            },
            `watermark_text`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              watermark_text: "test",
            },
            `watermark_text:test`,
          );
        });
      });

      describe("Watermark URL", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              watermark_url: "test",
            },
            `watermark_url`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              watermark_url: "test",
            },
            `watermark_url:test`,
          );
        });
      });

      describe("Zoom", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              zoom: 5,
            },
            `zoom`,
            true,
          );
        });

        it("Applies Modifier (X/Y)", async () => {
          await expectParam(
            {
              zoom: 12,
            },
            `zoom:12`,
          );
        });

        it("Applies Modifier (X, Y)", async () => {
          await expectParam(
            {
              zoom: {
                x: 14,
                y: 27,
              },
            },
            `zoom:14:27`,
          );
        });
      });

      describe("Watermark", () => {
        it("Uses Proper Identifier", async () => {
          await expectParam(
            {
              watermark: {
                opacity: 5,
              },
            },
            `watermark`,
            true,
          );
        });

        it("Applies Modifier", async () => {
          await expectParam(
            {
              watermark: {
                opacity: 14,
                position: "re",
              },
            },
            `watermark:14:re`,
            true,
          );
        });
      });
    });
  });
});

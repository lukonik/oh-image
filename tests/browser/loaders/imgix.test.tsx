import {
  describeBooleanOption,
  describeImageOptions,
  describeOptionFactory,
} from "./loaders-utils";
import type { ImgixTransforms } from "../../../src/loaders/imgix/imgix-options";
import { useImgixLoader } from "../../../src/loaders/imgix/imgix-loader";
import { describe } from "vitest";

describe("Imgix", () => {
  const optionSeparator = "=";

  const describeOption = describeOptionFactory<ImgixTransforms>(
    (options) => useImgixLoader(options),
    optionSeparator,
    ",",
  );

  describeImageOptions(
    () =>
      useImgixLoader({
        path: "https://example.imgix.net",
      }),
    "w",
    "h",
    optionSeparator,
  );

  describeBooleanOption(
    (options) => useImgixLoader(options),
    optionSeparator,
    true,
  );

  describeOption("w", 400);
  describeOption("h", 300);
  describeOption("ar", "16:9");
  describeOption("fit", "crop");
  describeOption("crop", "faces,top");
  describeOption("dpr", 2);
  describeOption("q", 80);
  describeOption("fm", "webp");
  describeOption("auto", "format,compress");
  describeOption("con", 20);
  describeOption("exp", -10);
  describeOption("sat", 30);
  describeOption("blur", 50);
  describeOption("sharp", 15);
  describeOption("sepia", 40);
  describeOption("bg", "fff");
  describeOption("border", "10px,red");
  describeOption("txt", "Hello");
  describeOption("txtFont", "Helvetica");
  describeOption("txtColor", "fff");
  describeOption("txtSize", 24);
  describeOption("txtAlign", "center");
  describeOption("mark", "https://example.com/watermark.png");
  describeOption("markAlpha", 50);
  describeOption("rot", 90);
  describeOption("flip", "h");
  describeOption("gaussblur", 10);
  describeOption("noise", 20);
  describeOption("strip", true);
  describeOption("rect", [10, 20, 100, 200]);
  describeOption("fp-x", 0.5);
  describeOption("fp-y", 0.5);
  describeOption("fp-z", 1.5);
  describeOption("lossless", true);
  describeOption("invert", true);
  describeOption("gam", 20);
});

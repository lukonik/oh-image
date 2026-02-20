import {
  describeBooleanOption,
  describeImageOptions,
  describeOptionFactory,
} from "./loaders-utils";
import type { CloudflareTransforms } from "../../../src/loaders/cloudflare/cloudflare-options";
import { useCloudflareLoader } from "../../../src/loaders/cloudflare/cloudflare-loader";
import { chai, describe } from "vitest";
chai.config.truncateThreshold = 100000;

describe("cloudflare", () => {
  const optionSeparator = "=";

  const describeOption = describeOptionFactory<CloudflareTransforms>(
    (options) => useCloudflareLoader(options),
    optionSeparator,
    ";",
  );

  describeImageOptions(
    () =>
      useCloudflareLoader({
        path: "http://contentful.com",
      }),
    "width",
    "height",
    optionSeparator,
  );

  describeBooleanOption(
    (options) => useCloudflareLoader(options),
    optionSeparator,
    true,
  );

  describeOption("anim", true);
  describeOption("background", "black");
  describeOption("blur", 120);
  describeOption("brightness", 77);
  describeOption("compression", "fast");
  describeOption("contrast", 55);
  describeOption("dpr", 1);
  describeOption("fit", "scale-down");
  describeOption("flip", "h");
  describeOption("format", "baseline-jpeg");
  describeOption("gamma", 5);
  describeOption("gravity", "top");
  describeOption("height", 120);
  describeOption("metadata", "copyright");
  describeOption("onerror", "redirect");
  describeOption("quality", "medium-high");
  describeOption("quality", 50);
  describeOption("rotate", 180);
  describeOption("saturation", 10);
  describeOption("segment", "foreground");
  describeOption("sharpen", 500);
  describeOption("slow-connection-quality", 50);
  describeOption("zoom", 100);
  describeOption("trim", [24, 27, 16, 14]);
});

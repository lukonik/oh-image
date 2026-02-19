import {
    createAnyDescribeTest,
    createBooleanDescribeTest,
    createNumberDescribeTest,
    createStringDescribeTest,
} from "./loaders-utils";
import type { CloudflareTransforms } from "../../../src/loaders/cloudflare/cloudflare-options";
import { useCloudflareLoader } from "../../../src/loaders/cloudflare/cloudflare-loader";
import { chai, describe } from "vitest";
chai.config.truncateThreshold = 100000;

describe("cloudflare", () => {
  const optionSeparator = "=";
  const paramSeparator = ",";
  let booleanDescribe = createBooleanDescribeTest<CloudflareTransforms>(
    (options) => useCloudflareLoader(options),
    paramSeparator,
    optionSeparator,
    true,
  );

  let numberDescribe = createNumberDescribeTest<CloudflareTransforms>(
    (options) => useCloudflareLoader(options),
    paramSeparator,
    optionSeparator,
  );

  let stringDescribe = createStringDescribeTest<CloudflareTransforms>(
    (options) => useCloudflareLoader(options),
    paramSeparator,
    optionSeparator,
  );

  let anyDescribe = createAnyDescribeTest<CloudflareTransforms>(
    (options) => useCloudflareLoader(options),
    paramSeparator,
    optionSeparator,
  );

  booleanDescribe("anim");
  stringDescribe("background", "black");
  numberDescribe("blur", 120);
  numberDescribe("brightness", 77);
  stringDescribe("compression", "fast");
  numberDescribe("contrast", 55);
  numberDescribe("dpr", 1);
  stringDescribe("fit", "scale-down");
  stringDescribe("flip", "h");
  stringDescribe("format", "baseline-jpeg");
  numberDescribe("gamma", 5);
  stringDescribe("gravity", "top");
  numberDescribe("height", 120);
  stringDescribe("metadata", "copyright");
  stringDescribe("onerror", "redirect");
  stringDescribe("quality", "medium-high");
  numberDescribe("quality", 50);
  numberDescribe("rotate", 180);
  numberDescribe("saturation", 10);
  stringDescribe("segment", "foreground");
  numberDescribe("sharpen", 500);
  numberDescribe("slow-connection-quality", 50);
  numberDescribe("zoom", 100);
  anyDescribe("trim", [24, 27, 16, 14], "24;27;16;14");
});

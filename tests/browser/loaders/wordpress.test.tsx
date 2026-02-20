import { describe } from "vitest";
import {
  createAnyDescribeTest,
  createBooleanDescribeTest,
  createImageOptionsDescribeTest,
  createNumberDescribeTest,
  createStringDescribeTest,
} from "./loaders-utils";
import { useWordpressLoader } from "../../../src/loaders/wordpress/wordpress-loader";
import type { WordpressTransforms } from "../../../src/loaders/wordpress/wordpress-options";

describe("WordPress", () => {
  const optionSeparator = "=";
  const paramSeparator = "&";

  createImageOptionsDescribeTest(
    () =>
      useWordpressLoader({
        path: "http://wordpress.com",
      }),
    "w",
    "h",
    optionSeparator,
  );

  const booleanDescribe = createBooleanDescribeTest<WordpressTransforms>(
    (options) => useWordpressLoader(options),
    paramSeparator,
    optionSeparator,
    true,
  );
  const numberDescribe = createNumberDescribeTest<WordpressTransforms>(
    (options) => useWordpressLoader(options),
    paramSeparator,
    optionSeparator,
  );
  const stringDescribe = createStringDescribeTest<WordpressTransforms>(
    (options) => useWordpressLoader(options),
    paramSeparator,
    optionSeparator,
  );
  const anyDescribe = createAnyDescribeTest<WordpressTransforms>(
    (options) => useWordpressLoader(options),
    paramSeparator,
    optionSeparator,
  );

  
  // booleanDescribe("crop");
  // numberDescribe("w", 320);
  // numberDescribe("h", 180);
  // anyDescribe("resize", [320, 100], "320%2C180");
  // // anyDescribe("fit", "320,180", "320%2C180");
  // numberDescribe("quality", 75);
  // stringDescribe("format", "webp");
  // stringDescribe("strip", "all");
  // numberDescribe("zoom", 2);
  // numberDescribe("ssl", 1);
});

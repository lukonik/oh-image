import { chai, describe } from "vitest";
import {
  createAnyDescribeTest,
  createBooleanDescribeTest,
  describeImageOptions,
  createNumberDescribeTest,
  createStringDescribeTest,
  describeOptionFactory,
  describeBooleanOption,
} from "./loaders-utils";
import { useWordpressLoader } from "../../../src/loaders/wordpress/wordpress-loader";
import type { WordpressTransforms } from "../../../src/loaders/wordpress/wordpress-options";
chai.config.truncateThreshold = 100000;

describe("WordPress", () => {
  const optionSeparator = "=";
  const paramSeparator = "&";

  const describeOption = describeOptionFactory<WordpressTransforms>(
    (options) => useWordpressLoader(options),
    "=",
    ",",
  );

  describeImageOptions(
    () =>
      useWordpressLoader({
        path: "http://contentful.com",
      }),
    "w",
    "h",
    optionSeparator,
  );

  describeBooleanOption(
    (options) => useWordpressLoader(options),
    optionSeparator,
    true,
  );
  describeOption("w", 100);
  describeOption("h", 200);
  describeOption("crop", [100, 200, "300px", "500px"]);
  describeOption("resize", [30, 50]);
  describeOption("fit", [100, 200]);
  describeOption("lb", [400, 500]);
  describeOption("ulb", true);
  describeOption("filter", "blurgaussian");
  describeOption("brightness", 100);
  describeOption("contrast", 50);
  describeOption("colorize", [20, 21, 255]);
  describeOption("smooth", 5);
  describeOption("zoom", 50);
  describeOption("quality", 50);
  describeOption("allow_lossy", 1);
  describeOption("strip", "none");

  describeImageOptions(
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
});

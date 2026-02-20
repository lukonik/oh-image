import { describe } from "vitest";
import {
  describeImageOptions,
  createNumberDescribeTest,
  createStringDescribeTest,
} from "./loaders-utils";
import { useContentfulLoader } from "../../../src/loaders/contentful/contentful-loader";
import type { ContentfulTransforms } from "../../../src/loaders/contentful/contentful-options";
describe("Contentful", () => {
  const optionSeparator = "=";
  const paramSeparator = "&";
  describeImageOptions(
    () =>
      useContentfulLoader({
        path: "http://contentful.com",
      }),
    "w",
    "h",
    optionSeparator,
  );

  let numberDescribe = createNumberDescribeTest<ContentfulTransforms>(
    (options) => useContentfulLoader(options),
    paramSeparator,
    optionSeparator,
  );

  let stringDescribe = createStringDescribeTest<ContentfulTransforms>(
    (options) => useContentfulLoader(options),
    paramSeparator,
    optionSeparator,
  );

  stringDescribe("fm", "tiff");
  stringDescribe("fl", "progressive");
  numberDescribe("w", 120);
  numberDescribe("h", 200);
  stringDescribe("fit", "pad");
  stringDescribe("f", "bottom_right");
  stringDescribe("r", "max");
  numberDescribe("r", 20);
  numberDescribe("q", 120);
  stringDescribe("bg", "red");
});

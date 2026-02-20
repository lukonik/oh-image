import { describe } from "vitest";
import {
  describeImageOptions,
  describeOptionFactory,
} from "./loaders-utils";
import { useContentfulLoader } from "../../../src/loaders/contentful/contentful-loader";
import type { ContentfulTransforms } from "../../../src/loaders/contentful/contentful-options";
describe("Contentful", () => {
  const optionSeparator = "=";

  const describeOption = describeOptionFactory<ContentfulTransforms>(
    (options) => useContentfulLoader(options),
    optionSeparator,
  );

  describeImageOptions(
    () =>
      useContentfulLoader({
        path: "http://contentful.com",
      }),
    "w",
    "h",
    optionSeparator,
  );

  describeOption("fm", "tiff");
  describeOption("fl", "progressive");
  describeOption("w", 120);
  describeOption("h", 200);
  describeOption("fit", "pad");
  describeOption("f", "bottom_right");
  describeOption("r", "max");
  describeOption("r", 20);
  describeOption("q", 120);
  describeOption("bg", "red");
});

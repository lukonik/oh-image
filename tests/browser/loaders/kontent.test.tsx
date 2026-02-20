import {
  describeBooleanOption,
  describeImageOptions,
  describeOptionFactory,
} from "./loaders-utils";
import type { KontentTransforms } from "../../../src/loaders/kontent/kontent-options";
import { useKontentLoader } from "../../../src/loaders/kontent/kontent-loader";
import { describe } from "vitest";

describe("Kontent", () => {
  const optionSeparator = "=";
  const paramSeparator = "&";

  const describeOption = describeOptionFactory<KontentTransforms>(
    (options) => useKontentLoader(options),
    "=",
    ",",
  );

  describeImageOptions(
    () =>
      useKontentLoader({
        path: "http://contentful.com",
      }),
    "w",
    "h",
    optionSeparator,
  );

  describeBooleanOption(
    (options) => useKontentLoader(options),
    optionSeparator,
    true,
  );

  describeOption("w", 250);
  describeOption("h", 300);
  describeOption("dpr", 20);
  describeOption("fit", "clamp");
  describeOption("rect", [23, 24, 25, 6]);
  describeOption("fp-x", 20);
  describeOption("fp-y", 0.5);
  describeOption("fp-z", 30);
  describeOption("smart", "edges");
  describeOption("bg", "fff");
  describeOption("fm", "webp");
  describeOption("q", 50);
  describeOption("lossless", true);
  describeOption("auto", "format");
});

import { describeImageOptions, describeOptionFactory } from "./loaders-utils";
import type { NetlifyTransforms } from "../../../src/loaders/netlify/netlify-options";
import { useNetlifyLoader } from "../../../src/loaders/netlify/netlify-loader";
import { chai, describe } from "vitest";
chai.config.truncateThreshold = 100000;

describe("netlify", () => {
  const optionSeparator = "=";

  const describeOption = describeOptionFactory<NetlifyTransforms>(
    (options) => useNetlifyLoader(options),
    optionSeparator,
    ",",
  );

  describeImageOptions(
    () =>
      useNetlifyLoader({
        path: "http://mock.com",
      }),
    "w",
    "h",
    optionSeparator,
  );
  describeOption("w", 200);
  describeOption("h", 400);
  describeOption("fm", "webp");
  describeOption("q", 80);
  describeOption("fit", "cover");
  describeOption("position", "center");
});

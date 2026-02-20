import {
  createBooleanDescribeTest,
  createNumberDescribeTest,
  createStringDescribeTest
} from "./loaders-utils";
import type { KontentTransforms } from "../../../src/loaders/kontent/kontent-options";
import { useKontentLoader } from "../../../src/loaders/kontent/kontent-loader";
import { describe } from "vitest";

describe("Kontent", () => {
  const optionSeparator = "=";
  const paramSeparator = "&";
  let booleanDescribe = createBooleanDescribeTest<KontentTransforms>(
    (options) => useKontentLoader(options),
    paramSeparator,
    optionSeparator,
    true,
  );

  let numberDescribe = createNumberDescribeTest<KontentTransforms>(
    (options) => useKontentLoader(options),
    paramSeparator,
    optionSeparator,
  );

  let stringDescribe = createStringDescribeTest<KontentTransforms>(
    (options) => useKontentLoader(options),
    paramSeparator,
    optionSeparator,
  );

  numberDescribe("w", 250);
  numberDescribe("h", 300);
  numberDescribe("dpr", 20);
  stringDescribe("fit", "clamp");
  // stringDescribe("rect", "23,24,25,6"); // TODO
  numberDescribe("fp-x", 20);
  numberDescribe("fp-y", 0.5);
  numberDescribe("fp-z", 30);
  stringDescribe("smart", "edges");
  stringDescribe("bg", "fff");
  stringDescribe("fm", "webp");
  numberDescribe("q", 50);
  booleanDescribe("lossless");
  stringDescribe("auto", "format");
});

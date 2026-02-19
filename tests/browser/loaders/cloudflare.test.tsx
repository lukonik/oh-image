import {
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

  booleanDescribe("anim");
  stringDescribe("background", "black");
  numberDescribe("blur", 120);
  numberDescribe("brightness", 77);
  stringDescribe("compression", "fast");
});

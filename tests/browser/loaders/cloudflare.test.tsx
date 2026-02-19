import { createOptionDescribeTests } from "./loaders-utils";
import type { CloudflareTransforms } from "../../../src/loaders/cloudflare/cloudflare-options";
import { useCloudflareLoader } from "../../../src/loaders/cloudflare/cloudflare-loader";
import { chai, describe } from "vitest";
chai.config.truncateThreshold = 100000;

describe("cloudflare", () => {
  let describeTest = createOptionDescribeTests<CloudflareTransforms>(
    (options) => useCloudflareLoader(options),
    ",",
    "=",
    true,
  );

  describeTest("anim");
});

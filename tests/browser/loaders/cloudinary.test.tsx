import { describe } from "vitest";
import { useCloudinaryLoader } from "../../../src/loaders/cloudinary/cloudinary-loader";
import type { CloudinaryTransforms } from "../../../src/loaders/cloudinary/cloudinary-options";
import {
    createBooleanDescribeTest,
    createNumberDescribeTest,
    createStringDescribeTest,
    createAnyDescribeTest,
} from "./loaders-utils";

describe("cloudinary", () => {
  const optionSeparator = "_";
  const paramSeparator = ",";
  let booleanDescribe = createBooleanDescribeTest<CloudinaryTransforms>(
    (options) => useCloudinaryLoader(options),
    paramSeparator,
    optionSeparator,
    true,
  );

  let numberDescribe = createNumberDescribeTest<CloudinaryTransforms>(
    (options) => useCloudinaryLoader(options),
    paramSeparator,
    optionSeparator,
  );

  let stringDescribe = createStringDescribeTest<CloudinaryTransforms>(
    (options) => useCloudinaryLoader(options),
    paramSeparator,
    optionSeparator,
  );

  let anyDescribe = createAnyDescribeTest<CloudinaryTransforms>(
    (options) => useCloudinaryLoader(options),
    paramSeparator,
    optionSeparator,
  );

  stringDescribe("a", "vflip.50");
  stringDescribe("ar", "10");
  numberDescribe("ar", 20);
  stringDescribe("b", "red");
});

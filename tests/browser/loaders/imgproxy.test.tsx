import { describe } from "vitest";
import { expectLoaderToPassParamFactory } from "./loaders-utils";
import { useImgproxyLoader } from "../../../src/loaders/imgproxy/imgproxy-loader";
import type { ImgproxyTransforms } from "../../../src/loaders/imgproxy/imgproxy-options";
describe("imgproxy", () => {
  let expectParam = expectLoaderToPassParamFactory<ImgproxyTransforms>(
    (options) => useImgproxyLoader(options),
    "/",
  );
});

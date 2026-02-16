import type { ImageLoaderOptions } from "../../types";
import { useImgproxyContext } from "./imgproxy-context";
import type { ImgproxyOptions } from "./imgproxy-options";

const resolveParam = (key: string, value: unknown) => {
  return `${key}:${value}`;
};

const resolveObjectParam = (source: Record<string, unknown>) => {
  const params: string[] = [];
  for (const key in Object.keys(source)) {
    const value = source[key];
    params.push(resolveParam(key, value));
  }
  return params.join("");
};

const resolveTransforms = (transforms: ImgproxyOptions["transforms"]) => {
  if (!transforms) {
    return "";
  }
  const params: string[] = [];
  for (const key of Object.keys(transforms)) {
    const value = transforms[key as keyof ImgproxyOptions["transforms"]];
    if (typeof value === "object") {
      params.push(resolveObjectParam(value));
    } else {
      params.push(resolveParam(key, value));
    }
  }

  return params;
};

const resolveParams = (...params: string[]) => {
  return params.join("/");
};

export function useImgproxyLoader(options: ImgproxyOptions) {
  const context = useImgproxyContext();
  const resolvedOptions = {
    ...context,
    ...options,
  };
  return (imageOptions: ImageLoaderOptions) => {
    const imageOptionParams: string[] = [];
    if (imageOptions.width) {
      imageOptionParams.push(resolveParam("width", imageOptions.width));
    }

    if (imageOptions.height) {
      imageOptionParams.push(resolveParam("height", imageOptions.height));
    }

    const transformsParams = resolveTransforms(resolvedOptions.transforms);

    // resolve deprecated params, will be removed in future
    if (options.params) {
      const params = resolveObjectParam(options.params);
      imageOptionParams.push(...params);
    }

    const resolvedParams = resolveParams(
      ...imageOptionParams,
      ...transformsParams,
    );

    return `${resolvedOptions.path}/${resolvedParams}/plain/${imageOptions.src}`;
  };
}

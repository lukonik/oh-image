import { renderHook } from "vitest-browser-react";
import type { BaseLoaderOptions } from "../../../src/loaders/base-loader-options";
import { expect } from "vitest";

export function expectLoaderToPassParamFactory<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
) {
  return async (transform: T, checkValue: string) => {
    const { result } = await renderHook(() =>
      hook({
        transforms: transform,
        path: "http://mock.com",
      }),
    );
    const url = result.current({
      src: "test",
    });

    expect(url).includes(`${paramSeparator}${checkValue}${paramSeparator}`);
    return url;
  };
}

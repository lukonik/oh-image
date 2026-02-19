import { renderHook } from "vitest-browser-react";
import type { BaseLoaderOptions } from "../../../src/loaders/base-loader-options";
import { describe, expect, it } from "vitest";

export function expectLoaderToPassParamFactory<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
) {
  return async (transform: T, checkValue: string, includesParam?: boolean) => {
    const { result } = await renderHook(() =>
      hook({
        transforms: transform,
        path: "http://mock.com",
      }),
    );
    const url = result.current({
      src: "test",
    });

    const expectedValue = includesParam
      ? checkValue
      : `${paramSeparator}${checkValue}${paramSeparator}`;

    const startValue = includesParam
      ? checkValue
      : `/${checkValue}${paramSeparator}`;

    const endValue = includesParam
      ? checkValue
      : `${paramSeparator}${checkValue}/`;

    const singleParamValue = includesParam
      ? checkValue
      : `/${paramSeparator}${checkValue}/`;

    if (!(expectedValue && startValue && endValue && singleParamValue)) {
      expect.fail(`Expected: ${url}, Got: ${expectedValue}`)
    }
    return url;
  };
}

export function createOptionDescribeTests<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
  optionsSeparator: string,
  passBooleanValue: boolean,
) {
  return (key: keyof T, value?: boolean) => {
    describe(key.toString(), () => {
      it("Uses Proper Identifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = value ?? true;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: true,
          } as any,
          expectedValue,
          true,
        );
      });
    });
  };
}

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

    const singleParamValue = includesParam ? checkValue : `/${checkValue}/`;

    if (
      !url.includes(expectedValue) &&
      !url.includes(startValue) &&
      !url.includes(endValue) &&
      !url.includes(singleParamValue)
    ) {
      expect.fail(`Expected: ${url} to contain: ${checkValue}`);
    }
    return url;
  };
}

export function createBooleanDescribeTest<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
  optionsSeparator: string,
  passBooleanValue: boolean,
) {
  return (key: keyof T) => {
    describe(key.toString(), () => {
      it("Uses Proper Identifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = true;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: resolvedValue,
          } as any,
          expectedValue,
          true,
        );
      });

      it("Applies Modifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = true;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: resolvedValue,
          } as any,
          expectedValue,
        );
      });
    });
  };
}

export function createNumberDescribeTest<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
  optionsSeparator: string,
) {
  return (key: keyof T, value: number) => {
    describe(key.toString(), () => {
      it("Uses Proper Identifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = value;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: value,
          } as any,
          expectedValue,
          true,
        );
      });

      it("Applies Modifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = value;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: resolvedValue,
          } as any,
          expectedValue,
        );
      });
    });
  };
}


export function createStringDescribeTest<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
  optionsSeparator: string,
) {
  return (key: keyof T, value: string) => {
    describe(key.toString(), () => {
      it("Uses Proper Identifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = value;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: value,
          } as any,
          expectedValue,
          true,
        );
      });

      it("Applies Modifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = value;
        const expectedValue = `${key as string}${optionsSeparator}${resolvedValue}`;
        checker(
          {
            [key as keyof T]: resolvedValue,
          } as any,
          expectedValue,
        );
      });
    });
  };
}

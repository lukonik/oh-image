import { renderHook } from "vitest-browser-react";
import type { BaseLoaderOptions } from "../../../src/loaders/base-loader-options";
import { describe, expect, it } from "vitest";
import type { ImageLoader } from "../../../src/react/types";

export function describeBooleanOption<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  optionSeparator: string,
  passBooleanValue: boolean,
) {
  describe("Boolean Option", () => {
    it("should correctly pass boolean value", async () => {
      const { result } = await renderHook(() =>
        hook({
          path: "http://mock.com",
          transforms: {
            foo: true,
          } as any,
        }),
      );

      const url = result.current({
        src: "test.png",
      });

      if (passBooleanValue) {
        expect(url).includes("foo" + optionSeparator + "true");
      } else {
        expect(url).includes("foo").and.not.includes("true");
      }
    });
  });
}

export function describeImageOptions<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  wKey: string,
  hKey: string,
  optionSeparator: string,
) {
  describe("ImageOptions", () => {
    it("src should be passed", async () => {
      const { result } = await renderHook(() =>
        hook({
          path: "http://mock.com",
        }),
      );

      const url = result.current({
        src: "test.png",
      });

      expect(url).includes("test.png");
    });

    it("should pass the width", async () => {
      const { result } = await renderHook(() =>
        hook({
          path: "http://mock.com",
        }),
      );

      const url = result.current({
        src: "test.png",
        width: 600,
      });

      expect(url).includes(`${wKey}${optionSeparator}${600}`);
    });

    it("should pass the width", async () => {
      const { result } = await renderHook(() =>
        hook({
          path: "http://mock.com",
        }),
      );

      const url = result.current({
        src: "test.png",
        height: 900,
      });

      expect(url).includes(`${hKey}${optionSeparator}${900}`);
    });
  });
}

type ExpectOption<T> = <K extends keyof T & string>(
  key: K,
  value: T[K],
  expectedValue?: string,
) => Promise<string | undefined>;

type HookFactory<T> = ({
  transforms,
  path,
}: {
  transforms: Partial<T>;
  path: string;
}) => ImageLoader;

export function optionExpectFactory<T extends Record<string, unknown>>(
  hook: HookFactory<T>,
  optionSeparator: string,
  arraySeparator?: string,
) {
  const expectOption: ExpectOption<T> = async (
    key,
    value,
    expectedValue?: string,
  ) => {
    const { result } = await renderHook(() =>
      hook({
        transforms: { [key]: value } as unknown as Partial<T>,
        path: "http://mock.com",
      }),
    );
    // if expectedValue is not present we get the value to check

    let valueToCheckAgainst = value as string;
    if (expectedValue) {
      valueToCheckAgainst = expectedValue;
    }
    if (Array.isArray(valueToCheckAgainst)) {
      if (!arraySeparator) {
        throw new Error(
          `got array with key: ${key}, value:${value} with no array separator`,
        );
      }
      valueToCheckAgainst = valueToCheckAgainst
        .map(encodeURIComponent)
        .join(arraySeparator);
    } else {
      valueToCheckAgainst = encodeURIComponent(valueToCheckAgainst);
    }

    const resolvedParamToCheckAgainst = `${key}${optionSeparator}${valueToCheckAgainst}`;
    const url = result.current({
      src: "test",
    });
    expect(url, "TEST!!!").includes(resolvedParamToCheckAgainst);

    return url;
  };

  return expectOption;
}

export function describeOptionFactory<T extends Record<string, unknown>>(
  hook: HookFactory<T>,
  optionSeparator: string,
  arraySeparator?: string,
) {
  const describeExpect: ExpectOption<T> = (
    key,
    value,
    expectedValue?: string,
  ) => {
    describe(key, () => {
      it("applies modifiers", async () => {
        const optionExpect = optionExpectFactory<T>(
          hook,
          optionSeparator,
          arraySeparator,
        );

        await optionExpect(key, value, expectedValue);
      });
    });

    return Promise.resolve("");
  };
  return describeExpect;
}

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

    let encodedExpectedValue = encodeURIComponent(checkValue);

    const expectedValue = includesParam
      ? checkValue
      : `${paramSeparator}${encodedExpectedValue}${paramSeparator}`;

    const startValue = includesParam
      ? encodedExpectedValue
      : `/${encodedExpectedValue}${paramSeparator}`;

    const endValue = includesParam
      ? encodedExpectedValue
      : `${paramSeparator}${encodedExpectedValue}/`;

    const singleParamValue = includesParam
      ? encodedExpectedValue
      : `/${encodedExpectedValue}/`;

    expect(url).includes(checkValue);

    // let passed =
    //   url.includes(expectedValue) ||
    //   url.includes(startValue) ||
    //   url.includes(endValue) ||
    //   url.includes(singleParamValue);

    // if (!passed && !includesParam && paramSeparator === "&") {
    //   const queryStart = `?${encodedExpectedValue}${paramSeparator}`;
    //   const queryEnd = `${paramSeparator}${encodedExpectedValue}`;
    //   const querySingle = `?${encodedExpectedValue}`;

    //   passed =
    //     url.includes(queryStart) ||
    //     url.endsWith(queryEnd) ||
    //     url.endsWith(querySingle);
    // }

    // if (!passed) {
    //   expect.fail(`Expected: ${url} to contain: ${checkValue}`);
    // }
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
  return <K extends keyof T>(key: K, value: T[K]) => {
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
  return <K extends keyof T>(key: K, value: T[K]) => {
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

export function createAnyDescribeTest<T>(
  hook: (transform: BaseLoaderOptions<T>) => any,
  paramSeparator: string,
  optionsSeparator: string,
) {
  return <K extends keyof T>(key: K, value: T[K], checkAgainst: string) => {
    describe(key.toString(), () => {
      it("Uses Proper Identifier", async () => {
        const checker = expectLoaderToPassParamFactory(hook, paramSeparator);
        const resolvedValue = value;
        const expectedValue = `${key as string}${optionsSeparator}${checkAgainst}`;
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
        const expectedValue = `${key as string}${optionsSeparator}${checkAgainst}`;
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

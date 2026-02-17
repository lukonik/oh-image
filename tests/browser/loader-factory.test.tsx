import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BaseGlobalLoaderOptions } from "../../src/react/loaders/base-loader-options";
import loaderFactory from "../../src/react/loaders/loader-factory";
import type { ImageLoaderOptions } from "../../src/react/types";

interface TestTransforms {
  q?: string;
  fmt?: string;
}

interface TestConfig extends BaseGlobalLoaderOptions<TestTransforms> {
  // no extra properties needed for now
}

describe("loaderFactory", () => {
  const defaults: TestConfig = {
    path: "https://example.com",
    transforms: { q: "80" },
    placeholderTransforms: { q: "10" },
  };

  const config = {
    optionSeparator: ",",
    paramSeparator: "&",
  };

  const paramsResolver = vi.fn();
  const urlResolver = vi.fn();

  // Reset mocks before each test
  const setup = () => {
    paramsResolver.mockReset().mockReturnValue(["mock=params"]);
    urlResolver.mockReset().mockReturnValue("https://resolved.url");
    return loaderFactory<TestTransforms, TestConfig>(
      defaults,
      config,
      paramsResolver,
      urlResolver,
    );
  };

  it("creates the expected exports", () => {
    const { LoaderProvider, useLoader, usePlaceholder, useLoaderContext } =
      setup();
    expect(LoaderProvider).toBeDefined();
    expect(useLoader).toBeDefined();
    expect(usePlaceholder).toBeDefined();
    expect(useLoaderContext).toBeDefined();
  });

  it("useLoaderContext returns defaults initially", () => {
    const { useLoaderContext } = setup();
    const { result } = renderHook(() => useLoaderContext());
    expect(result.current).toEqual(defaults);
  });

  it("LoaderProvider overrides context values", () => {
    const { LoaderProvider, useLoaderContext } = setup();
    const overrides = { path: "https://cdn.test" };

    const { result } = renderHook(() => useLoaderContext(), {
      wrapper: ({ children }) => (
        <LoaderProvider {...overrides}>{children}</LoaderProvider>
      ),
    });

    expect(result.current).toEqual({ ...defaults, ...overrides });
  });

  it("useLoader returns empty string if path is missing (and not in context)", () => {
    const { LoaderProvider, useLoader } = loaderFactory<
      TestTransforms,
      TestConfig
    >({} as any, config, paramsResolver, urlResolver);

    const { result } = renderHook(() => useLoader(), {
      wrapper: ({ children }) => <LoaderProvider>{children}</LoaderProvider>,
    });

    expect(result.current({} as any)).toBe(undefined);
  });

  it("useLoader generates URL using resolvers", () => {
    const { useLoader } = setup();
    const { result } = renderHook(() => useLoader());
    const generateUrl = result.current;

    const imageOptions: ImageLoaderOptions = {
      src: "foo.jpg",
      width: 100,
      height: 100,
    };
    const url = generateUrl(imageOptions);

    expect(url).toBe("https://resolved.url");

    expect(paramsResolver).toHaveBeenCalledWith({
      path: defaults.path,
      transforms: defaults.transforms,
      imageOptions,
      params: [`width,100`, `height,100`],
      optionSeparator: ",",
      paramSeparator: "&",
    });

    expect(urlResolver).toHaveBeenCalledWith({
      imageOptions,
      params: "mock=params", // Joined result of paramsResolver
      path: defaults.path,
    });
  });

  it("useLoader merges options transforms with context transforms", () => {
    const { useLoader } = setup();
    // Pass specific options to useLoader hook
    const hookOptions: TestConfig = { transforms: { fmt: "webp" } };
    const { result } = renderHook(() => useLoader(hookOptions));

    const generateUrl = result.current;
    generateUrl({ src: "img.png" });

    expect(paramsResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: { q: "80", fmt: "webp" },
      }),
    );
  });

  it("usePlaceholder uses placeholderTransforms", () => {
    const { usePlaceholder } = setup();
    const { result } = renderHook(() => usePlaceholder());
    const generateUrl = result.current;

    generateUrl({ src: "img.png" });

    expect(paramsResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        transforms: { q: "10" }, // placeholderTransforms from defaults
      }),
    );
  });

  it("useLoader passes locally provided path over context path", () => {
    const { useLoader } = setup();
    const localPath = "https://local.com";
    const { result } = renderHook(() => useLoader({ path: localPath }));
    const generateUrl = result.current;

    generateUrl({ src: "img.jpg" });

    expect(paramsResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        path: localPath,
      }),
    );
    expect(urlResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        path: localPath,
      }),
    );
  });
});

import "@testing-library/jest-dom/vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  ImgproxyLoaderProvider,
  useImgproxyContext,
} from "../../src/react/loaders/imgproxy-context";

describe("useImgproxyContext", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns default values", () => {
    const { result } = renderHook(() => useImgproxyContext());
    expect(result.current.path).toBe("");
    expect(result.current.placeholder).toBe(true);
    expect(result.current.format).toBe("webp");
  });
});

describe("ImgproxyLoaderProvider", () => {
  afterEach(() => {
    cleanup();
  });

  it("overrides path", () => {
    const { result } = renderHook(() => useImgproxyContext(), {
      wrapper: ({ children }) => (
        <ImgproxyLoaderProvider path="https://cdn.example.com">
          {children}
        </ImgproxyLoaderProvider>
      ),
    });
    expect(result.current.path).toBe("https://cdn.example.com");
  });

  it("merges nested providers", () => {
    const { result } = renderHook(() => useImgproxyContext(), {
      wrapper: ({ children }) => (
        <ImgproxyLoaderProvider path="https://outer.com">
          <ImgproxyLoaderProvider placeholder={false}>
            {children}
          </ImgproxyLoaderProvider>
        </ImgproxyLoaderProvider>
      ),
    });
    expect(result.current.path).toBe("https://outer.com");
    expect(result.current.placeholder).toBe(false);
  });
});

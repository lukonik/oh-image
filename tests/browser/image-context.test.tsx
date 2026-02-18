import "@testing-library/jest-dom/vitest";
import { cleanup, render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ImageProvider, useImageContext } from "../../src/react/image-context";
import type { ImageLoader } from "../../src/react/types";

describe("useImageContext", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns default loader=null", () => {
    const { result } = renderHook(() => useImageContext());
    expect(result.current.loader).toBeNull();
  });
});

describe("ImageProvider", () => {
  afterEach(() => {
    cleanup();
  });

  it("overrides breakpoints", () => {
    const customBreakpoints = [320, 640, 1024];
    const { result } = renderHook(() => useImageContext(), {
      wrapper: ({ children }) => (
        <ImageProvider breakpoints={customBreakpoints}>
          {children}
        </ImageProvider>
      ),
    });
    expect(result.current.breakpoints).toEqual(customBreakpoints);
  });

  it("overrides loader", () => {
    const myLoader: ImageLoader = (opts) => `https://cdn.test/${opts.src}`;
    const { result } = renderHook(() => useImageContext(), {
      wrapper: ({ children }) => (
        <ImageProvider loader={myLoader}>{children}</ImageProvider>
      ),
    });
    expect(result.current.loader).toBe(myLoader);
  });

  it("renders children", () => {
    const { getByText } = render(
      <ImageProvider>
        <span>child content</span>
      </ImageProvider>,
    );
    expect(getByText("child content")).toBeInTheDocument();
  });
});

import "@testing-library/jest-dom/vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  CloudflareLoaderProvider,
  useCloudflareContext,
} from "../../src/react";

describe("useCloudflareContext", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns default values", () => {
    const { result } = renderHook(() => useCloudflareContext());
    expect(result.current.path).toBe("");
    expect(result.current.placeholder).toBe(true);
    expect(result.current.format).toBe("auto");
  });
});

describe("CloudflareLoaderProvider", () => {
  afterEach(() => {
    cleanup();
  });

  it("overrides path", () => {
    const { result } = renderHook(() => useCloudflareContext(), {
      wrapper: ({ children }) => (
        <CloudflareLoaderProvider path="https://cdn.example.com">
          {children}
        </CloudflareLoaderProvider>
      ),
    });
    expect(result.current.path).toBe("https://cdn.example.com");
  });

  it("merges nested providers", () => {
    const { result } = renderHook(() => useCloudflareContext(), {
      wrapper: ({ children }) => (
        <CloudflareLoaderProvider path="https://outer.com">
          <CloudflareLoaderProvider placeholder={false}>
            {children}
          </CloudflareLoaderProvider>
        </CloudflareLoaderProvider>
      ),
    });
    expect(result.current.path).toBe("https://outer.com");
    expect(result.current.placeholder).toBe(false);
  });
});

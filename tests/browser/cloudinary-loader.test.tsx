import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  CloudinaryLoaderProvider,
  useCloudinaryLoader,
} from "../../src/react/loaders/cloudinary-loader";

describe("useCloudinaryLoader", () => {
  const defaultPath = "https://res.cloudinary.com/demo";

  it("generates correct URL with minimal options", () => {
    const { result } = renderHook(() =>
      useCloudinaryLoader({ path: defaultPath }),
    );
    const loader = result.current;

    const url = loader({ src: "sample.jpg" });
    expect(url).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto/sample.jpg",
    );
  });

  it("generates correct URL with width and height", () => {
    const { result } = renderHook(() =>
      useCloudinaryLoader({ path: defaultPath }),
    );
    const loader = result.current;

    const url = loader({ src: "sample.jpg", width: 100, height: 200 });
    expect(url).toContain("w_100");
    expect(url).toContain("h_200");
    expect(url).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,w_100,h_200/sample.jpg",
    );
  });

  it("handles placeholder quality (currently hardcoded)", () => {
    const { result } = renderHook(() =>
      useCloudinaryLoader({ path: defaultPath }),
    );
    const loader = result.current;

    const url = loader({ src: "sample.jpg", isPlaceholder: true });
    expect(url).toContain("e_blur:1000");
    expect(url).toContain("q_1");
  });

  it("respects context placeholderParams", () => {
    const { result } = renderHook(() => useCloudinaryLoader(), {
      wrapper: ({ children }) => (
        <CloudinaryLoaderProvider
          path={defaultPath}
          placeholderParams={{ q: "_10" }}
        >
          {children}
        </CloudinaryLoaderProvider>
      ),
    });
    const loader = result.current;
    const url = loader({ src: "sample.jpg", isPlaceholder: true });
    expect(url).toContain("q_10");
  });

  it("includes extra params", () => {
    const { result } = renderHook(() =>
      useCloudinaryLoader({
        path: defaultPath,
        params: { c: "_fill", g: "_center" },
      }),
    );
    const loader = result.current;
    const url = loader({ src: "sample.jpg" });
    expect(url).toContain("c_fill,g_center");
  });

  it("handles double slashes if src starts with /", () => {
    const { result } = renderHook(() =>
      useCloudinaryLoader({ path: defaultPath }),
    );
    const loader = result.current;
    const url = loader({ src: "/sample.jpg" });
    expect(url).not.toContain("//sample.jpg");
    expect(url).toContain("/image/upload/f_auto/sample.jpg");
  });
});

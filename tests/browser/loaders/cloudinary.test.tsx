import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { sepia } from "@cloudinary/url-gen/actions/effect";
import {
  useCloudinaryLoader,
  CloudinaryLoaderProvider,
} from "../../../src/loaders/cloudinary/cloudinary-loader";

describe("Cloudinary Loader", () => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "demo",
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CloudinaryLoaderProvider client={cld}>
      {children}
    </CloudinaryLoaderProvider>
  );

  it("generates a basic URL", () => {
    const { result } = renderHook(() => useCloudinaryLoader(), { wrapper });
    const loader = result.current;

    const url = loader({ src: "sample" });
    expect(url).toContain("https://res.cloudinary.com/demo/image/upload");
    expect(url).toContain("/sample");
    // Default transforms
    expect(url).toContain("f_auto");
    expect(url).toContain("q_auto");
  });

  it("applies width resize", () => {
    const { result } = renderHook(() => useCloudinaryLoader(), { wrapper });
    const loader = result.current;

    const url = loader({ src: "sample", width: 100 });
    // Check for resize action
    // scale().width(100) -> c_scale,w_100
    expect(url).toContain("c_scale");
    expect(url).toContain("w_100");
  });

  it("applies custom transforms via hook options", () => {
    const { result } = renderHook(
      () => useCloudinaryLoader((img) => img.effect(sepia())),
      { wrapper },
    );
    const loader = result.current;

    const url = loader({ src: "sample" });
    expect(url).toContain("e_sepia");
  });

  it("applies placeholder transforms", () => {
    const { result } = renderHook(() => useCloudinaryLoader(), { wrapper });
    const loader = result.current;

    const url = loader({ src: "sample", isPlaceholder: true });
    // Default placeholder: w_10, q_auto:low
    expect(url).toContain("w_10");
    expect(url).toContain("q_auto:low");
  });
});
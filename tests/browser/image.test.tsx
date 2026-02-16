import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Image } from "../../src/react/image";

describe("Image", () => {
  afterEach(() => {
    cleanup();
  });

  it("should be defined", () => {
    expect(Image).toBeDefined();
  });

  it("should add className to image", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} className="test" />,
    );
    expect(getByRole("img")).toHaveClass("test");
  });

  it("should add styles to image", () => {
    const { getByRole } = render(
      <Image
        alt="image"
        src="/"
        width={100}
        height={100}
        style={{ width: "100px" }}
      />,
    );
    expect(getByRole("img")).toHaveStyle({ width: "100px" });
  });

  it("should set alt attribute", () => {
    const { getByRole } = render(
      <Image src="/" alt="alt image" width={100} height={100} />,
    );
    expect(getByRole("img")).toHaveAttribute("alt", "alt image");
  });

  it("should set decoding attribute", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} decoding="async" />,
    );
    expect(getByRole("img")).toHaveAttribute("decoding", "async");
  });

  it("should set loading attribute", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} loading="lazy" />,
    );
    expect(getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  it("should set width attribute", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} />,
    );
    expect(getByRole("img")).toHaveAttribute("width", "100");
  });

  it("should set height attribute", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} />,
    );
    expect(getByRole("img")).toHaveAttribute("height", "100");
  });

  it("should set fetchPriority attribute", () => {
    const { getByRole } = render(
      <Image
        alt="image"
        src="/"
        width={100}
        height={100}
        fetchPriority="high"
      />,
    );
    expect(getByRole("img")).toHaveAttribute("fetchPriority", "high");
  });

  it("should update attributes for fast load when priority is true", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} priority />,
    );
    const img = getByRole("img");
    expect(img).toHaveAttribute("decoding", "async");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
    const preload = document.head.querySelector(
      'link[rel="preload"][as="image"]',
    );
    expect(preload).toBeDefined();
  });

  it("should update proper styles when fill is true", () => {
    const { getByRole } = render(<Image alt="image" src="/" fill />);
    const img = getByRole("img");
    expect(img).toHaveStyle({
      width: "100%",
      height: "100%",
    });
    expect(img.style.inset).toBe("0");
  });
});

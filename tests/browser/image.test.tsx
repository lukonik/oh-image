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
      <Image alt="image" src="/" width={100} height={100} style={{ width: "100px" }} />,
    );
    expect(getByRole("img")).toHaveStyle({ width: "100px" });
  });

  it("should set alt attribute", () => {
    const { getByRole } = render(<Image src="/" alt="alt image" width={100} height={100} />);
    expect(getByRole("img")).toHaveAttribute("alt", "alt image");
  });

  it("should set decoding attribute", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} decoding="async" />,
    );
    expect(getByRole("img")).toHaveAttribute("decoding", "async");
  });

  it("should set loading attribute", () => {
    const { getByRole } = render(<Image alt="image" src="/" width={100} height={100} loading="lazy" />);
    expect(getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  it("should set width attribute", () => {
    const { getByRole } = render(<Image alt="image" src="/" width={100} height={100} />);
    expect(getByRole("img")).toHaveAttribute("width", "100");
  });

  it("should set height attribute", () => {
    const { getByRole } = render(<Image alt="image" src="/" width={100} height={100} />);
    expect(getByRole("img")).toHaveAttribute("height", "100");
  });

  it("should set fetchPriority attribute", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} fetchPriority="high" />,
    );
    expect(getByRole("img")).toHaveAttribute("fetchPriority", "high");
  });

  it("should update attributes for fast load when priority is true", () => {
    const { getByRole } = render(<Image alt="image" src="/" width={100} height={100} priority />);
    const img = getByRole("img");
    expect(img).toHaveAttribute("decoding", "async");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
    const preload = document.head.querySelector(
      'link[rel="preload"][as="image"]',
    );
    expect(preload).toBeDefined();
  });

  it("should display placeholder when placeholder is true", () => {
    const { getByRole } = render(
      <Image alt="image" src="/" width={100} height={100} placeholderUrl="/blur" />,
    );
    expect(getByRole("img")).toHaveStyle({
      backgroundPosition: "50% 50%",
      backgroundRepeat: "no-repeat",
      backgroundImage: "url(/blur)",
    });
  });

  it("should take attributes from src when it is object", () => {
    const src = {
      width: 500,
      height: 600,
      src: "/image.jpg",
      srcSets: `/image-50.jpg 50w, /image-100.jpg 100w`,
      placeholderUrl: "/blur",
    };
    const { getByRole } = render(<Image alt="image" src={src} />);
    const img = getByRole("img");

    expect(img).toHaveAttribute("width", "500");
    expect(img).toHaveAttribute("height", "600");
    expect(img).toHaveAttribute("src", "/image.jpg");
    expect(img).toHaveAttribute(
      "srcset",
      "/image-50.jpg 50w, /image-100.jpg 100w",
    );
    expect(img).toHaveStyle({
      backgroundImage: "url(/blur)",
    });
  });

  it("should override custom attributes even when src is an object", () => {
    const src = {
      width: 500,
      height: 600,
      src: "/image.jpg",
      srcSets: `/image-50.jpg 50w, /image-100.jpg 100w`,
      placeholderUrl: "/blur",
    };
    const { getByRole } = render(
      <Image
        alt="image"
        src={src}
        placeholderUrl="/manual-blur"
        width={10}
        height={20}
        srcSet="image-1 0w"
      />,
    );
    const img = getByRole("img");

    expect(img).toHaveAttribute("width", "10");
    expect(img).toHaveAttribute("height", "20");
    expect(img).toHaveAttribute("src", "/image.jpg");
    expect(img).toHaveAttribute("srcset", "image-1 0w");
    expect(img).toHaveStyle({
      backgroundImage: "url(/manual-blur)",
    });
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

import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Image } from "../../src/react/image";

describe("Image", () => {
  beforeEach(() => {});

  it("should be defined", () => {
    expect(Image).toBeDefined();
  });

  it("should add className to image", async () => {
    const result = await render(<Image src="/" className="test" />);
    await expect.element(result.getByRole("img")).toHaveClass("test");
  });

  it("should add styles to image", async () => {
    const result = await render(<Image src="/" style={{ width: "100px" }} />);
    await expect
      .element(result.getByRole("img"))
      .toHaveStyle({ width: "100px" });
  });

  it("should set alt attribute", async () => {
    const result = await render(<Image src="/" alt="alt image" />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("alt", "alt image");
  });
  it("should set decoding attribute", async () => {
    const result = await render(<Image src="/" decoding="async" />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("decoding", "async");
  });
  it("should set loading attribute", async () => {
    const result = await render(<Image src="/" loading="lazy" />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("loading", "lazy");
  });
  it("should set width attribute", async () => {
    const result = await render(<Image src="/" width={100} />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("width", "100");
  });
  it("should set height attribute", async () => {
    const result = await render(<Image src="/" height={100} />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("height", "100");
  });
  it("should set fetchPriority attribute", async () => {
    const result = await render(<Image src="/" fetchPriority="high" />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("fetchPriority", "high");
  });

  it("should update attributes for fast load when asap is true", async () => {
    const result = await render(<Image src="/" asap />);
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("decoding", "async");
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("loading", "eager");
    await expect
      .element(result.getByRole("img"))
      .toHaveAttribute("fetchpriority", "high");
    const preload = document.head.querySelector(
      'link[rel="preload"][as="image"]',
    );
    expect(preload).toBeDefined();
  });

  it("should display placeholder when placeholder is true", async () => {
    const result = await render(
      <Image src="/" placeholder placeholderUrl="/blur" />,
    );
    const image = await result.getByRole("img");
    expect(image).toHaveStyle({
      backgroundPosition: "50% 50%",
      backgroundRepeat: "no-repeat",
      backgroundImage: "url(/blur)",
    });
  });

  it("should do nothing when placeholder is true but blurUrl is not defined", async () => {
    const result = await render(<Image src="/" placeholder />);
    const image = result.getByRole("img");
    expect(image).not.toHaveStyle({
      backgroundPosition: "50% 50%",
    });
  });

  it("should take attributes from src when it is object", async () => {
    const src = {
      width: 500,
      height: 600,
      src: "/image.jpg",
      srcSets: [
        {
          width: "50w",
          src: "/image-50.jpg",
        },
        {
          width: "100w",
          src: "/image-100.jpg",
        },
      ],
      placeholderUrl: "/blur",
    };
    const result = await render(<Image src={src} placeholder />);

    function attributeEquals(key: string, value: string) {
      expect(result.getByRole("img")).toHaveAttribute(key, value);
    }

    attributeEquals("width", "500");
    attributeEquals("height", "600");
    attributeEquals("src", "/image.jpg");
    attributeEquals("srcset", "/image-50.jpg 50w, /image-100.jpg 100w");
    expect(result.getByRole("img")).toHaveStyle({
      backgroundImage: "url(/blur)",
    });
  });

  it("should override custom attributes even when src is an object", async () => {
    const src = {
      width: 500,
      height: 600,
      src: "/image.jpg",
      srcSets: [
        {
          width: "50w",
          src: "/image-50.jpg",
        },
        {
          width: "100w",
          src: "/image-100.jpg",
        },
      ],
      placeholderUrl: "/blur",
    };
    const result = await render(
      <Image
        src={src}
        placeholderUrl="/manual-blur"
        placeholder
        width={10}
        height={20}
        srcset="image-1 0w"
      />,
    );

    function attributeEquals(key: string, value: string) {
      expect(result.getByRole("img")).toHaveAttribute(key, value);
    }

    attributeEquals("width", "10");
    attributeEquals("height", "20");
    attributeEquals("src", "/image.jpg");
    attributeEquals("srcset", "image-1 0w");

    expect(result.getByRole("img")).toHaveStyle({
      backgroundImage: "url(/manual-blur)",
    });
  });

  it("should update proper styles when fill is true", async () => {
    const result = await render(<Image src="/" fill />);
    await expect.element(result.getByRole("img")).toHaveStyle({
      width: "100%",
      height: "100%",
      inset: "0",
    });
  });
});

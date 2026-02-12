import * as ReactDOM from "react-dom";
import type { CSSProperties } from "react";
import type { ImageProps } from "./types";
import { useImgLoaded } from "./use-img-loaded";
import { resolveOptions } from "./prop-resolvers";
import { assertProps } from "./prop-asserts";
// preload is only available in React 19+
const preload =
  "preload" in ReactDOM &&
  typeof (ReactDOM as { preload?: unknown }).preload === "function"
    ? (
        ReactDOM as {
          preload: (
            href: string,
            options: { as: string; fetchPriority: string },
          ) => void;
        }
      ).preload
    : null;

function getPlaceholderStyles(props: ImageProps) {
  if (!props.placeholderUrl) {
    return {};
  }

  const styles: Partial<CSSProperties> = {
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${props.placeholderUrl})`,
    backgroundSize: "cover",
  };
  return styles;
}

function getFillStyles(props: ImageProps) {
  if (!props.fill) {
    return {};
  }
  return {
    width: "100%",
    height: "100%",
    inset: "0",
  } satisfies Partial<CSSProperties>;
}

export function Image(props: ImageProps) {
  assertProps(props);
  const options = resolveOptions(props);
  const [imgRef, isLoaded] = useImgLoaded(options.src);
  const placeholderStyles = isLoaded ? {} : getPlaceholderStyles(options);
  const fillStyles = getFillStyles(options);
  const styles = {
    ...placeholderStyles,
    ...fillStyles,
    ...props.style,
  };

  if (preload && options.asap) {
    preload(options.src, { as: "image", fetchPriority: "high" });
  }

  return (
    <img
      ref={imgRef}
      className={props.className}
      style={styles}
      src={options.src}
      width={options.width}
      height={options.height}
      srcSet={options.srcSet}
      alt={options.alt}
      loading={options.loading}
      decoding={options.decoding}
      sizes={options.sizes}
      fetchPriority={options.fetchPriority ?? "auto"}
    />
  );
}

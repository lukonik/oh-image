import * as ReactDOM from "react-dom";
import type { CSSProperties } from "react";
import type { ImageProps } from "./types";
import { useImgLoaded } from "./use-img-loaded";
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

function resolveOptions(props: ImageProps) {
  const { src, ...rest } = props;
  const resolved = { ...rest } as Omit<ImageProps, "src"> & {
    src: string;
    srcSet?: string;
  };
  if (typeof src === "object") {
    resolved.src = src.src;
    resolved.width ??= src.width;
    resolved.height ??= src.height;
    resolved.srcSet ??= src.srcSets;
    resolved.placeholderUrl ??= src.placeholderUrl;
  } else {
    resolved.src = src;
  }

  if (props.asap) {
    resolved.decoding = "async";
    resolved.loading = "eager";
    resolved.fetchPriority = "high";
    if (preload) {
      preload(resolved.src, { as: "image", fetchPriority: "high" });
    }
  }

  if (props.fill) {
    resolved.sizes ||= "100vw";
  }

  return resolved;
}

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
  const options = resolveOptions(props);
  const [imgRef, isLoaded] = useImgLoaded(options.src);
  const placeholderStyles = isLoaded ? {} : getPlaceholderStyles(options);
  const fillStyles = getFillStyles(options);
  const styles = {
    ...placeholderStyles,
    ...fillStyles,
    ...props.style,
  };
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

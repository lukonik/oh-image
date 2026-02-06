import { preload } from "react-dom";
import type { ImageSrc } from "../plugin/types";
import type { CSSProperties } from "react";

type ImageSrcType = string | ImageSrc;

export interface ImageProps extends Partial<
  Pick<
    HTMLImageElement,
    | "alt"
    | "fetchPriority"
    | "decoding"
    | "loading"
    | "height"
    | "width"
    | "srcset"
    | "className"
    | "sizes"
  >
> {
  asap?: boolean;
  src: ImageSrcType;
  placeholderUrl?: string | undefined;
  placeholder?: boolean;
  style?: CSSProperties;
  fill?: boolean;
}

function resolveOptions(props: ImageProps) {
  const { src, ...rest } = props;
  const resolved = { ...rest } as Omit<ImageProps, "src"> & {
    src: string;
    srcset?: string;
  };

  if (typeof src === "object") {
    resolved.src = src.src;
    resolved.width ??= src.width;
    resolved.height ??= src.height;
    resolved.srcset ??= src.srcSets
      .map((set) => `${set.src} ${set.width}`)
      .join(", ");
    resolved.placeholderUrl ??= src.placeholderUrl;
  } else {
    resolved.src = src;
  }

  if (props.asap) {
    resolved.decoding = "async";
    resolved.loading = "eager";
    resolved.fetchPriority = "high";
    preload(resolved.src, { as: "image", fetchPriority: "high" });
  }

  if (props.fill) {
    resolved.sizes ||= "100vw";
  }

  return resolved;
}

function getPlaceholderStyles(props: ImageProps) {
  if (!props.placeholder) {
    return {};
  }
  if (!props.placeholderUrl) {
    console.warn("Blur URL is required for placeholder");
    return {};
  }

  const styles: Partial<CSSProperties> = {
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${props.placeholderUrl})`,
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
  const placeholderStyles = getPlaceholderStyles(options);
  const fillStyles = getFillStyles(options);
  const styles = {
    ...placeholderStyles,
    ...fillStyles,
    ...props.style,
  };
  return (
    <img
      className={props.className}
      style={styles}
      src={options.src}
      width={options.width}
      height={options.height}
      srcSet={options.srcset}
      alt={options.alt}
      loading={options.loading}
      decoding={options.decoding}
      sizes={options.sizes}
      fetchPriority={options.fetchPriority ?? "auto"}
    />
  );
}

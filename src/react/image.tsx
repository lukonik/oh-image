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
  >
> {
  asap?: boolean;
  src: ImageSrcType;
  blurUrl?: string | undefined;
  placeholder?: boolean;
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
    resolved.srcset ??= src.srcSets.join(",");
    resolved.blurUrl ??= src.blurUrl;
  } else {
    resolved.src = src;
  }

  if (props.asap) {
    resolved.decoding = "async";
    resolved.loading = "eager";
    resolved.fetchPriority = "high";
    preload(resolved.src, { as: "image", fetchPriority: "high" });
  }

  return resolved;
}

function getPlaceholderStyles(props: ImageProps) {
  if (!props.placeholder) {
    return {};
  }
  if (!props.blurUrl) {
    return {};
  }

  const styles: Partial<CSSProperties> = {
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat",
    backgroundImage: `url(${props.blurUrl})`,
  };
  return styles;
}

export function Image(props: ImageProps) {
  const options = resolveOptions(props);
  const placeholderStyles = getPlaceholderStyles(props);

  return (
    <img
      style={placeholderStyles}
      src={options.src}
      width={options.width}
      height={options.height}
      srcSet={options.srcset}
      alt={options.alt}
      loading={options.loading}
      decoding={options.decoding}
      fetchPriority={options.fetchPriority}
    />
  );
}

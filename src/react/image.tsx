import { preload } from "react-dom";
import type { ImageSrc } from "../plugin/types";

type ImageSrcType = string | ImageSrc;

export interface ImageProps extends Pick<
  HTMLImageElement,
  | "alt"
  | "fetchPriority"
  | "decoding"
  | "loading"
  | "height"
  | "width"
  | "srcset"
> {
  asap?: boolean;
  src: ImageSrcType;
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

export function Image(props: ImageProps) {
  const options = resolveOptions(props);

  return (
    <img
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

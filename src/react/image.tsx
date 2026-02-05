import { useState, type CSSProperties, type ImgHTMLAttributes } from "react";
import { preload } from "react-dom";
import type { ImageSrc } from "../plugin/types";

export interface ImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src: ImageSrc | string;
  alt?: string;
  loading?: "eager" | "lazy";
  sizes?: string;
  fill?: boolean;
  priority?: boolean;
  preload?: boolean;
  placeholder?: "blur" | "empty";
}

function isImageSrc(src: ImageSrc | string): src is ImageSrc {
  return typeof src === "object" && "src" in src;
}

export function Image({
  src,
  alt = "",
  loading = "lazy",
  sizes = "100vw",
  fill = false,
  priority = false,
  preload: shouldPreload = false,
  placeholder = "empty",
  style,
  ...rest
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const imgSrc = isImageSrc(src) ? src.src : src;
  const srcSet = isImageSrc(src) ? src.srcSets.join(", ") : undefined;

  if (shouldPreload) {
    preload(imgSrc, {
      as: "image",
      imageSrcSet: srcSet,
      imageSizes: sizes,
    });
  }
  const width = isImageSrc(src) ? src.width : undefined;
  const height = isImageSrc(src) ? src.height : undefined;
  const blurUrl = isImageSrc(src) ? src.blurUrl : undefined;

  const showBlur = placeholder === "blur" && blurUrl && !isLoaded;
  const effectiveLoading = priority ? "eager" : loading;

  const imgStyle: CSSProperties = {
    ...(fill
      ? {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }
      : {}),
    ...(showBlur
      ? {
          backgroundImage: `url(${blurUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {}),
    ...style,
  };

  return (
    <img
      src={imgSrc}
      srcSet={srcSet}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={effectiveLoading}
      sizes={sizes}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setIsLoaded(true)}
      style={{ ...imgStyle, width: "100%", height: "auto" }}
      {...rest}
    />
  );
}

import { createFileRoute } from "@tanstack/react-router";
import ImgproxyControls from "./-components/imgproxy-controls";
import { useState } from "react";
import {
  useImgproxyLoader,
  Image,
  type ImgproxyOptions,
  useImgproxyPlaceholder,
} from "@lonik/oh-image/react";

export const Route = createFileRoute("/imgproxy/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<ImgproxyOptions["transforms"]>({
    resize: undefined,
    size: undefined,
    resizing_type: "fit",
    width: 300,
    height: 300,
    "min-width": 0,
    "min-height": 0,
    zoom: 1,
    dpr: 1,
    enlarge: false,
    extend: undefined,
    gravity: undefined,
    crop: undefined,
    trim: undefined,
    padding: undefined,
    auto_rotate: false,
    rotate: 0,
    background: undefined,
    adjust: undefined,
    blur: 0,
    sharpen: 0,
    pixelate: 0,
    unsharpening: undefined,
    blur_detections: undefined,
    draw_detections: undefined,
    watermark: undefined,
    watermark_url: undefined,
    watermark_text: undefined,
    watermark_size: undefined,
    style: undefined,
    strip_metadata: false,
    keep_copyright: false,
    strip_color_profile: false,
    enforce_thumbnail: false,
    return_attachment: false,
    format_quality: undefined,
    autoquality: undefined,
    max_bytes: 0,
    jpeg_options: undefined,
    png_options: undefined,
    format: undefined,
    fallback_image_url: undefined,
    skip_processing: undefined,
    cachebuster: undefined,
    expires: undefined,
    filename: undefined,
    preset: undefined,
  });
  const loader = useImgproxyLoader({
    path: "http://localhost:8080/insecure",
    transforms: transform,
  });
  const placeholder = useImgproxyPlaceholder({
    path: "http://localhost:8080/insecure",
    transforms: transform,
  });
  return (
    <div className="flex">
      <ImgproxyControls transform={transform} setTransform={setTransform} />
      <Image
        className="w-1/2 h-[300px]"
        width={1920}
        height={1080}
        src={"http://192.168.0.88:5173/city.jpg"}
        alt="Imgproxy Example"
        loader={loader}
        placeholder={placeholder}
      />
    </div>
  );
}

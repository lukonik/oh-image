import { createFileRoute } from "@tanstack/react-router";
import ImgproxyControls from "./-components/imgproxy-controls";
import { useState } from "react";
import {
  useImgproxyLoader,
  type ImgproxyTransforms,
} from "@lonik/oh-image/imgproxy";
import { Image } from "@lonik/oh-image/react";

export const Route = createFileRoute("/imgproxy/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<ImgproxyTransforms>({
    preset: ["foo"],
  });
  const loader = useImgproxyLoader({
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
      />
    </div>
  );
}

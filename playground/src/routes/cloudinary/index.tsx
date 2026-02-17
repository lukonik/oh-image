import { createFileRoute } from "@tanstack/react-router";
import {
  type CloudinaryTransforms,
  useCloudinaryLoader,
  useCloudinaryPlaceholder,
  Image,
} from "@lonik/oh-image/react";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";
export const Route = createFileRoute("/cloudinary/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<CloudinaryTransforms>({
    q: 1,
    o: 70,
  });
  const loader = useCloudinaryLoader({
    transforms: transform,
  });
  const placeholder = useCloudinaryPlaceholder({
    transforms: transform,
  });
  return (
    <div className="flex ">
      <ControlsPanel>
        <JsonEditor
          data={transform}
          setData={(data) => setTransform(data as any)}
        />
      </ControlsPanel>
      <div className="flex flex-col gap-4 border-b border-gray-300">
        <Image
          className="w-1/2 h-[300px]"
          width={1920}
          height={1080}
          src={"cld-sample.jpg"}
          alt="Imgproxy Example"
          loader={loader}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

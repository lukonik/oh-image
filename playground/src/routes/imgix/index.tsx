import { createFileRoute } from "@tanstack/react-router";
import {
  useImgixLoader,
  type ImgixTransforms,
} from "@lonik/oh-image/imgix";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";

export const Route = createFileRoute("/imgix/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<ImgixTransforms>({
    w: 600,
    h: 400,
    fit: "crop",
    crop: "faces",
    dpr: 2,
    q: 80,
    auto: "format,compress",
  });

  const loader = useImgixLoader({
    transforms: transform,
  });

  return (
    <div className="flex">
      <ControlsPanel>
        <JsonEditor
          data={transform}
          setData={(data) => setTransform(data as any)}
        />
      </ControlsPanel>
      <div className="flex flex-col gap-4 border-b border-gray-300">
        <div>
          URL:{" "}
          {loader({
            src: "examples/puffins.jpg",
            width: 600,
          })}
        </div>
      </div>
    </div>
  );
}

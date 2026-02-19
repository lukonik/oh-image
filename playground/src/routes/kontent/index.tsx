import { createFileRoute } from "@tanstack/react-router";
import {
  useKontentLoader,
  type KontentTransforms,
} from "@lonik/oh-image/kontent";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";
export const Route = createFileRoute("/kontent/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<KontentTransforms>({
    w: 250,

    /** Resize the height of the image in pixels. */
    h: 300,

    /** Serve correctly sized images for devices that expose a device pixel ratio. */
    dpr: 3,

    /** Set how the image will fit within the size bounds provided. */
    fit: "scale",

    "fp-x": 20,
    "fp-y": 30,
    "fp-z": 50,

    rect: [100, 120, 156, 160],

    smart: "face",
    lossless: true,
  });
  const loader = useKontentLoader({
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
        <div>
          URL:
          {loader({
            src: "test",
            width: 50,
          })}
        </div>
        <div></div>
      </div>
    </div>
  );
}

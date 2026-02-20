import { createFileRoute } from "@tanstack/react-router";
import {
  type WordpressTransforms,
  useWordpressLoader,
} from "@lonik/oh-image/wordpress";
import { Image } from "@lonik/oh-image/react";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";

export const Route = createFileRoute("/wordpress/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<WordpressTransforms>({});
  const loader = useWordpressLoader({
    transforms: transform,
  });

  return (
    <div className="flex ">
      <ControlsPanel>
        <JsonEditor
          data={transform}
          setData={(data) => setTransform(data as WordpressTransforms)}
        />
      </ControlsPanel>
      <div className="flex flex-col gap-4 border-b border-gray-300">
        <Image loader={loader} src="imag-1.png" fill alt="image" />
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

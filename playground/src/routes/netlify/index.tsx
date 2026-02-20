import { createFileRoute } from "@tanstack/react-router";
import {
  type NetlifyTransforms,
  useNetlifyLoader
} from "@lonik/oh-image/netlify";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";
export const Route = createFileRoute("/netlify/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<NetlifyTransforms>({
    fm: "webp",
    q: 80,
    fit: "cover",
    position: "center",
  });
  const loader = useNetlifyLoader({
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
            src: "test.jpg",
            width: 50,
          })}
        </div>
      </div>
    </div>
  );
}

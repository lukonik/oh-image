import { createFileRoute } from "@tanstack/react-router";
import {
  type CloudflareTransforms,
  useCloudflareLoader,
  useCloudflarePlaceholder,
} from "@lonik/oh-image/cloudflare";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";
export const Route = createFileRoute("/cloudflare/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<CloudflareTransforms>({
    anim: false,
    background: "red",
    blur: 50,
    brightness: 10,
    compression: false,
    contrast: 30,
    dpr: 1,
    fit: "scale-down",
    format: "auto",
    gamma: 2,
  });
  const loader = useCloudflareLoader({
    transforms: transform,
  });
  const placeholder = useCloudflarePlaceholder({
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
        <div>
          Placeholder:
          {placeholder({
            src: "test",
            width: 50,
          })}
        </div>
      </div>
    </div>
  );
}

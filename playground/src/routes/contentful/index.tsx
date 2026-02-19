import { createFileRoute } from "@tanstack/react-router";
import {
  useContentfulLoader,
  type ContentfulTransforms,
} from "@lonik/oh-image/contentful";
import { Image } from "@lonik/oh-image/react";
import { useState } from "react";
import ControlsPanel from "../../components/controls-panel";
import { JsonEditor } from "json-edit-react";
export const Route = createFileRoute("/contentful/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [transform, setTransform] = useState<ContentfulTransforms>({});
  const loader = useContentfulLoader({
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
        {/* /imag-1.png?h=250 */}
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

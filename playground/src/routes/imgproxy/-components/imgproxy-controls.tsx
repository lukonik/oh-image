import ControlsPanel from "../../../components/controls-panel";
import { JsonEditor } from "json-edit-react";

export default function ImgproxyControls({ transform, setTransform }: any) {
  return (
    <ControlsPanel>
      <JsonEditor data={transform} setData={setTransform} />
    </ControlsPanel>
  );
}

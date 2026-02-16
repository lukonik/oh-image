import { PropsWithChildren, useState } from "react";

export default function ControlsPanel({ children }: PropsWithChildren) {
  const [open, setIsOpen] = useState(true);

  return (
    <div>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex border-b border-gray-300 p-2 cursor-pointer"
      >
        Controls
      </div>
      <div className="py-4 px-2 overflow-y-auto h-[700px]" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Image } from "../../../src/react/image";
import mountain from "../mountain.jpg?oh";
import type { ImageProps } from "../../../src/react/types";
export function ImagePlayground() {
  const [props, setProps] = useState<Partial<ImageProps>>({
    fill: false,
    asap: false,
    loading: "lazy",
    fetchPriority: "auto",
    width: undefined,
    height: undefined,
  });

  const handleChange = (key: keyof ImageProps, value: any) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="demo-section">
      <h2>Image Component Playground</h2>
      <div className="controls">
        <div className="control-grid">
          <label>
            <input
              type="checkbox"
              checked={props.fill}
              onChange={(e) => handleChange("fill", e.target.checked)}
            />
            Fill Container
          </label>
          <label>
            <input
              type="checkbox"
              checked={props.asap}
              onChange={(e) => handleChange("asap", e.target.checked)}
            />
            Asap (Preload)
          </label>
          <label>
            Loading:
            <select
              value={props.loading}
              onChange={(e) => handleChange("loading", e.target.value)}
            >
              <option value="lazy">Lazy</option>
              <option value="eager">Eager</option>
            </select>
          </label>
          <label>
            Fetch Priority:
            <select
              value={props.fetchPriority}
              onChange={(e) => handleChange("fetchPriority", e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>
            Width:
            <input
              type="number"
              value={props.width || ""}
              onChange={(e) =>
                handleChange(
                  "width",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="Auto"
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={props.height || ""}
              onChange={(e) =>
                handleChange(
                  "height",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="Auto"
            />
          </label>
        </div>
      </div>

      <div className="interactive-demo">
        <div
          className={`image-container ${props.fill ? "fill-container" : ""}`}
          style={{
            maxWidth: props.fill ? "100%" : "600px",
            border: "1px solid #333",
            minHeight: "200px",
            position: "relative",
          }}
        >
          <Image src={mountain} alt="Mountain Landscape" {...props} />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <h3>Current Props:</h3>
          <pre className="code-preview">{JSON.stringify(props, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

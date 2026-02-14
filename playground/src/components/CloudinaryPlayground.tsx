import { useState } from "react";
import { Image } from "../../../src/react/image";
import {
  CloudinaryLoaderProvider,
  useCloudinaryLoader,
} from "../../../src/react/loaders/cloudinary-loader";

function CloudinaryDemo() {
  const loader = useCloudinaryLoader();

  return (
    <div className="interactive-demo">
      <h3>Cloudinary Loaded Image</h3>
      <div className="image-container" style={{ maxWidth: "600px" }}>
        <Image
          src={"cld-sample.jpg"}
          width={600}
          alt="Cloudinary Example"
          loader={loader}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <pre className="code-preview">
          {`// Code
const loader = useCloudinaryLoader();
<Image src={img} loader={loader} />`}
        </pre>
      </div>
    </div>
  );
}

export function CloudinaryPlayground() {
  const [path, setPath] = useState("https://res.cloudinary.com/dovmucqi8");

  return (
    <div className="demo-section">
      <h2>Cloudinary Loader Playground</h2>
      <div className="controls">
        <div className="control-grid">
          <label style={{ flexGrow: 1 }}>
            Cloudinary Cloud Name / Base Path:
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
            />
          </label>
        </div>
      </div>

      <CloudinaryLoaderProvider path={path}>
        <CloudinaryDemo />
      </CloudinaryLoaderProvider>
    </div>
  );
}

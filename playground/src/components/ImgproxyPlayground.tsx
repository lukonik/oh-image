import { useState } from "react";
import { Image } from "../../../src/react/image";
import {
  ImgproxyLoaderProvider,
  useImgproxyLoader,
} from "@lonik/oh-image/react";

function ImgproxyDemo() {
  const loader = useImgproxyLoader({
    transforms: {
      blur: 10,
      quality: 1,
    },
  });

  return (
    <div className="interactive-demo">
      <h3>Imgproxy Loaded Image</h3>
      <div className="image-container" style={{ maxWidth: "600px" }}>
        <Image
          src={"http://192.168.0.88:5173/city.jpg"}
          alt="Imgproxy Example"
          loader={loader}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <pre className="code-preview">
          {`// Code
const loader = useImgproxyLoader();
<Image src={img} loader={loader} />`}
        </pre>
      </div>
    </div>
  );
}

export function ImgproxyPlayground() {
  const [path, setPath] = useState("http://localhost:8080/insecure");

  return (
    <div className="demo-section">
      <h2>Imgproxy Loader Playground</h2>
      <div className="controls">
        <div className="control-grid">
          <label style={{ flexGrow: 1 }}>
            Imgproxy Path:
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
            />
          </label>
        </div>
      </div>

      <ImgproxyLoaderProvider path={path}>
        <ImgproxyDemo />
      </ImgproxyLoaderProvider>
    </div>
  );
}

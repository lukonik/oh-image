import { useState } from "react";
import {
  Image,
  CloudflareLoaderProvider,
  useCloudflareLoader,
} from "@lonik/oh-image/react";

function CloudflareDemo() {
  const loader = useCloudflareLoader();

  return (
    <div className="interactive-demo">
      <h3>Cloudflare Loaded Image</h3>
      <p>
        The image below is trying to load from the configured Cloudflare path.
      </p>
      <div className="image-container" style={{ maxWidth: "600px" }}>
        {/* 
                    Note: Since we don't have a real Cloudflare zone setup for this demo, 
                    this might 404 or fail unless the user provides a valid path.
                    We are just demonstrating the wiring.
                 */}
        <Image
          src="car.jpg"
          alt="Cloudflare Example"
          width={900}
          loader={loader}
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <pre className="code-preview">
          {`// Code
const loader = useCloudflareLoader();
<Image src={img} loader={loader} />`}
        </pre>
      </div>
    </div>
  );
}

export function CloudflarePlayground() {
  const [path, setPath] = useState("https://example.com");
  const [format, setFormat] = useState("auto");

  return (
    <div className="demo-section">
      <h2>Cloudflare Loader Playground</h2>
      <div className="controls">
        <div className="control-grid">
          <label style={{ flexGrow: 1 }}>
            Cloudflare Path (e.g., https://imagedelivery.net/...):
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
            />
          </label>
          <label>
            Format:
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="auto">Auto</option>
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
              <option value="json">JSON</option>
            </select>
          </label>
        </div>
      </div>

      <CloudflareLoaderProvider path={path} format={format}>
        <CloudflareDemo />
      </CloudflareLoaderProvider>
    </div>
  );
}

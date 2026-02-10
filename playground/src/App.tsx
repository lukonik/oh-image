import { useState } from "react";
import { Image } from "../../src/react/index";

// Local images with different optimization options
import natureDefault from "./nature.jpg?oh";
import naturePlaceholder from "./nature.jpg?oh&placeholder=true";
import natureBlur from "./nature.jpg?oh&placeholder=true&blur=10";
import mountainImage from "./mountain.jpg?oh&placeholder=true";
import cityImage from "./city.jpg?oh&placeholder=true";
import oceanImage from "./ocean.jpg?oh&placeholder=true";
import forestImage from "./forest.jpg?oh&placeholder=true";

// Remote images from Picsum (free stock photos)
const REMOTE_IMAGES = [
  "https://picsum.photos/id/1025/800/600", // Dog
  "https://picsum.photos/id/1043/800/600", // Car
  "https://picsum.photos/id/1059/800/600", // Beach
  "https://picsum.photos/id/1074/800/600", // Person
  "https://picsum.photos/id/1084/800/600", // Desk
  "https://picsum.photos/id/119/800/600", // Forest
];

type LoadingOption = "lazy" | "eager" | undefined;
type DecodingOption = "async" | "auto" | "sync" | undefined;
type FetchPriorityOption = "high" | "low" | "auto" | undefined;

export function App() {
  const [showAsap, setShowAsap] = useState(false);
  const [showFill, setShowFill] = useState(false);
  const [loading, setLoading] = useState<LoadingOption>("lazy");
  const [decoding, setDecoding] = useState<DecodingOption>("async");
  const [fetchPriority, setFetchPriority] =
    useState<FetchPriorityOption>("auto");

  return (
    <div className="playground">
      <header>
        <h1>oh-image Playground</h1>
        <p>Test and verify the Image component with different options</p>
      </header>

      {/* Interactive Controls */}
      <section className="controls">
        <h2>Interactive Controls</h2>
        <div className="control-grid">
          <label>
            <input
              type="checkbox"
              checked={showAsap}
              onChange={(e) => setShowAsap(e.target.checked)}
            />
            asap (eager + high priority)
          </label>
          <label>
            <input
              type="checkbox"
              checked={showFill}
              onChange={(e) => setShowFill(e.target.checked)}
            />
            fill
          </label>
          <label>
            loading:
            <select
              value={loading ?? ""}
              onChange={(e) =>
                setLoading((e.target.value || undefined) as LoadingOption)
              }
            >
              <option value="">default</option>
              <option value="lazy">lazy</option>
              <option value="eager">eager</option>
            </select>
          </label>
          <label>
            decoding:
            <select
              value={decoding ?? ""}
              onChange={(e) =>
                setDecoding((e.target.value || undefined) as DecodingOption)
              }
            >
              <option value="">default</option>
              <option value="async">async</option>
              <option value="auto">auto</option>
              <option value="sync">sync</option>
            </select>
          </label>
          <label>
            fetchPriority:
            <select
              value={fetchPriority ?? ""}
              onChange={(e) =>
                setFetchPriority(
                  (e.target.value || undefined) as FetchPriorityOption,
                )
              }
            >
              <option value="">default</option>
              <option value="high">high</option>
              <option value="low">low</option>
              <option value="auto">auto</option>
            </select>
          </label>
        </div>

        <div className="interactive-demo">
          <h3>Interactive Image</h3>
          <div
            className={`image-container ${showFill ? "fill-container" : ""}`}
          >
            <Image
              src={naturePlaceholder}
              alt="Interactive demo image"
              asap={showAsap}
              fill={showFill}
              loading={loading}
              decoding={decoding}
              fetchPriority={fetchPriority}
            />
          </div>
          <pre className="code-preview">
            {`<Image
  src={naturePlaceholder}
  alt="Interactive demo image"
  asap={${showAsap}}
  fill={${showFill}}
  loading="${loading ?? "default"}"
  decoding="${decoding ?? "default"}"
  fetchPriority="${fetchPriority ?? "default"}"
/>`}
          </pre>
        </div>
      </section>

      {/* Local Optimized Images */}
      <section className="demo-section">
        <h2>Local Optimized Images</h2>

        <div className="demo-grid">
          <div className="demo-card">
            <h3>Default (no placeholder)</h3>
            <Image src={natureDefault} alt="Nature - default" />
            <code>import img from "./nature.jpg?oh"</code>
          </div>

          <div className="demo-card">
            <h3>With Placeholder</h3>
            <Image src={naturePlaceholder} alt="Nature - placeholder" />
            <code>import img from "./nature.jpg?oh&placeholder=true"</code>
          </div>

          <div className="demo-card">
            <h3>Placeholder + Blur</h3>
            <Image src={natureBlur} alt="Nature - blur" />
            <code>
              import img from "./nature.jpg?oh&placeholder=true&blur=10"
            </code>
          </div>

          <div className="demo-card">
            <h3>Mountain</h3>
            <Image src={mountainImage} alt="Mountain" />
            <code>import img from "./mountain.jpg?oh&placeholder=true"</code>
          </div>

          <div className="demo-card">
            <h3>City</h3>
            <Image src={cityImage} alt="City" />
            <code>import img from "./city.jpg?oh&placeholder=true"</code>
          </div>

          <div className="demo-card">
            <h3>ASAP Loading</h3>
            <Image
              src={naturePlaceholder}
              alt="Nature - asap"
              asap
            />
            <code>{"<Image src={img} asap />"}</code>
          </div>
        </div>
      </section>

      {/* Fill Mode */}
      <section className="demo-section">
        <h2>Fill Mode</h2>
        <p>The fill prop makes the image fill its container</p>

        <div className="fill-demo-grid">
          <div className="fill-card">
            <h3>Square Container</h3>
            <div className="fill-container square">
              <Image src={oceanImage} alt="Fill square" fill />
            </div>
          </div>

          <div className="fill-card">
            <h3>Wide Container</h3>
            <div className="fill-container wide">
              <Image src={forestImage} alt="Fill wide" fill />
            </div>
          </div>

          <div className="fill-card">
            <h3>Tall Container</h3>
            <div className="fill-container tall">
              <Image src={mountainImage} alt="Fill tall" fill />
            </div>
          </div>
        </div>
      </section>

      {/* Remote Images */}
      <section className="demo-section">
        <h2>Remote Images (Picsum)</h2>
        <p>Testing with external image URLs (no optimization)</p>

        <div className="demo-grid">
          {REMOTE_IMAGES.map((url, index) => (
            <div key={url} className="demo-card">
              <h3>Picsum #{index + 1}</h3>
              <Image
                src={url}
                alt={`Picsum image ${index + 1}`}
                width={400}
                height={300}
                loading="lazy"
              />
              <code className="url-code">{url}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Styling */}
      <section className="demo-section">
        <h2>Custom Styling</h2>

        <div className="demo-grid">
          <div className="demo-card">
            <h3>Custom className</h3>
            <Image
              src={naturePlaceholder}
              alt="With custom class"
              className="custom-rounded"
            />
            <code>className="custom-rounded"</code>
          </div>

          <div className="demo-card">
            <h3>Custom style</h3>
            <Image
              src={oceanImage}
              alt="With custom style"
              style={{
                border: "4px solid #646cff",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(100, 108, 255, 0.3)",
              }}
            />
            <code>style={"{border, borderRadius, boxShadow}"}</code>
          </div>

          <div className="demo-card">
            <h3>Grayscale Filter</h3>
            <Image
              src={cityImage}
              alt="Grayscale"
              style={{ filter: "grayscale(100%)" }}
            />
            <code>style={"{filter: 'grayscale(100%)'}"}</code>
          </div>
        </div>
      </section>

      {/* Debug Info */}
      <section className="demo-section debug-section">
        <h2>Debug: ImageSrc Object</h2>
        <p>The optimized import returns an ImageSrc object with metadata:</p>
        <pre className="debug-output">
          {JSON.stringify(naturePlaceholder, null, 2)}
        </pre>
      </section>

      <footer>
        <p>oh-image playground - Test your Image component configurations</p>
      </footer>
    </div>
  );
}

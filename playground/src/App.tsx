import { useState } from "react";
import { ImagePlayground } from "./components/ImagePlayground";
import { CloudflarePlayground } from "./components/CloudflarePlayground";
import { CloudinaryPlayground } from "./components/CloudinaryPlayground";
import { ImgproxyPlayground } from "./components/ImgproxyPlayground";

type Page = "image" | "cloudflare" | "cloudinary" | "imgproxy";

export function App() {
  const [page, setPage] = useState<Page>("imgproxy");

  const buttonStyle = (active: boolean) => ({
    padding: "0.5rem 1rem",
    background: active ? "#646cff" : "#1a1a1a",
    color: active ? "#fff" : "#ccc",
    border: "1px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s"
  });

  return (
    <div className="playground">
      <header>
        <h1>oh-image Playground</h1>
        <p>A playground for testing and demonstrating oh-image features.</p>
        
        <nav style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
                style={buttonStyle(page === "image")} 
                onClick={() => setPage("image")}
            >
                Image Component
            </button>
            <button 
                style={buttonStyle(page === "cloudflare")} 
                onClick={() => setPage("cloudflare")}
            >
                Cloudflare Loader
            </button>
            <button 
                style={buttonStyle(page === "cloudinary")} 
                onClick={() => setPage("cloudinary")}
            >
                Cloudinary Loader
            </button>
            <button 
                style={buttonStyle(page === "imgproxy")} 
                onClick={() => setPage("imgproxy")}
            >
                Imgproxy Loader
            </button>
        </nav>
      </header>

      <main>
        {page === "image" && <ImagePlayground />}
        {page === "cloudflare" && <CloudflarePlayground />}
        {page === "cloudinary" && <CloudinaryPlayground />}
        {page === "imgproxy" && <ImgproxyPlayground />}
      </main>

      <footer>
        <p>oh-image &copy; 2024</p>
      </footer>
    </div>
  );
}
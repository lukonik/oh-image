import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { CloudflareLoaderProvider } from "@lonik/oh-image/cloudflare";

import { ImgproxyLoaderProvider } from "@lonik/oh-image/imgproxy";

import { CloudinaryLoaderProvider } from "@lonik/oh-image/cloudinary";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const buttonStyle = {
    padding: "0.5rem 1rem",
    background: "#1a1a1a",
    color: "#ccc",
    border: "1px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s",
    textDecoration: "none",
  };

  const activeButtonStyle = {
    background: "#646cff",
    color: "#fff",
  };

  return (
    <CloudinaryLoaderProvider path="https://res.cloudinary.com/dovmucqi8">
      <CloudflareLoaderProvider path="http://cloudflare.com">
        <ImgproxyLoaderProvider path="http://localhost:8080/insecure">
          <div className="container mx-auto pt-20 flex justify-center">
            <div>
              <header>
                <nav className="flex items-center gap-4 mb-20">
                  <Link
                    to="/image"
                    style={buttonStyle}
                    activeProps={{ style: activeButtonStyle }}
                  >
                    Image Component
                  </Link>
                  <Link
                    to="/cloudflare"
                    style={buttonStyle}
                    activeProps={{ style: activeButtonStyle }}
                  >
                    Cloudflare Loader
                  </Link>
                  <Link
                    to="/cloudinary"
                    style={buttonStyle}
                    activeProps={{ style: activeButtonStyle }}
                  >
                    Cloudinary Loader
                  </Link>
                  <Link
                    to="/imgproxy"
                    style={buttonStyle}
                    activeProps={{ style: activeButtonStyle }}
                  >
                    Imgproxy Loader
                  </Link>
                  <Link
                    to="/demo"
                    style={buttonStyle}
                    activeProps={{ style: activeButtonStyle }}
                  >
                    Demo Page
                  </Link>
                </nav>
              </header>
              <main>
                <Outlet />
              </main>
            </div>
          </div>
        </ImgproxyLoaderProvider>
      </CloudflareLoaderProvider>
    </CloudinaryLoaderProvider>
  );
}

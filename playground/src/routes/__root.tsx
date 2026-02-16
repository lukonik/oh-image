import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

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
    <div className="playground">
      <header>
        <h1>oh-image Playground</h1>
        <p>A playground for testing and demonstrating oh-image features.</p>

        <nav
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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

      <footer>
        <p>oh-image &copy; 2024</p>
      </footer>
    </div>
  );
}

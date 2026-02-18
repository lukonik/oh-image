import { createFileRoute } from "@tanstack/react-router";
import StaticImage from "./city.jpg?&oh";
export const Route = createFileRoute("/vite-image/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <StaticImage alt="data" className="flex" />;
}

import { createFileRoute } from "@tanstack/react-router";
import Hero from "../../city.jpg?placeholder&pl_width=5&$oh";

export const Route = createFileRoute("/image/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Hero alt="test" />;
}

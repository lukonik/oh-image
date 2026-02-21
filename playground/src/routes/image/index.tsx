import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/image/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <h1>olaa</h1>
}

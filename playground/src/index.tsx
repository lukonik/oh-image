import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./App.tsx";
import "./style.css";

createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

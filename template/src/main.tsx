import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { reportPathToStudio } from "./lib/studio-bridge";

const params = new URLSearchParams(location.search);
if (params.get("theme") === "dark")
  document.documentElement.classList.add("dark");
// design-system theme for previews: ?ds=emr (themes/emr.css); an app sets data-theme on <html> itself
const ds = params.get("ds");
if (ds) document.documentElement.dataset.theme = ds;

reportPathToStudio();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

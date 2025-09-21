import { registerSW } from "virtual:pwa-register";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

registerSW({
  onNeedRefresh() {
    if (confirm("New version available! Refresh now?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("Fimanage is ready to work offline 🚀");
  },
});

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root.jsx";

const bootSplash = document.getElementById("boot-splash");
const bootStart = Date.now();
const bootTextEl = document.querySelector("#boot-splash .boot-text");
const hideBootSplash = () => {
  if (!bootSplash || bootSplash.dataset.hidden === "1") return;
  const elapsed = Date.now() - bootStart;
  if (elapsed < 600) {
    window.setTimeout(hideBootSplash, 600 - elapsed);
    return;
  }
  bootSplash.dataset.hidden = "1";
  bootSplash.classList.add("boot-hide");
  window.setTimeout(() => bootSplash.remove(), 420);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

// Hide static preload screen only when app is ready.
window.addEventListener("dogood:app-ready", hideBootSplash, { once: true });
window.setTimeout(() => {
  if (bootSplash && bootSplash.dataset.hidden !== "1") {
    if (bootTextEl) bootTextEl.textContent = "La carga está tardando más de lo normal...";
    bootSplash.classList.add("boot-stuck");
  }
}, 12000);

window.addEventListener("error", () => {
  if (!bootSplash || bootSplash.dataset.hidden === "1") return;
  if (bootTextEl) bootTextEl.textContent = "No se pudo iniciar la app. Intenta recargar.";
  bootSplash.classList.add("boot-stuck");
});

window.addEventListener("unhandledrejection", () => {
  if (!bootSplash || bootSplash.dataset.hidden === "1") return;
  if (bootTextEl) bootTextEl.textContent = "Error de carga de datos. Intenta recargar.";
  bootSplash.classList.add("boot-stuck");
});

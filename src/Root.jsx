import { useEffect, useState } from "react";
import LandingPage      from "./LandingPage.jsx";
import App              from "./App.jsx";
import CatalogoPublico  from "./CatalogoPublico.jsx";

/* Detect public catalog routes:
   - /adoptar          → catálogo público
   - /adoptar?pet=123  → catálogo público + auto-open animal #123
   - any path?pet=123  → also opens the public catalog (from social links)
   - hash #adoptar / #catalogo
   - saved view in localStorage
*/
function isPublicCatalogRoute() {
  const path   = window.location.pathname;
  const search = window.location.search;
  const hash   = window.location.hash;
  const saved  = localStorage.getItem("dogood_current_view");

  return (
    path === "/adoptar" ||
    search.includes("pet=") ||
    hash === "#adoptar" ||
    hash === "#catalogo" ||
    saved === "catalog"
  );
}

function isAdopterPortalRoute() {
  const search = window.location.search;
  return search.includes("adopcion=") || search.includes("portal_solicitud=") || (search.includes("id=") && !search.includes("pet="));
}

export default function Root() {
  const [user, setUserState] = useState(() => {
    try {
      const saved = localStorage.getItem("dogood_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [view, setViewState] = useState(() => isPublicCatalogRoute() ? "catalog" : "landing");

  const setUser = (newUser) => {
    setUserState(newUser);
    try {
      if (newUser) {
        localStorage.setItem("dogood_user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("dogood_user");
      }
    } catch (e) {
      console.warn("[DoGood] Error guardando sesión en localStorage:", e);
    }
  };

  const setView = (newView) => {
    setViewState(newView);
    try {
      localStorage.setItem("dogood_current_view", newView);
      const newPath = newView === "catalog" ? "/adoptar" : "/";
      if (window.location.pathname !== newPath && !window.location.search.includes("pet=")) {
        window.history.pushState({ view: newView }, "", newPath);
      }
    } catch (e) {
      console.warn("[DoGood] Error guardando ruta:", e);
    }
  };

  useEffect(() => {
    window.dispatchEvent(new Event("dogood:app-ready"));

    const handlePopState = () => {
      if (isPublicCatalogRoute()) {
        setViewState("catalog");
      } else {
        setViewState("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("hashchange", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("hashchange", handlePopState);
    };
  }, []);

  /* Si hay un usuario logueado O si se abre un enlace del formulario de carga de adopción desde WhatsApp */
  if (user || isAdopterPortalRoute()) {
    return <App initialUser={user} onLogout={() => setUser(null)}/>;
  }

  /* Si el usuario eligió ir directamente al catálogo de adopción o entró por un link de mascota */
  if (view === "catalog") {
    return (
      <CatalogoPublico
        onGoHome={() => setView("landing")}
        onLogin={(loggedUser) => {
          if (loggedUser) setUser(loggedUser);
        }}
      />
    );
  }

  /* Vista principal: Landing Page informativa con botón directo al catálogo */
  return (
    <LandingPage
      onLogin={setUser}
      onGoToCatalog={() => setView("catalog")}
    />
  );
}

import { useEffect, useState } from "react";
import LandingPage      from "./LandingPage.jsx";
import App              from "./App.jsx";
import CatalogoPublico  from "./CatalogoPublico.jsx";

/* Detect public catalog routes:
   - /adoptar          → catálogo público
   - /adoptar?pet=123  → catálogo público + auto-open animal #123
   - any path?pet=123  → also opens the public catalog (from social links)
*/
function isPublicCatalogRoute() {
  const path   = window.location.pathname;
  const search = window.location.search;
  return path === "/adoptar" || search.includes("pet=");
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

  const [view, setView] = useState(() => isPublicCatalogRoute() ? "catalog" : "landing");

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

  useEffect(() => {
    window.dispatchEvent(new Event("dogood:app-ready"));
  }, []);

  /* Si hay un usuario rescatista o administrador logueado, mostrar su panel privado */
  if (user) {
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

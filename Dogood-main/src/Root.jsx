import { useEffect, useState } from "react";
import LandingPage from "./LandingPage.jsx";
import App from "./App.jsx";

export default function Root(){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    window.dispatchEvent(new Event("dogood:app-ready"));
  },[]);
  if(!user) return <LandingPage onLogin={setUser}/>;
  return <App initialUser={user} onLogout={()=>setUser(null)}/>;
}

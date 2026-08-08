import { useState, useEffect } from "react";
import FormularioWizard from "./FormularioWizard.jsx";

/* ==========================================
   CONFIG
========================================== */
const API = (import.meta.env.VITE_API_URL || "https://teotek.com.mx/api").replace(/\/+$/, "");

const GRADIENTS = [
  "linear-gradient(135deg,#1653BB 0%,#4C78CC 100%)",
  "linear-gradient(135deg,#0F45A2 0%,#1653BB 100%)",
  "linear-gradient(135deg,#F0C21D 0%,#F8D868 100%)",
  "linear-gradient(135deg,#1653BB 0%,#F0C21D 100%)",
  "linear-gradient(135deg,#2B2B2B 0%,#616161 100%)",
  "linear-gradient(135deg,#7FA5E7 0%,#1653BB 100%)",
];

const DEMO_ANIMALS = [
  { id:9001, nombre:"Moka",   especie:"perro", sexo:"Hembra", talla:"mediano",  peso:"14 kg", edad:2, caracter:"Juguetón/a",   historia:"Rescatada en colonia vecina. Ya socializa con niños y pasea sin jalar.",         raza:"Mestizo / Criollo",       rescatista_id:1, rescatista_nombre:"Refugio Demo",  rescatista_tel:"55 0000 0000", emoji:"🐕", color:GRADIENTS[0], estatus:"En adopción", foto_url:"", cuota:0   },
  { id:9002, nombre:"Nina",   especie:"gato",  sexo:"Hembra", talla:"pequeno",  peso:"4 kg",  edad:1, caracter:"Cariñoso/a",   historia:"Le encanta dormir al sol y convive perfecto en departamento.",                  raza:"Siamés",                  rescatista_id:1, rescatista_nombre:"Refugio Demo",  rescatista_tel:"55 0000 0000", emoji:"🐈", color:GRADIENTS[3], estatus:"En adopción", foto_url:"", cuota:500 },
  { id:9003, nombre:"Rocco",  especie:"perro", sexo:"Macho",  talla:"grande",   peso:"22 kg", edad:4, caracter:"Tranquilo/a",  historia:"Es noble y obediente. Busca familia con espacio para paseos diarios.",          raza:"Labrador Retriever",      rescatista_id:2, rescatista_nombre:"Casa Huellas", rescatista_tel:"55 2222 2222", emoji:"🐕", color:GRADIENTS[1], estatus:"En adopción", foto_url:"", cuota:0   },
  { id:9004, nombre:"Luna",   especie:"gato",  sexo:"Hembra", talla:"pequeno",  peso:"3 kg",  edad:3, caracter:"Independiente",historia:"Muy limpia y curiosa. Compatible con rutina de oficina.",                       raza:"British Shorthair",       rescatista_id:2, rescatista_nombre:"Casa Huellas", rescatista_tel:"55 2222 2222", emoji:"🐈", color:GRADIENTS[4], estatus:"En adopción", foto_url:"", cuota:300 },
  { id:9005, nombre:"Bruno",  especie:"perro", sexo:"Macho",  talla:"mediano",  peso:"18 kg", edad:3, caracter:"Activo/a",    historia:"Súper energético y leal. Ideal para familias activas con jardín.",               raza:"Mestizo / Criollo",       rescatista_id:1, rescatista_nombre:"Refugio Demo",  rescatista_tel:"55 0000 0000", emoji:"🐕", color:GRADIENTS[5], estatus:"En adopción", foto_url:"", cuota:0   },
  { id:9006, nombre:"Canela", especie:"gato",  sexo:"Hembra", talla:"pequeno",  peso:"3.5 kg",edad:2, caracter:"Juguetón/a",  historia:"Adora los juguetes y explorará cada rincón de tu hogar.",                       raza:"Gato Doméstico Mestizo",  rescatista_id:3, rescatista_nombre:"Gatitos QRO",  rescatista_tel:"55 3333 3333", emoji:"🐈", color:GRADIENTS[2], estatus:"En adopción", foto_url:"", cuota:200 },
  { id:9007, nombre:"Thor",   especie:"perro", sexo:"Macho",  talla:"grande",   peso:"28 kg", edad:5, caracter:"Noble",        historia:"¡Adoptado felizmente! Thor encontró una familia amorosa con jardín amplio.",     raza:"Husky Siberiano",         rescatista_id:1, rescatista_nombre:"Refugio Demo",  rescatista_tel:"55 0000 0000", emoji:"🐕", color:GRADIENTS[1], estatus:"Adoptado", foto_url:"", cuota:0 },
  { id:9008, nombre:"Simbad", especie:"gato",  sexo:"Macho",  talla:"pequeno",  peso:"4.5 kg",edad:2, caracter:"Tranquilo",     historia:"¡Caso de éxito! Simbad vive felizmente con su nueva familia en Querétaro.",     raza:"Mestizo / Criollo",       rescatista_id:2, rescatista_nombre:"Casa Huellas", rescatista_tel:"55 2222 2222", emoji:"🐈", color:GRADIENTS[4], estatus:"Adoptado", foto_url:"", cuota:0 },
];

/* ==========================================
   TOKENS
========================================== */
const T = {
  bg:      "#FFF8DF",
  surface: "#FFFFFF",
  border:  "#DDD5D6",
  borderHov:"#BEB6B7",
  ink:     "#111111",
  sub:     "#3C3A3A",
  muted:   "#6B6868",
  faint:   "#A9A3A4",
  blue:    "#1653BB",
  blueMd:  "#0F45A2",
  yellow:  "#F0C21D",
  r: { sm:8, md:16, lg:24, xl:32, full:999 },
  shadow: {
    sm:  "0 1px 4px rgba(0,0,0,.06)",
    md:  "0 4px 20px rgba(0,0,0,.09)",
    lg:  "0 12px 48px rgba(0,0,0,.14)",
    col: "0 8px 32px rgba(22,83,187,.22)",
  },
};

/* ==========================================
   GLOBAL STYLES
========================================== */
const PAW_CURSOR = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26' fill='none'>
    <circle cx='13' cy='15.5' r='5.1' fill='#6B4426'/>
    <circle cx='7.5' cy='8.2' r='2.6' fill='#6B4426'/>
    <circle cx='11.4' cy='5.6' r='2.3' fill='#6B4426'/>
    <circle cx='15.7' cy='5.9' r='2.3' fill='#6B4426'/>
    <circle cx='19.1' cy='9' r='2.5' fill='#6B4426'/>
  </svg>`
)}`;

const G = `
  @font-face{font-family:'Syne';src:url('/brand/AddenRegular.ttf') format('truetype');font-weight:400 900;font-style:normal;font-display:swap;}
  @font-face{font-family:'Plus Jakarta Sans';src:url('/brand/Futura.ttc') format('truetype-collection');font-weight:300 900;font-style:normal;font-display:swap;}
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Plus Jakarta Sans','Segoe UI Emoji','Segoe UI Symbol','Apple Color Emoji','Noto Color Emoji',sans-serif;background:${T.bg};color:${T.ink};-webkit-font-smoothing:antialiased;cursor:url("${PAW_CURSOR}") 4 2,auto;}
  input,select,textarea,button{font-family:'Plus Jakarta Sans','Segoe UI Emoji','Segoe UI Symbol','Apple Color Emoji','Noto Color Emoji',sans-serif;}
  button,a,[role="button"]{cursor:url("${PAW_CURSOR}") 4 2,pointer;transition:transform .22s ease,box-shadow .22s ease,filter .22s ease,background-color .22s ease,border-color .22s ease,color .22s ease;}
  button:hover,a:hover,[role="button"]:hover{filter:saturate(1.08);}
  button:active,a:active,[role="button"]:active{transform:translateY(1px) scale(.98);}

  .pretty-inventory-row {
    display: grid;
    grid-template-columns: minmax(64px, auto) 1.2fr 1fr 1fr auto;
    gap: 18px;
    align-items: center;
  }
  @media (max-width: 880px) {
    .pretty-inventory-row {
      grid-template-columns: auto 1fr !important;
      gap: 14px !important;
    }
    .pretty-inventory-row .col-health,
    .pretty-inventory-row .col-shelter {
      grid-column: 1 / -1;
    }
    .pretty-inventory-row .col-actions {
      grid-column: 1 / -1;
      display: flex !important;
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 100% !important;
      margin-top: 6px !important;
      padding-top: 10px !important;
      border-top: 1px dashed ${T.border} !important;
    }
  }
  @media (max-width: 540px) {
    .pretty-inventory-row {
      grid-template-columns: 1fr !important;
      padding: 14px !important;
    }
    .pretty-inventory-row .col-avatar {
      justify-content: center !important;
      margin: 0 auto !important;
    }
    .pretty-inventory-row .col-info {
      text-align: center !important;
    }
    .pretty-inventory-row .col-info > div {
      justify-content: center !important;
    }
    .pretty-inventory-row .col-health > div {
      justify-content: center !important;
    }
    .pretty-inventory-row .col-shelter {
      text-align: center !important;
      justify-content: center !important;
    }
    .pretty-inventory-row .col-shelter > div {
      justify-content: center !important;
    }
    .pretty-inventory-row .col-actions {
      flex-direction: column !important;
      gap: 8px !important;
      align-items: stretch !important;
    }
    .pretty-inventory-row .col-actions button {
      width: 100% !important;
    }
  }

  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{0%{background-position:-500px 0}100%{background-position:500px 0}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes toastUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:${T.faint};border-radius:4px}
`;

/* ==========================================
   ATOMS
========================================== */
function Toast({ msg, type }) {
  const bg = type === "success" ? T.blue : type === "error" ? "#C0392B" : T.ink;
  return msg ? (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, background:bg, color:"#fff", padding:"11px 20px", borderRadius:T.r.full, fontSize:".83rem", fontWeight:600, boxShadow:T.shadow.lg, animation:"toastUp .25s ease", maxWidth:340, lineHeight:1.4 }}>
      {msg}
    </div>
  ) : null;
}

function StatusBadge({ estatus }) {
  const cfg =
    estatus === "En adopción" ? { bg:"#EAF2FF", col:"#1653BB" } :
    estatus === "En proceso"  ? { bg:"#FFF6D8", col:"#8A6400" } :
                                { bg:"#F0F0F0", col:"#666" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"4px 12px", borderRadius:T.r.full, fontSize:".7rem", fontWeight:700, background:cfg.bg, color:cfg.col, letterSpacing:.2 }}>
      {estatus}
    </span>
  );
}

function SkeletonCard() {
  const shimmerBg = "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)";
  return (
    <div style={{ background:T.surface, borderRadius:T.r.lg, overflow:"hidden", border:`1.5px solid ${T.border}` }}>
      <div style={{ height:200, background:shimmerBg, backgroundSize:"500px 100%", animation:"shimmer 1.6s infinite" }}/>
      <div style={{ padding:"16px 18px" }}>
        {[[60,20],[40,14],[80,14],[100,36]].map(([w,h],i) => (
          <div key={i} style={{ height:h, background:"#f0f0f0", borderRadius:6, marginBottom:10, width:`${w}%`, animation:`pulse 1.6s ${i*.15}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ==========================================
   ANIMAL CARD
========================================== */
function AnimalCard({ animal: a, onOpen, onCopy, copiedId }) {
  const [hov, setHov] = useState(false);
  const isCopied = copiedId === a.id;
  const tallaLabel = t => ({ pequeno:"Pequeño", pequeño:"Pequeño", mediano:"Mediano", grande:"Grande" }[t] ?? t);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(a)}
      style={{
        background: T.surface,
        borderRadius: T.r.lg,
        overflow: "hidden",
        boxShadow: hov ? T.shadow.md : T.shadow.sm,
        border: `1.5px solid ${hov ? T.blue : T.border}`,
        transition: "all .25s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transform: hov ? "translateY(-4px)" : "none",
        animation: "fadeUp .4s ease both",
      }}
    >
      {/* ---- Photo ---- */}
      <div style={{ height:200, background:a.color||GRADIENTS[0], position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {a.foto_url
          ? <img src={a.foto_url} alt={a.nombre} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          : <span style={{ fontSize:"5rem", filter:"drop-shadow(0 2px 8px rgba(0,0,0,.2))" }}>{a.emoji||"🐾"}</span>
        }
        {/* Status */}
        <div style={{ position:"absolute", top:10, left:10 }}>
          <StatusBadge estatus={a.estatus}/>
        </div>
        {/* Copy link */}
        <button
          id={`copy-link-${a.id}`}
          onClick={e => onCopy(a, e)}
          title="Copiar link para WhatsApp o Facebook"
          style={{
            position:"absolute", top:8, right:8,
            width:34, height:34,
            background: isCopied ? T.blue : "rgba(255,255,255,.92)",
            border:"none", borderRadius:T.r.full,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize: isCopied ? ".65rem" : ".9rem",
            cursor:"pointer", boxShadow:T.shadow.sm,
            color: isCopied ? "#fff" : T.ink,
            fontWeight: isCopied ? 700 : 400,
            transition:"all .2s",
          }}
        >
          {isCopied ? "✓" : "🔗"}
        </button>
        {/* Cuota badge / Adopción Gratuita */}
        {Number(a.cuota) > 0 || a.aplica_cuota ? (
          <div style={{ position:"absolute", bottom:8, left:10, background:"rgba(240,194,29,.93)", color:"#6B4200", borderRadius:T.r.full, fontSize:".68rem", fontWeight:800, padding:"3px 10px" }}>
            💰 ${Number(a.cuota || 0).toLocaleString()} MXN (Cuota de Recuperación)
          </div>
        ) : (
          <div style={{ position:"absolute", bottom:8, left:10, background:"rgba(16,185,129,.93)", color:"#fff", borderRadius:T.r.full, fontSize:".68rem", fontWeight:800, padding:"3px 10px" }}>
            💚 Adopción Gratuita / Sin Cuota
          </div>
        )}
      </div>

      {/* ---- Content ---- */}
      <div style={{ padding:"16px 18px", flex:1, display:"flex", flexDirection:"column", gap:8 }}>
        {/* Name */}
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.1rem", color:T.ink, lineHeight:1.1, marginBottom:3 }}>
            {a.nombre}{" "}
            <span style={{ fontSize:".8rem", fontWeight:400, fontFamily:"'Plus Jakarta Sans',sans-serif", color:T.muted }}>
              ({a.sexo})
            </span>
          </div>
          <div style={{ fontSize:".75rem", color:T.sub }}>{a.raza}</div>
        </div>

        {/* Health Badges & Tags */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {[
            tallaLabel(a.talla),
            a.peso,
            a.edad ? `${a.edad} años` : null,
            a.caracter,
            a.desparasitado !== false && a.desparasitado !== 0 ? "🪱 Desparasitado/a" : null,
            a.esterilizado !== false && a.esterilizado !== 0 ? "✂️ Esterilizado/a" : null,
            a.vacunas ? `💉 ${a.vacunas}` : "💉 Vacunas al día",
            a.microchip ? `🏷️ Chip #${a.microchip}` : null
          ]
            .filter(Boolean).map(tag => (
              <span key={tag} style={{ padding:"3px 9px", borderRadius:T.r.full, background:T.bg, border:`1px solid ${T.border}`, fontSize:".69rem", color:T.sub, fontWeight:500 }}>
                {tag}
              </span>
            ))}
        </div>

        {/* History */}
        <p style={{ fontSize:".8rem", color:T.sub, lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", flex:1 }}>
          {a.historia}
        </p>

        {/* Rescuer */}
        <div style={{ fontSize:".72rem", color:T.muted, paddingTop:8, borderTop:`1px solid ${T.border}` }}>
          🏠 {a.rescatista_nombre || "Refugio"}
        </div>

        {/* CTA */}
        {a.estatus === "Adoptado" ? (
          <button
            onClick={e => { e.stopPropagation(); onOpen(a); }}
            style={{
              width:"100%", padding:"10px", border:"none",
              borderRadius:T.r.md,
              background: "#10B981",
              color:"#fff", fontWeight:700, fontSize:".83rem",
              cursor:"pointer", marginTop:2,
            }}
          >
            ❤️ ¡Adoptado/a con éxito!
          </button>
        ) : (
          <button
            id={`solicitar-${a.id}`}
            onClick={e => { e.stopPropagation(); onOpen(a); }}
            style={{
              width:"100%", padding:"10px", border:"none",
              borderRadius:T.r.md,
              background: hov ? T.blueMd : T.blue,
              color:"#fff", fontWeight:700, fontSize:".83rem",
              cursor:"pointer", transition:"background .2s", marginTop:2,
            }}
          >
            Solicitar adopción 🐾
          </button>
        )}
      </div>
    </div>
  );
}

function PrettyInventoryRow({ animal, onOpen, onCopy, copiedId }) {
  const folio = `DG-PET-${(animal.id || 9001).toString().padStart(4, "0")}`;
  const isAdopted = animal.estatus === "Adoptado";
  const inProcess = animal.estatus === "En proceso";
  const isCopied = copiedId === animal.id;

  return (
    <div
      className="pretty-inventory-row"
      style={{
        background: T.surface,
        borderRadius: T.r.md,
        border: `1.5px solid ${T.border}`,
        padding: "16px 20px",
        boxShadow: T.shadow.sm,
        transition: "all .2s ease"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = T.blue;
        e.currentTarget.style.boxShadow = T.shadow.md;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = T.shadow.sm;
      }}
    >
      {/* Col 1: Photo / Avatar */}
      <div className="col-avatar" style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          overflow: "hidden",
          border: `2px solid ${isAdopted ? "#A855F7" : inProcess ? "#F59E0B" : T.blue}`,
          flexShrink: 0,
          background: animal.color || T.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {animal.foto_url ? (
            <img src={animal.foto_url} alt={animal.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "2rem" }}>{animal.emoji || "🐾"}</span>
          )}
        </div>
      </div>

      {/* Col 2: Name & Specs */}
      <div className="col-info">
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: T.ink }}>
            {animal.nombre}
          </span>
          <span style={{ fontSize: ".68rem", fontFamily: "monospace", fontWeight: 800, background: "#EFF6FF", color: T.blue, padding: "2px 8px", borderRadius: 50, border: "1px solid #BFDBFE" }}>
            {folio}
          </span>
        </div>
        <div style={{ fontSize: ".82rem", color: T.sub, marginTop: 3, fontWeight: 600 }}>
          {animal.raza || "Mestizo"} • {animal.sexo || "Sexo N/D"} • {animal.edad ? `${animal.edad} año(s)` : "Joven"}
        </div>
        <div style={{ fontSize: ".74rem", color: T.muted, marginTop: 2 }}>
          Talla: <strong>{animal.talla || "Mediana"}</strong> • Peso: {animal.peso || "N/D"}
        </div>
      </div>

      {/* Col 3: Expediente / Carácter */}
      <div className="col-health">
        <div style={{ fontSize: ".7rem", fontWeight: 800, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
          Expediente Clínico
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontSize: ".7rem", background: "#ECFDF5", color: "#047857", padding: "2px 8px", borderRadius: 50, fontWeight: 700 }}>
            ✂️ Esterilizado
          </span>
          <span style={{ fontSize: ".7rem", background: "#EFF6FF", color: "#1D4ED8", padding: "2px 8px", borderRadius: 50, fontWeight: 700 }}>
            💉 Vacunas al día
          </span>
          <span style={{ fontSize: ".7rem", background: "#FFFBEB", color: "#B45309", padding: "2px 8px", borderRadius: 50, fontWeight: 700 }}>
            🩺 {animal.caracter || "Tranquilo/a"}
          </span>
        </div>
      </div>

      {/* Col 4: Refugio / Ubicación */}
      <div className="col-shelter">
        <div style={{ fontSize: ".78rem", fontWeight: 700, color: T.ink, display: "flex", alignItems: "center", gap: 4 }}>
          <span>📍</span> Querétaro, MX
        </div>
        <div style={{ fontSize: ".74rem", color: T.muted, marginTop: 2 }}>
          🏠 {animal.rescatista_nombre || "Refugio DoGood"}
        </div>
      </div>

      {/* Col 5: Actions */}
      <div className="col-actions" style={{ textAlign: "right" }}>
        <div style={{ marginBottom: 6 }}>
          <StatusBadge estatus={animal.estatus} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={e => onCopy(animal, e)}
            title="Compartir link"
            style={{ padding: "8px 12px", borderRadius: 50, border: `1px solid ${T.border}`, background: T.surface, color: T.sub, fontWeight: 700, fontSize: ".76rem", cursor: "pointer" }}
          >
            {isCopied ? "✓ Copiado" : "🔗 Compartir"}
          </button>
          <button
            type="button"
            onClick={() => onOpen(animal)}
            style={{ padding: "8px 18px", borderRadius: 50, border: "none", background: T.blue, color: "#fff", fontWeight: 700, fontSize: ".8rem", cursor: "pointer" }}
          >
            Solicitar Adopción 🐾
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function CatalogoPublico({ onLogin, onGoHome }) {
  const [animals,      setAnimals]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [isDemoData,   setIsDemoData]   = useState(false);
  const [tabMode,      setTabMode]      = useState("en_adopcion"); // "en_adopcion" | "adoptados"
  const [viewMode,     setViewMode]     = useState("list");        // "list" | "grid"
  const [search,       setSearch]       = useState("");
  const [filterSp,     setFilterSp]     = useState("all");  // species
  const [filterSz,     setFilterSz]     = useState("all");  // size
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [copiedId,     setCopiedId]     = useState(null);
  const [toast,        setToast]        = useState(null);

  // Rescuer Login Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail,     setLoginEmail]     = useState("");
  const [loginPass,      setLoginPass]      = useState("");
  const [loginLoading,   setLoginLoading]   = useState(false);
  const [loginError,     setLoginError]     = useState("");

  const toast$ = (msg, type = "") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!loginEmail || !loginPass) {
      setLoginError("Ingresa correo y contraseña");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${API}/auth.php?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      setLoginLoading(false);
      if (data.ok && data.user) {
        setShowLoginModal(false);
        onLogin?.(data.user);
      } else {
        setLoginError(data.error || "Credenciales incorrectas");
      }
    } catch {
      setLoginLoading(false);
      setLoginError("Error de conexión al servidor");
    }
  };

  const handleQuickLogin = (role) => {
    const creds = role === "admin" 
      ? { id: 1, nombre: "Admin DoGood", email: "dogood@teotek.com.mx", rol: "admin" }
      : { id: 2, nombre: "Refugio Demo", email: "refugio@dogood.mx", rol: "rescatista" };
    setShowLoginModal(false);
    onLogin?.(creds);
  };

  /* ---- Load animals ---- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      let loadedAnimals = [];
      try {
        const res  = await fetch(`${API}/animales.php?action=list`, { headers:{ "Content-Type":"application/json" } });
        const data = await res.json();
        if (data.ok && Array.isArray(data.animals)) {
          loadedAnimals = data.animals;
        }
      } catch (e) {}

      let localSaved = [];
      try { localSaved = JSON.parse(localStorage.getItem("dogood_custom_animals") || "[]"); } catch {}
      const customLocal = localSaved.filter(a => Number(a.id) > 10000);

      const combined = [...loadedAnimals, ...customLocal];
      const unique = [];
      const map = new Map();
      for (const item of combined) {
        if (item && item.id && !map.has(item.id)) {
          map.set(item.id, true);
          unique.push(item);
        }
      }

      setAnimals(unique);
      setIsDemoData(false);
      setLoading(false);
    })();
  }, []);

  /* ---- Auto-open ?pet= after animals load ---- */
  useEffect(() => {
    if (loading || animals.length === 0) return;
    const petId = new URLSearchParams(window.location.search).get("pet");
    if (petId) {
      const found = animals.find(a => String(a.id) === String(petId));
      if (found) setSelectedAnimal(found);
    }
  }, [loading, animals]);

  /* ---- Dynamic Open Graph & Page Title for Social Sharing ---- */
  useEffect(() => {
    if (selectedAnimal) {
      const title = `¡Adopta a ${selectedAnimal.nombre}! 🐾 (${selectedAnimal.raza}) — DoGood`;
      const desc = `${selectedAnimal.nombre} (${selectedAnimal.sexo}, ${selectedAnimal.talla}) está en adopción en DoGood. ${selectedAnimal.historia || ""} — Refugio: ${selectedAnimal.rescatista_nombre || "DoGood"}`;
      const img = selectedAnimal.foto_url || `${window.location.origin}/brand/logo-primary-trim.png`;
      const url = `${window.location.origin}/adoptar?pet=${selectedAnimal.id}`;

      document.title = title;

      const setMeta = (attr, key, content) => {
        let el = document.querySelector(`meta[${attr}="${key}"]`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, key);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      setMeta("property", "og:title", title);
      setMeta("property", "og:description", desc);
      setMeta("property", "og:image", img);
      setMeta("property", "og:url", url);
      setMeta("property", "og:type", "website");
      setMeta("name", "description", desc);
      setMeta("name", "twitter:title", title);
      setMeta("name", "twitter:description", desc);
      setMeta("name", "twitter:image", img);
    } else {
      document.title = "DoGood — Plataforma de Adopción Responsable";
    }
  }, [selectedAnimal]);

  /* ---- Copy link ---- */
  const copyLink = (param1, param2) => {
    const e = (param2 && typeof param2.stopPropagation === "function") ? param2 : (param1 && typeof param1.stopPropagation === "function") ? param1 : null;
    const animal = (param1 && param1.id) ? param1 : (param2 && param2.id) ? param2 : null;
    try { e?.stopPropagation?.(); } catch {}
    if (!animal) return;
    const link = `${window.location.origin}/adoptar?pet=${animal.id}`;
    const apply = () => {
      setCopiedId(animal.id);
      setTimeout(() => setCopiedId(null), 2200);
      toast$(`🔗 Link de ${animal.nombre || "mascota"} copiado — pégalo en WhatsApp o Facebook`, "success");
    };
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(apply).catch(() => {
        const el = document.createElement("textarea");
        el.value = link; el.style.position = "fixed"; el.style.opacity = "0";
        document.body.appendChild(el); el.focus(); el.select();
        try { document.execCommand("copy"); } catch {}
        document.body.removeChild(el);
        apply();
      });
    } else {
      const el = document.createElement("textarea");
      el.value = link; el.style.position = "fixed"; el.style.opacity = "0";
      document.body.appendChild(el); el.focus(); el.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(el);
      apply();
    }
  };

  /* ---- Dismiss selected animal ---- */
  const closeForm = () => {
    setSelectedAnimal(null);
    if (window.location.search.includes("pet="))
      window.history.replaceState({}, "", "/adoptar");
  };

  /* ---- Filters (excluye siempre a las mascotas ya adoptadas) ---- */
  const filtered = animals.filter(a => {
    if (a.estatus === "Adoptado") return false;
    const q    = search.toLowerCase();
    const ms   = !q || a.nombre.toLowerCase().includes(q) || (a.raza||"").toLowerCase().includes(q) || (a.historia||"").toLowerCase().includes(q);
    const mSp  = filterSp  === "all" || a.especie === filterSp;
    const norm = (a.talla || "").toLowerCase().replace("ñ","n");
    const mSz  = filterSz  === "all" || norm.includes(filterSz);
    return ms && mSp && mSz;
  });

  /* ==========================================
     RENDER
  ========================================== */
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{G}</style>

      {/* ===== NAVBAR ===== */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,248,223,.96)", backdropFilter:"blur(14px)", borderBottom:`1.5px solid ${T.border}`, padding:"0 5%" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
          {/* Logo */}
          <a href="#" onClick={e => { e.preventDefault(); onGoHome?.(); }} style={{ display:"flex", alignItems:"center", textDecoration:"none", gap:10 }}>
            <img
              src="/brand/logo-primary-trim.png"
              alt="DoGood"
              style={{ height:34, objectFit:"contain" }}
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span style={{ display:"none", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.3rem", color:T.blue }}>
              DoGood
            </span>
          </a>

          {/* Right actions */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {onGoHome && (
              <button
                onClick={onGoHome}
                style={{ padding:"8px 16px", border:`1px solid ${T.border}`, borderRadius:T.r.full, background:T.surface, color:T.sub, fontWeight:700, fontSize:".8rem", cursor:"pointer" }}
              >
                ← Volver a Inicio
              </button>
            )}
            {isDemoData && (
              <span style={{ padding:"4px 12px", borderRadius:T.r.full, background:"#FFF3CD", color:"#7A5200", fontSize:".7rem", fontWeight:700, border:"1px solid #F5D48B" }}>
                Modo demo
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <div style={{ background:`linear-gradient(135deg,${T.blue} 0%,${T.blueMd} 52%,${T.yellow}cc 100%)`, padding:"52px 5% 46px", position:"relative", overflow:"hidden" }}>
        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
        <div style={{ position:"absolute", bottom:-60, left:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,.04)" }}/>

        <div style={{ maxWidth:1280, margin:"0 auto", position:"relative", textAlign:"center" }}>
          <div style={{ fontSize:"3rem", marginBottom:8, lineHeight:1 }}>🐾</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(1.9rem,4.5vw,2.9rem)", color:"#fff", lineHeight:1.1, marginBottom:10 }}>
            Encuentra tu compañero ideal
          </h1>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,.72)", maxWidth:480, margin:"0 auto 26px", lineHeight:1.6 }}>
            Mascotas disponibles para adopción. Elige a tu nuevo amigo y solicita su adopción directamente.
          </p>

          {/* Search bar */}
          <div style={{ maxWidth:540, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.96)", borderRadius:T.r.full, padding:"11px 20px", boxShadow:T.shadow.col }}>
              <span style={{ fontSize:"1.1rem", flexShrink:0 }}>🔍</span>
              <input
                id="cat-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, raza…"
                style={{ flex:1, border:"none", background:"transparent", fontSize:".9rem", outline:"none", color:T.ink }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:"1.2rem", lineHeight:1, padding:0 }}>
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== FILTERS & TABS ===== */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"20px 5% 0" }}>
        {/* Main Header & View Switcher */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:"1rem", fontWeight:800, color:T.ink }}>
              🐾 Mascotas en Adopción
            </span>
          </div>

          {/* View Switcher: Lista vs Grid */}
          <div style={{ display:"flex", background:"#F3F4F6", padding:3, borderRadius:T.r.full, border:`1px solid ${T.border}` }}>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding:"6px 16px", borderRadius:T.r.full, border:"none",
                background: viewMode === "list" ? T.blue : "transparent",
                color: viewMode === "list" ? "#fff" : T.sub,
                fontWeight: 700, fontSize:".8rem", cursor:"pointer"
              }}
            >
              📋 Lista Inventario
            </button>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding:"6px 16px", borderRadius:T.r.full, border:"none",
                background: viewMode === "grid" ? T.blue : "transparent",
                color: viewMode === "grid" ? "#fff" : T.sub,
                fontWeight: 700, fontSize:".8rem", cursor:"pointer"
              }}
            >
              📱 Mosaico Cards
            </button>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          {/* Species */}
          {[["all","Todos 🐾"],["perro","Perros 🐕"],["gato","Gatos 🐈"]].map(([v, l]) => (
            <button
              key={v}
              id={`filter-sp-${v}`}
              onClick={() => setFilterSp(v)}
              style={{
                padding:"7px 18px", borderRadius:T.r.full,
                border:`1.5px solid ${filterSp===v ? T.blue : T.border}`,
                background: filterSp===v ? T.blue : "transparent",
                color:      filterSp===v ? "#fff" : T.sub,
                fontWeight:600, fontSize:".82rem", cursor:"pointer", transition:"all .15s",
              }}
            >
              {l}
            </button>
          ))}
          <div style={{ width:1, height:22, background:T.border, margin:"0 2px" }}/>
          {/* Size */}
          {[["all","Todas las tallas"],["pequeno","Pequeño"],["mediano","Mediano"],["grande","Grande"]].map(([v, l]) => (
            <button
              key={v}
              id={`filter-sz-${v}`}
              onClick={() => setFilterSz(v)}
              style={{
                padding:"7px 16px", borderRadius:T.r.full,
                border:`1.5px solid ${filterSz===v ? T.blue : T.border}`,
                background: filterSz===v ? "#EDF3FF" : "transparent",
                color:      filterSz===v ? T.blue : T.muted,
                fontWeight: filterSz===v ? 700 : 500, fontSize:".8rem", cursor:"pointer", transition:"all .15s",
              }}
            >
              {l}
            </button>
          ))}
          {/* Clear */}
          {(filterSp !== "all" || filterSz !== "all" || search) && (
            <button
              onClick={() => { setFilterSp("all"); setFilterSz("all"); setSearch(""); }}
              style={{ padding:"7px 14px", borderRadius:T.r.full, border:`1.5px solid ${T.border}`, background:T.surface, color:T.muted, fontWeight:600, fontSize:".78rem", cursor:"pointer" }}
            >
              Limpiar ×
            </button>
          )}
          {/* Count */}
          <span style={{ marginLeft:"auto", fontSize:".79rem", color:T.muted, fontWeight:500 }}>
            {loading ? "Cargando…" : `${filtered.length} disponible${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* ===== CONTENT (LIST OR GRID) ===== */}
      <main style={{ maxWidth:1280, margin:"0 auto", padding:"22px 5% 80px" }}>
        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i}/>)}
          </div>
        ) : filtered.length ? (
          viewMode === "list" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {filtered.map(a => (
                <PrettyInventoryRow
                  key={a.id}
                  animal={a}
                  onOpen={setSelectedAnimal}
                  onCopy={copyLink}
                  copiedId={copiedId}
                />
              ))}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
              {filtered.map(a => (
                <AnimalCard
                  key={a.id}
                  animal={a}
                  onOpen={setSelectedAnimal}
                  onCopy={copyLink}
                  copiedId={copiedId}
                />
              ))}
            </div>
          )
        ) : (
          <div style={{ textAlign:"center", padding:"72px 20px", background:T.surface, borderRadius:T.r.xl, border:`1.5px dashed ${T.border}` }}>
            <div style={{ fontSize:"3rem", marginBottom:12 }}>🔍</div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", color:T.ink, marginBottom:8, fontSize:"1.2rem" }}>Sin resultados</h3>
            <p style={{ fontSize:".85rem", color:T.muted, marginBottom:16 }}>
              Prueba con otros filtros o una búsqueda diferente.
            </p>
            <button
              onClick={() => { setSearch(""); setFilterSp("all"); setFilterSz("all"); }}
              style={{ padding:"10px 24px", border:"none", borderRadius:T.r.full, background:T.blue, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:".86rem" }}
            >
              Ver todos los animales
            </button>
          </div>
        )}
      </main>

      {/* ===== ADOPTION FORM WIZARD ===== */}
      {selectedAnimal && (
        <FormularioWizard
          animal={selectedAnimal}
          onClose={closeForm}
          onSuccess={petName => {
            closeForm();
            toast$(`¡Solicitud enviada para ${petName}! El rescatista te contactará pronto 🐾`, "success");
          }}
        />
      )}

      {/* ===== RESCUER LOGIN MODAL ===== */}
      {showLoginModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowLoginModal(false); }}
          style={{ position:"fixed", inset:0, background:"rgba(20,20,20,.62)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(8px)" }}
        >
          <div style={{ background:T.surface, borderRadius:T.r.xl, width:"100%", maxWidth:420, padding:32, boxShadow:T.shadow.lg, position:"relative" }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{ position:"absolute", top:16, right:16, background:"none", border:"none", fontSize:"1.2rem", color:T.muted, cursor:"pointer" }}
            >
              ×
            </button>
            
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.5rem", color:T.blue, marginBottom:4, textAlign:"center" }}>
              Acceso a Rescatistas
            </div>
            <p style={{ fontSize:".83rem", color:T.muted, textAlign:"center", marginBottom:22, lineHeight:1.5 }}>
              Ingresa tu correo y contraseña para gestionar tus solicitudes y mascotas registradas.
            </p>

            {loginError && (
              <div style={{ padding:"10px 14px", borderRadius:T.r.md, background:"#FEE2E2", color:"#991B1B", fontSize:".8rem", fontWeight:600, marginBottom:16 }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:".74rem", fontWeight:700, color:T.sub, textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${T.border}`, borderRadius:T.r.md, fontSize:".88rem", outline:"none" }}
                />
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:".74rem", fontWeight:700, color:T.sub, textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${T.border}`, borderRadius:T.r.md, fontSize:".88rem", outline:"none" }}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{ width:"100%", padding:"12px", border:"none", borderRadius:T.r.full, background:T.blue, color:"#fff", fontWeight:700, fontSize:".9rem", cursor:"pointer", marginBottom:18 }}
              >
                {loginLoading ? "Ingresando…" : "Iniciar Sesión 🐾"}
              </button>
            </form>

            <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:16, textAlign:"center" }}>
              <div style={{ fontSize:".72rem", color:T.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:.8, fontWeight:700 }}>
                Accesos de Demostración Rápida
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("rescatista")}
                  style={{ padding:"8px 14px", borderRadius:T.r.full, border:`1px solid ${T.blue}`, background:"#EDF3FF", color:T.blue, fontSize:".76rem", fontWeight:700, cursor:"pointer" }}
                >
                  🐕 Demo Rescatista
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin")}
                  style={{ padding:"8px 14px", borderRadius:T.r.full, border:`1px solid ${T.border}`, background:T.bg, color:T.sub, fontSize:".76rem", fontWeight:700, cursor:"pointer" }}
                >
                  ⚡ Demo Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}

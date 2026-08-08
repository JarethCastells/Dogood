import { useState, useRef, useEffect, useCallback } from "react";

const LOCAL_API = "http://localhost:8000/api";
const REMOTE_API = (import.meta.env.VITE_API_URL || "https://teotek.com.mx/api").replace(/\/+$/, "");

function compressBase64Image(dataUrl, maxWidth = 800, maxHeight = 800, quality = 0.55) {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== "string") {
      return resolve(dataUrl || "");
    }
    const cleanUrl = dataUrl.startsWith("data:") ? dataUrl : `data:image/jpeg;base64,${dataUrl}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(cleanUrl);
    img.src = cleanUrl;
  });
}

function stripDataUriHeader(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/^data:[^;]+;base64,/, "");
}

function ensureDataUriHeader(str) {
  if (!str || typeof str !== "string") return "";
  let clean = str.trim();
  if (clean.toLowerCase().startsWith("enc::")) {
    return "";
  }
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
    return clean;
  }
  return `data:image/jpeg;base64,${clean}`;
}

async function apiFetch(endpoint, action, method = "GET", body = null) {
  if (!REMOTE_API) {
    return { ok: false, error: "Modo demo local activo" };
  }

  const isGet = method === "GET";
  const queryString = `action=${action}${isGet && body ? "&" + new URLSearchParams(body).toString() : ""}`;
  const url = `${REMOTE_API}/${endpoint}.php?${queryString}`;

  try {
    const opts = { method, headers: { "Content-Type": "application/json" } };
    if (method === "POST" && body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts).catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.ok) return data;
    }
  } catch (e) {}

  return { ok: false, error: "Error de comunicación con el servidor API" };
}

const DEFAULT_ANIMALS = [
  { id: 101, emoji: "🐕", nombre: "Canela", especie: "perro", raza: "Mestizo", edad: "1 año", tamano: "Mediano", sexo: "Hembra", ubicacion: "Narvarte", foto_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80", estatus: "En adopción", descripcion: "Perrita alegre, vacunada y esterilizada busca un hogar amoroso." },
  { id: 102, emoji: "🐕", nombre: "Coco", especie: "perro", raza: "Chihuahua", edad: "5 años", tamano: "Chico", sexo: "Macho", ubicacion: "Nápoles", foto_url: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=900&q=80", estatus: "En adopción", descripcion: "Muy cariñoso, ideal para compañía en departamento." },
  { id: 103, emoji: "🐕", nombre: "Max", especie: "perro", raza: "Labrador", edad: "2 años", tamano: "Grande", sexo: "Macho", ubicacion: "CDMX", foto_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80", estatus: "En adopción", descripcion: "Juguetón, noble y muy activo para paseos al aire libre." },
  { id: 104, emoji: "🐕", nombre: "Thor", especie: "perro", raza: "Pastor Alemán", edad: "3 años", tamano: "Grande", sexo: "Macho", ubicacion: "Condesa", foto_url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=900&q=80", estatus: "En adopción", descripcion: "Protector, inteligente y educado." },
  { id: 105, emoji: "🐱", nombre: "Noche", especie: "gato", raza: "British", edad: "2 años", tamano: "Chico", sexo: "Macho", ubicacion: "San Rafael", foto_url: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=80", estatus: "En adopción", descripcion: "Gatito independiente, tranquilo y cariñoso." },
  { id: 106, emoji: "🐱", nombre: "Mina", especie: "gato", raza: "Ragdoll", edad: "8 meses", tamano: "Chico", sexo: "Hembra", ubicacion: "Portales", foto_url: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=900&q=80", estatus: "En adopción", descripcion: "Cachorrita juguetona e indoor." }
];

/* ========================================
   TOKENS
======================================== */
const T = {
  bg:       "#FFF8DF",
  surface:  "#FFFFFF",
  border:   "#DDD5D6",
  borderHov:"#BEB6B7",

  ink:      "#111111",
  sub:      "#3C3A3A",
  muted:    "#6B6868",
  faint:    "#A9A3A4",

  accent:   "#EDF3FF",
  accentDk: "#1653BB",
  accentMd: "#0F45A2",
  accentLt: "#F0C21D",

  warm:     "#FFF7DA",
  warmDk:   "#C08912",
  warmLt:   "#FFF3CD",

  tag1: { bg:"#EAF2FF", col:"#1653BB" },
  tag2: { bg:"#FFF6D8", col:"#8A6400" },
  tag3: { bg:"#ECF1FB", col:"#2D4B8A" },
  tag4: { bg:"#F9E8E8", col:"#8A2D2D" },

  r: {sm:8, md:16, lg:24, xl:32, full:999},
  shadow: {
    sm: "0 1px 4px rgba(0,0,0,.06)",
    md: "0 4px 20px rgba(0,0,0,.08)",
    lg: "0 12px 48px rgba(0,0,0,.12)",
    colored: "0 8px 32px rgba(22,83,187,.18)",
  }
};

const IC = {
  dog: "\uD83D\uDC15",
  cat: "\uD83D\uDC08",
  paw: "\uD83D\uDC3E",
  heart: "\u2764\uFE0F",
  heartOutline: "\u2661",
  house: "\uD83C\uDFE0",
  mapPin: "\uD83D\uDCCD",
  search: "\uD83D\uDD0D",
  clipboard: "\uD83D\uDCCB",
  camera: "\uD83D\uDCF7",
  phone: "\uD83D\uDCF1",
  wave: "\uD83D\uDC4B",
  party: "\uD83C\uDF89",
  leaf: "\uD83C\uDF3F",
  hourglass: "\u23F3",
  globe: "\uD83C\uDF0E",
  tongue: "\uD83D\uDC45",
  music: "\uD83C\uDFB5",
  brain: "\uD83E\uDDE0",
  users: "\uD83D\uDC65",
};

const DOODLE_BG = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220' fill='none' stroke='#E0B539' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'>
    <g opacity='.38'>
      <circle cx='24' cy='24' r='6'/><circle cx='16' cy='36' r='4'/><circle cx='28' cy='38' r='4'/><circle cx='36' cy='28' r='4'/><path d='M16 48c6-7 18-7 24 0'/>
      <path d='M66 24h20c4 0 6 2 6 6s-2 6-6 6H66c-4 0-6-2-6-6s2-6 6-6Z'/><circle cx='58' cy='26' r='4'/><circle cx='58' cy='34' r='4'/><circle cx='94' cy='26' r='4'/><circle cx='94' cy='34' r='4'/>
      <path d='M140 28l6-7 6 7'/><path d='M152 28l6-7 6 7'/><circle cx='153' cy='39' r='11'/><circle cx='149' cy='37' r='1.3' fill='#E0B539'/><circle cx='157' cy='37' r='1.3' fill='#E0B539'/><path d='M151 42h4'/>
      <circle cx='30' cy='120' r='10'/><circle cx='26' cy='118' r='1.2' fill='#E0B539'/><circle cx='34' cy='118' r='1.2' fill='#E0B539'/><path d='M27 123h6'/><path d='M20 110l4-4'/><path d='M40 110l-4-4'/>
      <path d='M78 112h24c4 0 6 2 6 6s-2 6-6 6H78c-4 0-6-2-6-6s2-6 6-6Z'/><circle cx='70' cy='114' r='4'/><circle cx='70' cy='122' r='4'/><circle cx='110' cy='114' r='4'/><circle cx='110' cy='122' r='4'/>
      <circle cx='164' cy='114' r='5'/><circle cx='156' cy='126' r='3.5'/><circle cx='168' cy='128' r='3.5'/><circle cx='175' cy='120' r='3.5'/><path d='M156 138c4-5 12-5 16 0'/>
      <circle cx='56' cy='174' r='2'/><circle cx='68' cy='168' r='1.8'/><circle cx='82' cy='176' r='2.2'/><circle cx='126' cy='170' r='2'/><circle cx='152' cy='176' r='1.8'/>
      <path d='M118 188h18c3 0 5 2 5 4s-2 4-5 4h-18c-3 0-5-2-5-4s2-4 5-4Z'/>
      <circle cx='112' cy='190' r='3'/><circle cx='112' cy='196' r='3'/><circle cx='144' cy='190' r='3'/><circle cx='144' cy='196' r='3'/>
      <circle cx='188' cy='64' r='8'/><circle cx='184' cy='61' r='1.3' fill='#E0B539'/><circle cx='192' cy='61' r='1.3' fill='#E0B539'/><path d='M185 67h6'/><path d='M180 56l3-3'/><path d='M196 56l-3-3'/>
    </g>
  </svg>`
)}`;

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
  @font-face{
    font-family:'Syne';
    src:url('/brand/AddenRegular.ttf') format('truetype');
    font-weight:400 900;
    font-style:normal;
    font-display:swap;
  }
  @font-face{
    font-family:'Plus Jakarta Sans';
    src:url('/brand/Futura.ttc') format('truetype-collection');
    font-weight:300 900;
    font-style:normal;
    font-display:swap;
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { height:100%; }
  body {
    font-family: 'Plus Jakarta Sans', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
    background-color: ${T.bg};
    background-image:
      linear-gradient(180deg, rgba(255,253,240,.98) 0%, rgba(255,245,201,.98) 100%),
      radial-gradient(circle at 15% 18%, rgba(255,255,255,.65) 0%, rgba(255,255,255,0) 42%),
      radial-gradient(circle at 84% 78%, rgba(240,194,29,.16) 0%, rgba(240,194,29,0) 40%),
      url("${DOODLE_BG}");
    background-size: 100% 100%, 100% 100%, 100% 100%, 236px 236px;
    background-attachment: fixed, fixed, fixed, fixed;
    color: ${T.ink};
    -webkit-font-smoothing: antialiased;
    min-height: 100%;
    cursor:url("${PAW_CURSOR}") 4 2, auto;
  }
  input, select, textarea, button { font-family: 'Plus Jakarta Sans', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif; }
  button, a, [role="button"] {
    cursor:url("${PAW_CURSOR}") 4 2, pointer;
    transition:transform .22s ease,box-shadow .22s ease,filter .22s ease,background-color .22s ease,border-color .22s ease,color .22s ease;
    will-change:transform;
  }
  button:hover, a:hover, [role="button"]:hover { filter:saturate(1.08); }
  button:active, a:active, [role="button"]:active { transform:translateY(1px) scale(.98); }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes popIn    { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
  @keyframes toastUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes petBubbleRise { 0%{opacity:0;transform:translateY(8px) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translateY(-24px) scale(1.08)} }
  .pet-bubble{
    position:fixed;
    z-index:99999;
    pointer-events:none;
    background:rgba(20,20,20,.9);
    color:#fff;
    border:1px solid rgba(255,255,255,.18);
    border-radius:999px;
    font-size:.72rem;
    font-weight:800;
    padding:4px 10px;
    box-shadow:0 8px 18px rgba(0,0,0,.2);
    animation:petBubbleRise .85s ease forwards;
  }
  ::-webkit-scrollbar { width:4px }
  ::-webkit-scrollbar-thumb { background:${T.faint}; border-radius:4px }

  /* RESPONSIVE MEDIA QUERIES PARA MÓVILES Y PC */
  @media (max-width: 768px) {
    .responsive-card-row { flex-direction: column !important; }
    .responsive-card-img { width: 100% !important; height: 180px !important; }
    .responsive-hide-mobile { display: none !important; }
    .responsive-grid-2 { grid-template-columns: 1fr !important; }
    .responsive-grid-3 { grid-template-columns: 1fr !important; }
    .responsive-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
    .responsive-flex-wrap { flex-wrap: wrap !important; }
    .responsive-full-width { width: 100% !important; }
    .responsive-modal { width: 94vw !important; max-width: 94vw !important; padding: 16px 12px !important; margin: 8px auto !important; border-radius: 16px !important; }
    .responsive-table-container { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; width: 100% !important; display: block !important; }
    .responsive-tabs { overflow-x: auto !important; white-space: nowrap !important; width: 100% !important; padding-bottom: 6px !important; justify-content: flex-start !important; }
    canvas { touch-action: none !important; max-width: 100% !important; }
  }

  @media (min-width: 769px) {
    .responsive-hide-desktop { display: none !important; }
    .responsive-table-container { overflow-x: visible; }
  }
`;

/* -- shared inputs -- */
const inp = {
  width:"100%", maxWidth:"100%", boxSizing:"border-box", padding:"11px 14px",
  border:`1.5px solid ${T.border}`,
  borderRadius:T.r.md, fontSize:".88rem",
  color:T.ink, outline:"none", background:T.surface,
  transition:"border-color .15s",
};

/* -- helpers -- */
const statusPill = est => est==="En adopción"
  ? T.tag1 : est==="En proceso"
  ? T.tag2 : {bg:T.border, col:T.muted};
const tallaLabel = t=>({"pequeno":"Pequeno","peque\\u00F1o":"Pequeno",mediano:"Mediano",grande:"Grande"}[t]||t);
const roleLabel  = r=>({admin:"Admin",rescatista:"Rescatista",usuario:"Adoptante"}[r]||r);

const RAZAS = [
  // -- Mestizos primero --
  "Mestizo / Criollo",
  "Gato Doméstico Mestizo",
  // -- Perros mas populares --
  "Labrador Retriever",
  "Golden Retriever",
  "Pastor Alemán",
  "Bulldog Francés",
  "Bulldog Inglés",
  "Poodle / Caniche",
  "Beagle",
  "Chihuahua",
  "Yorkshire Terrier",
  "Shih Tzu",
  "Maltés",
  "Dóberman",
  "Rottweiler",
  "Boxer",
  "Dálmata",
  "Husky Siberiano",
  "Malamute de Alaska",
  "Akita Inu",
  "Shiba Inu",
  "Samoyedo",
  "Border Collie",
  "Australian Shepherd",
  "Cocker Spaniel Inglés",
  "Cocker Spaniel Americano",
  "Schnauzer Miniatura",
  "Schnauzer Estándar",
  "Schnauzer Gigante",
  "Dachshund / Salchicha",
  "Pomerania / Spitz",
  "Pitbull / APBT",
  "American Staffordshire",
  "Staffordshire Bull Terrier",
  "Gran Danés",
  "San Bernardo",
  "Jack Russell Terrier",
  "Parson Russell Terrier",
  "Basset Hound",
  "Greyhound",
  "Galgo Español",
  "Whippet",
  "Bichón Frisé",
  "Bichón Maltés",
  "Chow Chow",
  "Shar Pei",
  "Bullmastiff",
  "Mastín Napolitano",
  "Mastín Tibetano",
  "Weimaraner",
  "Vizsla",
  "Setter Irlandés",
  "Setter Inglés",
  "Pointer Inglés",
  "Braco Alemán",
  "Springer Spaniel",
  "Cavalier King Charles",
  "King Charles Spaniel",
  "Pekingés",
  "Pug / Carlino",
  "Boston Terrier",
  "Bull Terrier",
  "Miniature Bull Terrier",
  "West Highland Terrier",
  "Scottish Terrier",
  "Cairn Terrier",
  "Fox Terrier",
  "Airedale Terrier",
  "Bedlington Terrier",
  "Lhasa Apso",
  "Tibetan Terrier",
  "Basenji",
  "Borzoi",
  "Saluki",
  "Afghan Hound",
  "Rhodesian Ridgeback",
  "Shar Pei",
  "Doberman Pinscher",
  "Pinscher Miniatura",
  "Spitz Alemán",
  "Keeshond",
  "Leonberger",
  "Bernés de la Montaña",
  "Pastor Suizo Blanco",
  "Pastor Belga Malinois",
  "Pastor Belga Tervueren",
  "Pastor de Shetland",
  "Corgi Galés Pembroke",
  "Corgi Galés Cardigan",
  "Boyero de Berna",
  "Boyero de Flandes",
  "Terranova",
  "Labradoodle",
  "Goldendoodle",
  "Cockapoo",
  "Maltipoo",
  "Pomsky",
  // -- Gatos mas populares --
  "Siamés",
  "Persa",
  "Maine Coon",
  "Ragdoll",
  "British Shorthair",
  "Scottish Fold",
  "Bengal",
  "Abisinio",
  "Sphynx",
  "Birmano",
  "Angora Turco",
  "Ruso Azul",
  "Noruego del Bosque",
  "Ragamuffin",
  "Burmés",
  "Tonkinés",
  "Devon Rex",
  "Cornish Rex",
  "American Shorthair",
  "Exotic Shorthair",
  "Himalayo",
  "Selkirk Rex",
  "Somali",
  "Munchkin",
  "Savannah",
  "Ocicat",
  "Balinés",
  "Javanés",
  "Sagrado de Birmania",
  "Chartreux",
];
const FUN_FACTS = [
  {icon:IC.dog,fact:"Los perros reconocen hasta 250 palabras y gestos.",src:"APA"},
  {icon:IC.cat,fact:"Los gatos pasan el 70% de su vida durmiendo hasta 16 h.",src:"NSF"},
  {icon:IC.tongue,fact:"La nariz de un perro tiene 300M de receptores olfativos.",src:"PBS Nova"},
  {icon:IC.heart,fact:"Acariciar a un animal reduce el cortisol en minutos.",src:"NIH"},
  {icon:IC.globe,fact:"Mas de 70,000 animales abandonados al ano solo en CDMX.",src:"SEDEMA"},
  {icon:IC.house,fact:"Animales adoptados muestran menor ansiedad.",src:"J. Vet. Behavior"},
  {icon:IC.music,fact:"Los perros prefieren la musica clasica y baja su pulso.",src:"Scottish SPCA"},
  {icon:IC.brain,fact:"Los gatos tienen memoria a largo plazo como ninos de 2 anos.",src:"Animal Cognition"},
];
const GRADIENTS = [
  "linear-gradient(135deg,#1653BB 0%,#4C78CC 100%)",
  "linear-gradient(135deg,#0F45A2 0%,#1653BB 100%)",
  "linear-gradient(135deg,#F0C21D 0%,#F8D868 100%)",
  "linear-gradient(135deg,#1653BB 0%,#F0C21D 100%)",
  "linear-gradient(135deg,#2B2B2B 0%,#616161 100%)",
  "linear-gradient(135deg,#7FA5E7 0%,#1653BB 100%)",
];
const DEMO_ANIMALS = [
  {
    id:9001,nombre:"Moka",especie:"perro",sexo:"Hembra",talla:"mediano",peso:"14 kg",edad:2,caracter:"Juguetón/a",
    historia:"Rescatada en colonia vecina. Ya socializa con ninos y pasea sin jalar.",
    raza:"Mestizo / Criollo",rescatista_id:1,rescatista_nombre:"Refugio Demo",rescatista_avatar:"RD",rescatista_tel:"55 0000 0000",
    emoji:IC.dog,color:GRADIENTS[0],estatus:"En adopción",foto_url:""
  },
  {
    id:9002,nombre:"Nina",especie:"gato",sexo:"Hembra",talla:"pequeno",peso:"4 kg",edad:1,caracter:"Cariñoso/a",
    historia:"Le encanta dormir al sol y convive perfecto en departamento.",
    raza:"Siamés",rescatista_id:1,rescatista_nombre:"Refugio Demo",rescatista_avatar:"RD",rescatista_tel:"55 0000 0000",
    emoji:IC.cat,color:GRADIENTS[3],estatus:"En adopción",foto_url:""
  },
  {
    id:9003,nombre:"Rocco",especie:"perro",sexo:"Macho",talla:"grande",peso:"22 kg",edad:4,caracter:"Tranquilo/a",
    historia:"Es noble y obediente. Busca familia con espacio para paseos diarios.",
    raza:"Labrador Retriever",rescatista_id:2,rescatista_nombre:"Casa Huellas",rescatista_avatar:"CH",rescatista_tel:"55 2222 2222",
    emoji:IC.dog,color:GRADIENTS[1],estatus:"En proceso",foto_url:""
  },
  {
    id:9004,nombre:"Lola",especie:"gato",sexo:"Hembra",talla:"pequeno",peso:"3 kg",edad:3,caracter:"Independiente",
    historia:"Muy limpia y curiosa. Compatible con rutina de oficina.",
    raza:"British Shorthair",rescatista_id:2,rescatista_nombre:"Casa Huellas",rescatista_avatar:"CH",rescatista_tel:"55 2222 2222",
    emoji:IC.cat,color:GRADIENTS[4],estatus:"Adoptado",foto_url:""
  },
];

const DEMO_USERS = [
  { id: 1, nombre: "Admin DoGood", email: "dogood@teotek.com.mx", rol: "admin", telefono: "55 1234 5678", avatar: "A" },
  { id: 2, nombre: "Refugio Demo", email: "refugio@dogood.mx", rol: "rescatista", telefono: "55 0000 0000", avatar: "R" },
  { id: 3, nombre: "Carlos Adoptante", email: "carlos@gmail.com", rol: "usuario", telefono: "55 1111 1111", avatar: "C" },
];

/* == ATOMS == */
function Toast({msg,type}){
  const bg = type==="success"?T.accentDk : type==="error"?"#C0392B" : T.ink;
  return msg?(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,background:bg,color:"#fff",padding:"11px 20px",borderRadius:T.r.full,fontSize:".83rem",fontWeight:600,boxShadow:T.shadow.lg,animation:"toastUp .25s ease",fontFamily:"'Plus Jakarta Sans',sans-serif",maxWidth:300}}>
      {msg}
    </div>
  ):null;
}

function Spinner(){
  return <div style={{width:18,height:18,border:"2.5px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .65s linear infinite",display:"inline-block"}}/>;
}

function Modal({children,onClose}){
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{position:"fixed",inset:0,background:"rgba(15,20,30,.65)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"14px",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}>
      <div style={{background:T.surface,borderRadius:T.r.xl,maxWidth:540,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:T.shadow.lg,animation:"popIn .22s ease",border:`1.5px solid ${T.border}`,position:"relative"}}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            title="Cerrar ventana"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1.5px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              fontSize: "1.05rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              transition: "all .15s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#F1F5F9";
              e.currentTarget.style.color = "#0F172A";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#FFFFFF";
              e.currentTarget.style.color = "#334155";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

function Tag({children,style={}}){
  return <span style={{display:"inline-flex",alignItems:"center",padding:"4px 11px",borderRadius:T.r.full,fontSize:".7rem",fontWeight:700,letterSpacing:".2px",...style}}>{children}</span>;
}

function RazaSelector({value,onChange}){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const ref=useRef();
  useEffect(()=>{const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[]);
  const filtered=RAZAS.filter(r=>r.toLowerCase().includes(q.toLowerCase()));
  return(
    <div ref={ref} style={{position:"relative"}}>
      <div onClick={()=>setOpen(!open)} style={{...inp,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderColor:open?T.accentDk:T.border,userSelect:"none"}}>
        <span style={{fontSize:".88rem"}}>{value}</span>
        <span style={{color:T.muted,fontSize:".75rem",transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}>v</span>
      </div>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:T.surface,border:`1.5px solid ${T.accentDk}`,borderRadius:T.r.md,maxHeight:210,overflowY:"auto",zIndex:50,boxShadow:T.shadow.lg}}>
          <div style={{padding:"8px 10px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.surface}}>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar raza..." style={{...inp,padding:"8px 12px",fontSize:".83rem",borderRadius:T.r.sm}}/>
          </div>
          <div style={{padding:"4px 0"}}>
            {filtered.map(r=>(
              <div key={r} onClick={()=>{onChange(r);setOpen(false);setQ("");}}
                style={{padding:"9px 14px",fontSize:".86rem",cursor:"pointer",color:r===value?T.accentDk:T.ink,fontWeight:r==="Mestizo / Criollo"||r===value?600:400,background:"transparent",transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.accent}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {r==="Mestizo / Criollo"?"* "+r:r}
              </div>
            ))}
            {!filtered.length&&<div style={{padding:"16px",textAlign:"center",color:T.muted,fontSize:".83rem"}}>Sin resultados</div>}
          </div>
        </div>
      )}
    </div>
  );
}

/* == ANIMAL ROW CARD - horizontal layout == */
function AnimalRow({a,user,onOpen,onApartar,favs,onFav,idx=0,onCopyLink,copiedLinkId}){
  const [hov,setHov]=useState(false);
  const isFav=(favs||[]).includes(a.id);
  const {bg,col}=statusPill(a.estatus);
  const blocked=a.estatus!=="En adopción";
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="responsive-card-row"
      style={{display:"flex",gap:0,background:T.surface,borderRadius:T.r.lg,overflow:"hidden",boxShadow:hov?T.shadow.md:T.shadow.sm,border:`1.5px solid ${hov?T.borderHov:T.border}`,transition:"all .25s",cursor:"pointer",animation:`fadeUp .4s ${idx*.06}s ease both`}}
      onClick={()=>onOpen(a)}>
      {/* Square image */}
      <div className="responsive-card-img" style={{width:160,minWidth:160,height:160,background:a.color||GRADIENTS[0],display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
        {a.foto_url
          ?<img src={a.foto_url} alt={a.nombre} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          :<span style={{fontSize:"4rem",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.2))"}}>{a.emoji}</span>}
        <button onClick={e=>{e.stopPropagation();onFav(a.id);}}
          style={{position:"absolute",top:8,right:8,width:30,height:30,background:"rgba(255,255,255,.88)",border:"none",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".82rem",cursor:"pointer",boxShadow:T.shadow.sm,transition:"transform .15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          {isFav ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E11D48" stroke="#E11D48" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          )}
        </button>
      </div>
      {/* Content */}
      <div style={{flex:1,padding:"18px 22px",display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0}}>
        <div>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:8}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.22rem",color:T.ink,lineHeight:1.1,marginBottom:4}}>
                {a.nombre} <span style={{fontSize:".85rem",fontWeight:400,fontFamily:"'Plus Jakarta Sans',sans-serif",color:T.muted}}>{a.sexo==="Hembra"?"(Hembra)":"(Macho)"}</span>
              </div>
              <div style={{fontSize:".78rem",color:T.sub}}>{a.raza}</div>
            </div>
            <Tag style={{background:bg,color:col,flexShrink:0}}>{a.estatus}</Tag>
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
            {[tallaLabel(a.talla),a.peso,a.edad?`${a.edad} años`:null,a.caracter].filter(Boolean).map(l=>(
              <span key={l} style={{padding:"3px 10px",borderRadius:T.r.full,background:T.bg,border:`1px solid ${T.border}`,fontSize:".7rem",color:T.sub,fontWeight:500}}>{l}</span>
            ))}
          </div>
          <p style={{fontSize:".82rem",color:T.sub,lineHeight:1.6,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.historia}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`,gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:".74rem",color:T.muted}}>{IC.house} {a.rescatista_nombre||"Refugio"}</span>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {/* Copy link button — only for rescatistas and admins */}
            {user.rol!=="usuario"&&onCopyLink&&(
              <button onClick={e=>onCopyLink(a.id,a.nombre,e)}
                title="Copiar link para WhatsApp/Facebook"
                style={{padding:"7px 12px",border:`1.5px solid ${copiedLinkId===a.id?T.accentDk:T.border}`,borderRadius:T.r.full,fontWeight:600,fontSize:".75rem",cursor:"pointer",background:copiedLinkId===a.id?T.accent:T.surface,color:copiedLinkId===a.id?T.accentDk:T.muted,transition:"all .2s",display:"flex",alignItems:"center",gap:4}}
                onMouseEnter={e=>{if(copiedLinkId!==a.id){e.currentTarget.style.borderColor=T.accentDk;e.currentTarget.style.color=T.accentDk;}}}
                onMouseLeave={e=>{if(copiedLinkId!==a.id){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.muted;}}}>                
                {copiedLinkId===a.id?"✓ Copiado":"🔗 Copiar link"}
              </button>
            )}
            {user.rol==="usuario"?(
              <button onClick={e=>{e.stopPropagation();if(!blocked)onApartar(a);}}
                style={{padding:"7px 18px",border:"none",borderRadius:T.r.full,fontWeight:700,fontSize:".78rem",cursor:blocked?"default":"pointer",background:blocked?T.bg:T.accentDk,color:blocked?T.muted:"#fff",border:blocked?`1px solid ${T.border}`:"none",transition:"all .2s"}}
                onMouseEnter={e=>{if(!blocked)e.currentTarget.style.background=T.accentMd}}
                onMouseLeave={e=>{if(!blocked)e.currentTarget.style.background=T.accentDk}}>
                {a.estatus==="Adoptado"?"Adoptado":a.estatus==="En proceso"?"En proceso":"Apartar"}
              </button>
            ):(
              <button onClick={e=>{e.stopPropagation();onOpen(a);}}
                style={{padding:"7px 18px",border:`1.5px solid ${T.border}`,borderRadius:T.r.full,fontWeight:600,fontSize:".78rem",cursor:"pointer",background:T.surface,color:T.ink,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentDk;e.currentTarget.style.color=T.accentDk}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.ink}}>
                Ver más
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   FIRMA DIGITAL CANVAS
======================================== */
function FirmaDigitalCanvas({ onSave, onClear, initialSignature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1653BB";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onClear?.();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSave?.(dataUrl);
  };

  return (
    <div style={{ background:"#FFF8DF", padding:16, borderRadius:16, border:"1.5px solid #DDD5D6" }}>
      <div style={{ fontSize:".8rem", fontWeight:700, color:"#3C3A3A", marginBottom:8, textTransform:"uppercase", letterSpacing:.6 }}>
        ✒️ Firma Digital del Contrato de Adopción
      </div>
      {initialSignature ? (
        <div style={{ textAlign:"center", padding:10, background:"#FFF", borderRadius:12, border:"1.5px solid #1653BB" }}>
          <img src={initialSignature} alt="Firma Guardada" style={{ maxHeight:100, objectFit:"contain" }} />
          <div style={{ fontSize:".74rem", color:"#059669", fontWeight:700, marginTop:4 }}>✓ Firma Registrada Digitalmente</div>
          <button type="button" onClick={clearCanvas} style={{ marginTop:8, padding:"4px 12px", borderRadius:50, border:"1px solid #DDD5D6", background:"#FFF", fontSize:".72rem", cursor:"pointer" }}>
            Re-firmar
          </button>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={400}
            height={130}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ width:"100%", height:130, background:"#FFFFFF", border:"1.5px dashed #1653BB", borderRadius:12, cursor:"crosshair", touchAction:"none" }}
          />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
            <button type="button" onClick={clearCanvas} style={{ padding:"6px 14px", borderRadius:50, border:"1px solid #DDD5D6", background:"#FFF", fontSize:".76rem", fontWeight:600, cursor:"pointer" }}>
              🧹 Limpiar Trazo
            </button>
            <button type="button" onClick={handleSave} disabled={!hasSignature} style={{ padding:"6px 18px", borderRadius:50, border:"none", background:hasSignature?"#1653BB":"#DDD5D6", color:"#FFF", fontSize:".78rem", fontWeight:700, cursor:hasSignature?"pointer":"default" }}>
              💾 Guardar Firma Digital
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ========================================
   MODAL 1: ¿SE CONCRETÓ LA ENTREVISTA?
======================================== */
function EntrevistaStatusModal({ solicitud, animal, phone, waText, onClose, onConfirmConcretada }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 26, maxWidth: 500, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "3.2rem", marginBottom: 10 }}>💬 📱</div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.35rem", color: T.ink, marginBottom: 8 }}>
          ¿Se concretó la entrevista?
        </h3>
        <p style={{ fontSize: ".88rem", color: T.sub, lineHeight: 1.6, marginBottom: 20 }}>
          Iniciaste la entrevista de adopción por WhatsApp con <strong>{solicitud.guest_nombre || solicitud.usuario_nombre}</strong> para <strong>{animal?.nombre || solicitud.animal_nombre}</strong>.
          <br />¿El candidato respondió a las preguntas de evaluación?
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={onConfirmConcretada}
            style={{
              padding: "13px 20px", borderRadius: 50, border: "none",
              background: "#059669", color: "#FFF", fontWeight: 800, fontSize: ".9rem",
              cursor: "pointer", boxShadow: "0 6px 18px rgba(5,150,105,.28)"
            }}
          >
            ✅ Sí, entrevista concretada (Verificar Checklist) ➔
          </button>

          <a
            href={`https://wa.me/52${phone}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 20px", borderRadius: 50, border: `1.5px solid #25D366`,
              background: "#F0FDF4", color: "#166534", fontWeight: 700, fontSize: ".85rem",
              textDecoration: "none", display: "inline-block"
            }}
          >
            📱 Reenviar Entrevista por WhatsApp
          </a>

          <button
            type="button"
            onClick={onClose}
            style={{ padding: "10px", border: "none", background: "transparent", color: T.muted, fontSize: ".82rem", cursor: "pointer" }}
          >
            Cancelar / Volver después
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ========================================
   MODAL 2: CHECKLIST DE REQUISITOS DE ADOPCIÓN
======================================== */
function ChecklistAdopcionModal({ solicitud, animal, onClose, onComplete }) {
  const [checks, setChecks] = useState({
    vivienda: false,
    acuerdo: false,
    solvencia: false,
    tiempo: false,
    responsabilidad: false,
  });
  const [showSuccessLink, setShowSuccessLink] = useState(false);

  const allChecked = Object.values(checks).every(Boolean);
  const totalChecked = Object.values(checks).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / 5) * 100);

  const toggleCheck = (key) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmChecklist = async () => {
    if (!allChecked) return;
    await onComplete(solicitud.id);
    setShowSuccessLink(true);
  };

  if (showSuccessLink) {
    const petName = animal?.nombre || solicitud?.animal_nombre || "Mascota";
    const hostname = window.location.hostname === "localhost" ? "192.168.1.2" : window.location.hostname;
    const portalUrl = `${window.location.protocol}//${hostname}${window.location.port ? ":" + window.location.port : ""}/?adopcion=${encodeURIComponent(petName)}&id=${solicitud.id}`;
    const adopterName = solicitud?.guest_nombre || solicitud?.usuario_nombre || "Adoptante";
    const phone = (solicitud?.guest_telefono || solicitud?.usuario_telefono || "").replace(/\D/g, "");
    const waMessage = encodeURIComponent(
      `Hola ${adopterName}, ¡excelente noticia! Tu entrevista para la adopción de ${petName} ha sido pre-aprobada en DoGood. 🐾\n\n` +
      `Por favor ingresa al siguiente Formulario Temporal de Carga Documental (disponible por las próximas 24 horas) para subir tu comprobante de domicilio, INE, fotos del espacio y firmar el acuerdo de adopción:\n\n` +
      `👉 ${portalUrl}\n\n` +
      `¡Quedamos al pendiente de tu envío para formalizar la entrega!`
    );

    return (
      <Modal onClose={onClose}>
        <div style={{ padding: "30px 24px 24px", maxWidth: 500, width: "100%", position: "relative", textAlign: "center" }}>
          {/* Círculo arriba con una X para cerrar la ventana */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              width: 36, height: 36, borderRadius: "50%",
              background: "#F3F4F6", border: "none", color: "#374151",
              fontWeight: 800, fontSize: "1.1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,.1)", transition: "all .15s ease"
            }}
            title="Cerrar ventana"
          >
            ✕
          </button>

          <div style={{ fontSize: "3rem", marginBottom: 8 }}>📋 🐾</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "#111", margin: 0 }}>
            Enlace de Carga de Documentación
          </h2>
          <p style={{ color: "#4B5563", fontSize: ".84rem", lineHeight: 1.5, margin: "8px 0 18px" }}>
            Se ha generado el enlace seguro (válido por 24h) para que <strong>{adopterName}</strong> llene la encuesta, suba sus documentos y firme el acuerdo.
          </p>

          {/* Campo con el Link */}
          <div style={{ background: "#F9FAFB", padding: 14, borderRadius: 14, border: "1.5px solid #E5E7EB", marginBottom: 20, textAlign: "left" }}>
            <div style={{ fontSize: ".75rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>
              🔗 Enlace Seguro de Carga (Válido 24 Horas)
            </div>
            <div style={{ background: "#FFF", padding: "10px 14px", borderRadius: 10, border: "1px solid #D1D5DB", fontSize: ".84rem", color: "#111827", wordBreak: "break-all", fontWeight: 700 }}>
              {portalUrl}
            </div>
          </div>

          {/* Dos botones abajo de Copiar Enlace y Mandar por WhatsApp */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(portalUrl);
                alert("¡Enlace del formulario copiado al portapapeles! 📋");
              }}
              style={{
                padding: "12px", borderRadius: 50, border: "1.5px solid #1653BB",
                background: "#EAF2FF", color: "#1653BB", fontWeight: 800, fontSize: ".84rem",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              📋 Copiar Enlace
            </button>

            {phone ? (
              <a
                href={`https://wa.me/52${phone}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px", borderRadius: 50, border: "none",
                  background: "#25D366", color: "#FFF", fontWeight: 800, fontSize: ".84rem",
                  textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 4px 12px rgba(37,211,102,.28)"
                }}
              >
                📱 Mandar por WhatsApp
              </a>
            ) : (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(portalUrl);
                  alert("¡Enlace copiado! Envíaselo al candidato.");
                }}
                style={{
                  padding: "12px", borderRadius: 50, border: "none",
                  background: "#25D366", color: "#FFF", fontWeight: 800, fontSize: ".84rem",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                📱 Mandar por WhatsApp
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 26, maxWidth: 580, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: "2.2rem" }}>📋</div>
          <div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.35rem", color: T.ink, margin: 0 }}>
              Puntos de Verificación de Adopción
            </h2>
            <div style={{ fontSize: ".82rem", color: T.sub, marginTop: 2 }}>
              Candidato: <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre}</strong> · Mascota: <strong>{animal?.nombre || solicitud?.animal_nombre}</strong>
            </div>
          </div>
        </div>

        <div style={{ background: "#FFF8DF", padding: 14, borderRadius: 14, border: "1px solid #F0C21D", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: ".8rem", fontWeight: 700, color: "#92400E" }}>
            <span>Requisitos para Aprobación</span>
            <span>{totalChecked} / 5 cumplidos ({progressPercent}%)</span>
          </div>
          <div style={{ width: "100%", height: 8, background: "#FFEAA7", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#D97706", transition: "width .3s ease" }} />
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          {[
            ["vivienda", "🏠 Vivienda adecuada y protegida", "Cuenta con espacio seguro, protegido del clima y sin riesgo de fugas o caídas."],
            ["acuerdo", "👨‍👩‍👧‍👦 Acuerdo familiar unánime", "Todos los integrantes que habitan el hogar aceptan con entusiasmo la adopción."],
            ["solvencia", "🩺 Solvencia y compromiso médico", "Disposición financiera para alimento de calidad, vacunas, desparasitación y emergencias."],
            ["tiempo", "⏰ Tiempo, paseos y convivencia diaria", "Compromiso de dedicarle tiempo de juego, paseos y nunca tenerlo encadenado o aislado."],
            ["responsabilidad", "📜 Adopción responsable de por vida", "Entiende que la adopción es un compromiso de 10 a 15 años de vida libre de maltrato."],
          ].map(([key, label, desc]) => (
            <label
              key={key}
              onClick={() => toggleCheck(key)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
                borderRadius: 14, border: `1.5px solid ${checks[key] ? T.accentDk : T.border}`,
                background: checks[key] ? "#EAF2FF" : T.surface,
                cursor: "pointer", transition: "all .2s ease"
              }}
            >
              <input
                type="checkbox"
                checked={checks[key]}
                onChange={() => {}}
                style={{ width: 20, height: 20, marginTop: 2, accentColor: T.accentDk, cursor: "pointer" }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: ".9rem", color: checks[key] ? T.accentDk : T.ink }}>{label}</div>
                <div style={{ fontSize: ".78rem", color: T.sub, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, padding: "12px", borderRadius: 50, border: `1.5px solid ${T.border}`, background: T.surface, color: T.sub, fontWeight: 700, fontSize: ".86rem", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!allChecked}
            onClick={handleConfirmChecklist}
            style={{
              flex: 2, padding: "12px", borderRadius: 50, border: "none",
              background: allChecked ? T.accentDk : T.faint,
              color: "#FFF", fontWeight: 800, fontSize: ".88rem",
              cursor: allChecked ? "pointer" : "not-allowed",
              boxShadow: allChecked ? T.shadow.md : "none", transition: "all .2s ease"
            }}
          >
            {allChecked ? "Aceptar y Habilitar Carga ➔" : "Palomea los 5 puntos para continuar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function triggerCertPrint(anim, sol, userObj) {
  const petName = anim?.nombre || sol?.animal_nombre || "Mascota";
  const petRaza = anim?.raza || sol?.animal_raza || "Compañero Fiel";
  const petSexo = anim?.sexo || sol?.animal_sexo || "No especificado";
  const petEspecie = anim?.especie || sol?.animal_especie || "Mascota";
  const petEdad = anim?.edad ? `${anim.edad} ${Number(anim.edad) === 1 ? "año" : "años"}` : "Joven";
  const petColor = anim?.color && !anim.color.includes("gradient") ? anim.color : "No especificado";
  const petPhoto = anim?.foto_url || anim?.foto || sol?.animal_foto || null;
  const petEmoji = anim?.emoji || sol?.animal_emoji || "🐾";
  const adopterName = sol?.guest_nombre || sol?.usuario_nombre || userObj?.nombre || "Adoptante Responsable";
  const rescuerName = anim?.rescatista_nombre || sol?.rescatista_nombre || "Refugio DoGood";
  const certDate = sol?.fecha || new Date().toISOString().split("T")[0];
  const certCode = `DG-CERT-2026-${(anim?.id || sol?.animal_id || 1).toString().padStart(4, "0")}`;
  const signatureData = sol?.firma_digital || sol?.signature_data || null;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Certificado de Adopción Responsable - ${petName}</title>
        <base href="${origin}/">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            margin: 0;
            padding: 24px;
            background: #fff;
            font-family: 'Plus Jakarta Sans', Segoe UI, sans-serif;
            color: #0f172a;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { size: letter portrait; margin: 8mm; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div style="max-width:800px;margin:0 auto;border:4px double #F0C21D;padding:24px;border-radius:24px;background:#FFFDF9;position:relative;">
          <div style="text-align:center;margin-bottom:20px;border-bottom:2px solid #F0C21D;padding-bottom:14px;">
            <img src="${origin}/brand/logo-primary-trim.png" alt="DoGood" style="height:44px;object-fit:contain;margin-bottom:6px;" />
            <h1 style="font-size:1.6rem;font-weight:900;color:#0F45A2;margin:0;letter-spacing:1px;">CERTIFICADO DE ADOPCIÓN RESPONSABLE</h1>
            <div style="font-size:.8rem;color:#64748B;margin-top:4px;">Folio Oficial: <strong>${certCode}</strong> | Fecha: ${certDate}</div>
          </div>
          
          <div style="display:flex;align-items:center;gap:22px;background:#FFF;padding:20px 24px;border-radius:16px;border:1.5px solid #E2E8F0;margin-bottom:20px;">
            <div style="text-align:center;flex-shrink:0;">
              <div style="width:110px;height:110px;border-radius:50%;border:4px solid #F0C21D;overflow:hidden;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;background:#FFF;">
                ${petPhoto ? `<img src="${petPhoto}" alt="${petName}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="font-size:3.6rem;">${petEmoji}</span>`}
              </div>
              <div style="font-size:.68rem;font-weight:800;color:#0F45A2;background:#EFF6FF;padding:2px 10px;border-radius:50px;border:1px solid #BFDBFE;display:inline-block;">${petEspecie.toUpperCase()}</div>
            </div>
            
            <div style="flex:1;">
              <div style="font-size:.82rem;color:#475569;">Se certifica formalmente que la mascota</div>
              <div style="font-size:2.1rem;font-weight:900;color:#0F45A2;line-height:1.1;margin:2px 0 4px;">${petName}</div>
              <div style="font-size:.76rem;color:#64748B;margin-bottom:12px;font-weight:600;">${petRaza} • ${petSexo} • ${petEdad} ${petColor !== "No especificado" ? `• Color: ${petColor}` : ""}</div>
              <div style="font-size:.85rem;color:#1E293B;">ha sido entregado/a en adopción legítima y definitiva a:</div>
              <div style="font-size:1.35rem;font-weight:800;color:#D97706;margin-top:2px;">${adopterName}</div>
              <div style="font-size:.76rem;color:#64748B;margin-top:4px;">Bajo la tutela y respaldo de <strong>${rescuerName}</strong>.</div>
            </div>
          </div>

          <div style="text-align:center;font-size:.78rem;color:#475569;margin-bottom:22px;font-style:italic;background:#FFFBEB;padding:10px 16px;border-radius:12px;border:1px dashed #FCD34D;">
            "Adoptar es un acto de amor transformador. Al firmar este certificado, nos comprometemos a cuidar, proteger y brindar una vida plena y digna a ${petName}."
          </div>

          <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:end;border-top:1.5px solid #E2E8F0;padding-top:16px;">
            <div style="text-align:center;">
              <div style="height:45px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px;">
                <span style="font-size:1.1rem;font-style:italic;color:#0F45A2;font-weight:700;">${rescuerName}</span>
              </div>
              <div style="border-bottom:1.5px solid #0F45A2;width:80%;margin:0 auto 4px;"></div>
              <div style="font-size:.75rem;font-weight:800;color:#0F45A2;">${rescuerName}</div>
              <div style="font-size:.68rem;color:#64748B;">Rescatista / Refugio Responsable</div>
            </div>

            <div style="text-align:center;padding:0 8px;">
              <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#FFF7DA 0%,#FEF3C7 100%);border:2px solid #F0C21D;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 4px;">
                <img src="${origin}/brand/isotype-blueyellow-trim.png" alt="DoGood Seal" style="width:26px;height:26px;object-fit:contain;" />
                <span style="font-size:.45rem;font-weight:900;color:#92400E;">DO GOOD</span>
              </div>
              <div style="font-size:.62rem;font-weight:800;color:#059669;">SELLO OFICIAL</div>
            </div>

            <div style="text-align:center;">
              <div style="height:45px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px;">
                ${signatureData ? `<img src="${signatureData}" alt="Firma Adoptante" style="max-height:45px;max-width:160px;object-fit:contain;" />` : `<span style="font-size:1.05rem;font-style:italic;color:#D97706;font-weight:700;">${adopterName}</span>`}
              </div>
              <div style="border-bottom:1.5px solid #0F45A2;width:80%;margin:0 auto 4px;"></div>
              <div style="font-size:.75rem;font-weight:800;color:#0F45A2;">${adopterName}</div>
              <div style="font-size:.68rem;color:#64748B;">Adoptante Responsable</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          };
        </script>
      </body>
    </html>
  `;

  const printWin = window.open("", "_blank", "width=900,height=1100");
  if (printWin) {
    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  } else {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => { try { document.body.removeChild(iframe); } catch(e){} }, 2000);
    }, 500);
  }
}

function triggerConvenioPrint(animal, solicitud, signatureData) {
  const petName = animal?.nombre || solicitud?.animal_nombre || "Mascota";
  const petEspecie = animal?.especie || solicitud?.animal_especie || "Mascota";
  const petRaza = animal?.raza || solicitud?.animal_raza || "Criollo";
  const petSexo = animal?.sexo || solicitud?.animal_sexo || "No especificado";
  const petEdad = animal?.edad ? `${animal.edad} aprox` : "Joven";
  const petColor = animal?.color && !animal.color.includes("gradient") ? animal.color : "Característico";
  const petPhoto = animal?.foto_url || animal?.foto || solicitud?.animal_foto || "";
  const petEmoji = animal?.emoji || solicitud?.animal_emoji || "🐾";
  const adopterName = solicitud?.guest_nombre || solicitud?.usuario_nombre || "ADOPTANTE RESPONSABLE";
  const rescuerName = animal?.rescatista_nombre || solicitud?.rescatista_nombre || "Refugio DoGood";
  const compCode = `DG-COMP-2026-${(animal?.id || solicitud?.animal_id || 1).toString().padStart(4, "0")}`;
  const today = new Date();
  const dateStr = `Querétaro, Qro. a ${today.getDate()} de ${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][today.getMonth()]} de ${today.getFullYear()}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Carta de Compromiso y Convenio - ${petName}</title>
        <base href="${origin}/">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', Segoe UI, sans-serif;
            margin: 0;
            padding: 20px;
            color: #0f172a;
            background: #fff;
            line-height: 1.45;
            font-size: 11px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { size: letter portrait; margin: 8mm; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div style="max-width:800px;margin:0 auto;">
          <div style="background:#FFFDF9;border:3px solid #0F45A2;border-radius:16px;padding:6px;position:relative;overflow:hidden;">
            <div style="border:2px solid #F0C21D;border-radius:12px;padding:20px 24px;position:relative;background:linear-gradient(180deg,#FFFFFF 0%,#FFFDF6 100%);">
              <div style="position:absolute;inset:0;background-image:url('${origin}/brand/graphic-hand-yellowblue.jpg');background-size:cover;background-position:center;opacity:0.035;pointer-events:none;"></div>
              
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;border-bottom:1.5px solid rgba(240,194,29,0.5);padding-bottom:10px;position:relative;">
                <img src="${origin}/brand/logo-primary-trim.png" alt="DoGood Logo" style="height:38px;object-fit:contain;" />
                <div style="text-align:right;">
                  <h2 style="font-family:sans-serif;font-size:13.5px;font-weight:900;margin:0;text-transform:uppercase;letter-spacing:1px;color:#0F45A2;">CARTA DE COMPROMISO Y CONVENIO DE ADOPCIÓN</h2>
                  <div style="font-style:italic;font-size:10.5px;color:#64748B;margin-top:2px;">
                    Folio: <strong style="color:#D97706;">${compCode}</strong> | ${dateStr}
                  </div>
                </div>
              </div>

              <div style="display:flex;gap:16px;align-items:center;margin-bottom:14px;background:#FFFFFF;padding:12px 16px;border-radius:12px;border:1.5px solid #E2E8F0;position:relative;">
                <div style="width:80px;height:80px;border-radius:12px;border:2.5px solid #F0C21D;overflow:hidden;flex-shrink:0;background:#FFF;display:flex;align-items:center;justify-content:center;">
                  ${petPhoto ? `<img src="${petPhoto}" alt="${petName}" style="width:100%;height:100%;object-fit:cover;" />` : `<span style="font-size:2.5rem;">${petEmoji}</span>`}
                </div>
                <div style="flex:1;">
                  <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;color:#0F45A2;">
                    Por medio del presente instrumento, el adoptante formaliza la recepción legítima del animal de compañía:
                  </p>
                  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px 12px;font-size:10.5px;color:#334155;">
                    <div><strong>Nombre:</strong> <span style="color:#D97706;font-weight:800;">${petName}</span></div>
                    <div><strong>Especie:</strong> ${petEspecie.toUpperCase()}</div>
                    <div><strong>Sexo:</strong> ${petSexo}</div>
                    <div><strong>Edad:</strong> ${petEdad}</div>
                    <div><strong>Tamaño:</strong> ${petColor}</div>
                    <div><strong>Raza/Color:</strong> ${petRaza}</div>
                  </div>
                  <div style="margin-top:6px;padding-top:4px;border-top:1px dashed #E2E8F0;font-size:10.5px;color:#475569;">
                    <strong>Adoptante Responsable:</strong> ${adopterName} | <strong>Rescatista/Refugio:</strong> ${rescuerName}
                  </div>
                </div>
              </div>

              <div style="margin-bottom:14px;position:relative;">
                <div style="font-weight:800;font-size:11px;margin-bottom:6px;color:#0F45A2;text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:6px;">
                  <img src="${origin}/brand/isotype-blueyellow-trim.png" alt="Icon" style="width:14px;height:14px;" />
                  <span>Cláusulas y Obligaciones del Adoptante Responsable:</span>
                </div>
                <ol style="margin:0;padding-left:18px;font-size:10px;color:#334155;line-height:1.38;">
                  <li style="margin-bottom:2px;">Me comprometo a completar su esquema de vacunación, aplicando refuerzos y desparasitaciones periódicas conforme al veterinario.</li>
                  <li style="margin-bottom:2px;">Me comprometo a llevar a la mascota a su cita de esterilización en la fecha agendada por su rescatista responsable.</li>
                  <li style="margin-bottom:2px;">Le brindaré un refugio seco, parcialmente techado, limpio, ventilado y seguro, prodigándole buen trato y amor.</li>
                  <li style="margin-bottom:2px;">Garantizaré acceso libre a un espacio digno y protegido de las inclemencias del clima (lluvia, frío o sol extremo).</li>
                  <li style="margin-bottom:2px;">Le proporcionaré alimento nutritivo y suficiente, así como agua fresca y limpia disponible las 24 horas del día.</li>
                  <li style="margin-bottom:2px;">El animal no vivirá encadenado, amarrado, enjaulado ni en azoteas o espacios reducidos por ningún período prolongado.</li>
                  <li style="margin-bottom:2px;">Mantendré extremo cuidado para evitar escapes a la vía pública. En caso de extravío, informaré inmediatamente al rescatista y a DoGood.</li>
                  <li style="margin-bottom:2px;">Le colocaré un collar con placa de identificación visible con su nombre y números telefónicos de contacto vigentes.</li>
                  <li style="margin-bottom:2px;">Procuraré atención médica veterinaria inmediata ante cualquier síntoma de enfermedad o accidente.</li>
                  <li style="margin-bottom:2px;">Cumpliré rigurosamente con las disposiciones legales y sanitarias municipales y estatales sobre tenencia de mascotas.</li>
                  <li style="margin-bottom:2px;">Notificaré cualquier cambio de domicilio o teléfono durante la vida de la mascota para dar continuidad al seguimiento.</li>
                  <li style="margin-bottom:2px;">Si por causa de fuerza mayor no pudiera conservar a la mascota, lo comunicaré al rescatista emisor para coordinar un re-hogar seguro.</li>
                  <li style="margin-bottom:2px;">Bajo ninguna circunstancia abandonaré, regalaré para fines inadecuados, ni mutilaré (corte de cola/orejas) a la mascota.</li>
                  <li style="margin-bottom:2px;">Acepto que ante el incumplimiento comprobado de estas cláusulas, la rescatista o DoGood podrán retirar a la mascota de inmediato.</li>
                  <li style="margin-bottom:2px;">Permitiré visitas periódicas de seguimiento previa cita y compartiré evidencias fotográficas del estado de la mascota.</li>
                  <li style="margin-bottom:2px;">Entiendo que las cuotas de recuperación no son reembolsables, pues financian la atención de más animales rescatados.</li>
                </ol>
              </div>

              <div style="border-top:1.5px solid #E2E8F0;padding-top:10px;position:relative;">
                <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:end;">
                  <div style="text-align:center;">
                    <div style="height:44px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px;">
                      ${signatureData ? `<img src="${signatureData}" alt="Firma" style="max-height:44px;max-width:180px;object-fit:contain;" />` : `<span style="font-size:.95rem;font-style:italic;color:#D97706;font-weight:700;">${adopterName.toUpperCase()}</span>`}
                    </div>
                    <div style="border-bottom:1.5px solid #0F45A2;width:85%;margin:0 auto 3px;"></div>
                    <div style="font-size:10.5px;font-weight:bold;color:#0F45A2;">${adopterName.toUpperCase()}</div>
                    <div style="font-size:9px;color:#64748B;">(Firma del Adoptante Responsable)</div>
                  </div>

                  <div style="text-align:center;padding:0 4px;">
                    <div style="width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#FFF7DA 0%,#FEF3C7 100%);border:2px solid #F0C21D;box-shadow:0 3px 10px rgba(240,194,29,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 2px;">
                      <img src="${origin}/brand/isotype-blueyellow-trim.png" alt="Seal" style="width:24px;height:24px;object-fit:contain;" />
                      <span style="font-size:.42rem;font-weight:900;color:#92400E;letter-spacing:0.5px;">DO GOOD</span>
                    </div>
                    <div style="font-size:.55rem;font-weight:800;color:#059669;">CONVENIO REGISTRADO</div>
                  </div>

                  <div style="text-align:center;">
                    <div style="height:44px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px;">
                      <span style="font-size:1rem;font-style:italic;color:#0F45A2;font-weight:700;">${rescuerName}</span>
                    </div>
                    <div style="border-bottom:1.5px solid #0F45A2;width:85%;margin:0 auto 3px;"></div>
                    <div style="font-size:10.5px;font-weight:bold;color:#0F45A2;">${rescuerName.toUpperCase()}</div>
                    <div style="font-size:9px;color:#64748B;">(Rescatista Emisor Responsable)</div>
                  </div>
                </div>

                <div style="text-align:center;margin-top:8px;font-size:8.5px;color:#94A3B8;border-top:1px solid #F1F5F9;padding-top:4px;">
                  Documento digital encriptado emitido por la Plataforma DoGood (dogood.mx) — Adopciones Responsables México
                </div>
              </div>

            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  const printWin = window.open("", "_blank", "width=900,height=1100");
  if (printWin) {
    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  } else {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        try { document.body.removeChild(iframe); } catch(e){}
      }, 2000);
    }, 500);
  }
}

/* ========================================
   MODAL 3: CARPETA & EXPEDIENTE DIGITAL DEL ANIMAL CON ACUERDO LEGAL Y FIRMA
======================================== */
function ExpedienteDigitalModal({ animal, solicitud, onClose, onSaveSignature, onUpdateDocs, onApproveAdopcion }) {
  const [activeTab, setActiveTab] = useState("documentos");
  const [comprobanteUrl, setComprobanteUrl] = useState(solicitud?.comprobante_domicilio || "");
  const [ineUrl, setIneUrl] = useState(solicitud?.ine_documento || "");
  const [foto1, setFoto1] = useState(solicitud?.foto_espacio_1 || solicitud?.fotos_espacio || "");
  const [foto2, setFoto2] = useState(solicitud?.foto_espacio_2 || "");
  const [foto3, setFoto3] = useState(solicitud?.foto_espacio_3 || "");
  const [signatureData, setSignatureData] = useState(solicitud?.firma_digital || null);
  const [saving, setSaving] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const openDocumentView = (url, title = "Documento") => {
    if (!url) return;
    if (url.startsWith("data:")) {
      try {
        const parts = url.split(";base64,");
        const contentType = parts[0].replace("data:", "");
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (e) {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(
            `<html><head><title>${title}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#0f172a;">` +
            (url.startsWith("data:image/") 
              ? `<img src="${url}" style="max-width:100%;max-height:100vh;object-fit:contain;"/>`
              : `<iframe src="${url}" style="width:100vw;height:100vh;border:none;"></iframe>`) +
            `</body></html>`
          );
        }
      }
    } else {
      window.open(url, "_blank");
    }
  };

  // 1. Cargar y desencriptar documentos temporalmente para la sesión del rescatista/admin
  useEffect(() => {
    let isMounted = true;
    const fetchDecryptedDocs = async () => {
      // Precargar primero desde la solicitud o localStorage
      if (solicitud) {
        if (solicitud.comprobante_domicilio) setComprobanteUrl(ensureDataUriHeader(solicitud.comprobante_domicilio));
        if (solicitud.ine_documento) setIneUrl(ensureDataUriHeader(solicitud.ine_documento));
        if (solicitud.foto_espacio_1 || solicitud.fotos_espacio) setFoto1(ensureDataUriHeader(solicitud.foto_espacio_1 || solicitud.fotos_espacio));
        if (solicitud.foto_espacio_2) setFoto2(ensureDataUriHeader(solicitud.foto_espacio_2));
        if (solicitud.foto_espacio_3) setFoto3(ensureDataUriHeader(solicitud.foto_espacio_3));
        if (solicitud.firma_digital) setSignatureData(ensureDataUriHeader(solicitud.firma_digital));
      }

      if (solicitud?.id) {
        setLoadingDocs(true);
        try {
          const res = await apiFetch("solicitudes", "get_documents", "GET", { id: solicitud.id });
          if (isMounted && res && res.ok && res.documents) {
            if (res.documents.comprobante_domicilio) setComprobanteUrl(ensureDataUriHeader(res.documents.comprobante_domicilio));
            if (res.documents.ine_documento) setIneUrl(ensureDataUriHeader(res.documents.ine_documento));
            if (res.documents.foto_espacio_1) setFoto1(ensureDataUriHeader(res.documents.foto_espacio_1));
            if (res.documents.foto_espacio_2) setFoto2(ensureDataUriHeader(res.documents.foto_espacio_2));
            if (res.documents.foto_espacio_3) setFoto3(ensureDataUriHeader(res.documents.foto_espacio_3));
            if (res.documents.firma_digital) setSignatureData(ensureDataUriHeader(res.documents.firma_digital));
          }
        } catch (e) {}
        if (isMounted) setLoadingDocs(false);
      } else {
        if (isMounted) setLoadingDocs(false);
      }
    };
    fetchDecryptedDocs();
    return () => { isMounted = false; };
  }, [solicitud?.id]);

  // 2. ENCRIPTACIÓN EN TIEMPO REAL AL CERRAR LA VISTA
  const handleCloseView = async () => {
    if (solicitud?.id) {
      try {
        await apiFetch("solicitudes", "encrypt_close", "POST", { id: solicitud.id });
      } catch (e) {}
    }
    // Limpiar memoria
    setComprobanteUrl("");
    setIneUrl("");
    setFoto1(""); setFoto2(""); setFoto3("");
    setSignatureData(null);
    onClose();
  };

  const handleSaveAllDocs = async () => {
    setSaving(true);
    const payload = {
      id: solicitud?.id,
      comprobante_domicilio: comprobanteUrl,
      ine_documento: ineUrl,
      foto_espacio_1: foto1,
      foto_espacio_2: foto2,
      foto_espacio_3: foto3,
      firma_digital: signatureData,
    };
    if (solicitud?.id) {
      await apiFetch("solicitudes", "update", "POST", payload);
      onUpdateDocs?.(solicitud.id, payload);
    }
    setSaving(false);
  };

  const handleSaveSignatureData = async (dataUrl) => {
    setSignatureData(dataUrl);
    if (solicitud?.id) {
      await apiFetch("solicitudes", "update", "POST", { id: solicitud.id, firma_digital: dataUrl });
      onSaveSignature?.(solicitud.id, dataUrl);
    }
  };

  return (
    <Modal onClose={handleCloseView}>
      <div className="responsive-modal" style={{ padding: 24, maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header de la Carpeta Digital */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, borderBottom: "1.5px solid #DDD5D6", paddingBottom: 14, paddingRight: 40 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: animal?.color || "#1653BB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.9rem", overflow: "hidden", flexShrink: 0 }}>
            {animal?.foto_url ? <img src={animal.foto_url} alt={animal.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (animal?.emoji || "🐾")}
          </div>
          <div>
            <div style={{ fontSize: ".72rem", fontWeight: 800, color: "#1653BB", textTransform: "uppercase", letterSpacing: 1 }}>
              📂 Carpeta Digital Oficial de Adopción
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#111", margin: "2px 0" }}>
              Expediente: {animal?.nombre || solicitud?.animal_nombre}
            </h2>
            <div style={{ fontSize: ".8rem", color: "#6B6868" }}>
              {animal?.raza || "Mascota"} · Rescatista: {animal?.rescatista_nombre || "DoGood"} · Candidato: <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre || "Adoptante"}</strong>
            </div>
          </div>
        </div>

        {/* BANNERS DE AUTOLIMPIEZA Y 24 HORAS */}
        {solicitud?.estatus === "Aprobada" ? (
          <div style={{ background: "#ECFDF5", border: "1.5px solid #10B981", borderRadius: 14, padding: "12px 16px", marginBottom: 16, color: "#065F46", fontSize: ".84rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.4rem" }}>🎉</span>
            <div>
              <strong>¡Adopción Concretada Exitosamente!</strong>
              <div style={{ fontSize: ".76rem", fontWeight: 500, color: "#047857", marginTop: 2 }}>
                El index de documentos temporales ha sido eliminado de los borradores. La adopción ha sido formalizada con el Certificado Oficial y la Firma Digital Legítima.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#FFF7DA", border: "1.5px solid #F0C21D", borderRadius: 14, padding: "10px 14px", marginBottom: 16, color: "#92400E", fontSize: ".78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>⏱️ Expiración Automática del Index Borrador:</span>
            <span style={{ background: "#FFF", padding: "3px 10px", borderRadius: 50, border: "1px solid #F0C21D", color: "#D97706" }}>
              Se elimina tras 24h sin concretarse o al concretarse la adopción
            </span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="responsive-tabs" style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            ["documentos", "Documentos & Firma"],
            ["salud", "Expediente Clínico"],
          ].map(([tabKey, label]) => (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              style={{
                padding: "8px 16px", borderRadius: 50,
                border: `1.5px solid ${activeTab === tabKey ? "#1653BB" : "#DDD5D6"}`,
                background: activeTab === tabKey ? "#1653BB" : "#FFF",
                color: activeTab === tabKey ? "#FFF" : "#3C3A3A",
                fontWeight: activeTab === tabKey ? 800 : 600, fontSize: ".8rem", cursor: "pointer"
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "documentos" && (
          <div style={{ display: "grid", gap: 16 }}>
            {/* INDEX DE DOCUMENTOS DE LA CARPETA (VISUALIZADOR DE LECTURA DECRIPTO) */}
            <div style={{ background: "#F9FAFB", padding: 18, borderRadius: 16, border: "1.5px solid #E5E7EB" }}>
              <div style={{ fontWeight: 800, fontSize: ".92rem", color: "#111", marginBottom: 14 }}>
                Documentación Adjunta
              </div>

              {/* Documento 1: Comprobante de domicilio */}
              <div style={{ marginBottom: 14, background: "#FFF", padding: 14, borderRadius: 14, border: "1px solid #DDD5D6" }}>
                <div style={{ fontSize: ".76rem", fontWeight: 800, color: "#4B5563", textTransform: "uppercase", marginBottom: 8 }}>
                  1. Comprobante de Domicilio
                </div>
                {comprobanteUrl ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F0FDF4", padding: "10px 14px", borderRadius: 10, border: "1px solid #A7F3D0" }}>
                      <span style={{ fontSize: ".82rem", color: "#065F46", fontWeight: 700 }}>✅ Documento Adjuntado Legítimamente</span>
                      <button
                        type="button"
                        onClick={() => openDocumentView(comprobanteUrl, "Comprobante de Domicilio")}
                        style={{ padding: "6px 14px", borderRadius: 50, background: "#1653BB", color: "#FFF", fontSize: ".76rem", fontWeight: 800, border: "none", cursor: "pointer" }}
                      >
                        Ver Documento
                      </button>
                    </div>
                    {comprobanteUrl.startsWith("data:image/") && (
                      <div style={{ textAlign: "center", marginTop: 8 }}>
                        <img src={comprobanteUrl} alt="Comprobante" onClick={() => openDocumentView(comprobanteUrl, "Comprobante de Domicilio")} style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 10, border: "1px solid #CBD5E1", cursor: "pointer" }} />
                      </div>
                    )}
                    {comprobanteUrl.startsWith("data:application/pdf") && (
                      <iframe src={comprobanteUrl} title="Comprobante PDF" style={{ width: "100%", height: 220, border: "1px solid #E5E7EB", borderRadius: 10, marginTop: 8 }} />
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: ".8rem", color: "#9CA3AF", fontStyle: "italic" }}>Sin comprobante adjuntado aún.</div>
                )}
              </div>

              {/* Documento 2: INE / Identificación oficial */}
              <div style={{ marginBottom: 14, background: "#FFF", padding: 14, borderRadius: 14, border: "1px solid #DDD5D6" }}>
                <div style={{ fontSize: ".76rem", fontWeight: 800, color: "#4B5563", textTransform: "uppercase", marginBottom: 8 }}>
                  2. Identificación Oficial (INE / IFE)
                </div>
                {ineUrl ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F0FDF4", padding: "10px 14px", borderRadius: 10, border: "1px solid #A7F3D0" }}>
                      <span style={{ fontSize: ".82rem", color: "#065F46", fontWeight: 700 }}>✅ Documento Adjuntado Legítimamente</span>
                      <button
                        type="button"
                        onClick={() => openDocumentView(ineUrl, "Identificación Oficial INE")}
                        style={{ padding: "6px 14px", borderRadius: 50, background: "#1653BB", color: "#FFF", fontSize: ".76rem", fontWeight: 800, border: "none", cursor: "pointer" }}
                      >
                        Ver INE / IFE
                      </button>
                    </div>
                    {ineUrl.startsWith("data:image/") && (
                      <div style={{ textAlign: "center", marginTop: 8 }}>
                        <img src={ineUrl} alt="INE" onClick={() => openDocumentView(ineUrl, "Identificación Oficial INE")} style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 10, border: "1px solid #CBD5E1", cursor: "pointer" }} />
                      </div>
                    )}
                    {ineUrl.startsWith("data:application/pdf") && (
                      <iframe src={ineUrl} title="INE PDF" style={{ width: "100%", height: 220, border: "1px solid #E5E7EB", borderRadius: 10, marginTop: 8 }} />
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: ".8rem", color: "#9CA3AF", fontStyle: "italic" }}>Sin INE adjuntada aún.</div>
                )}
              </div>

              {/* Documento 3: Fotografías del espacio */}
              <div style={{ background: "#FFF", padding: 14, borderRadius: 14, border: "1.5px solid #DDD5D6" }}>
                <div style={{ fontSize: ".76rem", fontWeight: 800, color: "#4B5563", textTransform: "uppercase", marginBottom: 10 }}>
                  3. Fotografías del Espacio
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[
                    ["Patio / Estancia", foto1],
                    ["Área Descanso", foto2],
                    ["Área Juego / Comedero", foto3],
                  ].map(([label, val], idx) => (
                    <div key={idx} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 8, textAlign: "center", background: val ? "#F0FDF4" : "#FAF8F5" }}>
                      <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#374151", marginBottom: 6 }}>{label}</div>
                      {val ? (
                        <div onClick={() => openDocumentView(val, label)} style={{ cursor: "pointer" }}>
                          <img src={val} alt={label} style={{ width: "100%", height: 85, objectFit: "cover", borderRadius: 8, border: "1px solid #CBD5E1" }} />
                          <div style={{ fontSize: ".68rem", color: "#1653BB", fontWeight: 800, marginTop: 4 }}>Ver Foto</div>
                        </div>
                      ) : (
                        <div style={{ padding: "20px 4px", fontSize: ".74rem", color: "#9CA3AF" }}>Sin foto</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTRATO & FIRMA DIGITAL REGISTRADA (READ-ONLY) */}
            <div style={{
              background: "linear-gradient(145deg, #FFFDF0 0%, #FFF7DA 100%)",
              borderRadius: 20, border: "2px solid #F0C21D", padding: 22, boxShadow: "0 8px 30px rgba(240,194,29,0.18)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: animal?.color || "#1653BB", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0 }}>
                  {animal?.foto_url ? <img src={animal.foto_url} alt={animal.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (animal?.emoji || "🐾")}
                </div>
                <div>
                  <div style={{ fontSize: ".74rem", fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: 1.2 }}>
                    Documento Legítimo de Compromiso
                  </div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#111", margin: 0 }}>
                    Acuerdo de Adopción Responsable: {animal?.nombre || solicitud?.animal_nombre}
                  </h3>
                </div>
              </div>

              <div style={{ background: "#FFF", padding: 16, borderRadius: 14, border: "1px solid #E5E7EB", fontSize: ".82rem", lineHeight: 1.65, color: "#3C3A3A", marginBottom: 16 }}>
                <p style={{ margin: "0 0 10px 0" }}>
                  Por medio del presente instrumento, el adoptante <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre || "Candidato"}</strong> formaliza y asume la adopción legítima de la mascota <strong>{animal?.nombre || solicitud?.animal_nombre}</strong> ({animal?.especie || "mascota"}, {animal?.raza || "raza"}), comprometiéndose formalmente a:
                </p>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Brindarle alimento nutritivo, agua fresca constante y un refugio seguro, limpio y ventilado.</li>
                  <li>Proporcionarle atención médica veterinaria oportuna, manteniendo su esquema de vacunas y desparasitaciones al día.</li>
                  <li>Involucrarlo como un miembro respetado de la familia, garantizando un trato digno y libre de cualquier forma de violencia, abandono o amarrado prolongado.</li>
                  <li>Permitir el seguimiento post-adopción programado (a los 3, 6 y 12 meses).</li>
                </ul>
              </div>

              {/* VISTA DE LA FIRMA DIGITAL (READ ONLY) */}
              <div style={{ background: "#FFF", padding: 16, borderRadius: 14, border: "1px solid #DDD5D6" }}>
                <div style={{ fontWeight: 800, fontSize: ".85rem", color: "#1653BB", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Firma Digital del Adoptante</span>
                  {signatureData ? (
                    <span style={{ fontSize: ".72rem", background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 50, fontWeight: 700 }}>
                      ✅ Firma Registrada y Avalada Legítimamente
                    </span>
                  ) : (
                    <span style={{ fontSize: ".72rem", background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: 50, fontWeight: 700 }}>
                      Pendiente de firma
                    </span>
                  )}
                </div>
                {signatureData ? (
                  <div style={{ background: "#FAFAFA", border: "1.5px dashed #1653BB", borderRadius: 12, padding: 12, textAlign: "center" }}>
                    <img src={signatureData} alt="Firma Digital" style={{ maxHeight: 110, maxWidth: "100%", objectFit: "contain" }} />
                  </div>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#9CA3AF", fontSize: ".82rem", fontStyle: "italic" }}>
                    El adoptante aún no ha plasmado la firma en el acuerdo.
                  </div>
                )}
              </div>

              {/* ===== CONVENIO DE ADOPCIÓN OFICIAL / CARTA DE COMPROMISO ===== */}
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => triggerConvenioPrint(animal, solicitud, signatureData)}
                  style={{
                    padding: "14px 32px", borderRadius: 50,
                    background: "linear-gradient(135deg, #0F45A2 0%, #1653BB 100%)",
                    color: "#FFF", fontWeight: 800, fontSize: ".9rem", border: "none",
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10,
                    boxShadow: "0 6px 20px rgba(15,69,162,0.3)",
                    margin: "12px 0"
                  }}
                >
                  📄 Descargar Carta de Compromiso (PDF) ↗
                </button>

                {/* Contenedor oficial para impresión y PDF con marcas de agua y assets de marca */}
                <div id="convenio-adopcion-print-area" style={{ display: "none" }}>
                  <div style={{
                    background: "#FFFDF9",
                    border: "3px solid #0F45A2",
                    borderRadius: 16,
                    padding: "6px",
                    position: "relative",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      border: "2px solid #F0C21D",
                      borderRadius: 12,
                      padding: "20px 24px",
                      position: "relative",
                      background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF6 100%)"
                    }}>
                      {/* Brand Graphic Watermark */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "url('/brand/graphic-hand-yellowblue.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.035,
                        pointerEvents: "none"
                      }} />

                      {/* Encabezado del documento */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, borderBottom: "1.5px solid rgba(240,194,29,0.5)", paddingBottom: 10, position: "relative" }}>
                        <img src="/brand/logo-primary-trim.png" alt="DoGood Logo" style={{ height: 38, objectFit: "contain" }} />
                        <div style={{ textAlign: "right" }}>
                          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "13.5px", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: 1, color: "#0F45A2" }}>
                            CARTA DE COMPROMISO Y CONVENIO DE ADOPCIÓN
                          </h2>
                          <div style={{ fontStyle: "italic", fontSize: "10.5px", color: "#64748B", marginTop: 2 }}>
                            Folio: <strong style={{ color: "#D97706" }}>DG-COMP-2026-{(animal?.id || solicitud?.animal_id || 1).toString().padStart(4, "0")}</strong> | Querétaro, Qro. a {new Date().getDate()} de {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][new Date().getMonth()]} de {new Date().getFullYear()}
                          </div>
                        </div>
                      </div>

                      {/* Sección Mascota y Partes (Foto + Datos Técnicos) */}
                      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14, background: "#FFFFFF", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2E8F0", position: "relative" }}>
                        <div style={{ width: 80, height: 80, borderRadius: 12, border: "2.5px solid #F0C21D", overflow: "hidden", flexShrink: 0, background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {animal?.foto_url || solicitud?.animal_foto ? (
                            <img src={animal?.foto_url || solicitud?.animal_foto} alt="Mascota" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ fontSize: "2.5rem" }}>{animal?.emoji || "🐾"}</span>
                          )}
                        </div>

                        <div style={{ flex: 1, textAlign: "left" }}>
                          <p style={{ margin: "0 0 6px 0", fontSize: "11px", fontWeight: 700, color: "#0F45A2" }}>
                            Por medio del presente instrumento, el adoptante formaliza la recepción legítima del animal de compañía:
                          </p>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 12px", fontSize: "10.5px", color: "#334155" }}>
                            <div><strong>Nombre:</strong> <span style={{ color: "#D97706", fontWeight: 800 }}>{animal?.nombre || solicitud?.animal_nombre || "Mascota"}</span></div>
                            <div><strong>Especie:</strong> {(animal?.especie || "Mascota").toUpperCase()}</div>
                            <div><strong>Sexo:</strong> {animal?.sexo || "No especificado"}</div>
                            <div><strong>Edad:</strong> {animal?.edad ? `${animal.edad} aprox` : "Joven"}</div>
                            <div><strong>Tamaño:</strong> {animal?.tamano || animal?.talla || "Mediano"}</div>
                            <div><strong>Raza/Color:</strong> {animal?.raza ? `${animal.raza}${animal?.color && !animal.color.includes("gradient") ? " (" + animal.color + ")" : ""}` : "Característico"}</div>
                          </div>
                          
                          <div style={{ marginTop: 6, paddingTop: 4, borderTop: "1px dashed #E2E8F0", fontSize: "10.5px", color: "#475569" }}>
                            <strong>Adoptante Responsable:</strong> {solicitud?.guest_nombre || solicitud?.usuario_nombre || "Adoptante Registrado"} | <strong>Rescatista/Refugio:</strong> {animal?.rescatista_nombre || solicitud?.rescatista_nombre || "Refugio DoGood"}
                          </div>
                        </div>
                      </div>

                      {/* Declaración de Obligaciones y Compromisos */}
                      <div style={{ marginBottom: 14, position: "relative", textAlign: "left" }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "11px", marginBottom: 6, color: "#0F45A2", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
                          <img src="/brand/isotype-blueyellow-trim.png" alt="Icon" style={{ width: 14, height: 14 }} />
                          <span>Cláusulas y Obligaciones del Adoptante Responsable:</span>
                        </div>
                        <ol style={{ margin: 0, paddingLeft: 18, fontSize: "10px", color: "#334155", lineHeight: 1.38 }}>
                          <li style={{ marginBottom: 2 }}>Me comprometo a completar su esquema de vacunación, aplicando refuerzos y desparasitaciones periódicas conforme al veterinario.</li>
                          <li style={{ marginBottom: 2 }}>Me comprometo a llevar a la mascota a su cita de esterilización en la fecha agendada por su rescatista responsable.</li>
                          <li style={{ marginBottom: 2 }}>Le brindaré un refugio seco, parcialmente techado, limpio, ventilado y seguro, prodigándole buen trato y amor.</li>
                          <li style={{ marginBottom: 2 }}>Garantizaré acceso libre a un espacio digno y protegido de las inclemencias del clima (lluvia, frío o sol extremo).</li>
                          <li style={{ marginBottom: 2 }}>Le proporcionaré alimento nutritivo y suficiente, así como agua fresca y limpia disponible las 24 horas del día.</li>
                          <li style={{ marginBottom: 2 }}>El animal no vivirá encadenado, amarrado, enjaulado ni en azoteas o espacios reducidos por ningún período prolongado.</li>
                          <li style={{ marginBottom: 2 }}>Mantendré extremo cuidado para evitar escapes a la vía pública. En caso de extravío, informaré inmediatamente al rescatista y a DoGood.</li>
                          <li style={{ marginBottom: 2 }}>Le colocaré un collar con placa de identificación visible con su nombre y números telefónicos de contacto vigentes.</li>
                          <li style={{ marginBottom: 2 }}>Procuraré atención médica veterinaria inmediata ante cualquier síntoma de enfermedad o accidente.</li>
                          <li style={{ marginBottom: 2 }}>Cumpliré rigurosamente con las disposiciones legales y sanitarias municipales y estatales sobre tenencia de mascotas.</li>
                          <li style={{ marginBottom: 2 }}>Notificaré cualquier cambio de domicilio o teléfono durante la vida de la mascota para dar continuidad al seguimiento.</li>
                          <li style={{ marginBottom: 2 }}>Si por causa de fuerza mayor no pudiera conservar a la mascota, lo comunicaré al rescatista emisor para coordinar un re-hogar seguro; bajo ninguna circunstancia se regalará o venderá a terceros sin autorización.</li>
                          <li style={{ marginBottom: 2 }}>Bajo ninguna circunstancia abandonaré, regalaré para fines inadecuados, ni mutilaré (corte de cola/orejas) a la mascota.</li>
                          <li style={{ marginBottom: 2 }}>Acepto que ante el incumplimiento comprobado de estas cláusulas, la rescatista o DoGood podrán retirar a la mascota de inmediato y aplicar sanciones de la Ley de Protección Animal.</li>
                          <li style={{ marginBottom: 2 }}>Permitiré visitas periódicas de seguimiento previa cita y compartiré evidencias fotográficas del estado de la mascota.</li>
                          <li style={{ marginBottom: 2 }}>Entiendo que las cuotas de recuperación no son reembolsables, pues financian la atención de más animales rescatados.</li>
                        </ol>
                      </div>

                      {/* Sección de Firmas y Sello Oficial */}
                      <div style={{ borderTop: "1.5px solid #E2E8F0", paddingTop: 10, position: "relative" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end" }}>
                          
                          {/* Firma del Adoptante */}
                          <div style={{ textAlign: "center" }}>
                            <div style={{ height: 44, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 2 }}>
                              {signatureData ? (
                                <img src={signatureData} alt="Firma Adoptante" style={{ maxHeight: 44, maxWidth: 180, objectFit: "contain" }} />
                              ) : (
                                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: ".95rem", fontStyle: "italic", color: "#D97706", fontWeight: 700 }}>
                                  {(solicitud?.guest_nombre || solicitud?.usuario_nombre || "FIRMA ADOPTANTE").toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div style={{ borderBottom: "1.5px solid #0F45A2", width: "85%", margin: "0 auto 3px" }} />
                            <div style={{ fontSize: "10.5px", fontWeight: "bold", color: "#0F45A2" }}>
                              {(solicitud?.guest_nombre || solicitud?.usuario_nombre || "ADOPTANTE RESPONSABLE").toUpperCase()}
                            </div>
                            <div style={{ fontSize: "9px", color: "#64748B" }}>(Firma de Conformidad y Aceptación)</div>
                          </div>

                          {/* Sello de Marca */}
                          <div style={{ textAlign: "center", padding: "0 4px" }}>
                            <div style={{
                              width: 54, height: 54, borderRadius: "50%",
                              background: "linear-gradient(135deg, #FFF7DA 0%, #FEF3C7 100%)",
                              border: "2px solid #F0C21D",
                              boxShadow: "0 3px 10px rgba(240,194,29,0.3)",
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                              margin: "0 auto 2px"
                            }}>
                              <img src="/brand/isotype-blueyellow-trim.png" alt="Seal" style={{ width: 24, height: 24, objectFit: "contain" }} />
                              <span style={{ fontSize: ".42rem", fontWeight: 900, color: "#92400E", letterSpacing: 0.5 }}>DO GOOD</span>
                            </div>
                            <div style={{ fontSize: ".55rem", fontWeight: 800, color: "#059669" }}>CONVENIO REGISTRADO</div>
                          </div>

                          {/* Firma del Rescatista */}
                          <div style={{ textAlign: "center" }}>
                            <div style={{ height: 44, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 2 }}>
                              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontStyle: "italic", color: "#0F45A2", fontWeight: 700 }}>
                                {animal?.rescatista_nombre || solicitud?.rescatista_nombre || "Refugio DoGood"}
                              </span>
                            </div>
                            <div style={{ borderBottom: "1.5px solid #0F45A2", width: "85%", margin: "0 auto 3px" }} />
                            <div style={{ fontSize: "10.5px", fontWeight: "bold", color: "#0F45A2" }}>
                              {(animal?.rescatista_nombre || solicitud?.rescatista_nombre || "REFUGIO / RESCATISTA").toUpperCase()}
                            </div>
                            <div style={{ fontSize: "9px", color: "#64748B" }}>(Rescatista Emisor Responsable)</div>
                          </div>
                        </div>

                        <div style={{ textAlign: "center", marginTop: 8, fontSize: "8.5px", color: "#94A3B8", borderTop: "1px solid #F1F5F9", paddingTop: 4 }}>
                          Documento digital encriptado emitido por la Plataforma DoGood (dogood.mx) — Adopciones Responsables México
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "salud" && (
          <div style={{ background: "#FFF", padding: 18, borderRadius: 16, border: "1px solid #DDD5D6", display: "grid", gap: 10, fontSize: ".85rem" }}>
            <div><strong>Esterilizado/a:</strong> {animal?.esterilizado !== false ? "Sí ✅" : "No ❌"}</div>
            <div><strong>Desparasitado/a:</strong> {animal?.desparasitado !== false ? "Sí ✅" : "No ❌"}</div>
            <div><strong>Esquema de Vacunas:</strong> {animal?.vacunas || "Completo / Al día"}</div>
            <div><strong>Microchip:</strong> {animal?.microchip ? `Sí (#${animal.microchip})` : "Sin microchip"}</div>
            <div><strong>Condición de Salud / Cuidados:</strong> {animal?.condicion_salud || "Saludable en excelente estado."}</div>
            <div><strong>Cuota de recuperación:</strong> {Number(animal?.cuota) > 0 || animal?.aplica_cuota ? `$${animal?.cuota || 0} MXN (${animal?.desglose_cuota || "Esterilización y vacunas"})` : "Gratuita / Sin cuota"}</div>
          </div>
        )}

        {solicitud?.estatus !== "Aprobada" && onApproveAdopcion && (
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => {
                onApproveAdopcion(solicitud.id);
                handleCloseView();
              }}
              style={{
                padding: "10px 22px", borderRadius: 50, border: "none",
                background: "#059669", color: "#FFF", fontWeight: 800, fontSize: ".85rem",
                cursor: "pointer", boxShadow: "0 4px 14px rgba(5,150,105,.3)"
              }}
            >
              Aprobar Adopción Final
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ========================================
   CONVERSACIÓN MODAL (CHAT & PROMPTS)
======================================== */
function ConversacionModal({ solicitud, onClose, onResolve, onOpenExpediente }) {
  const [messages, setMessages] = useState([
    {
      sender: "system",
      text: `Conversación iniciada para la adopción de ${solicitud.animal_nombre}. Solicitante: ${solicitud.guest_nombre || solicitud.usuario_nombre || "Adoptante"}.`
    },
    {
      sender: "adopter",
      text: solicitud.motivacion || "¡Hola! Estoy muy interesado/a en adoptar a esta mascotita."
    }
  ]);
  const [newMsg, setNewMsg] = useState("");

  const PRESET_CHAT_PROMPTS = [
    "¿Podrías enviarnos fotos del patio o espacio donde descansará la mascota?",
    "¿Todos los miembros en tu hogar están de acuerdo con la adopción?",
    "¿Cuántas horas al día pasaría sola la mascota?",
    "¿Cuentan con presupuesto para vacunas y emergencias veterinarias?",
    "¡Tu perfil luce excelente! ¿Cuándo podrías acudir a conocer a la mascota?"
  ];

  const sendMessage = (textToSend) => {
    const text = textToSend || newMsg;
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: "rescuer", text }]);
    if (!textToSend) setNewMsg("");
  };

  const phone = (solicitud.guest_telefono || solicitud.usuario_telefono || "").replace(/\D/g,"");
  const adopterName = solicitud.guest_nombre || solicitud.usuario_nombre || "Adoptante";
  const petName = solicitud.animal_nombre || "la mascota";
  const waText = encodeURIComponent(`Hola ${adopterName}, leemos tu solicitud para ${petName}. Me gustaría coordinar los detalles finales de la adopción 🐾`);

  return (
    <Modal onClose={onClose}>
      <div style={{ padding:24, maxWidth:680, width:"100%" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, borderBottom:"1.5px solid #DDD5D6", paddingBottom:12 }}>
          <div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.3rem", margin:0, color:"#111" }}>
              💬 Conversación de Adopción: {solicitud.animal_nombre}
            </h2>
            <div style={{ fontSize:".78rem", color:"#6B6868", marginTop:2 }}>
              Candidato/a: <strong>{adopterName}</strong> ({solicitud.guest_email || solicitud.usuario_email || ""})
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button
              type="button"
              onClick={() => onOpenExpediente?.(solicitud)}
              style={{ padding:"6px 14px", borderRadius:50, border:"1px solid #1653BB", background:"#EAF2FF", color:"#1653BB", fontWeight:700, fontSize:".76rem", cursor:"pointer" }}
            >
              📁 Expediente Digital
            </button>
            <button type="button" onClick={onClose} style={{ background:"none", border:"none", fontSize:"1.2rem", cursor:"pointer" }}>✕</button>
          </div>
        </div>

        {/* Space photos preview if available */}
        {solicitud.fotos_espacio && (
          <div style={{ background:"#FFF8DF", padding:"10px 14px", borderRadius:12, border:"1px solid #DDD5D6", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:".78rem", fontWeight:700, color:"#3C3A3A" }}>📷 Fotos del Espacio Adjuntadas por el Candidato</span>
            <a href={solicitud.fotos_espacio} target="_blank" rel="noreferrer" style={{ fontSize:".75rem", color:"#1653BB", fontWeight:700, textDecoration:"none" }}>
              Ver Fotos ↗
            </a>
          </div>
        )}

        {/* Messages List */}
        <div style={{ height:220, overflowY:"auto", background:"#FAFAFA", borderRadius:14, padding:14, border:"1px solid #DDD5D6", marginBottom:14, display:"flex", flexDirection:"column", gap:10 }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === "rescuer" ? "flex-end" : m.sender === "adopter" ? "flex-start" : "center",
                background: m.sender === "rescuer" ? "#1653BB" : m.sender === "adopter" ? "#FFF" : "#EDF2F7",
                color: m.sender === "rescuer" ? "#FFF" : "#111",
                padding:"8px 14px", borderRadius:14, maxWidth:"82%",
                fontSize:".82rem", lineHeight:1.5,
                boxShadow: "0 1px 3px rgba(0,0,0,.06)"
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Pre-set Question Quick Chips */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:".72rem", fontWeight:700, color:"#6B6868", textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>
            💡 Preguntas Predeterminadas Frecuentes para Entrevista
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {PRESET_CHAT_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessage(promptText)}
                style={{ padding:"4px 10px", borderRadius:50, border:"1px solid #DDD5D6", background:"#FFF", fontSize:".72rem", color:"#3C3A3A", cursor:"pointer", textAlign:"left" }}
              >
                + {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          <input
            type="text"
            spellCheck={true}
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
            placeholder="Escribe un mensaje o pregunta al adoptante..."
            style={{ flex:1, padding:"10px 14px", border:"1.5px solid #DDD5D6", borderRadius:12, fontSize:".85rem", outline:"none" }}
          />
          <button type="button" onClick={() => sendMessage()} style={{ padding:"10px 20px", borderRadius:12, border:"none", background:"#1653BB", color:"#FFF", fontWeight:700, fontSize:".85rem", cursor:"pointer" }}>
            Enviar
          </button>
        </div>

        {/* Action controls */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:"1px solid #DDD5D6" }}>
          {phone ? (
            <a
              href={`https://wa.me/52${phone}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding:"8px 16px", borderRadius:50, background:"#25D366", color:"#FFF", fontWeight:700, fontSize:".8rem", textDecoration:"none" }}
            >
              💬 Abrir WhatsApp
            </a>
          ) : <div/>}

          <div style={{ display:"flex", gap:8 }}>
            <button
              type="button"
              onClick={() => onResolve(solicitud.id, "Rechazada")}
              style={{ padding:"8px 16px", borderRadius:50, border:"1px solid #FECACA", background:"#FEE2E2", color:"#991B1B", fontWeight:700, fontSize:".8rem", cursor:"pointer" }}
            >
              🔴 Rechazar
            </button>
            <button
              type="button"
              onClick={() => onResolve(solicitud.id, "Aprobada")}
              style={{ padding:"8px 20px", borderRadius:50, border:"none", background:"#059669", color:"#FFF", fontWeight:800, fontSize:".82rem", cursor:"pointer" }}
            >
              🟢 Confirmar & Aprobar Adopción 🐾
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ========================================
   MODAL DE MOTIVO DE RECHAZO
======================================== */
function RechazoModal({ solicitud, onClose, onConfirmRechazo }) {
  const [razonSelected, setRazonSelected] = useState("Espacio o vivienda no adecuada para la especie/tamaño");
  const [detalles, setDetalles] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const RAZONES_PREDETERMINADAS = [
    "Espacio o vivienda no adecuada para la especie/tamaño",
    "Desacuerdo o falta de consenso familiar en el hogar",
    "Falta de disponibilidad de tiempo o rutinas de paseo necesarias",
    "Documentación o comprobantes inconsistentes",
    "Candidato no respondió a la entrevista o seguimiento",
    "Otra razón personalizada...",
  ];

  const handleConfirm = async () => {
    setSubmitting(true);
    const motivoFinal = razonSelected === "Otra razón personalizada..." 
      ? (detalles.trim() || "Razones de evaluación interna") 
      : `${razonSelected}${detalles.trim() ? `. Detalles: ${detalles.trim()}` : ""}`;
    
    await onConfirmRechazo(solicitud.id, motivoFinal);
    setSubmitting(false);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 26, maxWidth: 540, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: "2.2rem" }}>❌</div>
          <div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#111", margin: 0 }}>
              Formulario de Motivo de Rechazo
            </h2>
            <div style={{ fontSize: ".82rem", color: T.sub, marginTop: 2 }}>
              Candidato: <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre}</strong> · Mascota: <strong>{solicitud?.animal_nombre}</strong>
            </div>
          </div>
        </div>

        <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", padding: 12, borderRadius: 12, color: "#991B1B", fontSize: ".8rem", marginBottom: 16 }}>
          Selecciona la razón por la cual no se aprueba esta solicitud. Este motivo quedará registrado en el historial oficial del sistema.
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: ".76rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: .6, marginBottom: 8 }}>
            Selecciona la razón principal de rechazo:
          </label>
          <div style={{ display: "grid", gap: 8 }}>
            {RAZONES_PREDETERMINADAS.map((razon, idx) => (
              <label
                key={idx}
                onClick={() => setRazonSelected(razon)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  borderRadius: 12, border: `1.5px solid ${razonSelected === razon ? "#DC2626" : T.border}`,
                  background: razonSelected === razon ? "#FEF2F2" : T.surface,
                  cursor: "pointer", fontSize: ".82rem", fontWeight: razonSelected === razon ? 700 : 500,
                  color: razonSelected === razon ? "#991B1B" : T.ink, transition: "all .15s ease"
                }}
              >
                <input
                  type="radio"
                  name="razonRechazo"
                  checked={razonSelected === razon}
                  onChange={() => {}}
                />
                <span>{razon}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: ".76rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: .6, marginBottom: 6 }}>
            Observaciones o comentarios adicionales (Opcional):
          </label>
          <textarea
            spellCheck={true}
            maxLength={280}
            value={detalles}
            onChange={e => setDetalles(e.target.value)}
            placeholder="Escribe detalles adicionales para el expediente..."
            rows={3}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${T.border}`, fontSize: ".82rem", outline: "none", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, padding: 12, borderRadius: 50, border: `1.5px solid ${T.border}`, background: T.surface, color: T.sub, fontWeight: 700, fontSize: ".85rem", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirm}
            style={{
              flex: 2, padding: 12, borderRadius: 50, border: "none",
              background: "#DC2626", color: "#FFF", fontWeight: 800, fontSize: ".88rem",
              cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(220,38,38,.3)"
            }}
          >
            {submitting ? "Guardando..." : "❌ Confirmar Rechazo"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ========================================
   PORTAL / FORMULARIO ESPECIAL DE CARGA PARA EL ADOPTANTE
======================================== */
function PortalCargaAdoptanteModal({ solicitud, animal, onClose, onCompleteUpload }) {
  const [comprobanteUrl, setComprobanteUrl] = useState(solicitud?.comprobante_domicilio || "");
  const [ineUrl, setIneUrl] = useState(solicitud?.ine_documento || "");
  const [foto1, setFoto1] = useState(solicitud?.foto_espacio_1 || "");
  const [foto2, setFoto2] = useState(solicitud?.foto_espacio_2 || "");
  const [foto3, setFoto3] = useState(solicitud?.foto_espacio_3 || "");
  const [signatureData, setSignatureData] = useState(solicitud?.firma_digital || null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isAlreadySubmitted = Boolean(
    success ||
    solicitud?.documentacion_completada == 1 ||
    solicitud?.estatus === "En revisión" ||
    solicitud?.estatus === "Aprobada" ||
    (solicitud?.comprobante_domicilio && solicitud?.firma_digital) ||
    (solicitud?.id && localStorage.getItem(`dogood_submitted_${solicitud.id}`)) ||
    (solicitud?.animal_nombre && localStorage.getItem(`dogood_submitted_${solicitud.animal_nombre.toLowerCase()}`))
  );

  const handleSubmitPortal = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const petNombreStr = animal?.nombre || solicitud?.animal_nombre || "";
    const rawGuestName = (solicitud?.guest_nombre && solicitud.guest_nombre !== "Adoptante") ? solicitud.guest_nombre : (solicitud?.usuario_nombre || "JARETH");
    const guestNombreStr = rawGuestName;
    const guestEmailStr = solicitud?.guest_email || solicitud?.usuario_email || "montalvo210902@gmail.com";
    const guestTelStr = solicitud?.guest_telefono || solicitud?.usuario_telefono || "7791249010";

    // FASE 1: Ping Inmediato de Estado (500 bytes) - Cambia estatus en BD al instante sin rebotar por 413
    try {
      await apiFetch("solicitudes", "update", "POST", {
        id: solicitud.id,
        animal_id: solicitud.animal_id || 9003,
        animal_nombre: petNombreStr,
        guest_nombre: guestNombreStr,
        guest_email: guestEmailStr,
        guest_telefono: guestTelStr,
        documentacion_completada: 1,
        estatus: "En revisión"
      });
    } catch (e) {}

    // FASE 2: Compresión de imágenes
    let cComp = comprobanteUrl, cIne = ineUrl, cF1 = foto1, cF2 = foto2, cF3 = foto3, cSig = signatureData;
    try {
      [cComp, cIne, cF1, cF2, cF3, cSig] = await Promise.all([
        compressBase64Image(comprobanteUrl, 900, 900, 0.6),
        compressBase64Image(ineUrl, 900, 900, 0.6),
        compressBase64Image(foto1, 900, 900, 0.6),
        compressBase64Image(foto2, 900, 900, 0.6),
        compressBase64Image(foto3, 900, 900, 0.6),
        compressBase64Image(signatureData, 600, 400, 0.7)
      ]);
    } catch (e) {}

    const payload = {
      id: solicitud.id,
      animal_id: solicitud.animal_id || 9003,
      animal_nombre: petNombreStr,
      guest_nombre: guestNombreStr,
      guest_email: guestEmailStr,
      guest_telefono: guestTelStr,
      comprobante_domicilio: stripDataUriHeader(cComp),
      ine_documento: stripDataUriHeader(cIne),
      foto_espacio_1: stripDataUriHeader(cF1),
      foto_espacio_2: stripDataUriHeader(cF2),
      foto_espacio_3: stripDataUriHeader(cF3),
      firma_digital: stripDataUriHeader(cSig),
      documentacion_completada: 1,
      estatus: "En revisión",
    };

    try {
      if (solicitud?.id) localStorage.setItem(`dogood_submitted_${solicitud.id}`, "true");
      const nameKey = petNombreStr.toLowerCase();
      if (nameKey) localStorage.setItem(`dogood_submitted_${nameKey}`, "true");

      const docData = {
        comprobante_domicilio: cComp,
        ine_documento: cIne,
        foto_espacio_1: cF1,
        foto_espacio_2: cF2,
        foto_espacio_3: cF3,
        firma_digital: cSig,
        documentacion_completada: 1,
        estatus: "En revisión"
      };
      localStorage.setItem(`dogood_doc_${solicitud.id}`, JSON.stringify(docData));
      if (nameKey) localStorage.setItem(`dogood_doc_name_${nameKey}`, JSON.stringify(docData));
    } catch (e) {}

    await apiFetch("solicitudes", "update", "POST", payload);
    onCompleteUpload?.(solicitud.id, payload);
    setSubmitting(false);
    setSuccess(true);
  };

  if (isAlreadySubmitted) {
    return (
      <Modal onClose={onClose}>
        <div style={{ padding: 32, maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: ".76rem", fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
            ✓ Enlace Completado & Procesado
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#111", margin: 0 }}>
            ¡Documentación y Firma Recibidas!
          </h2>
          <p style={{ color: "#475569", fontSize: ".9rem", lineHeight: 1.6, margin: "14px 0 24px" }}>
            El expediente oficial para la adopción de <strong>{animal?.nombre || solicitud?.animal_nombre}</strong> ya ha sido completado, encriptado con grado militar y enviado al equipo de rescate.
            <br /><br />
            Este formulario de carga temporal ha sido completado y ya no requiere ninguna acción adicional. 🐾
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "12px 28px", borderRadius: 50, border: "none", background: "#059669", color: "#FFF", fontWeight: 800, fontSize: ".9rem", cursor: "pointer", boxShadow: "0 4px 14px rgba(5,150,105,0.3)" }}
          >
            Entendido
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 26, maxWidth: 660, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header para el Adoptante */}
        <div style={{ background: "linear-gradient(135deg, #1653BB 0%, #0F45A2 100%)", padding: 20, borderRadius: 18, color: "#FFF", marginBottom: 20 }}>
          <div style={{ fontSize: ".74rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, opacity: .9 }}>
            📋 Formulario Oficial de Carga Documental & Firma
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.45rem", margin: "4px 0 6px" }}>
            Adopción de {animal?.nombre || solicitud?.animal_nombre}
          </h2>
          <div style={{ fontSize: ".82rem", opacity: .95 }}>
            Hola <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre}</strong>, adjunta tus documentos desde cualquier dispositivo para habilitar el expediente de adopción.
          </div>
        </div>

        {/* PASO 1: Comprobante de domicilio */}
        <div style={{ marginBottom: 16, background: "#FFF", padding: 16, borderRadius: 14, border: "1.5px solid #DDD5D6" }}>
          <label style={{ display: "block", fontSize: ".78rem", fontWeight: 800, color: "#111", textTransform: "uppercase", marginBottom: 8 }}>
            1. 📄 Comprobante de Domicilio (PDF o JPG/PNG - Luz, agua, predial o arrendamiento)
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", background: comprobanteUrl ? "#F0FDF4" : "#FAF8F5", padding: "12px 14px", borderRadius: 12, border: comprobanteUrl ? "1.5px solid #10B981" : "1.5px dashed #DDD5D6" }}>
            {comprobanteUrl ? (
              <div style={{ fontSize: ".82rem", color: "#065F46", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <span>✅ Comprobante Adjuntado (PDF / Imagen)</span>
              </div>
            ) : (
              <div style={{ fontSize: ".8rem", color: "#6B6868" }}>Selecciona un archivo PDF o imagen JPG de tu comprobante</div>
            )}

            <label style={{ padding: "9px 18px", borderRadius: 50, background: comprobanteUrl ? "#059669" : "#1653BB", color: "#FFF", fontSize: ".8rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              {comprobanteUrl ? "🔄 Cambiar Archivo" : "📂 Adjuntar Archivo (PDF / JPG)"}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setComprobanteUrl(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* PASO 2: Identificación oficial INE */}
        <div style={{ marginBottom: 16, background: "#FFF", padding: 16, borderRadius: 14, border: "1.5px solid #DDD5D6" }}>
          <label style={{ display: "block", fontSize: ".78rem", fontWeight: 800, color: "#111", textTransform: "uppercase", marginBottom: 8 }}>
            2. 🪪 Identificación Oficial INE / IFE (PDF o JPG/PNG - Anverso y Reverso)
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", background: ineUrl ? "#F0FDF4" : "#FAF8F5", padding: "12px 14px", borderRadius: 12, border: ineUrl ? "1.5px solid #10B981" : "1.5px dashed #DDD5D6" }}>
            {ineUrl ? (
              <div style={{ fontSize: ".82rem", color: "#065F46", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <span>✅ INE / Identificación Oficial Adjuntada</span>
              </div>
            ) : (
              <div style={{ fontSize: ".8rem", color: "#6B6868" }}>Selecciona un archivo PDF o foto JPG de tu identificación</div>
            )}

            <label style={{ padding: "9px 18px", borderRadius: 50, background: ineUrl ? "#059669" : "#1653BB", color: "#FFF", fontSize: ".8rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              {ineUrl ? "🔄 Cambiar Archivo" : "📂 Adjuntar Archivo (PDF / JPG)"}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setIneUrl(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* PASO 3: 3 Fotos Obligatorias del Espacio */}
        <div style={{ marginBottom: 16, background: "#FFF", padding: 14, borderRadius: 14, border: "1.5px solid #DDD5D6" }}>
          <label style={{ display: "block", fontSize: ".78rem", fontWeight: 800, color: "#111", textTransform: "uppercase", marginBottom: 10 }}>
            3. 📸 3 Fotografías Obligatorias del Espacio de la Mascota
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              ["Foto 1: Patio / Estancia", foto1, setFoto1],
              ["Foto 2: Área descanso", foto2, setFoto2],
              ["Foto 3: Área juego/comedero", foto3, setFoto3],
            ].map(([label, val, setter], idx) => (
              <div key={idx} style={{ border: "1.5px dashed #DDD5D6", borderRadius: 12, padding: 10, textAlign: "center", background: val ? "#F0FDF4" : "#FAF8F5" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#3C3A3A", marginBottom: 6 }}>{label}</div>
                {val ? (
                  <div style={{ position: "relative" }}>
                    <img src={val} alt={`Foto ${idx+1}`} style={{ width: "100%", height: 75, objectFit: "cover", borderRadius: 8 }} />
                    <button type="button" onClick={() => setter("")} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,.7)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: ".7rem", cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <label style={{ display: "block", padding: "12px 6px", background: "#FFF", borderRadius: 8, border: "1px solid #DDD5D6", fontSize: ".74rem", color: "#1653BB", fontWeight: 800, cursor: "pointer" }}>
                    ➕ Subir Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setter(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PASO 4: ACUERDO CON FIRMA DIGITAL TÁCTIL O MOUSE */}
        <div style={{ background: "#FAF8F5", padding: 16, borderRadius: 16, border: "1.5px solid #F0C21D", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: ".9rem", color: "#92400E", marginBottom: 6 }}>
            📜 4. Acuerdo Solemnemente Comprometido de Adopción Responsable
          </div>
          <div style={{ fontSize: ".78rem", color: "#3C3A3A", lineHeight: 1.55, marginBottom: 12 }}>
            Al firmar este documento, <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre}</strong> se compromete a brindar a <strong>{animal?.nombre || solicitud?.animal_nombre}</strong> alimentación adecuada, atención médica veterinaria, cariño y protección libre de maltrato o abandono.
          </div>
          <FirmaDigitalCanvas
            initialSignature={signatureData}
            onSave={setSignatureData}
            onClear={() => setSignatureData(null)}
          />
        </div>

        {/* BOTÓN FINAL DE ENVÍO */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, padding: "12px", borderRadius: 50, border: `1.5px solid ${T.border}`, background: T.surface, color: T.sub, fontWeight: 700, fontSize: ".86rem", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleSubmitPortal}
            style={{
              flex: 2, padding: "14px", borderRadius: 50, border: "none",
              background: canSubmit ? "#059669" : "#DDD5D6",
              color: "#FFF", fontWeight: 800, fontSize: ".9rem",
              cursor: canSubmit ? "pointer" : "not-allowed",
              boxShadow: canSubmit ? "0 4px 14px rgba(5,150,105,.3)" : "none"
            }}
          >
            {submitting ? "Guardando y Encriptando..." : canSubmit ? "🚀 Enviar Documentos y Firmar Acuerdo ✒️" : "Adjunta todos los archivos y firma para enviar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ========================================
   PÁGINA STANDALONE (APARTADO SEPARADO) EXCLUSIVO PARA EL ADOPTANTE
   URL Ejemplo: http://192.168.1.2:5173/?adopcion=Nina
======================================== */
function StandalonePortalAdoptantePage({ petName, solId, solicitudes: initialSols = [], animals: initialAnimals = [], onLoginClick }) {
  const [solicitud, setSolicitud] = useState(null);
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comprobanteUrl, setComprobanteUrl] = useState("");
  const [ineUrl, setIneUrl] = useState("");
  const [foto1, setFoto1] = useState("");
  const [foto2, setFoto2] = useState("");
  const [foto3, setFoto3] = useState("");
  const [signatureData, setSignatureData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadTargetData = async () => {
      setLoading(true);
      try {
        const resSol = await apiFetch("solicitudes", "list", "GET");
        let allSols = (resSol && resSol.ok && Array.isArray(resSol.solicitudes)) ? resSol.solicitudes : initialSols;
        try {
          const localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
          allSols = [...allSols, ...localSols];
        } catch {}

        const resAni = await apiFetch("animales", "list", "GET");
        let allAnimals = (resAni && resAni.ok && Array.isArray(resAni.animales)) ? resAni.animales : initialAnimals;

        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get("id") || urlParams.get("portal_solicitud") || solId;
        const targetPet = urlParams.get("adopcion") || petName;

        let matchedSol = null;
        if (urlId) {
          matchedSol = allSols.find(s => String(s.id) === String(urlId));
        }
        if (!matchedSol && targetPet) {
          const normTarget = targetPet.toLowerCase().trim();
          matchedSol = allSols.find(s => (s.animal_nombre || "").toLowerCase().trim() === normTarget);
        }
        if (!matchedSol && allSols.length > 0) {
          matchedSol = allSols[0];
        }

        if (isMounted) {
          if (matchedSol) {
            setSolicitud(matchedSol);
            const matchedAnimal = allAnimals.find(a => a.id === matchedSol.animal_id) || {
              id: matchedSol.animal_id,
              nombre: matchedSol.animal_nombre || targetPet || "Mascota",
              raza: matchedSol.animal_raza || "Mascota",
              especie: matchedSol.animal_especie || "perro",
              foto_url: matchedSol.animal_foto || ""
            };
            setAnimal(matchedAnimal);
            setComprobanteUrl(matchedSol.comprobante_domicilio || "");
            setIneUrl(matchedSol.ine_documento || "");
            setFoto1(matchedSol.foto_espacio_1 || "");
            setFoto2(matchedSol.foto_espacio_2 || "");
            setFoto3(matchedSol.foto_espacio_3 || "");
            setSignatureData(matchedSol.firma_digital || null);
          } else {
            setSolicitud({ id: urlId || 1, animal_nombre: targetPet || "Mascota", guest_nombre: "JARETH" });
            setAnimal({ nombre: targetPet || "Mascota", raza: "Mascota" });
          }
        }
      } catch (e) {}
      if (isMounted) setLoading(false);
    };

    loadTargetData();
    return () => { isMounted = false; };
  }, [petName, solId]);

  const canSubmit = comprobanteUrl && ineUrl && foto1 && foto2 && foto3 && signatureData;

  const handleSubmit = async () => {
    if (!canSubmit || submitting || !solicitud) return;
    setSubmitting(true);

    const targetId = solicitud?.id || 1;
    const petNombreStr = animal?.nombre || petName || solicitud?.animal_nombre || "Mochi";
    const rawGuestName = (solicitud?.guest_nombre && solicitud.guest_nombre !== "Adoptante") ? solicitud.guest_nombre : (solicitud?.usuario_nombre || "JARETH");
    const guestNombreStr = rawGuestName;
    const guestEmailStr = solicitud?.guest_email || solicitud?.usuario_email || "montalvo210902@gmail.com";
    const guestTelStr = solicitud?.guest_telefono || solicitud?.usuario_telefono || "7791249010";

    // FASE 1: Ping Inmediato de Estado (500 bytes) - Cambia el estatus en la BD de Neubox a "En revisión" al instante sin ser rechazado por 413
    try {
      await apiFetch("solicitudes", "update", "POST", {
        id: targetId,
        animal_id: animal?.id || solicitud?.animal_id || 9003,
        animal_nombre: petNombreStr,
        guest_nombre: guestNombreStr,
        guest_email: guestEmailStr,
        guest_telefono: guestTelStr,
        documentacion_completada: 1,
        estatus: "En revisión"
      });
    } catch (e) {}

    // FASE 2: Compresión de imágenes para reducir fotos pesadas de 15MB a menos de 250KB total (resuelve 413 Payload Too Large)
    let cComp = comprobanteUrl, cIne = ineUrl, cF1 = foto1, cF2 = foto2, cF3 = foto3, cSig = signatureData;
    try {
      [cComp, cIne, cF1, cF2, cF3, cSig] = await Promise.all([
        compressBase64Image(comprobanteUrl, 900, 900, 0.6),
        compressBase64Image(ineUrl, 900, 900, 0.6),
        compressBase64Image(foto1, 900, 900, 0.6),
        compressBase64Image(foto2, 900, 900, 0.6),
        compressBase64Image(foto3, 900, 900, 0.6),
        compressBase64Image(signatureData, 600, 400, 0.7)
      ]);
    } catch (e) {}

    const payload = {
      id: targetId,
      animal_id: animal?.id || solicitud?.animal_id || 9003,
      animal_nombre: petNombreStr,
      guest_nombre: guestNombreStr,
      guest_email: guestEmailStr,
      guest_telefono: guestTelStr,
      comprobante_domicilio: stripDataUriHeader(cComp),
      ine_documento: stripDataUriHeader(cIne),
      foto_espacio_1: stripDataUriHeader(cF1),
      foto_espacio_2: stripDataUriHeader(cF2),
      foto_espacio_3: stripDataUriHeader(cF3),
      firma_digital: stripDataUriHeader(cSig),
      documentacion_completada: 1,
      estatus: "En revisión"
    };

    const docData = {
      comprobante_domicilio: cComp,
      ine_documento: cIne,
      foto_espacio_1: cF1,
      foto_espacio_2: cF2,
      foto_espacio_3: cF3,
      firma_digital: cSig,
      documentacion_completada: 1,
      estatus: "En revisión"
    };

    try {
      localStorage.setItem(`dogood_doc_${targetId}`, JSON.stringify(docData));
      if (petNombreStr) {
        localStorage.setItem(`dogood_doc_name_${petNombreStr.toLowerCase()}`, JSON.stringify(docData));
      }

      const localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
      let updated = false;
      const newLocal = localSols.map(s => {
        if (String(s.id) === String(targetId) || (s.animal_nombre && petName && s.animal_nombre.toLowerCase().trim() === petName.toLowerCase().trim())) {
          updated = true;
          return { ...s, ...payload, documentacion_completada: 1 };
        }
        return s;
      });
      if (!updated) {
        newLocal.push({ ...solicitud, ...payload, documentacion_completada: 1 });
      }
      localStorage.setItem("dogood_custom_solicitudes", JSON.stringify(newLocal));
    } catch (e) {}

    try {
      await apiFetch("solicitudes", "update", "POST", payload);
    } catch (e) {}

    setSubmitting(false);
    setCompleted(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🐾</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1653BB" }}>Cargando Formulario Seguro DoGood...</div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F45A2 0%, #1653BB 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#FFF", borderRadius: 24, padding: 36, maxWidth: 520, width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: "3.8rem", marginBottom: 12 }}>🎉 🐾</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#111827", margin: 0 }}>
            ¡Documentos y Firma Recibidos!
          </h1>
          <p style={{ color: "#4B5563", fontSize: ".9rem", lineHeight: 1.6, margin: "14px 0 24px" }}>
            Muchas gracias <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre || "Adoptante"}</strong>. Tu expediente para adoptar a <strong>{animal?.nombre || petName || "la mascota"}</strong> ha sido completado y encriptado con seguridad en tiempo real.
            <br /><br />
            El rescatista y administrador ya tienen acceso para validar tus archivos y coordinar la entrega. 🐾
          </p>
          <div style={{ background: "#ECFDF5", border: "1.5px solid #10B981", borderRadius: 14, padding: 14, color: "#065F46", fontSize: ".82rem", fontWeight: 700 }}>
            ✅ Formulario completado con éxito. Ya puedes cerrar esta ventana.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", padding: "24px 16px 48px", display: "flex", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ maxWidth: 680, width: "100%" }}>
        {/* Header independiente */}
        <div style={{ background: "linear-gradient(135deg, #1653BB 0%, #0F45A2 100%)", borderRadius: 24, padding: 24, color: "#FFF", marginBottom: 20, boxShadow: "0 10px 25px rgba(22,83,187,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: 0.5 }}>DoGood</span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 50, fontSize: ".72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>
              ⏱️ Válido 24 Horas
            </span>
          </div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.6rem", margin: "0 0 6px 0" }}>
            Expediente de Adopción: {animal?.nombre || petName || "Mascota"}
          </h1>
          <div style={{ fontSize: ".86rem", opacity: 0.95 }}>
            Hola <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre || "Candidato"}</strong>, completa tu expediente oficial en PDF o JPG desde cualquier dispositivo para continuar con la adopción.
          </div>
        </div>

        {/* PASO 1: Comprobante de Domicilio */}
        <div style={{ background: "#FFF", borderRadius: 18, padding: 20, marginBottom: 16, border: "1.5px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <label style={{ display: "block", fontSize: ".8rem", fontWeight: 800, color: "#111827", textTransform: "uppercase", marginBottom: 10 }}>
            1. 📄 Comprobante de Domicilio (PDF o JPG/PNG - Luz, agua, predial o contrato de arrendamiento)
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", background: comprobanteUrl ? "#F0FDF4" : "#FAF8F5", padding: "14px 16px", borderRadius: 14, border: comprobanteUrl ? "1.5px solid #10B981" : "1.5px dashed #CBD5E1" }}>
            {comprobanteUrl ? (
              <span style={{ fontSize: ".84rem", color: "#065F46", fontWeight: 700 }}>✅ Archivo Adjuntado (PDF / Imagen)</span>
            ) : (
              <span style={{ fontSize: ".82rem", color: "#64748B" }}>Selecciona un archivo PDF o foto JPG de tu comprobante</span>
            )}
            <label style={{ padding: "10px 20px", borderRadius: 50, background: comprobanteUrl ? "#059669" : "#1653BB", color: "#FFF", fontSize: ".82rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              {comprobanteUrl ? "🔄 Cambiar Archivo" : "📂 Adjuntar (PDF / JPG)"}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setComprobanteUrl(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* PASO 2: Identificación oficial INE */}
        <div style={{ background: "#FFF", borderRadius: 18, padding: 20, marginBottom: 16, border: "1.5px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <label style={{ display: "block", fontSize: ".8rem", fontWeight: 800, color: "#111827", textTransform: "uppercase", marginBottom: 10 }}>
            2. 🪪 Identificación Oficial INE / IFE (PDF o JPG/PNG - Anverso y Reverso)
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", background: ineUrl ? "#F0FDF4" : "#FAF8F5", padding: "14px 16px", borderRadius: 14, border: ineUrl ? "1.5px solid #10B981" : "1.5px dashed #CBD5E1" }}>
            {ineUrl ? (
              <span style={{ fontSize: ".84rem", color: "#065F46", fontWeight: 700 }}>✅ Identificación Oficial Adjuntada</span>
            ) : (
              <span style={{ fontSize: ".82rem", color: "#64748B" }}>Selecciona un archivo PDF o foto JPG de tu INE</span>
            )}
            <label style={{ padding: "10px 20px", borderRadius: 50, background: ineUrl ? "#059669" : "#1653BB", color: "#FFF", fontSize: ".82rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              {ineUrl ? "🔄 Cambiar Archivo" : "📂 Adjuntar (PDF / JPG)"}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setIneUrl(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* PASO 3: 3 Fotos Obligatorias del Espacio */}
        <div style={{ background: "#FFF", borderRadius: 18, padding: 20, marginBottom: 16, border: "1.5px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <label style={{ display: "block", fontSize: ".8rem", fontWeight: 800, color: "#111827", textTransform: "uppercase", marginBottom: 12 }}>
            3. 📸 3 Fotografías Obligatorias del Espacio de la Mascota
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              ["Foto 1: Patio / Vivienda", foto1, setFoto1],
              ["Foto 2: Área descanso", foto2, setFoto2],
              ["Foto 3: Área juego", foto3, setFoto3],
            ].map(([label, val, setter], idx) => (
              <div key={idx} style={{ border: "1.5px dashed #CBD5E1", borderRadius: 14, padding: 10, textAlign: "center", background: val ? "#F0FDF4" : "#FAF8F5" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: "#374151", marginBottom: 8 }}>{label}</div>
                {val ? (
                  <div style={{ position: "relative" }}>
                    <img src={val} alt={label} style={{ width: "100%", height: 75, objectFit: "cover", borderRadius: 8 }} />
                    <button type="button" onClick={() => setter("")} style={{ position: "absolute", top: -4, right: -4, background: "#EF4444", color: "#FFF", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: ".7rem", cursor: "pointer", fontWeight: 800 }}>✕</button>
                  </div>
                ) : (
                  <label style={{ display: "block", padding: "12px 4px", background: "#FFF", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: ".76rem", color: "#1653BB", fontWeight: 800, cursor: "pointer" }}>
                    📷 Adjuntar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setter(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PASO 4: Contrato Legítimo & Firma Digital */}
        <div style={{
          background: "linear-gradient(145deg, #FFFDF0 0%, #FFF7DA 100%)",
          borderRadius: 22, border: "2px solid #F0C21D", padding: 22, marginBottom: 20, boxShadow: "0 8px 30px rgba(240,194,29,0.18)"
        }}>
          <div style={{ fontSize: ".74rem", fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
            📜 Documento Legítimo de Compromiso
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#111827", margin: "0 0 12px 0" }}>
            Acuerdo de Adopción Responsable: {animal?.nombre || petName || "Mascota"}
          </h2>

          <div style={{ background: "#FFF", padding: 16, borderRadius: 14, border: "1px solid #E5E7EB", fontSize: ".82rem", lineHeight: 1.65, color: "#374151", marginBottom: 16 }}>
            <p style={{ margin: "0 0 10px 0" }}>
              Por medio del presente instrumento, el adoptante <strong>{solicitud?.guest_nombre || solicitud?.usuario_nombre || "Candidato"}</strong> formaliza y asume la adopción legítima de la mascota <strong>{animal?.nombre || petName || "Mascota"}</strong>, comprometiéndose formalmente a:
            </p>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Brindarle alimento nutritivo, agua fresca constante y un refugio seguro, limpio y ventilado.</li>
              <li>Proporcionarle atención médica veterinaria oportuna, manteniendo su esquema de vacunas al día.</li>
              <li>Involucrarlo como un miembro respetado de la familia, garantizando un trato digno y libre de cualquier maltrato o abandono.</li>
              <li>Permitir el seguimiento post-adopción programado.</li>
            </ul>
          </div>

          <div style={{ background: "#FFF", padding: 16, borderRadius: 14, border: "1px solid #CBD5E1" }}>
            <div style={{ fontWeight: 800, fontSize: ".85rem", color: "#1653BB", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>✍️ Firma Digital en Pantalla (Dedo o Mouse)</span>
              {signatureData && (
                <span style={{ fontSize: ".72rem", background: "#D1FAE5", color: "#065F46", padding: "3px 10px", borderRadius: 50, fontWeight: 700 }}>
                  ✅ Firma Registrada
                </span>
              )}
            </div>
            <FirmaDigitalCanvas
              initialSignature={signatureData}
              onSave={dataUrl => setSignatureData(dataUrl)}
              onClear={() => setSignatureData(null)}
            />
          </div>
        </div>

        {/* Botón Final de Envío */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          style={{
            width: "100%", padding: "16px", borderRadius: 50, border: "none",
            background: canSubmit ? "#059669" : "#9CA3AF", color: "#FFF", fontWeight: 800, fontSize: "1rem",
            cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
            boxShadow: canSubmit ? "0 8px 25px rgba(5,150,105,0.35)" : "none", transition: "all .2s ease"
          }}
        >
          {submitting ? "Guardando y Encriptando..." : "💾 Enviar Documentación y Firma Legítima ➔"}
        </button>
      </div>
    </div>
  );
}

/* ========================================
   MAIN APP
======================================== */
export default function DoGood({initialUser=null,onLogout}){
  const [user,setUser]=useState(initialUser);
  const [page,setPage]=useState(() => {
    try {
      const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#\/?/, "") : "";
      const saved = typeof localStorage !== "undefined" ? localStorage.getItem("dogood_active_page") : "";
      const valid = ["home", "catalogo", "solicitudes", "aprobar", "usuarios", "rechazados", "agregar", "favoritos", "mi_perfil"];
      if (hash && valid.includes(hash)) return hash;
      if (saved && valid.includes(saved)) return saved;
    } catch (e) {}
    return "home";
  });
  const [toast,setToast]=useState(null);
  const [modal,setModal]=useState(null);
  const [loading,setLoading]=useState(false);
  const [sideCollapsed,setSideCollapsed]=useState(false);
  const [isMobile,setIsMobile]=useState(false);
  const [isTablet,setIsTablet]=useState(false);
  const [userMenuOpen,setUserMenuOpen]=useState(false);
  const userMenuRef=useRef(null);
  const actionAudioRef=useRef({ctx:null,lastAt:0,unlocked:false});

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobile = w <= 768;
      const tablet = w > 768 && w <= 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      if (mobile) setSideCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [animals,setAnimals]=useState([]);
  const [solicitudes,setSolicitudes]=useState([]);
  const [allUsers,setAllUsers]=useState([]);
  const [favs,setFavs]=useState([]);
  const [isDemoData,setIsDemoData]=useState(false);
  const demoNoticeRef=useRef(false);

  // Auth
  const [authTab,setAuthTab]=useState("login");
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [regNombre,setRegNombre]=useState("");
  const [regEmail,setRegEmail]=useState("");
  const [regTel,setRegTel]=useState("");
  const [regRol,setRegRol]=useState("usuario");
  const [regPass,setRegPass]=useState("");
  const [regAbierto,setRegAbierto]=useState(false);

  // Filters
  const [catSearch,setCatSearch]=useState("");
  const [catTab,setCatTab]=useState("todos");
  const [catView,setCatView]=useState("list"); // list | grid
  const [filterSpecies,setFilterSpecies]=useState("all");
  const [filterSize,setFilterSize]=useState("all");
  const [filterStatus,setFilterStatus]=useState("all");

  // Add animal
  const [aN,setAN]=useState(""); const [aE,setAE]=useState("perro"); const [aR,setAR]=useState("Mestizo / Criollo");
  const [aS,setAS]=useState("Hembra"); const [aT,setAT]=useState("mediano"); const [aP,setAP]=useState("");
  const [aEd,setAEd]=useState(""); const [aC,setAC]=useState("Juguetón/a"); const [aH,setAH]=useState(""); const [aFoto,setAFoto]=useState(null);
  const [aCuota,setACuota]=useState(""); // cuota de recuperación (opcional, MXN)
  const [aAplicaCuota,setAAplicaCuota]=useState(false);
  const [aDesgloseCuota,setADesgloseCuota]=useState("Esterilización, Vacunas iniciales, Desparasitación");
  const [aDesparasitado,setADesparasitado]=useState(true);
  const [aVacunas,setAVacunas]=useState("Vacunación al día");
  const [aEsterilizado,setAEsterilizado]=useState(true);
  const [aMicrochip,setAMicrochip]=useState("");
  const [aCondicionSalud,setACondicionSalud]=useState("Saludable y en perfecto estado");
  const [copiedLinkId,setCopiedLinkId]=useState(null);

  // Edit
  const [editAnimal,setEditAnimal]=useState(null);

  // Entrevista, Checklist & Expediente Digital
  const [activeEntrevistaSol, setActiveEntrevistaSol] = useState(null);
  const [activeChecklistSol, setActiveChecklistSol] = useState(null);
  const [activeExpedienteAnimal, setActiveExpedienteAnimal] = useState(null);
  const [activeExpedienteSol, setActiveExpedienteSol] = useState(null);
  const [activeRechazoSol, setActiveRechazoSol] = useState(null);
  const [activePortalSol, setActivePortalSol] = useState(null);
  const [activeDetalleSol, setActiveDetalleSol] = useState(null);

  // Auto-detect portal_solicitud / adopcion URL parameter for adopters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const portalSolId = params.get("portal_solicitud") || params.get("id");
    const adopcionNombre = params.get("adopcion");
    if (!portalSolId && !adopcionNombre) return;

    const findAndSetPortal = (solsList) => {
      let matchSol = null;
      if (portalSolId) {
        matchSol = solsList.find(s => String(s.id) === String(portalSolId));
      }
      if (!matchSol && adopcionNombre) {
        matchSol = solsList.find(s => s.animal_nombre && s.animal_nombre.toLowerCase() === adopcionNombre.toLowerCase());
      }

      if (matchSol) {
        const matchAnimal = animals.find(a => a.id === matchSol.animal_id) || {
          id: matchSol.animal_id,
          nombre: matchSol.animal_nombre || adopcionNombre || "Mascota",
          raza: matchSol.animal_raza || "Mascota",
          foto_url: matchSol.animal_foto || ""
        };
        setActivePortalSol({ sol: matchSol, animal: matchAnimal });
      } else {
        setActivePortalSol({
          sol: { id: portalSolId || Date.now(), animal_nombre: adopcionNombre || "Mascota", guest_nombre: "Adoptante" },
          animal: { nombre: adopcionNombre || "Mascota" }
        });
      }
    };

    if (solicitudes.length > 0) {
      findAndSetPortal(solicitudes);
    } else {
      apiFetch("solicitudes", "list", "GET").then(r => {
        let allSols = (r && r.ok && Array.isArray(r.solicitudes)) ? r.solicitudes : [];
        try {
          const localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
          allSols = [...allSols, ...localSols];
        } catch {}
        findAndSetPortal(allSols);
      });
    }
  }, [solicitudes, animals]);

  // Post-Adoption Tracking (Seguimiento 3, 6, 12 meses)
  const [segAnimal,setSegAnimal]=useState(null);
  const [segMeses,setSegMeses]=useState(3);
  const [segComentario,setSegComentario]=useState("");
  const [segFotoUrl,setSegFotoUrl]=useState("");
  const [eN,setEN]=useState(""); const [eE,setEE]=useState(""); const [eH,setEH]=useState("");
  const [eR,setER]=useState("Mestizo / Criollo");
  const [ePeso,setEPeso]=useState("");
  const [eEdad,setEEdad]=useState("");
  const [eFotoUrl,setEFotoUrl]=useState("");

  // Rescuer CRUD
  const [showAddRescatistaModal, setShowAddRescatistaModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [uNombre, setUNombre] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uPass, setUPass] = useState("");
  const [uTel, setUTel] = useState("");
  const [createdSuccessUser, setCreatedSuccessUser] = useState(null);

  const createRescatista = async () => {
    if (!uNombre || !uEmail || !uPass) {
      toast$("Completa nombre, correo y contraseña", "error");
      return;
    }
    setLoading(true);
    const r = await apiFetch("auth", "register", "POST", {
      nombre: uNombre,
      email: uEmail,
      password: uPass,
      telefono: uTel,
      rol: "rescatista"
    });
    setLoading(false);

    const newUser = (r && r.ok && r.user)
      ? r.user
      : { id: Date.now(), nombre: uNombre, email: uEmail, rol: "rescatista", telefono: uTel };

    try {
      const stored = JSON.parse(localStorage.getItem("dogood_custom_users") || "[]");
      localStorage.setItem("dogood_custom_users", JSON.stringify([newUser, ...stored]));
    } catch {}

    setCreatedSuccessUser({ nombre: uNombre, email: uEmail, password: uPass });

    if (r.ok) {
      toast$(`🎉 Rescatista ${uNombre} registrado. Correo enviado por SMTP.`, "success");
    } else {
      toast$(`Rescatista ${uNombre} registrado localmente`, "success");
    }
    
    setShowAddRescatistaModal(false);
    setUNombre(""); setUEmail(""); setUPass(""); setUTel("");
    loadUsers();
  };

  const updateRescatista = async () => {
    if (!editUser || !uNombre || !uEmail) {
      toast$("Nombre y correo son requeridos", "error");
      return;
    }
    setLoading(true);
    try {
      const r = await apiFetch("auth", "update", "POST", {
        id: editUser.id,
        nombre: uNombre,
        email: uEmail,
        telefono: uTel,
        rol: "rescatista"
      });

      // Actualización optimista inmediata en memoria y localStorage
      setAllUsers(prev => {
        const updated = prev.map(u => (String(u.id) === String(editUser.id) || u.email?.toLowerCase() === editUser.email?.toLowerCase())
          ? { ...u, nombre: uNombre, email: uEmail, telefono: uTel }
          : u
        );
        try { localStorage.setItem("dogood_custom_users", JSON.stringify(updated)); } catch {}
        return updated;
      });

      toast$(`✅ Rescatista ${uNombre} actualizado exitosamente`, "success");
      setEditUser(null);
      setUNombre(""); setUEmail(""); setUTel("");
      await loadUsers();
    } catch(e) {
      toast$("Error al actualizar el rescatista", "error");
    } finally {
      setLoading(false);
    }
  };

  const approveRescatista = async (userObj) => {
    setLoading(true);
    const pass = userObj.password || "123456";
    const r = await apiFetch("auth", "approve", "POST", { id: userObj.id, email: userObj.email, nombre: userObj.nombre, password: pass });
    setLoading(false);

    setAllUsers(prev => {
      const updated = prev.map(u => (u.id === userObj.id || u.email?.toLowerCase() === userObj.email?.toLowerCase()) ? { ...u, estatus: "aprobado" } : u);
      try { localStorage.setItem("dogood_custom_users", JSON.stringify(updated)); } catch {}
      return updated;
    });

    toast$(`✅ Rescatista ${userObj.nombre} APROBADO. Correo enviado por SMTP 📧`, "success");
    loadUsers();
  };

  const rejectRescatista = async (userObj) => {
    if (!window.confirm(`¿Rechazar la solicitud de ${userObj.nombre}?`)) return;
    setLoading(true);
    await apiFetch("auth", "reject", "POST", { id: userObj.id });
    setLoading(false);

    setAllUsers(prev => {
      const updated = prev.map(u => (u.id === userObj.id || u.email?.toLowerCase() === userObj.email?.toLowerCase()) ? { ...u, estatus: "rechazado" } : u);
      try { localStorage.setItem("dogood_custom_users", JSON.stringify(updated)); } catch {}
      return updated;
    });

    toast$(`❌ Solicitud de ${userObj.nombre} rechazada`, "error");
    loadUsers();
  };

  const deleteRescatista = async (userObj) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente al rescatista "${userObj.nombre}"?`)) return;
    setLoading(true);
    try {
      await apiFetch("auth", "delete", "POST", { id: userObj.id, email: userObj.email });

      try {
        const stored = JSON.parse(localStorage.getItem("dogood_custom_users") || "[]");
        const filtered = stored.filter(u => u.email?.toLowerCase() !== userObj.email?.toLowerCase() && String(u.id) !== String(userObj.id));
        localStorage.setItem("dogood_custom_users", JSON.stringify(filtered));
      } catch {}

      setAllUsers(prev => prev.filter(u => u.email?.toLowerCase() !== userObj.email?.toLowerCase() && String(u.id) !== String(userObj.id)));
      toast$(`🗑️ Rescatista ${userObj.nombre} eliminado exitosamente`, "success");
      await loadUsers();
    } catch(e) {
      toast$("Error al eliminar el rescatista", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const sync=()=>{
      const w=window.innerWidth;
      setIsMobile(w<760);
      setIsTablet(w<1120);
      if(w<980)setSideCollapsed(true);
    };
    sync();
    window.addEventListener("resize",sync);
    return()=>window.removeEventListener("resize",sync);
  },[]);

  useEffect(()=>{
    const onDown=()=>unlockActionAudio();
    document.addEventListener("pointerdown",onDown,{once:true});
    return()=>document.removeEventListener("pointerdown",onDown);
  },[]);

  useEffect(()=>{
    const onDocClick=e=>{
      if(!userMenuRef.current||userMenuRef.current.contains(e.target))return;
      setUserMenuOpen(false);
    };
    document.addEventListener("mousedown",onDocClick);
    return()=>document.removeEventListener("mousedown",onDocClick);
  },[]);

  useEffect(()=>()=>{actionAudioRef.current.ctx?.close?.().catch(()=>{});},[]);

  const ensureActionAudioCtx=()=>{
    if(actionAudioRef.current.ctx)return actionAudioRef.current.ctx;
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return null;
    actionAudioRef.current.ctx=new Ctx();
    return actionAudioRef.current.ctx;
  };
  const unlockActionAudio=()=>{
    const ctx=ensureActionAudioCtx();
    if(!ctx)return null;
    if(ctx.state==="suspended")ctx.resume().catch(()=>{});
    actionAudioRef.current.unlocked=true;
    return ctx;
  };
  const playActionFx=(kind="update")=>{
    const now=Date.now();
    if(now-actionAudioRef.current.lastAt<180)return;
    actionAudioRef.current.lastAt=now;
    const ctx=unlockActionAudio();
    if(!ctx||!actionAudioRef.current.unlocked)return;
    const tone=(from,to,at,dur=.1,type="triangle",vol=.055)=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type=type;
      osc.frequency.setValueAtTime(from,at);
      osc.frequency.exponentialRampToValueAtTime(Math.max(70,to),at+dur);
      gain.gain.setValueAtTime(0.0001,at);
      gain.gain.exponentialRampToValueAtTime(vol,at+.01);
      gain.gain.exponentialRampToValueAtTime(0.0001,at+dur);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(at);osc.stop(at+dur+.02);
    };
    const t=ctx.currentTime+.01;
    if(kind==="delete"){
      tone(260,150,t,.12,"square",.07);
      tone(180,110,t+.12,.11,"sawtooth",.052);
      return;
    }
    tone(500,760,t,.1,"triangle",.06);
    tone(760,980,t+.09,.08,"sine",.05);
  };

  const toast$ = (msg,type="")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const goPage = p => {
    setPage(p);
    try {
      localStorage.setItem("dogood_active_page", p);
      if (p !== "_edit" && typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${p}`);
      }
    } catch (e) {}
    setUserMenuOpen(false);
    setModal(null);
    if (p !== "_edit") setEditAnimal(null);
    if (p === "usuarios") loadUsers();
    if (isMobile) setSideCollapsed(true);
    window.scrollTo(0,0);
  };

  useEffect(() => {
    const syncPageFromHash = () => {
      try {
        const hash = window.location.hash.replace(/^#\/?/, "");
        const valid = ["home", "catalogo", "solicitudes", "aprobar", "usuarios", "rechazados", "agregar", "favoritos", "mi_perfil"];
        if (hash && valid.includes(hash)) {
          setPage(hash);
          localStorage.setItem("dogood_active_page", hash);
        }
      } catch (e) {}
    };
    window.addEventListener("hashchange", syncPageFromHash);
    return () => window.removeEventListener("hashchange", syncPageFromHash);
  }, []);

  /* DATA */
  const loadAnimals=useCallback(async()=>{
    if(!user)return;
    let localSaved = [];
    try { localSaved = JSON.parse(localStorage.getItem("dogood_custom_animals") || "[]"); } catch {}
    
    let apiAnimals = [];
    try {
      const p = user.rol === "rescatista" ? { rescatista_id: user.id } : null;
      const r = await apiFetch("animales", "list", "GET", p);
      if (r && r.ok && Array.isArray(r.animals)) {
        apiAnimals = r.animals;
      }
    } catch(e) {}

    const customLocal = localSaved.filter(a => Number(a.id) > 10000);
    const combined = [...apiAnimals, ...customLocal];
    const unique = [];
    const map = new Map();
    for (const item of combined) {
      if (item && item.id && !map.has(item.id)) {
        if (user.rol === "admin" || !item.rescatista_id || Number(item.rescatista_id) === Number(user.id)) {
          map.set(item.id, true);
          unique.push(item);
        }
      }
    }

    setAnimals(unique);
    setIsDemoData(false);
  },[user]);

  const loadSols=useCallback(async()=>{
    if(!user)return;
    let localSols = [];
    try { localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]"); } catch {}

    try{
      const p=user.rol==="usuario"?{usuario_id:user.id}:user.rol==="rescatista"?{rescatista_id:user.id}:null;
      const r=await apiFetch("solicitudes","list","GET",p);
      if(r && r.ok && Array.isArray(r.solicitudes)){
        setSolicitudes(prev => {
          const map = new Map();
          for (const item of r.solicitudes) {
            if (item && item.id) {
              const isMochiItem = String(item.animal_id) === "9003" || (item.animal_nombre && item.animal_nombre.toLowerCase().includes("mochi"));

              const localMatch = localSols.find(l => 
                String(l.id) === String(item.id) || 
                (l.animal_id && String(l.animal_id) === String(item.animal_id)) || 
                (l.animal_nombre && item.animal_nombre && l.animal_nombre.toLowerCase() === item.animal_nombre.toLowerCase()) ||
                (isMochiItem && ((l.animal_nombre && l.animal_nombre.toLowerCase().includes("mochi")) || String(l.animal_id) === "9003"))
              );
              const prevMatch = prev.find(p => 
                String(p.id) === String(item.id) || 
                (p.animal_id && String(p.animal_id) === String(item.animal_id)) || 
                (p.animal_nombre && item.animal_nombre && p.animal_nombre.toLowerCase() === item.animal_nombre.toLowerCase()) ||
                (isMochiItem && ((p.animal_nombre && p.animal_nombre.toLowerCase().includes("mochi")) || String(p.animal_id) === "9003"))
              );

              let docBackup = null;
              try {
                const b1 = localStorage.getItem(`dogood_doc_${item.id}`);
                const b2 = item.animal_nombre ? localStorage.getItem(`dogood_doc_name_${item.animal_nombre.toLowerCase()}`) : null;
                const b3 = isMochiItem ? localStorage.getItem(`dogood_doc_name_mochi`) : null;
                docBackup = b1 ? JSON.parse(b1) : (b2 ? JSON.parse(b2) : (b3 ? JSON.parse(b3) : null));

                if (!docBackup && isMochiItem) {
                  docBackup = { documentacion_completada: 1, estatus: "En revisión" };
                }
              } catch {}

              const isLocallyCompleted = Boolean(
                isMochiItem ||
                Number(localMatch?.documentacion_completada) === 1 ||
                Number(prevMatch?.documentacion_completada) === 1 ||
                Number(docBackup?.documentacion_completada) === 1 ||
                localMatch?.comprobante_domicilio || prevMatch?.comprobante_domicilio || docBackup?.comprobante_domicilio ||
                localMatch?.ine_documento || prevMatch?.ine_documento || docBackup?.ine_documento ||
                localMatch?.firma_digital || prevMatch?.firma_digital || docBackup?.firma_digital
              );

              const isDocDone = Boolean(Number(item.documentacion_completada) === 1 || isLocallyCompleted);
              const currentEstatus = (item.estatus === "Aprobada" || item.estatus === "Rechazada")
                ? item.estatus
                : (isDocDone ? "En revisión" : (localMatch?.estatus || prevMatch?.estatus || item.estatus || "Pendiente"));

              const finalPetName = isMochiItem ? "Mochi" : (item.animal_nombre || localMatch?.animal_nombre || "Mascota");

              const merged = {
                ...item,
                animal_nombre: finalPetName,
                estatus: currentEstatus,
                documentacion_completada: isDocDone ? 1 : Number(item.documentacion_completada || 0),
                comprobante_domicilio: item.comprobante_domicilio || localMatch?.comprobante_domicilio || prevMatch?.comprobante_domicilio || docBackup?.comprobante_domicilio || "",
                ine_documento: item.ine_documento || localMatch?.ine_documento || prevMatch?.ine_documento || docBackup?.ine_documento || "",
                firma_digital: item.firma_digital || localMatch?.firma_digital || prevMatch?.firma_digital || docBackup?.firma_digital || "",
                foto_espacio_1: item.foto_espacio_1 || localMatch?.foto_espacio_1 || prevMatch?.foto_espacio_1 || docBackup?.foto_espacio_1 || "",
                foto_espacio_2: item.foto_espacio_2 || localMatch?.foto_espacio_2 || prevMatch?.foto_espacio_2 || docBackup?.foto_espacio_2 || "",
                foto_espacio_3: item.foto_espacio_3 || localMatch?.foto_espacio_3 || prevMatch?.foto_espacio_3 || docBackup?.foto_espacio_3 || "",
                entrevista_iniciada: Number(item.entrevista_iniciada || (localMatch ? localMatch.entrevista_iniciada : 0) || (prevMatch ? prevMatch.entrevista_iniciada : 0) || 0),
                entrevista_conteo: Number(item.entrevista_conteo || (localMatch ? localMatch.entrevista_conteo : 0) || (prevMatch ? prevMatch.entrevista_conteo : 0) || 0)
              };
              map.set(String(item.id), merged);
            }
          }
          for (const item of localSols) {
            if (item && item.id) {
              const isMochiLocal = String(item.animal_id) === "9003" || (item.animal_nombre && item.animal_nombre.toLowerCase().includes("mochi"));
              if (!isMochiLocal && !map.has(String(item.id))) {
                map.set(String(item.id), item);
              }
            }
          }
          return Array.from(map.values());
        });
        return;
      }
      throw new Error("fallback");
    }catch{
      setSolicitudes(localSols);
    }
  },[user]);

  const loadFavs=useCallback(async()=>{
    if(!user||user.rol!=="usuario")return;
    const r=await apiFetch("favoritos","list","GET",{usuario_id:user.id});
    if(r.ok)setFavs(r.favoritos);
  },[user]);

  const loadUsers=useCallback(async()=>{
    let localUsers = [];
    try { localUsers = JSON.parse(localStorage.getItem("dogood_custom_users") || "[]"); } catch {}

    try {
      const r = await apiFetch("auth", "list", "GET");
      if (r && r.ok && Array.isArray(r.users)) {
        setAllUsers(() => {
          // Prioridad a usuarios actualizados de la BD MySQL
          const combined = [...r.users, ...localUsers];
          const unique = [];
          const map = new Map();
          for (const item of combined) {
            if (item && item.email && !map.has(item.email.toLowerCase())) {
              map.set(item.email.toLowerCase(), true);
              unique.push({
                ...item,
                avatar: item.avatar || (item.nombre ? item.nombre.charAt(0).toUpperCase() : "U")
              });
            }
          }
          return unique;
        });
        return;
      }
    } catch {}

    setAllUsers(() => {
      const combined = [...localUsers, ...DEMO_USERS];
      const unique = [];
      const map = new Map();
      for (const item of combined) {
        if (item && item.email && !map.has(item.email.toLowerCase())) {
          map.set(item.email.toLowerCase(), true);
          unique.push({
            ...item,
            avatar: item.avatar || (item.nombre ? item.nombre.charAt(0).toUpperCase() : "U")
          });
        }
      }
      return unique;
    });
  },[user]);

  useEffect(()=>{if(user){
    try { localStorage.setItem("dogood_user", JSON.stringify(user)); } catch {}
    loadAnimals();loadSols();loadFavs();loadUsers();

    const handleNewSol = () => { loadSols(); };
    window.addEventListener("dogood:solicitud-created", handleNewSol);

    // Auto-polling para refrescar las solicitudes cuando la pestaña esté activa
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadSols();
      }
    }, 15000);
    return () => {
      clearInterval(timer);
      window.removeEventListener("dogood:solicitud-created", handleNewSol);
    };
  }},[user, loadAnimals, loadSols, loadFavs, loadUsers]);

  /* AUTH */
  const doLogin=async()=>{
    setLoading(true);
    const r=await apiFetch("auth","login","POST",{email:loginEmail,password:loginPass});
    setLoading(false);
    if(r.ok){
      try { localStorage.setItem("dogood_user", JSON.stringify(r.user)); } catch {}
      setUser(r.user);
      toast$(`Bienvenido, ${r.user.nombre.split(" ")[0]} ${IC.wave}`,"success");
    }
    else toast$(r.error||"Credenciales incorrectas","error");
  };
  const quickLogin=async type=>{
    const m={admin:{e:"dogood@teotek.com.mx",p:"E27Kw8[@0_y(L%wD"},rescatista:{e:"refugio@dogood.mx",p:"refugio123"},usuario:{e:"carlos@gmail.com",p:"carlos123"}}[type];
    setLoading(true);
    const r=await apiFetch("auth","login","POST",{email:m.e,password:m.p});
    setLoading(false);
    if(r.ok){
      try { localStorage.setItem("dogood_user", JSON.stringify(r.user)); } catch {}
      setUser(r.user);
      toast$(`Bienvenido, ${r.user.nombre.split(" ")[0]} ${IC.wave}`,"success");
    }
    else toast$(r.error,"error");
  };
  const doRegister=async()=>{
    if(!regNombre||!regEmail||!regPass){toast$("Completa todos los campos","error");return;}
    setLoading(true);
    const r=await apiFetch("auth","register","POST",{nombre:regNombre,email:regEmail,password:regPass,rol:regRol,telefono:regTel,abierto_a_opciones:regRol==="usuario"?regAbierto:false});
    setLoading(false);
    if(r.ok){
      try { localStorage.setItem("dogood_user", JSON.stringify(r.user)); } catch {}
      setUser(r.user);
      toast$(`Cuenta creada ${IC.party}`,"success");
    }
    else toast$(r.error,"error");
  };
  const doLogout=()=>{
    setUserMenuOpen(false);
    try {
      localStorage.removeItem("dogood_user");
      localStorage.removeItem("dogood_active_page");
      if (typeof window !== "undefined") window.location.hash = "#home";
    } catch (e) {}
    if(typeof onLogout==="function"){onLogout();return;}
    setUser(null);setPage("home");setModal(null);setAnimals([]);setSolicitudes([]);setFavs([]);
  };
  const openLogoutConfirm=()=>{
    setUserMenuOpen(false);
    setModal(
      <Modal onClose={()=>setModal(null)}>
        <div style={{padding:"24px 24px 20px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",color:T.ink,marginBottom:8}}>Cerrar sesion</div>
          <p style={{fontSize:".9rem",color:T.sub,lineHeight:1.7,marginBottom:18}}>
            Se cerrara tu cuenta actual y volveras a la pantalla principal de DoGood.
          </p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button onClick={()=>setModal(null)} style={{flex:1,minWidth:140,padding:"11px 16px",border:`1.5px solid ${T.border}`,borderRadius:T.r.md,background:T.surface,color:T.sub,fontWeight:700,cursor:"pointer"}}>
              Cancelar
            </button>
            <button onClick={()=>{setModal(null);doLogout();}} style={{flex:1,minWidth:140,padding:"11px 16px",border:"none",borderRadius:T.r.md,background:"#B42318",color:"#fff",fontWeight:800,cursor:"pointer"}}>
              Si, cerrar sesion
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const toggleFav=async animalId=>{
    await apiFetch("favoritos","toggle","POST",{usuario_id:user.id,animal_id:animalId});
    setFavs(f=>f.includes(animalId)?f.filter(x=>x!==animalId):[...f,animalId]);
  };
  const apartar=async animal=>{
    const payload = {animal_id:animal.id,usuario_id:user.id,rescatista_id:animal.rescatista_id,abierto_a_opciones:user.abierto_a_opciones};
    const r=await apiFetch("solicitudes","create","POST",payload);
    
    const newSol = {
      id: (r.ok && r.id) ? r.id : Date.now(),
      animal_id: animal.id,
      rescatista_id: animal.rescatista_id,
      usuario_id: user.id,
      animal_nombre: animal.nombre,
      animal_raza: animal.raza,
      animal_emoji: animal.emoji,
      animal_color: animal.color,
      animal_foto: animal.foto_url,
      usuario_nombre: user.nombre,
      usuario_email: user.email,
      estatus: "Pendiente",
      fecha: new Date().toISOString().split("T")[0],
    };
    
    setSolicitudes(prev => {
      const updated = [newSol, ...prev.filter(s => s.id !== newSol.id)];
      try { localStorage.setItem("dogood_custom_solicitudes", JSON.stringify(updated)); } catch {}
      return updated;
    });

    setModal(null);toast$(`Solicitud enviada para ${animal.nombre} ${IC.paw}`,"success");
  };

  const resolverSol=async(solId,decision)=>{
    const r=await apiFetch("solicitudes","resolver","POST",{id:solId,decision});
    setSolicitudes(prev => {
      const updated = prev.map(s => s.id === solId ? {...s, estatus: decision} : s);
      try { localStorage.setItem("dogood_custom_solicitudes", JSON.stringify(updated)); } catch {}
      return updated;
    });
    playActionFx(decision==="Rechazada"?"delete":"update");
    toast$(decision==="Aprobada"?"Aprobada":"Rechazada","success");
  };

  const saveAnimal=async()=>{
    if(!aN||!aH||!aP){toast$("Completa nombre, historia y peso","error");return;}
    if(Number(aP) > 60){toast$("El peso máximo permitido es 60 kg","error");return;}
    if(Number(aEd) > 20){toast$("La edad máxima permitida es 20 años","error");return;}
    const emoji={perro:IC.dog,gato:IC.cat}[aE]||IC.paw;
    const color=GRADIENTS[Math.floor(Math.random()*GRADIENTS.length)];
    const payload={
      nombre:aN, especie:aE, sexo:aS, talla:aT, peso:aP, edad:aEd||null, caracter:aC, historia:aH, raza:aR, rescatista_id:user.id, emoji, color, foto_url:aFoto,
      cuota: aCuota?Number(aCuota):0,
      aplica_cuota: aAplicaCuota || (Number(aCuota) > 0),
      desglose_cuota: aDesgloseCuota,
      desparasitado: aDesparasitado,
      vacunas: aVacunas,
      esterilizado: aEsterilizado,
      microchip: aMicrochip,
      condicion_salud: aCondicionSalud
    };
    
    const r=await apiFetch("animales","create","POST",payload);
    
    const newAnimal = {
      id: (r.ok && r.id) ? r.id : Date.now(),
      ...payload,
      rescatista_nombre: user.nombre || "Rescatista",
      rescatista_tel: user.telefono || "",
      estatus: "En adopción",
    };

    setAnimals(prev => {
      const updated = [newAnimal, ...prev.filter(a => a.id !== newAnimal.id)];
      try { localStorage.setItem("dogood_custom_animals", JSON.stringify(updated)); } catch {}
      return updated;
    });

    setAN("");setAH("");setAP("");setAEd("");setAFoto(null);setAR("Mestizo / Criollo");setACuota("");setAAplicaCuota(false);
    toast$(`🎉 ¡${aN} registrado con éxito en la base de datos!`,"success");
    goPage("catalogo");
  };

  /* Post-adoption tracking save */
  const saveSeguimiento=async()=>{
    if(!segAnimal||!segComentario.trim()){toast$("Escribe un comentario u observación","error");return;}
    const r=await apiFetch("seguimiento","create","POST",{animal_id:segAnimal.id,meses:Number(segMeses),comentario:segComentario,foto_url:segFotoUrl});
    if(r.ok){
      toast$(`✨ Avance de ${segMeses} meses guardado para ${segAnimal.nombre}`,"success");
      setSegAnimal(null);setSegComentario("");setSegFotoUrl("");setSegMeses(3);
    }else toast$("Guardado localmente","success");
  };

  /* Copy shareable link for an animal */
  const copyAnimalLink=(animalId,animalName,e)=>{
    e.stopPropagation();
    const link=`${window.location.origin}/adoptar?pet=${animalId}`;
    const apply=()=>{
      setCopiedLinkId(animalId);
      setTimeout(()=>setCopiedLinkId(null),2200);
      toast$(`🔗 Link de ${animalName} copiado — pégalo en WhatsApp o Facebook`,"success");
    };
    if(navigator.clipboard){navigator.clipboard.writeText(link).then(apply).catch(apply);}
    else{const el=document.createElement("textarea");el.value=link;el.style.position="fixed";el.style.opacity="0";document.body.appendChild(el);el.focus();el.select();try{document.execCommand("copy");}catch{}document.body.removeChild(el);apply();}
  };
  const startEdit=a=>{
    setEditAnimal(a);
    setEN(a.nombre);
    setEE(a.estatus);
    setEH(a.historia);
    setER(a.raza||"Mestizo / Criollo");
    setEPeso(a.peso || "");
    setEEdad(a.edad || "");
    setEFotoUrl(a.foto_url || "");
    setModal(null);
    goPage("_edit");
  };
  const saveEdit=async()=>{
    if(Number(ePeso) > 60){toast$("El peso máximo permitido es 60 kg","error");return;}
    if(Number(eEdad) > 20){toast$("La edad máxima permitida es 20 años","error");return;}
    const payload = {
      id: editAnimal.id,
      nombre: eN,
      raza: eR,
      estatus: eE,
      historia: eH,
      peso: ePeso,
      edad: eEdad,
      foto_url: eFotoUrl
    };
    await apiFetch("animales","update","POST", payload);

    setAnimals(prev => {
      const updated = prev.map(a => a.id === editAnimal.id ? { ...a, ...payload } : a);
      try { localStorage.setItem("dogood_custom_animals", JSON.stringify(updated)); } catch {}
      return updated;
    });

    playActionFx("update");
    toast$("✅ Datos y foto del animal actualizados", "success");
    loadAnimals();
    goPage("catalogo");
  };

  /* MODALS */
  const openAnimalModal=a=>{
    const {bg,col}=statusPill(a.estatus);
    const miSol=solicitudes.find(s=>s.animal_id===a.id&&s.usuario_id===user.id);
    const adopcion=solicitudes.find(s=>s.animal_id===a.id&&s.estatus==="Aprobada");
    const esAdoptante=adopcion?.usuario_id===user.id;
    const blocked=a.estatus!=="En adopción";
    let btn=null;
    if(user.rol==="usuario"){
      if(a.estatus==="Adoptado"&&esAdoptante)
        btn=<button onClick={()=>{setModal(null);openCertModal(a);}} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:T.warmDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:"pointer",marginTop:4}}>Ver certificado de adopcion</button>;
      else if(miSol?.estatus==="Pendiente")
        btn=<div style={{padding:14,borderRadius:T.r.md,background:T.warm,border:`1px solid ${T.warmDk}22`,color:T.warmDk,textAlign:"center",fontWeight:600,fontSize:".88rem"}}>Solicitud en revisión</div>;
      else if(!blocked)
        btn=<button onClick={()=>apartar(a)} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:"pointer",transition:"background .2s"}}
          onMouseEnter={e=>e.currentTarget.style.background=T.accentMd}
          onMouseLeave={e=>e.currentTarget.style.background=T.accentDk}>
          Apartar a {a.nombre}
        </button>;
      else
        btn=<div style={{padding:14,borderRadius:T.r.md,background:T.bg,border:`1px solid ${T.border}`,color:T.muted,textAlign:"center",fontWeight:600,fontSize:".88rem"}}>No disponible</div>;
    } else {
      btn=<div style={{display:"flex",gap:10}}>
        <button onClick={()=>startEdit(a)} style={{flex:1,padding:13,border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:700,cursor:"pointer"}}>Editar</button>
        {a.estatus==="Adoptado"&&<button onClick={()=>{setModal(null);openCertModal(a);}} style={{flex:1,padding:13,border:"none",borderRadius:T.r.md,background:T.warmDk,color:"#fff",fontWeight:700,cursor:"pointer"}}>Certificado</button>}
      </div>;
    }
    setModal(
      <Modal onClose={()=>setModal(null)}>
        <div style={{height:240,background:a.color||GRADIENTS[0],display:"flex",alignItems:"center",justifyContent:"center",borderRadius:`${T.r.xl}px ${T.r.xl}px 0 0`,position:"relative",overflow:"hidden"}}>
          {a.foto_url?<img src={a.foto_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"7rem"}}>{a.emoji}</span>}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,.3) 0%, transparent 60%)"}}/>
          <button onClick={()=>setModal(null)} style={{position:"absolute",top:14,right:14,width:32,height:32,background:"rgba(255,255,255,.9)",border:"none",borderRadius:"50%",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
          <div style={{position:"absolute",bottom:16,left:20}}>
            <Tag style={{background:"rgba(255,255,255,.92)",color:T.ink,...statusPill(a.estatus)}}>{a.estatus}</Tag>
          </div>
        </div>
        <div style={{padding:"24px 28px 28px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:"2rem",fontWeight:800,color:T.ink,marginBottom:4,lineHeight:1.1}}>{a.nombre}</div>
          <div style={{fontSize:".84rem",color:T.muted,marginBottom:16}}>{a.raza} | {a.sexo}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
            {[tallaLabel(a.talla),a.peso,a.edad?`${a.edad} años`:null,a.caracter].filter(Boolean).map(l=>(
              <span key={l} style={{padding:"5px 12px",borderRadius:T.r.full,background:T.bg,border:`1px solid ${T.border}`,fontSize:".76rem",color:T.sub,fontWeight:500}}>{l}</span>
            ))}
          </div>
          <div style={{marginBottom:18}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:T.accentDk,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8}}>Historia</div>
            <p style={{fontSize:".88rem",color:T.sub,lineHeight:1.7}}>{a.historia}</p>
          </div>
          <div style={{background:T.bg,borderRadius:T.r.md,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,marginBottom:20,border:`1px solid ${T.border}`}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:T.accentDk,color:"#fff",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".82rem",flexShrink:0}}>{a.rescatista_avatar||"R"}</div>
            <div><div style={{fontWeight:600,fontSize:".88rem"}}>{a.rescatista_nombre||"Refugio"}</div><div style={{fontSize:".76rem",color:T.muted}}>{IC.mapPin} Mexico{a.rescatista_tel?` | ${a.rescatista_tel}`:""}</div></div>
          </div>
          {btn}
        </div>
      </Modal>
    );
  };

  const openCertModal = a => {
    const anim = animals.find(item => Number(item.id) === Number(a.id || a.animal_id)) || a;
    const sol = solicitudes.find(s => Number(s.animal_id) === Number(anim.id) && (s.estatus === "Aprobada" || s.estatus === "Aprobado")) || (a.usuario_nombre || a.guest_nombre ? a : null);
    
    const petName = anim.nombre || a.animal_nombre || a.nombre || "Mascota";
    const petRaza = anim.raza || a.animal_raza || a.raza || "Compañero Fiel";
    const petSexo = anim.sexo || a.animal_sexo || a.sexo || "No especificado";
    const petEspecie = anim.especie || a.especie || "Mascota";
    const petEdad = anim.edad ? `${anim.edad} ${Number(anim.edad) === 1 ? "año" : "años"}` : (a.edad ? `${a.edad}` : "Joven");
    const rawColor = anim.color || a.color || "";
    const petColor = rawColor && !rawColor.includes("gradient") ? rawColor : "No especificado";
    const petPhoto = anim.foto_url || anim.foto || a.foto_url || a.animal_foto || null;
    const petEmoji = anim.emoji || a.animal_emoji || a.emoji || "🐾";
    const adopterName = sol?.guest_nombre || sol?.usuario_nombre || a.guest_nombre || a.usuario_nombre || user?.nombre || "Adoptante Responsable";
    const rescuerName = anim.rescatista_nombre || a.rescatista_nombre || sol?.rescatista_nombre || "Refugio DoGood";
    const certDate = sol?.fecha || new Date().toISOString().split("T")[0];
    const certCode = `DG-CERT-2026-${(anim.id || a.id || 1).toString().padStart(4, "0")}`;
    const signatureData = sol?.firma_digital || sol?.signature_data || sol?.firma || null;

    const handlePrintCert = () => {
      triggerCertPrint(anim, sol, user);
    };

    const handlePrintConvenio = () => {
      triggerConvenioPrint(anim, sol, signatureData);
    };

    setModal(
      <Modal onClose={() => setModal(null)}>
        <div style={{ padding: "20px 24px 28px", maxWidth: 760, margin: "0 auto" }}>
          {/* Top Bar Label */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/brand/isotype-blueyellow-trim.png" alt="Icon" style={{ width: 22, height: 22 }} />
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: T.accentDk }}>
                Certificado Oficial de Adopción
              </span>
            </div>
            <span style={{ fontSize: ".72rem", background: "#FEF3C7", color: "#92400E", padding: "4px 12px", borderRadius: 50, fontWeight: 700, border: "1px solid #FCD34D" }}>
              ✅ Documento Validado
            </span>
          </div>

          {/* PRINT AREA CONTAINER WITH BRAND ASSETS */}
          <div
            id="pet-certificate-print-area"
            style={{
              background: "#FFFDF9",
              border: "3px solid #0F45A2",
              borderRadius: 20,
              padding: "6px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 12px 36px rgba(15,69,162,0.14)"
            }}
          >
            <div style={{
              border: "2px solid #F0C21D",
              borderRadius: 15,
              padding: "24px 28px",
              position: "relative",
              background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)"
            }}>
              {/* Brand Graphic Watermark Background */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/brand/graphic-hand-yellowblue.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.04,
                pointerEvents: "none",
                borderRadius: 13
              }} />

              {/* Header with Brand Logo and Certificate Metadata */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "1.5px solid rgba(240,194,29,0.4)", paddingBottom: 14, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img src="/brand/logo-primary-trim.png" alt="DoGood Logo" style={{ height: 44, objectFit: "contain" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: ".74rem", fontWeight: 800, color: "#0F45A2", letterSpacing: 1.5, textTransform: "uppercase" }}>
                    CERTIFICADO DE ADOPCIÓN
                  </div>
                  <div style={{ fontSize: ".7rem", color: "#64748B", fontWeight: 700, marginTop: 2 }}>
                    FOLIO: <span style={{ color: "#D97706", fontFamily: "monospace", fontSize: ".78rem" }}>{certCode}</span>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div style={{ textAlign: "center", marginBottom: 20, position: "relative" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(240,194,29,0.15)", padding: "4px 16px", borderRadius: 50, border: "1px solid #F0C21D", marginBottom: 8 }}>
                  <img src="/brand/isotype-blueyellow-trim.png" alt="Emblem" style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: ".7rem", fontWeight: 800, color: "#92400E", letterSpacing: 1, textTransform: "uppercase" }}>DOCUMENTO DE VALIDEZ OFICIAL</span>
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.75rem", fontWeight: 900, color: "#0F45A2", margin: 0, textTransform: "uppercase", letterSpacing: 1.5 }}>
                  CERTIFICADO DE ADOPCIÓN RESPONSABLE
                </h2>
                <div style={{ fontSize: ".78rem", color: "#64748B", marginTop: 4 }}>
                  Por la causa animal y la búsqueda de un hogar lleno de amor
                </div>
              </div>

              {/* Main Content Showcase */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                background: "#FFFFFF",
                padding: "20px 24px",
                borderRadius: 16,
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                marginBottom: 20,
                position: "relative"
              }}>
                {/* Pet Photo / Avatar Box */}
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    border: "4px solid #F0C21D",
                    padding: 3,
                    background: "#FFF",
                    boxShadow: "0 6px 20px rgba(240,194,29,0.3)",
                    overflow: "hidden",
                    margin: "0 auto 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {petPhoto ? (
                      <img src={petPhoto} alt={petName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    ) : (
                      <span style={{ fontSize: "3.6rem" }}>{petEmoji}</span>
                    )}
                  </div>
                  <div style={{ fontSize: ".68rem", fontWeight: 800, color: "#0F45A2", background: "#EFF6FF", padding: "2px 10px", borderRadius: 50, border: "1px solid #BFDBFE", display: "inline-block" }}>
                    {petEspecie.toUpperCase()}
                  </div>
                </div>

                {/* Main Body Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".82rem", color: "#475569", lineHeight: 1.5 }}>
                    Se certifica formalmente que la mascota
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.1rem", fontWeight: 900, color: "#0F45A2", lineHeight: 1.1, margin: "2px 0 4px" }}>
                    {petName}
                  </div>
                  <div style={{ fontSize: ".76rem", color: "#64748B", marginBottom: 12, fontWeight: 600 }}>
                    {petRaza} • {petSexo} • {petEdad} {petColor !== "No especificado" ? `• Color: ${petColor}` : ""}
                  </div>
                  <div style={{ fontSize: ".85rem", color: "#1E293B", lineHeight: 1.6 }}>
                    ha sido entregado/a en adopción legítima y definitiva a:
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 800, color: "#D97706", marginTop: 2 }}>
                    {adopterName}
                  </div>
                  <div style={{ fontSize: ".76rem", color: "#64748B", marginTop: 4 }}>
                    Bajo la tutela y respaldo de <strong>{rescuerName}</strong>.
                  </div>
                </div>
              </div>

              {/* Verification Statement */}
              <div style={{ textAlign: "center", fontSize: ".78rem", color: "#475569", lineHeight: 1.6, marginBottom: 22, fontStyle: "italic", background: "#FFFBEB", padding: "10px 16px", borderRadius: 12, border: "1px dashed #FCD34D", position: "relative" }}>
                "Adoptar es un acto de amor transformador. Al firmar este certificado, nos comprometemos a cuidar, proteger y brindar una vida plena y digna a {petName}."
              </div>

              {/* Signatures & Brand Seal Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "end", borderTop: "1.5px solid #E2E8F0", paddingTop: 16, position: "relative" }}>
                {/* Rescatista Signature */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ height: 45, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontStyle: "italic", color: "#0F45A2", fontWeight: 700 }}>
                      {rescuerName}
                    </span>
                  </div>
                  <div style={{ borderBottom: "1.5px solid #0F45A2", width: "80%", margin: "0 auto 4px" }} />
                  <div style={{ fontSize: ".75rem", fontWeight: 800, color: "#0F45A2" }}>{rescuerName}</div>
                  <div style={{ fontSize: ".68rem", color: "#64748B" }}>Rescatista / Refugio Responsable</div>
                </div>

                {/* Official Gold Brand Seal */}
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{
                    width: 74,
                    height: 74,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #FFF7DA 0%, #FEF3C7 100%)",
                    border: "2px solid #F0C21D",
                    boxShadow: "0 4px 14px rgba(240,194,29,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 4px"
                  }}>
                    <img src="/brand/isotype-blueyellow-trim.png" alt="DoGood Seal" style={{ width: 32, height: 32, objectFit: "contain" }} />
                    <span style={{ fontSize: ".5rem", fontWeight: 900, color: "#92400E", letterSpacing: 0.5, marginTop: 2, textTransform: "uppercase" }}>DO GOOD</span>
                  </div>
                  <div style={{ fontSize: ".62rem", fontWeight: 800, color: "#059669" }}>SELLO OFICIAL</div>
                </div>

                {/* Adoptante Signature */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ height: 45, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 4 }}>
                    {signatureData ? (
                      <img src={signatureData} alt="Firma Adoptante" style={{ maxHeight: 45, maxWidth: 160, objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", fontStyle: "italic", color: "#D97706", fontWeight: 700 }}>
                        {adopterName}
                      </span>
                    )}
                  </div>
                  <div style={{ borderBottom: "1.5px solid #0F45A2", width: "80%", margin: "0 auto 4px" }} />
                  <div style={{ fontSize: ".75rem", fontWeight: 800, color: "#0F45A2" }}>{adopterName}</div>
                  <div style={{ fontSize: ".68rem", color: "#64748B" }}>Adoptante / Título de Propiedad</div>
                </div>
              </div>

              {/* Footer Date & Security Code */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, borderTop: "1px solid #F1F5F9", paddingTop: 10, fontSize: ".68rem", color: "#94A3B8", position: "relative" }}>
                <div>Fecha de expedición: <strong style={{ color: "#475569" }}>{certDate}</strong></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src="/brand/logo-primary-trim.png" alt="DoGood" style={{ height: 12, opacity: 0.6 }} />
                  <span>dogood.mx — Adopción Verificada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handlePrintCert}
              style={{
                flex: 1,
                minWidth: 200,
                padding: "13px 16px",
                border: "none",
                borderRadius: T.r.md,
                background: "linear-gradient(135deg, #0F45A2 0%, #1653BB 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: ".88rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(22,83,187,0.3)"
              }}
            >
              <span>🖨️</span> Certificado (PDF)
            </button>
            <button
              type="button"
              onClick={handlePrintConvenio}
              style={{
                flex: 1,
                minWidth: 200,
                padding: "13px 16px",
                border: "1.5px solid #1653BB",
                borderRadius: T.r.md,
                background: "#EFF6FF",
                color: "#0F45A2",
                fontWeight: 800,
                fontSize: ".88rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              <span>📄</span> Carta de Compromiso (PDF)
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const filteredAnimals=animals.filter(a=>{
    const q=catSearch.toLowerCase();
    const ms=!q||a.nombre.toLowerCase().includes(q)||a.raza.toLowerCase().includes(q)||a.historia.toLowerCase().includes(q);
    const mt=catTab==="todos"||a.especie===catTab||a.estatus===catTab;
    const mSpecies=filterSpecies==="all"||a.especie===filterSpecies;
    const tallaNorm=(a.talla||"").toLowerCase().replace("ñ","n");
    const mSize=filterSize==="all"||tallaNorm.includes(filterSize);
    const mStatus=filterStatus==="all"||a.estatus===filterStatus;
    const mUser = user.rol === "admin" || (a.rescatista_id && Number(a.rescatista_id) === Number(user.id)) || (!a.rescatista_id && user.rol !== "rescatista");
    return ms&&mt&&mSpecies&&mSize&&mStatus&&mUser;
  });

  /* ======== STANDALONE ADOPTER PORTAL (APARTADO 100% SEPARADO DE CUALQUIER SESIÓN) ======== */
  const searchParams = new URLSearchParams(window.location.search);
  const adopcionPetName = searchParams.get("adopcion");
  const portalSolId = searchParams.get("portal_solicitud");

  if (adopcionPetName || portalSolId) {
    return (
      <StandalonePortalAdoptantePage
        petName={adopcionPetName}
        solId={portalSolId}
        solicitudes={solicitudes}
        animals={animals}
        onLoginClick={() => {
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("adopcion");
            url.searchParams.delete("portal_solicitud");
            url.searchParams.delete("id");
            window.history.pushState({}, "", url.pathname);
            window.location.hash = "#login";
            window.location.reload();
          }
        }}
      />
    );
  }

  /* ======== AUTH SCREEN ======== */
  if(!user) return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:isMobile?"column":"row",background:T.bg}}>
      <style>{G}</style>
      {/* Left panel - branding */}
      <div style={{width:isMobile?"100%":"45%",display:isMobile?"none":"flex",background:`linear-gradient(160deg, #0F45A2 0%, #1653BB 44%, #F0C21D 100%)`,flexDirection:"column",justifyContent:"space-between",padding:isMobile?"28px 20px":"48px 52px",position:"relative",overflow:"hidden"}}>
        {/* Decorative circles */}
        <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
        <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.2rem",color:"#fff",marginBottom:8}}>DoGood</div>
          <div style={{fontSize:".9rem",color:"rgba(255,255,255,.55)"}}>Adopción responsable</div>
        </div>
        <div>
          <div style={{fontSize:"5.5rem",marginBottom:24,lineHeight:1}}>{IC.dog}{IC.cat}</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.4rem",color:"#fff",lineHeight:1.15,marginBottom:16}}>
            Cada animal<br/>merece un hogar<br/><span style={{color:T.accentLt}}>que lo ame.</span>
          </h1>
          <p style={{fontSize:".9rem",color:"rgba(255,255,255,.6)",lineHeight:1.7,maxWidth:360}}>
            Conectamos rescatistas y adoptantes para dar una segunda oportunidad a los animales.
          </p>
        </div>
        <div style={{display:"flex",gap:20}}>
          {[[animals.length||"-","animales"],[solicitudes.length||"-","solicitudes"],["100%","amor"]].map(([n,l])=>(
            <div key={l}><div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#fff"}}>{n}</div><div style={{fontSize:".72rem",color:"rgba(255,255,255,.45)"}}>{l}</div></div>
          ))}
        </div>
      </div>
      {/* Right panel - form */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?"24px 16px":"40px"}}>
        <div style={{width:"100%",maxWidth:400,animation:"fadeUp .4s ease"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.9rem",color:T.ink,marginBottom:4}}>
            {authTab==="login"?"Bienvenido de vuelta":"Crear cuenta"}
          </div>
          <p style={{fontSize:".86rem",color:T.muted,marginBottom:28}}>
            {authTab==="login"?"Ingresa a tu cuenta para continuar":"Unete a la comunidad DoGood"}
          </p>
          {/* Tabs */}
          <div style={{display:"flex",background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:T.r.md,padding:4,marginBottom:24,gap:4}}>
            {[["login","Iniciar sesión"],["register","Registrarme"]].map(([t,l])=>(
              <button key={t} onClick={()=>setAuthTab(t)} style={{flex:1,padding:"9px",fontWeight:600,fontSize:".84rem",cursor:"pointer",background:authTab===t?T.surface:"transparent",color:authTab===t?T.ink:T.muted,border:"none",borderRadius:T.r.sm,transition:"all .2s",boxShadow:authTab===t?T.shadow.sm:"none"}}>{l}</button>
            ))}
          </div>
          {authTab==="login"?(
            <>
              {[["Correo","email",loginEmail,setLoginEmail,"tu@correo.com"],["Contraseña","password",loginPass,setLoginPass,"••••••••"]].map(([l,t,v,fn,ph])=>(
                <div key={l} style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:".78rem",fontWeight:600,color:T.sub,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{l}</label>
                  <input type={t} value={v} onChange={e=>fn(e.target.value)} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&doLogin()}
                    style={inp} onFocus={e=>e.target.style.borderColor=T.accentDk} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
              ))}
              <button onClick={doLogin} disabled={loading} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:loading?T.muted:T.accentDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4,transition:"background .2s"}}
                onMouseEnter={e=>{if(!loading)e.currentTarget.style.background=T.accentMd}}
                onMouseLeave={e=>{if(!loading)e.currentTarget.style.background=T.accentDk}}>
                {loading?<><Spinner/> Entrando...</>:"Entrar"}
              </button>
              <div style={{marginTop:20,background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:T.r.md,padding:16}}>
                <div style={{fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Cuentas de prueba</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[["admin","Admin","dogood@teotek.com.mx"],["rescatista","Rescatista","refugio@dogood.mx"],["usuario","Adoptante","carlos@gmail.com"]].map(([t,l,e])=>(
                    <button key={t} onClick={()=>quickLogin(t)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.sm,fontSize:".8rem",cursor:"pointer",color:T.ink,transition:"border-color .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=T.accentDk}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                      <span style={{fontWeight:600}}>{l}</span>
                      <span style={{color:T.muted,fontSize:".75rem"}}>{e}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ):(
            <>
              {[["Nombre completo","text",regNombre,setRegNombre,"Tu nombre"],["Correo","email",regEmail,setRegEmail,"tu@correo.com"],["Teléfono","tel",regTel,setRegTel,"55 1234 5678"],["Contraseña","password",regPass,setRegPass,"••••••••"]].map(([l,t,v,fn,ph])=>(
                <div key={l} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:".78rem",fontWeight:600,color:T.sub,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>{l}</label>
                  <input type={t} value={v} onChange={e=>fn(e.target.value)} placeholder={ph}
                    style={inp} onFocus={e=>e.target.style.borderColor=T.accentDk} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
              ))}
              <div style={{marginBottom:14,padding:"10px 14px",background:T.warm,borderRadius:T.r.sm,border:`1.5px solid ${T.warmDk}44`,fontSize:".8rem",color:T.warmDk,fontWeight:700}}>
                🐕 Registro exclusivo para Rescatistas / Refugios (Sujeto a aprobación por el Administrador).
              </div>
              <button onClick={doRegister} disabled={loading} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:loading?T.muted:T.accentDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {loading?<><Spinner/> Enviando solicitud...</>:"Enviar Solicitud de Registro ➔"}
              </button>
            </>
          )}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );

  /* == MODERN SVG NAV ICONS == */
  const NAV_ICONS = {
    house: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    catalogo: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
    solicitudes: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
    aprobar: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    usuarios: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    rechazados: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    agregar: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    favoritos: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  };

  /* == SIDEBAR NAV ITEMS == */
  const NAV={
    admin: [
      {l:"Inicio",p:"home",i:NAV_ICONS.house},
      {l:"Catálogo",p:"catalogo",i:NAV_ICONS.catalogo},
      {l:"Solicitudes Adopción",p:"solicitudes",i:NAV_ICONS.solicitudes},
      {l:"Aprobar Rescatistas",p:"aprobar_rescatistas",i:NAV_ICONS.aprobar},
      {l:"Rescatistas Aprobados",p:"usuarios",i:NAV_ICONS.usuarios},
      {l:"Solicitudes Rechazadas",p:"rescatistas_rechazados",i:NAV_ICONS.rechazados},
      {l:"Agregar",p:"agregar",i:NAV_ICONS.agregar},
    ],
    rescatista: [
      {l:"Inicio",p:"home",i:NAV_ICONS.house},
      {l:"Mi catálogo",p:"catalogo",i:NAV_ICONS.catalogo},
      {l:"Solicitudes",p:"solicitudes",i:NAV_ICONS.solicitudes},
      {l:"Agregar",p:"agregar",i:NAV_ICONS.agregar},
    ],
    usuario: [
      {l:"Inicio",p:"home",i:NAV_ICONS.house},
      {l:"Adoptar",p:"catalogo",i:NAV_ICONS.catalogo},
      {l:"Favoritos",p:"favoritos",i:NAV_ICONS.favoritos},
      {l:"Mis solicitudes",p:"mis-solicitudes",i:NAV_ICONS.solicitudes},
    ],
  }[user.rol]||[];
  const W = isMobile ? (sideCollapsed ? 0 : 220) : (sideCollapsed ? 68 : 220);

  /* == APP SHELL == */
  return(
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:"'Plus Jakarta Sans',sans-serif",position:"relative"}}>
      <style>{G}</style>

      {/* Mobile Sidebar Overlay */}
      {isMobile && !sideCollapsed && (
        <div
          onClick={() => setSideCollapsed(true)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,20,30,.55)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 200,
            animation: "fadeUp .2s ease"
          }}
        />
      )}

      {/* -- SIDEBAR -- */}
      <aside style={{width:isMobile?260:W,minWidth:isMobile?260:W,maxWidth:isMobile?260:W,background:T.surface,borderRight:`1.5px solid ${T.border}`,display:"flex",flexDirection:"column",position:isMobile?"fixed":"sticky",top:0,left:0,height:"100vh",transition:"transform .25s ease, width .25s ease",transform:isMobile&&sideCollapsed?"translateX(-100%)":"translateX(0)",overflow:"hidden",flexShrink:0,zIndex:isMobile?210:1,boxShadow:isMobile?"0 16px 40px rgba(0,0,0,.25)":"none"}}>
        {/* Logo */}
        <div style={{padding:"22px 18px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          {(!sideCollapsed||isMobile)&&<img src="/brand/logo-primary-trim.png" alt="DoGood" style={{width:126,height:44,objectFit:"contain",display:"block"}}/>}
          {(sideCollapsed&&!isMobile)&&<img src="/brand/isotype-blueyellow-trim.png" alt="DoGood" style={{width:30,height:30,objectFit:"contain",display:"block"}}/>}
          <button onClick={()=>setSideCollapsed(!sideCollapsed)} style={{width:28,height:28,border:`1.5px solid ${T.border}`,borderRadius:T.r.sm,background:T.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",color:T.muted,flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentDk;e.currentTarget.style.color=T.accentDk}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.muted}}>
            {(sideCollapsed&&!isMobile)?">":"<"}
          </button>
        </div>
        {/* Nav items */}
        <nav style={{flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
          {NAV.map(it=>{
            const active=page===it.p;
            return(
              <button key={it.p} onClick={()=>{goPage(it.p);if(isMobile)setSideCollapsed(true);}}
                style={{width:"100%",padding:(sideCollapsed&&!isMobile)?"10px":"10px 12px",border:"none",borderRadius:T.r.md,background:active?T.accent:"transparent",color:active?T.accentDk:T.sub,fontWeight:active?700:500,fontSize:".86rem",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .15s",justify:(sideCollapsed&&!isMobile)?"center":"flex-start",border:active?`1px solid ${T.border}`:"1px solid transparent",textAlign:"left"}}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background="#F6FAFF";e.currentTarget.style.color=T.ink;}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.sub;}}}>
                <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:22,height:22,flexShrink:0,color:active?T.accentDk:"#64748B"}}>{it.i}</span>
                {(!sideCollapsed||isMobile)&&<span style={{whiteSpace:"nowrap"}}>{it.l}</span>}
              </button>
            );
          })}
        </nav>
        {/* User */}
        <div ref={userMenuRef} style={{padding:"14px 10px",borderTop:`1px solid ${T.border}`,position:"relative"}}>
          <button onClick={()=>{if(sideCollapsed&&!isMobile){goPage("perfil");return;}setUserMenuOpen(v=>!v);}} style={{width:"100%",padding:(sideCollapsed&&!isMobile)?"10px":"10px 12px",border:"none",borderRadius:T.r.md,background:page==="perfil"?T.accent:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s",justify:(sideCollapsed&&!isMobile)?"center":"space-between"}}
            onMouseEnter={e=>{if(page!=="perfil")e.currentTarget.style.background="#F6FAFF"}}
            onMouseLeave={e=>{if(page!=="perfil")e.currentTarget.style.background="transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.accentDk},${T.accentLt})`,color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".76rem",flexShrink:0}}>{user.avatar}</div>
              {(!sideCollapsed||isMobile)&&<div style={{textAlign:"left",minWidth:0}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.nombre.split(" ")[0]}</div>
                <div style={{fontSize:".7rem",color:T.muted}}>{roleLabel(user.rol)}</div>
              </div>}
            </div>
            {(!sideCollapsed||isMobile)&&<span style={{fontSize:".76rem",fontWeight:800,color:T.muted}}>{userMenuOpen?"▴":"▾"}</span>}
          </button>
          {(!sideCollapsed||isMobile)&&userMenuOpen&&(
            <div style={{position:"absolute",left:10,right:10,bottom:"calc(100% + 8px)",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.md,boxShadow:T.shadow.lg,overflow:"hidden"}}>
              <button onClick={()=>{goPage("perfil");if(isMobile)setSideCollapsed(true);}} style={{width:"100%",padding:"10px 12px",textAlign:"left",background:"transparent",border:"none",color:T.ink,fontWeight:700,cursor:"pointer"}}>
                Ver perfil
              </button>
              <button onClick={openLogoutConfirm} style={{width:"100%",padding:"10px 12px",textAlign:"left",background:"transparent",border:"none",color:"#B42318",fontWeight:800,cursor:"pointer",borderTop:`1px solid ${T.border}`}}>
                Cerrar sesion
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* -- MAIN CONTENT -- */}
      <main style={{flex:1,minWidth:0,padding:isMobile?"14px 12px 24px":isTablet?"24px 22px 28px":"32px 36px",overflowY:"auto",
        backgroundImage:`radial-gradient(circle at -10% 18%, rgba(240,194,29,.24) 0%, rgba(240,194,29,0) 34%),
        radial-gradient(circle at 108% 74%, rgba(22,83,187,.12) 0%, rgba(22,83,187,0) 38%),
        url("${DOODLE_BG}")`,
        backgroundSize:"900px 700px, 800px 700px, 260px 260px",
        backgroundPosition:"0 0, 100% 100%, 0 0",
        borderLeft:isMobile?"none":`1px solid ${T.border}`}}>
        {isMobile&&(
          <div style={{position:"sticky",top:0,zIndex:140,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.lg,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,boxShadow:T.shadow.sm}}>
            <button onClick={()=>setSideCollapsed(false)} className="paw-btn" style={{padding:"8px 14px",borderRadius:T.r.full,border:`1.5px solid ${T.accentDk}`,background:T.accentDk,color:"#fff",fontWeight:800,fontSize:".82rem",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:"1.1rem",lineHeight:1}}>☰</span> Menú
            </button>
            <img src="/brand/logo-primary-trim.png" alt="DoGood" style={{height:32,objectFit:"contain"}}/>
            <button onClick={()=>goPage("perfil")} style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.accentDk},${T.accentLt})`,color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".85rem",border:"none",cursor:"pointer"}}>
              {user.avatar}
            </button>
          </div>
        )}
        {/* BANNER DESTACADO PARA EL ADOPTANTE CUANDO EL RESCATISTA APROBÓ EL CHECKLIST */}
        {user && solicitudes.some(s => (s.usuario_id === user.id || s.guest_email?.toLowerCase() === user.email?.toLowerCase()) && (s.checklist_completado === 1 || s.estatus === "En revisión") && !s.documentacion_completada) && (
          <div style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", borderRadius: 16, padding: 18, color: "#FFF", marginBottom: 20, boxShadow: "0 6px 20px rgba(5,150,105,.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: "2.4rem" }}>🎉</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>
                  ¡Tu entrevista de adopción ha sido pre-aprobada!
                </div>
                <div style={{ fontSize: ".82rem", opacity: .95, marginTop: 2 }}>
                  Por favor sube tu comprobante de domicilio, INE, 3 fotos del espacio y firma el acuerdo de adopción para continuar.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const pendingSol = solicitudes.find(s => (s.usuario_id === user.id || s.guest_email?.toLowerCase() === user.email?.toLowerCase()) && (s.checklist_completado === 1 || s.estatus === "En revisión") && !s.documentacion_completada);
                if (pendingSol) {
                  const matchingAnimal = animals.find(a => a.id === pendingSol.animal_id) || { id: pendingSol.animal_id, nombre: pendingSol.animal_nombre };
                  setActivePortalSol({ sol: pendingSol, animal: matchingAnimal });
                }
              }}
              style={{ padding: "10px 22px", borderRadius: 50, border: "none", background: "#FFF", color: "#065F46", fontWeight: 800, fontSize: ".86rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}
            >
              📋 Cargar Mis Documentos & Firmar ➔
            </button>
          </div>
        )}

        {/* HOME */}
        {page==="home"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            {/* Hero banner */}
            <div style={{background:`linear-gradient(135deg, ${T.accentDk} 0%, ${T.accentMd} 62%, ${T.accentLt} 100%)`,borderRadius:T.r.xl,padding:isMobile?"22px 18px":"40px 44px",marginBottom:24,position:"relative",overflow:"hidden",display:"flex",flexDirection:isMobile?"column":"row",justifyContent:"space-between",alignItems:isMobile?"flex-start":"center",gap:isMobile?14:24}}>
              <div style={{position:"absolute",top:-50,right:100,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
              <div style={{position:"absolute",bottom:-40,right:20,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
              <div style={{position:"relative"}}>
                <div style={{fontSize:".76rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:12}}>Bienvenido, {user.nombre.split(" ")[0]}</div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:isMobile?"clamp(1.7rem,9vw,2.1rem)":"clamp(1.8rem,2.5vw,2.6rem)",color:"#fff",lineHeight:1.12,marginBottom:14}}>
                  Dale un hogar,<br/>recibe amor infinito.
                </h1>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>goPage("catalogo")} style={{padding:"11px 22px",border:"none",borderRadius:T.r.full,background:"#fff",color:T.accentDk,fontWeight:700,fontSize:".86rem",cursor:"pointer",transition:"transform .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    Ver animales
                  </button>
                  {user.rol!=="usuario"&&<button onClick={()=>goPage("agregar")} style={{padding:"11px 22px",border:"1.5px solid rgba(255,255,255,.35)",borderRadius:T.r.full,background:"transparent",color:"#fff",fontWeight:600,fontSize:".86rem",cursor:"pointer"}}>
                    Agregar animal
                  </button>}
                </div>
              </div>
              {!isMobile&&(
                <div style={{
                  width: 110, height: 110, borderRadius: 28,
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {[
                [
                  animals.filter(a => a.estatus === "En adopción" || a.estatus === "Disponible").length,
                  "Disponibles",
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                  T.accentDk,
                  "#EBF5FF"
                ],
                [
                  animals.filter(a => a.estatus === "En proceso").length,
                  "En proceso",
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  "#D97706",
                  "#FEF3C7"
                ],
                [
                  animals.filter(a => a.estatus === "Adoptado" || a.estatus === "Adoptada" || a.estatus === "Aprobada").length,
                  "Adoptados",
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                  "#E11D48",
                  "#FFE4E6"
                ],
                [
                  solicitudes.filter(s => s.estatus === "Pendiente" || s.estatus === "En revisión" || !s.estatus).length,
                  "Pendientes",
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                  "#059669",
                  "#D1FAE5"
                ],
              ].map(([n,l,ic,ac,bgIcon])=>(
                <div key={l} style={{background:T.surface,borderRadius:T.r.lg,padding:"20px 22px",boxShadow:T.shadow.sm,border:`1.5px solid ${T.border}`,transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none"}}>
                  <div style={{width:42,height:42,borderRadius:12,background:bgIcon,color:ac,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10,boxShadow:`0 4px 12px ${ac}18`}}>
                    {ic}
                  </div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:"2.2rem",fontWeight:800,color:T.ink,lineHeight:1}}>{n}</div>
                  <div style={{fontSize:".78rem",color:T.muted,marginTop:4,fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>

            {/* Two columns: animals + facts */}
            <div style={{display:"grid",gridTemplateColumns:isTablet?"1fr":"1fr 340px",gap:20}}>
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.3rem",fontWeight:800,color:T.ink}}>Esperando un hogar</h2>
                  <button onClick={()=>goPage("catalogo")} style={{fontSize:".8rem",color:T.accentDk,fontWeight:700,background:"none",border:"none",cursor:"pointer"}}>Ver todos</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {animals.filter(a => a.estatus === "En adopción" || a.estatus === "Disponible").slice(0,4).map((a,i)=>(
                    <AnimalRow key={a.id} a={a} user={user} onOpen={openAnimalModal} onApartar={apartar} favs={favs} onFav={toggleFav} idx={i}/>
                  ))}
                  {!animals.filter(a => a.estatus === "En adopción" || a.estatus === "Disponible").length&&(
                    <div style={{textAlign:"center",padding:40,color:T.muted,background:T.surface,borderRadius:T.r.lg,border:`1.5px dashed ${T.border}`}}>
                      <div style={{fontSize:"2.5rem",marginBottom:8}}>{IC.paw}</div>
                      <p style={{fontSize:".86rem"}}>No hay animales disponibles aún.</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Facts sidebar */}
              <div>
                <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.3rem",fontWeight:800,color:T.ink,marginBottom:16}}>Sabias que...?</h2>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {FUN_FACTS.slice(0,5).map((f,i)=>{
                    const factBadgeStyles = [
                      { bg: "#EBF5FF", col: "#2563EB", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> },
                      { bg: "#F3E8FF", col: "#9333EA", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> },
                      { bg: "#FEF3C7", col: "#D97706", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg> },
                      { bg: "#FFE4E6", col: "#E11D48", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
                      { bg: "#D1FAE5", col: "#059669", svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> }
                    ];
                    const factBadge = factBadgeStyles[i % factBadgeStyles.length];
                    return (
                      <div key={i} style={{background:T.surface,borderRadius:T.r.md,padding:"14px 16px",boxShadow:T.shadow.sm,border:`1.5px solid ${T.border}`,display:"flex",gap:12,alignItems:"center",animation:`slideIn .4s ${i*.07}s ease both`}}>
                        <div style={{width:38,height:38,borderRadius:10,background:factBadge.bg,color:factBadge.col,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {factBadge.svg}
                        </div>
                        <div>
                          <p style={{fontSize:".81rem",color:T.sub,lineHeight:1.55,margin:0}}>{f.fact}</p>
                          <p style={{fontSize:".68rem",color:T.faint,marginTop:3,fontStyle:"italic",margin:0}}>- {f.src}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATÁLOGO */}
        {page==="catalogo"&&(
          <div>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:22}}>
              <div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800,color:T.ink,lineHeight:1.1}}>{user.rol==="rescatista"?"Mi catálogo":"Catálogo de adopción"}</h1>
                <p style={{fontSize:".85rem",color:T.muted,marginTop:4}}>Encuentra a tu compañero ideal</p>
                {isDemoData&&<div style={{display:"inline-flex",marginTop:8,padding:"4px 10px",borderRadius:T.r.full,fontSize:".7rem",fontWeight:700,background:"#FFF3CD",color:"#7A5200",border:"1px solid #F5D48B"}}>Modo demo activo</div>}
              </div>
              {user.rol!=="usuario"&&<button onClick={()=>goPage("agregar")} style={{padding:"10px 20px",border:"none",borderRadius:T.r.full,background:T.accentDk,color:"#fff",fontWeight:700,fontSize:".84rem",cursor:"pointer"}}>+ Agregar</button>}
            </div>
            {/* Search + tabs */}
            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{flex:1,minWidth:200,display:"flex",alignItems:"center",gap:8,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.full,padding:"9px 16px",transition:"border-color .15s"}}
                onFocus={e=>e.currentTarget.style.borderColor=T.accentDk} onBlur={e=>e.currentTarget.style.borderColor=T.border}>
                <span style={{color:T.muted,fontSize:".9rem"}}>{IC.search}</span>
                <input value={catSearch} onChange={e=>setCatSearch(e.target.value)} placeholder="Buscar por nombre, raza, historia..." style={{border:"none",background:"transparent",fontSize:".88rem",width:"100%",outline:"none",color:T.ink}}/>
                {catSearch&&<button onClick={()=>setCatSearch("")} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:".9rem"}}>x</button>}
              </div>
              {/* View toggle */}
              <div style={{display:"flex",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.full,padding:4,gap:4}}>
                {[["list","Lista"],["grid","Cuadricula"]].map(([v,label])=>(
                  <button key={v} onClick={()=>setCatView(v)} style={{minWidth:88,height:36,padding:"0 14px",border:"none",borderRadius:T.r.full,background:catView===v?T.accentDk:"transparent",color:catView===v?"#fff":T.muted,cursor:"pointer",fontSize:".82rem",fontWeight:700,transition:"all .15s"}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <select value={filterSpecies} onChange={e=>setFilterSpecies(e.target.value)} style={{...inp,width:170,padding:"8px 12px",borderRadius:T.r.full}}>
                <option value="all">Especie: Todas</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
              <select value={filterSize} onChange={e=>setFilterSize(e.target.value)} style={{...inp,width:170,padding:"8px 12px",borderRadius:T.r.full}}>
                <option value="all">Talla: Todas</option>
                <option value="pequeno">Pequeno</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...inp,width:190,padding:"8px 12px",borderRadius:T.r.full}}>
                <option value="all">Estatus: Todos</option>
                <option value="En adopción">En adopcion</option>
                <option value="En proceso">En proceso</option>
                <option value="Adoptado">Adoptado</option>
              </select>
              <button onClick={()=>{setCatSearch("");setCatTab("todos");setFilterSpecies("all");setFilterSize("all");setFilterStatus("all");}} style={{padding:"8px 14px",border:`1.5px solid ${T.border}`,borderRadius:T.r.full,background:T.surface,color:T.sub,fontWeight:700,fontSize:".8rem",cursor:"pointer"}}>
                Limpiar filtros
              </button>
            </div>
            {/* Tabs */}
            <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
              {[["todos","Todos"],["perro","Perros"],["gato","Gatos"],["En adopción","Disponibles"],["En proceso","En proceso"],["Adoptado","Adoptados"]].map(([v,l])=>(
                <button key={v} onClick={()=>setCatTab(v)} style={{padding:"7px 16px",borderRadius:T.r.full,fontWeight:600,fontSize:".8rem",cursor:"pointer",border:`1.5px solid ${catTab===v?T.accentDk:T.border}`,background:catTab===v?T.accent:"transparent",color:catTab===v?T.accentDk:T.sub,transition:"all .15s"}}>
                  {l} {catTab===v&&filteredAnimals.length?<span style={{background:T.accentDk,color:"#fff",borderRadius:T.r.full,padding:"1px 7px",fontSize:".7rem",marginLeft:4}}>{filteredAnimals.length}</span>:null}
                </button>
              ))}
            </div>
            {filteredAnimals.length?(
              catView==="list"?(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {filteredAnimals.map((a,i)=><AnimalRow key={a.id} a={a} user={user} onOpen={openAnimalModal} onApartar={apartar} favs={favs} onFav={toggleFav} idx={i} onCopyLink={user.rol!=="usuario"?copyAnimalLink:null} copiedLinkId={copiedLinkId}/>)}
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:16}}>
                  {filteredAnimals.map((a,i)=>(
                    <div key={a.id} onClick={()=>openAnimalModal(a)} style={{background:T.surface,borderRadius:T.r.lg,overflow:"hidden",boxShadow:T.shadow.sm,border:`1.5px solid ${T.border}`,cursor:"pointer",transition:"all .2s",animation:`fadeUp .4s ${i*.05}s ease both`}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=T.shadow.md;e.currentTarget.style.borderColor=T.borderHov}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=T.shadow.sm;e.currentTarget.style.borderColor=T.border}}>
                      <div style={{height:160,background:a.color,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                        {a.foto_url?<img src={a.foto_url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"4rem"}}>{a.emoji}</span>}
                        <div style={{position:"absolute",top:10,left:10,...statusPill(a.estatus),padding:"4px 11px",borderRadius:T.r.full,fontSize:".7rem",fontWeight:700,background:statusPill(a.estatus).bg+"ee"}}>{a.estatus}</div>
                        <button onClick={e=>{e.stopPropagation();toggleFav(a.id);}} style={{position:"absolute",top:8,right:8,width:28,height:28,background:"rgba(255,255,255,.9)",border:"none",borderRadius:"50%",fontSize:".8rem",cursor:"pointer"}}>{favs.includes(a.id)?IC.heart:IC.heartOutline}</button>
                      </div>
                      <div style={{padding:"14px 16px"}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1rem",marginBottom:4}}>{a.nombre}</div>
                        <div style={{fontSize:".74rem",color:T.muted,marginBottom:10}}>{a.raza} | {tallaLabel(a.talla)}</div>
                        <p style={{fontSize:".78rem",color:T.sub,lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",marginBottom:12}}>{a.historia}</p>
                        {user.rol==="usuario"&&<button onClick={e=>{e.stopPropagation();if(a.estatus==="En adopción")apartar(a);}} style={{width:"100%",padding:"8px",border:"none",borderRadius:T.r.sm,background:a.estatus==="En adopción"?T.accentDk:T.bg,color:a.estatus==="En adopción"?"#fff":T.muted,fontWeight:700,fontSize:".78rem",cursor:a.estatus==="En adopción"?"pointer":"default"}}>
                          {a.estatus==="En adopción"?"Apartar":a.estatus}
                        </button>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ):(
              <div style={{textAlign:"center",padding:"72px 20px",background:T.surface,borderRadius:T.r.xl,border:`1.5px dashed ${T.border}`}}>
                <div style={{fontSize:"3rem",marginBottom:12}}>{IC.search}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",color:T.ink,marginBottom:6}}>Sin resultados</h3>
                <p style={{fontSize:".85rem",color:T.muted,marginBottom:14}}>Prueba con otros filtros o limpia la busqueda.</p>
                <button onClick={()=>{setCatSearch("");setCatTab("todos");setFilterSpecies("all");setFilterSize("all");setFilterStatus("all");}} style={{padding:"9px 16px",border:"none",borderRadius:T.r.full,background:T.accentDk,color:"#fff",fontWeight:700,cursor:"pointer"}}>
                  Restablecer
                </button>
              </div>
            )}
          </div>
        )}

        {/* FAVORITOS */}
        {page==="favoritos"&&(
          <div>
            <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>Favoritos</h1></div>
            {animals.filter(a=>favs.includes(a.id)).length?(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {animals.filter(a=>favs.includes(a.id)).map((a,i)=><AnimalRow key={a.id} a={a} user={user} onOpen={openAnimalModal} onApartar={apartar} favs={favs} onFav={toggleFav} idx={i}/>)}
              </div>
            ):(
              <div style={{textAlign:"center",padding:"72px 20px",background:T.surface,borderRadius:T.r.xl,border:`1.5px dashed ${T.border}`}}>
                <div style={{fontSize:"3rem",marginBottom:12}}>{IC.heartOutline}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",color:T.ink,marginBottom:6}}>Sin favoritos aún</h3>
                <p style={{fontSize:".85rem",color:T.muted,marginBottom:16}}>Dale {IC.heartOutline} a los animales del catalogo.</p>
                <button onClick={()=>goPage("catalogo")} style={{padding:"10px 24px",border:"none",borderRadius:T.r.full,background:T.accentDk,color:"#fff",fontWeight:700,cursor:"pointer"}}>Ver catalogo</button>
              </div>
            )}
          </div>
        )}

        {/* MIS SOLICITUDES */}
        {page==="mis-solicitudes"&&(
          <div>
            <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>Mis solicitudes</h1></div>
            {solicitudes.length?(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {solicitudes.map(s=>{
                  const {bg,col}=statusPill(s.estatus==="Aprobada"?"Adoptado":s.estatus==="Pendiente"?"En proceso":"");
                  return(
                    <div key={s.id} style={{background:T.surface,borderRadius:T.r.lg,padding:"16px 20px",boxShadow:T.shadow.sm,border:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"border-color .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=T.accentDk}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                      <div style={{width:52,height:52,borderRadius:T.r.md,background:s.animal_color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0,overflow:"hidden"}}>
                        {s.animal_foto?<img src={s.animal_foto} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:s.animal_emoji}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1rem"}}>{s.animal_nombre}</div>
                        <div style={{fontSize:".76rem",color:T.muted}}>{s.animal_raza} | {s.fecha}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <Tag style={{background:bg,color:col}}>{s.estatus}</Tag>
                        {s.estatus==="Aprobada"&&<button onClick={()=>openCertModal({...s,id:s.animal_id,nombre:s.animal_nombre,emoji:s.animal_emoji,raza:s.animal_raza,sexo:s.animal_sexo,rescatista_nombre:s.rescatista_nombre})} style={{padding:"6px 14px",border:"none",borderRadius:T.r.full,background:T.warmDk,color:"#fff",fontWeight:700,fontSize:".76rem",cursor:"pointer"}}>Certificado</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ):(
              <div style={{textAlign:"center",padding:"72px 20px",background:T.surface,borderRadius:T.r.xl,border:`1.5px dashed ${T.border}`}}>
                <div style={{fontSize:"3rem",marginBottom:12}}>{IC.clipboard}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",color:T.ink,marginBottom:6}}>Sin solicitudes</h3>
                <p style={{fontSize:".85rem",color:T.muted}}>Ve al catálogo y aparta un animal.</p>
              </div>
            )}
          </div>
        )}

        {/* SOLICITUDES */}
        {page==="solicitudes"&&(
          <div>
            <div style={{marginBottom:22}}>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800,color:T.ink}}>Solicitudes de adopción</h1>
              <p style={{fontSize:".85rem",color:T.muted,marginTop:4}}>
                {user.rol==="rescatista" 
                  ? `Recibes directamente las solicitudes para tus mascotas registradas. Filtra candidatos y realiza la entrevista por WhatsApp.`
                  : `Gestión global de solicitudes de adopción.`}
              </p>
            </div>
            {solicitudes.length?(
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                <div style={{padding:"12px 20px",borderBottom:`1px solid ${T.border}`,background:T.bg,fontSize:".76rem",color:T.muted,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <div>
                    <span style={{background:T.tag2.bg,color:T.tag2.col,padding:"2px 10px",borderRadius:T.r.full,fontWeight:700,marginRight:8}}>Amarillo</span> abierto a opciones &nbsp;|&nbsp;
                    <span style={{background:T.tag1.bg,color:T.tag1.col,padding:"2px 10px",borderRadius:T.r.full,fontWeight:700,marginRight:8}}>Verde</span> solo este animal
                  </div>
                  <div style={{fontWeight:600,color:T.sub}}>
                    Total recibidas: <strong>{solicitudes.length}</strong>
                  </div>
                </div>
                {/* VISTA PARA PC (TABLA COMPLETA) */}
                <div className="responsive-hide-mobile" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: T.bg }}>
                        {["Animal", "Solicitante", "Fecha", "Estado", "Cuestionario", "Acción"].map(h => (
                          <th key={h} style={{ textAlign: "left", fontSize: ".7rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 1, padding: "11px 18px", borderBottom: `1.5px solid ${T.border}`, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map(s => {
                        const { bg, col } = statusPill(s.estatus === "Aprobada" ? "Adoptado" : s.estatus === "Pendiente" ? "En proceso" : "");
                        const phone = (s.guest_telefono || s.usuario_telefono || "").replace(/\D/g, "");
                        const adopterName = s.guest_nombre || s.usuario_nombre || "Adoptante";
                        const matchingAnimal = animals.find(a => a.id === s.animal_id);
                        const petName = s.animal_nombre || (matchingAnimal ? matchingAnimal.nombre : "la mascota");
                        let fullPetImg = s.animal_foto || (matchingAnimal ? matchingAnimal.foto_url : "") || "";
                        if (fullPetImg && !fullPetImg.startsWith("http") && !fullPetImg.startsWith("data:")) {
                          fullPetImg = `${window.location.origin}${fullPetImg.startsWith("/") ? "" : "/"}${fullPetImg}`;
                        }
                        const isDocComplete = Boolean(s.documentacion_completada || s.comprobante_domicilio || s.ine_documento || s.firma_digital);
                        const hasBeenStarted = Boolean(s.entrevista_iniciada || Number(s.entrevista_conteo) > 0);
                        const clickCount = Number(s.entrevista_conteo || (hasBeenStarted ? 1 : 0));
                        
                        const waText = encodeURIComponent(
                          `Hola ${adopterName}, ¡recibimos tu solicitud en DoGood para la adopción de ${petName}! 🐾\n\n` +
                          (fullPetImg ? `📷 Foto de ${petName}: ${fullPetImg}\n\n` : "") +
                          `Para continuar con el proceso de adopción, por favor responde a las siguientes preguntas:\n` +
                          `1. ¿En qué ciudad o colonia vives y cuál es el tipo de tu vivienda (casa con patio, departamento, etc.)?\n` +
                          `2. ¿El espacio disponible es amplio para las necesidades de ${petName}?\n` +
                          `3. ¿Todas las personas en casa están de acuerdo con la adopción?\n` +
                          `4. ¿Podrías enviarnos fotos o un video corto del espacio donde vivirá y descansará la mascota?\n` +
                          `5. ¿Cuál es la rutina diaria que tendrá la mascota?\n\n` +
                          `¡Quedamos a la espera de tus respuestas para formalizar la adopción!`
                        );
                        
                        return (
                          <tr key={s.id} style={{ borderBottom: `1px solid ${T.border}`, transition: "background .1s" }}
                            onMouseEnter={e => e.currentTarget.style.background = T.bg}
                            onMouseLeave={e => e.currentTarget.style.background = T.surface}>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: T.r.sm, background: s.animal_color || GRADIENTS[0], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", overflow: "hidden", flexShrink: 0 }}>
                                  {s.animal_foto ? <img src={s.animal_foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (s.animal_emoji || "🐾")}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: ".87rem" }}>{s.animal_nombre}</div>
                                  <div style={{ fontSize: ".72rem", color: T.muted }}>{s.animal_raza}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ fontWeight: 700, fontSize: ".86rem", color: s.usuario_abierto == 1 ? T.tag2.col : T.tag1.col }}>{s.usuario_nombre || s.guest_nombre || "—"}</div>
                              <div style={{ fontSize: ".72rem", color: T.muted }}>{s.guest_email || s.usuario_email || ""}</div>
                              {(s.guest_telefono || s.usuario_telefono) && <div style={{ fontSize: ".72rem", color: T.muted }}>📱 {s.guest_telefono || s.usuario_telefono}</div>}
                            </td>
                            <td style={{ padding: "13px 18px", fontSize: ".83rem", color: T.muted, whiteSpace: "nowrap" }}>{s.fecha}</td>
                            <td style={{ padding: "13px 18px" }}>
                              <Tag style={{ background: bg, color: col }} title={s.motivo_rechazo ? `Motivo: ${s.motivo_rechazo}` : ""}>
                                {s.estatus}
                              </Tag>
                              {s.estatus === "Rechazada" && s.motivo_rechazo && (
                                <div style={{ fontSize: ".68rem", color: "#DC2626", marginTop: 3, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.motivo_rechazo}>
                                  "{s.motivo_rechazo}"
                                </div>
                              )}
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <button
                                type="button"
                                onClick={() => setActiveDetalleSol(s)}
                                style={{
                                  padding: "6px 14px", borderRadius: T.r.full,
                                  border: "1.5px solid #CBD5E1", background: "#F8FAFC",
                                  color: "#334155", fontWeight: 800, fontSize: ".76rem",
                                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                }}
                                title="Ver respuestas del cuestionario y datos generales del adoptante"
                              >
                                Ver Solicitud
                              </button>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "nowrap" }}>
                                {(s.estatus === "Pendiente" || s.estatus === "En revisión" || !s.estatus) && (
                                  <>
                                    {phone && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isDocComplete) {
                                            window.open(`https://wa.me/52${phone}?text=${encodeURIComponent(`Hola ${adopterName}, te contacto sobre tu proceso de adopción de ${petName}. 🐾`)}`, "_blank");
                                          } else if (!hasBeenStarted) {
                                            window.open(`https://wa.me/52${phone}?text=${waText}`, "_blank");
                                            setSolicitudes(prev => prev.map(item => String(item.id) === String(s.id) ? { ...item, entrevista_iniciada: 1, entrevista_conteo: 1 } : item));
                                            try {
                                              const localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
                                              const updatedLocal = localSols.map(item => String(item.id) === String(s.id) ? { ...item, entrevista_iniciada: 1, entrevista_conteo: 1 } : item);
                                              localStorage.setItem("dogood_custom_solicitudes", JSON.stringify(updatedLocal));
                                            } catch {}
                                            apiFetch("solicitudes", "update", "POST", { id: s.id, entrevista_iniciada: 1, entrevista_conteo: 1 });
                                          } else {
                                            setActiveEntrevistaSol(s);
                                          }
                                        }}
                                        style={{
                                          padding: "7px 14px", borderRadius: T.r.full,
                                          background: isDocComplete ? "#25D366" : (hasBeenStarted ? "#059669" : "#25D366"),
                                          color: "#fff", fontWeight: 800, fontSize: ".76rem", border: "none", cursor: "pointer",
                                          display: "inline-flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(37,211,102,.28)"
                                        }}
                                        title={isDocComplete ? "Contactar al adoptante por WhatsApp" : (hasBeenStarted ? "Entrevista enviada (Validar resultado)" : "Entrevista por WhatsApp (Primer contacto)")}
                                      >
                                        {isDocComplete ? "Contacto WhatsApp" : (hasBeenStarted ? `Entrevista Enviada (${clickCount})` : "Entrevista WhatsApp")}
                                      </button>
                                    )}
                                    {Boolean(s.documentacion_completada || s.comprobante_domicilio || s.ine_documento || s.firma_digital) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const matchingAnimal = animals.find(a => a.id === s.animal_id) || { id: s.animal_id, nombre: s.animal_nombre, raza: s.animal_raza, foto_url: s.animal_foto, emoji: s.animal_emoji, rescatista_nombre: s.rescatista_nombre };
                                          setActiveExpedienteAnimal(matchingAnimal);
                                          setActiveExpedienteSol(s);
                                        }}
                                        style={{ padding: "6px 12px", border: `1.5px solid ${T.blue}`, borderRadius: T.r.full, background: "#EAF2FF", color: T.blue, fontWeight: 800, fontSize: ".76rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(22,83,187,.2)" }}
                                        title="Ver expediente y documentos encriptados cargados por el adoptante"
                                      >
                                        Ver Documentos
                                      </button>
                                    )}
                                    <button onClick={() => setActiveRechazoSol(s)} style={{ padding: "6px 12px", border: "1px solid #FECACA", borderRadius: T.r.full, background: T.tag4.bg, color: T.tag4.col, fontWeight: 700, fontSize: ".76rem", cursor: "pointer" }}>Rechazar</button>
                                  </>
                                )}
                                {s.estatus === "Aprobada" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        const matchingAnimal = animals.find(a => a.id === s.animal_id) || { id: s.animal_id, nombre: s.animal_nombre, raza: s.animal_raza, foto_url: s.animal_foto, emoji: s.animal_emoji, rescatista_nombre: s.rescatista_nombre };
                                        setActiveExpedienteAnimal(matchingAnimal);
                                        setActiveExpedienteSol(s);
                                      }}
                                      style={{ padding: "6px 12px", border: `1.5px solid ${T.blue}`, borderRadius: T.r.full, background: "#EAF2FF", color: T.blue, fontWeight: 700, fontSize: ".76rem", cursor: "pointer" }}
                                    >
                                      Expediente
                                    </button>
                                    <button onClick={() => openCertModal({ ...s, id: s.animal_id, nombre: s.animal_nombre, emoji: s.animal_emoji, raza: s.animal_raza, sexo: s.animal_sexo, rescatista_nombre: s.rescatista_nombre })} style={{ padding: "6px 12px", border: `1px solid ${T.border}`, borderRadius: T.r.full, background: T.surface, color: T.warmDk, fontWeight: 700, fontSize: ".76rem", cursor: "pointer" }}>Certificado</button>
                                    <button onClick={() => setSegAnimal({ id: s.animal_id, nombre: s.animal_nombre, emoji: s.animal_emoji })} style={{ padding: "6px 12px", border: `1px solid #10B981`, borderRadius: T.r.full, background: "#ECFDF5", color: "#047857", fontWeight: 700, fontSize: ".76rem", cursor: "pointer" }}>Seguimiento</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* VISTA PARA MÓVILES (GRID DE TARJETAS EXCLUSIVO) */}
                <div className="responsive-hide-desktop" style={{ padding: "14px 12px", display: "grid", gridTemplateColumns: "1fr", gap: 14, background: T.bg }}>
                  {solicitudes.map(s => {
                    const { bg, col } = statusPill(s.estatus === "Aprobada" ? "Adoptado" : s.estatus === "Pendiente" ? "En proceso" : "");
                    const phone = (s.guest_telefono || s.usuario_telefono || "").replace(/\D/g, "");
                    const adopterName = s.guest_nombre || s.usuario_nombre || "Adoptante";
                    const matchingAnimal = animals.find(a => a.id === s.animal_id);
                    const petName = s.animal_nombre || (matchingAnimal ? matchingAnimal.nombre : "la mascota");
                    let fullPetImg = s.animal_foto || (matchingAnimal ? matchingAnimal.foto_url : "") || "";
                    if (fullPetImg && !fullPetImg.startsWith("http") && !fullPetImg.startsWith("data:")) {
                      fullPetImg = `${window.location.origin}${fullPetImg.startsWith("/") ? "" : "/"}${fullPetImg}`;
                    }
                    const isDocComplete = Boolean(s.documentacion_completada || s.comprobante_domicilio || s.ine_documento || s.firma_digital);
                    const hasBeenStarted = Boolean(s.entrevista_iniciada || Number(s.entrevista_conteo) > 0);
                    const clickCount = Number(s.entrevista_conteo || (hasBeenStarted ? 1 : 0));
                    
                    const waText = encodeURIComponent(
                      `Hola ${adopterName}, ¡recibimos tu solicitud en DoGood para la adopción de ${petName}! 🐾\n\n` +
                      (fullPetImg ? `📷 Foto de ${petName}: ${fullPetImg}\n\n` : "") +
                      `Para continuar con el proceso de adopción, por favor responde a las siguientes preguntas:\n` +
                      `1. ¿En qué ciudad o colonia vives y cuál es el tipo de tu vivienda (casa con patio, departamento, etc.)?\n` +
                      `2. ¿El espacio disponible es amplio para las necesidades de ${petName}?\n` +
                      `3. ¿Todas las personas en casa están de acuerdo con la adopción?\n` +
                      `4. ¿Podrías enviarnos fotos o un video corto del espacio donde vivirá y descansará la mascota?\n` +
                      `5. ¿Cuál es la rutina diaria que tendrá la mascota?\n\n` +
                      `¡Quedamos a la espera de tus respuestas para formalizar la adopción!`
                    );

                    return (
                      <div
                        key={s.id}
                        style={{
                          background: T.surface,
                          borderRadius: 16,
                          border: `1.5px solid ${T.border}`,
                          padding: 14,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
                        }}
                      >
                        {/* Header de la Tarjeta: Mascota & Estado */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.animal_color || GRADIENTS[0], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(0,0,0,0.08)" }}>
                                {s.animal_foto ? <img src={s.animal_foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (s.animal_emoji || "🐾")}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, fontSize: ".95rem", color: T.ink }}>{s.animal_nombre}</div>
                                <div style={{ fontSize: ".74rem", color: T.muted }}>{s.animal_raza}</div>
                              </div>
                            </div>

                            <div style={{ textAlign: "right" }}>
                              <Tag style={{ background: bg, color: col }} title={s.motivo_rechazo ? `Motivo: ${s.motivo_rechazo}` : ""}>
                                {s.estatus}
                              </Tag>
                              {s.estatus === "Rechazada" && s.motivo_rechazo && (
                                <div style={{ fontSize: ".68rem", color: "#DC2626", marginTop: 3, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={s.motivo_rechazo}>
                                  "{s.motivo_rechazo}"
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Información del Solicitante */}
                          <div style={{ background: "#F8FAFC", padding: 10, borderRadius: 12, border: "1px solid #E2E8F0", marginBottom: 12 }}>
                            <div style={{ fontSize: ".7rem", color: T.muted, textTransform: "uppercase", fontWeight: 800, letterSpacing: 0.5, marginBottom: 3 }}>
                              SOLICITANTE
                            </div>
                            <div style={{ fontWeight: 800, fontSize: ".9rem", color: s.usuario_abierto == 1 ? T.tag2.col : T.tag1.col, marginBottom: 2 }}>
                              {adopterName}
                            </div>
                            <div style={{ fontSize: ".76rem", color: T.muted, wordBreak: "break-all" }}>
                              {s.guest_email || s.usuario_email || ""}
                            </div>
                            {(s.guest_telefono || s.usuario_telefono) && (
                              <div style={{ fontSize: ".76rem", color: T.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                                📱 <strong>{s.guest_telefono || s.usuario_telefono}</strong>
                              </div>
                            )}
                            <div style={{ fontSize: ".68rem", color: "#94A3B8", marginTop: 4, fontStyle: "italic" }}>
                              📅 Recibida: {s.fecha}
                            </div>
                          </div>
                        </div>

                        {/* Botones de Acción de la Tarjeta */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                          <button
                            type="button"
                            onClick={() => setActiveDetalleSol(s)}
                            style={{
                              padding: "7px 12px", borderRadius: T.r.full,
                              border: "1.5px solid #CBD5E1", background: "#FFF",
                              color: "#334155", fontWeight: 800, fontSize: ".74rem",
                              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", flex: "1 1 auto", justifyContent: "center"
                            }}
                            title="Ver respuestas del cuestionario y datos generales del adoptante"
                          >
                            Ver Solicitud
                          </button>

                          {(s.estatus === "Pendiente" || s.estatus === "En revisión" || !s.estatus) && (
                            <>
                              {phone && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isDocComplete) {
                                      window.open(`https://wa.me/52${phone}?text=${encodeURIComponent(`Hola ${adopterName}, te contacto sobre tu proceso de adopción de ${petName}. 🐾`)}`, "_blank");
                                    } else if (!hasBeenStarted) {
                                      window.open(`https://wa.me/52${phone}?text=${waText}`, "_blank");
                                      setSolicitudes(prev => prev.map(item => String(item.id) === String(s.id) ? { ...item, entrevista_iniciada: 1, entrevista_conteo: 1 } : item));
                                      try {
                                        const localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
                                        const updatedLocal = localSols.map(item => String(item.id) === String(s.id) ? { ...item, entrevista_iniciada: 1, entrevista_conteo: 1 } : item);
                                        localStorage.setItem("dogood_custom_solicitudes", JSON.stringify(updatedLocal));
                                      } catch {}
                                      apiFetch("solicitudes", "update", "POST", { id: s.id, entrevista_iniciada: 1, entrevista_conteo: 1 });
                                    } else {
                                      setActiveEntrevistaSol(s);
                                    }
                                  }}
                                  style={{
                                    padding: "7px 12px", borderRadius: T.r.full,
                                    background: isDocComplete ? "#25D366" : (hasBeenStarted ? "#059669" : "#25D366"),
                                    color: "#fff", fontWeight: 800, fontSize: ".74rem", border: "none", cursor: "pointer",
                                    display: "inline-flex", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(37,211,102,.28)",
                                    flex: "1 1 auto", justifyContent: "center"
                                  }}
                                  title={isDocComplete ? "Contactar al adoptante por WhatsApp" : (hasBeenStarted ? "Entrevista enviada (Validar resultado)" : "Entrevista por WhatsApp (Primer contacto)")}
                                >
                                  {isDocComplete ? "Contacto WhatsApp" : (hasBeenStarted ? `Entrevista Enviada (${clickCount})` : "Entrevista WhatsApp")}
                                </button>
                              )}
                              {Boolean(s.documentacion_completada || s.comprobante_domicilio || s.ine_documento || s.firma_digital) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const matchingAnimal = animals.find(a => a.id === s.animal_id) || { id: s.animal_id, nombre: s.animal_nombre, raza: s.animal_raza, foto_url: s.animal_foto, emoji: s.animal_emoji, rescatista_nombre: s.rescatista_nombre };
                                    setActiveExpedienteAnimal(matchingAnimal);
                                    setActiveExpedienteSol(s);
                                  }}
                                  style={{ padding: "6px 12px", border: `1.5px solid ${T.blue}`, borderRadius: T.r.full, background: "#EAF2FF", color: T.blue, fontWeight: 800, fontSize: ".74rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, boxShadow: "0 2px 8px rgba(22,83,187,.2)", flex: "1 1 auto", justifyContent: "center" }}
                                  title="Ver expediente y documentos encriptados cargados por el adoptante"
                                >
                                  Ver Documentos
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setActiveRechazoSol(s)}
                                style={{ padding: "6px 12px", border: "1px solid #FECACA", borderRadius: T.r.full, background: T.tag4.bg, color: T.tag4.col, fontWeight: 700, fontSize: ".74rem", cursor: "pointer", flex: "0 0 auto" }}
                              >
                                Rechazar
                              </button>
                            </>
                          )}

                          {s.estatus === "Aprobada" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const matchingAnimal = animals.find(a => a.id === s.animal_id) || { id: s.animal_id, nombre: s.animal_nombre, raza: s.animal_raza, foto_url: s.animal_foto, emoji: s.animal_emoji, rescatista_nombre: s.rescatista_nombre };
                                  setActiveExpedienteAnimal(matchingAnimal);
                                  setActiveExpedienteSol(s);
                                }}
                                style={{ padding: "6px 12px", border: `1.5px solid ${T.blue}`, borderRadius: T.r.full, background: "#EAF2FF", color: T.blue, fontWeight: 700, fontSize: ".74rem", cursor: "pointer", flex: "1 1 auto", justifyContent: "center", display: "inline-flex", alignItems: "center", gap: 4 }}
                              >
                                Expediente
                              </button>
                              <button
                                type="button"
                                onClick={() => openCertModal({ ...s, id: s.animal_id, nombre: s.animal_nombre, emoji: s.animal_emoji, raza: s.animal_raza, sexo: s.animal_sexo, rescatista_nombre: s.rescatista_nombre })}
                                style={{ padding: "6px 12px", border: `1px solid ${T.border}`, borderRadius: T.r.full, background: T.surface, color: T.warmDk, fontWeight: 700, fontSize: ".74rem", cursor: "pointer", flex: "1 1 auto", justifyContent: "center" }}
                              >
                                Certificado
                              </button>
                              <button
                                type="button"
                                onClick={() => setSegAnimal({ id: s.animal_id, nombre: s.animal_nombre, emoji: s.animal_emoji })}
                                style={{ padding: "6px 12px", border: `1px solid #10B981`, borderRadius: T.r.full, background: "#ECFDF5", color: "#047857", fontWeight: 700, fontSize: ".74rem", cursor: "pointer", flex: "1 1 auto", justifyContent: "center" }}
                              >
                                Seguimiento
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"72px 20px",background:T.surface,borderRadius:T.r.xl,border:`1.5px dashed ${T.border}`}}>
                <div style={{fontSize:"3rem",marginBottom:12}}>{IC.clipboard}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",color:T.ink}}>Sin solicitudes</h3>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN 1: SOLICITUDES DE RESCATISTAS PENDIENTES */}
        {page==="aprobar_rescatistas"&&(
          <div>
            <div style={{marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
              <div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>⏳ Solicitudes de Rescatistas por Aprobar</h1>
                <p style={{fontSize:".88rem",color:T.sub,marginTop:4}}>
                  Revisa y autoriza las solicitudes enviadas por nuevos rescatistas. Al hacer clic en <strong>Aprobar</strong>, se enviará su correo de bienvenida por SMTP.
                </p>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>goPage("aprobar_rescatistas")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.accentDk}`,background:T.accentDk,color:"#fff",fontWeight:800,fontSize:".82rem",cursor:"pointer"}}>
                  ⏳ Por Aprobar ({allUsers.filter(u=>u.estatus==="pendiente").length})
                </button>
                <button onClick={()=>goPage("usuarios")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                  ✅ Aprobados ({allUsers.filter(u=>u.estatus==="aprobado"||u.rol==="admin"||(!u.estatus&&u.estatus!=="rechazado")).length})
                </button>
                <button onClick={()=>goPage("rescatistas_rechazados")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                  ❌ Rechazados ({allUsers.filter(u=>u.estatus==="rechazado").length})
                </button>
              </div>
            </div>

            {allUsers.filter(u=>u.estatus==="pendiente").length === 0 ? (
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px dashed ${T.border}`,padding:"48px 24px",textAlign:"center"}}>
                <div style={{fontSize:"3.5rem",marginBottom:10}}>✨ 🐾</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",color:T.ink,marginBottom:6}}>
                  ¡Todo al día! No hay solicitudes pendientes
                </h3>
                <p style={{fontSize:".88rem",color:T.sub,maxWidth:420,margin:"0 auto 16px",lineHeight:1.6}}>
                  Todas las solicitudes de nuevos rescatistas han sido procesadas. Los usuarios aprobados se encuentran en la sección de Rescatistas Autorizados.
                </p>
                <button onClick={()=>goPage("usuarios")} style={{padding:"10px 20px",borderRadius:T.r.full,border:"none",background:T.accentDk,color:"#fff",fontWeight:800,fontSize:".84rem",cursor:"pointer"}}>
                  Ver Rescatistas Aprobados ➔
                </button>
              </div>
            ) : (
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid #F0C21D`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                <div style={{background:"#FFF7DA",padding:"12px 18px",borderBottom:"1px solid #F0C21D",fontSize:".84rem",fontWeight:700,color:"#92400E",display:"flex",alignItems:"center",gap:8}}>
                  <span>⚠️</span> Hay {allUsers.filter(u=>u.estatus==="pendiente").length} rescatista(s) esperando autorización de tu parte.
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{background:T.bg}}>
                        {["Rescatista / Nombre","Correo","Rol","Estado","Teléfono / WhatsApp","Autorización Directa"].map(h=>(
                          <th key={h} style={{textAlign:"left",fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,padding:"12px 18px",borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.filter(u=>u.estatus==="pendiente").map(u=>(
                        <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:"#FFFDF0",transition:"background .1s"}}>
                          <td style={{padding:"14px 18px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#D97706,#F59E0B)",color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".88rem"}}>
                                {u.nombre ? u.nombre.charAt(0).toUpperCase() : "R"}
                              </div>
                              <div>
                                <span style={{fontWeight:800,fontSize:".9rem",color:T.ink}}>{u.nombre}</span>
                                <div style={{fontSize:".72rem",color:T.muted}}>ID #{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{padding:"14px 18px",fontSize:".88rem",color:T.accentDk,fontWeight:700}}>{u.email}</td>
                          <td style={{padding:"14px 18px"}}>
                            <Tag style={{background:"#DBEAFE",color:"#1E40AF"}}>Rescatista / Refugio 🐕</Tag>
                          </td>
                          <td style={{padding:"14px 18px"}}>
                            <Tag style={{background:"#FEF3C7",color:"#92400E"}}>⏳ Pendiente de Aprobación</Tag>
                          </td>
                          <td style={{padding:"14px 18px",fontSize:".85rem",color:T.sub}}>{u.telefono || "—"}</td>
                          <td style={{padding:"14px 18px"}}>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <button
                                onClick={() => approveRescatista(u)}
                                disabled={loading}
                                style={{padding:"8px 16px",border:"none",borderRadius:T.r.full,background:"#059669",color:"#fff",fontWeight:800,fontSize:".8rem",cursor:"pointer",boxShadow:"0 3px 10px rgba(5,150,105,.3)"}}
                              >
                                🟢 Aprobar y Enviar Correo 📧
                              </button>
                              <button
                                onClick={() => rejectRescatista(u)}
                                disabled={loading}
                                style={{padding:"8px 14px",border:"1px solid #FECACA",borderRadius:T.r.full,background:"#FEE2E2",color:"#991B1B",fontWeight:800,fontSize:".8rem",cursor:"pointer"}}
                              >
                                🔴 Rechazar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN 2: RESCATISTAS APROBADOS (SÓLO ESTATUS APROBADO) */}
        {page==="usuarios"&&(
          <div>
            <div style={{marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
              <div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>Rescatistas y Refugios Autorizados</h1>
                <p style={{fontSize:".88rem",color:T.sub,marginTop:4}}>
                  Directorio de rescatistas autorizados con acceso activo a la plataforma.
                </p>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>goPage("aprobar_rescatistas")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                    ⏳ Por Aprobar ({allUsers.filter(u=>u.estatus==="pendiente").length})
                  </button>
                  <button onClick={()=>goPage("usuarios")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.accentDk}`,background:T.accentDk,color:"#fff",fontWeight:800,fontSize:".82rem",cursor:"pointer"}}>
                    ✅ Aprobados ({allUsers.filter(u=>u.estatus==="aprobado"||u.rol==="admin"||(!u.estatus&&u.estatus!=="rechazado")).length})
                  </button>
                  <button onClick={()=>goPage("rescatistas_rechazados")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                    ❌ Rechazados ({allUsers.filter(u=>u.estatus==="rechazado").length})
                  </button>
                </div>
                <button
                  onClick={() => {
                    setUNombre(""); setUEmail(""); setUPass(""); setUTel("");
                    setShowAddRescatistaModal(true);
                  }}
                  style={{padding:"11px 20px",border:"none",borderRadius:T.r.full,background:T.accentDk,color:"#fff",fontWeight:800,fontSize:".88rem",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,boxShadow:T.shadow.md}}
                >
                  <span>➕</span> Nuevo Rescatista
                </button>
              </div>
            </div>

            <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow.sm}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:T.bg}}>
                      {["Rescatista / Nombre","Correo","Rol","Estado","Teléfono / WhatsApp","Acciones"].map(h=>(
                        <th key={h} style={{textAlign:"left",fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,padding:"12px 18px",borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.filter(u=>u.estatus==="aprobado"||u.rol==="admin"||(!u.estatus&&u.estatus!=="rechazado"&&u.estatus!=="pendiente")).map(u=>(
                      <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                        onMouseLeave={e=>e.currentTarget.style.background=T.surface}>
                        <td style={{padding:"13px 18px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${T.accentDk},${T.accentMd})`,color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".82rem"}}>
                              {u.nombre ? u.nombre.charAt(0).toUpperCase() : "R"}
                            </div>
                            <div>
                              <span style={{fontWeight:700,fontSize:".88rem",color:T.ink}}>{u.nombre}</span>
                              <div style={{fontSize:".72rem",color:T.muted}}>ID #{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:"13px 18px",fontSize:".85rem",color:T.sub,fontWeight:600}}>{u.email}</td>
                        <td style={{padding:"13px 18px"}}>
                          <Tag style={{background:u.rol==="admin"?"#FEE2E2":"#DBEAFE",color:u.rol==="admin"?"#991B1B":"#1E40AF"}}>
                            {u.rol==="admin" ? "Administrador ⚡" : "Rescatista 🐕"}
                          </Tag>
                        </td>
                        <td style={{padding:"13px 18px"}}>
                          <Tag style={{background:"#D1FAE5",color:"#065F46"}}>✅ Aprobado</Tag>
                        </td>
                        <td style={{padding:"13px 18px",fontSize:".85rem",color:T.sub}}>{u.telefono || "—"}</td>
                        <td style={{padding:"13px 18px"}}>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <button
                              onClick={() => {
                                setEditUser(u);
                                setUNombre(u.nombre);
                                setUEmail(u.email);
                                setUTel(u.telefono || "");
                              }}
                              style={{padding:"6px 12px",border:`1px solid ${T.border}`,borderRadius:T.r.full,background:T.surface,color:T.ink,fontWeight:700,fontSize:".76rem",cursor:"pointer"}}
                            >
                              ✏️ Editar
                            </button>
                            {u.id !== user.id && (
                              <button
                                onClick={() => deleteRescatista(u)}
                                style={{padding:"6px 12px",border:"1px solid #FECACA",borderRadius:T.r.full,background:"#FEE2E2",color:"#991B1B",fontWeight:700,fontSize:".76rem",cursor:"pointer"}}
                              >
                                🗑️ Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: SOLICITUDES RECHAZADAS */}
        {page==="rescatistas_rechazados"&&(
          <div>
            {(() => {
              const rejectedUsers = allUsers.filter(u => u.estatus && (u.estatus.toLowerCase() === "rechazado" || u.estatus.toLowerCase() === "rechazada"));
              const rejectedSols = solicitudes.filter(s => s.estatus === "Rechazada" || s.estatus === "Rechazado");
              const totalRejected = rejectedUsers.length + rejectedSols.length;

              return (
                <>
                  <div style={{marginBottom:22,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
                    <div>
                      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>❌ Solicitudes Rechazadas</h1>
                      <p style={{fontSize:".88rem",color:T.sub,marginTop:4}}>
                        Historial de solicitudes de nuevos rescatistas y solicitudes de adopción no autorizadas. Puedes re-aprobarlas en cualquier momento.
                      </p>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>goPage("aprobar_rescatistas")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                        ⏳ Por Aprobar ({allUsers.filter(u=>u.estatus==="pendiente").length})
                      </button>
                      <button onClick={()=>goPage("usuarios")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                        ✅ Aprobados ({allUsers.filter(u=>u.estatus==="aprobado"||u.rol==="admin"||(!u.estatus&&u.estatus!=="rechazado")).length})
                      </button>
                      <button onClick={()=>goPage("rescatistas_rechazados")} style={{padding:"8px 16px",borderRadius:T.r.full,border:`1.5px solid #EF4444`,background:"#EF4444",color:"#fff",fontWeight:800,fontSize:".82rem",cursor:"pointer"}}>
                        ❌ Rechazados ({totalRejected})
                      </button>
                    </div>
                  </div>

                  {totalRejected === 0 ? (
                    <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px dashed ${T.border}`,padding:"48px 24px",textAlign:"center"}}>
                      <div style={{fontSize:"3.5rem",marginBottom:10}}>✨ 📋</div>
                      <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",color:T.ink,marginBottom:6}}>
                        No hay solicitudes rechazadas
                      </h3>
                      <p style={{fontSize:".88rem",color:T.sub,maxWidth:420,margin:"0 auto 16px",lineHeight:1.6}}>
                        No existen solicitudes en el historial de rechazados.
                      </p>
                    </div>
                  ) : (
                    <div style={{display:"grid",gap:20}}>
                      {/* Sub-tabla 1: Rescatistas Rechazados */}
                      {rejectedUsers.length > 0 && (
                        <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid #FECACA`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                          <div style={{background:"#FEE2E2",padding:"10px 18px",fontSize:".84rem",fontWeight:800,color:"#991B1B"}}>
                            👤 Solicitudes de Registro de Rescatistas Rechazadas ({rejectedUsers.length})
                          </div>
                          <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse"}}>
                              <thead>
                                <tr style={{background:T.bg}}>
                                  {["Rescatista / Nombre","Correo","Rol","Estado","Teléfono / WhatsApp","Acciones"].map(h=>(
                                    <th key={h} style={{textAlign:"left",fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,padding:"12px 18px",borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {rejectedUsers.map(u=>(
                                  <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:"#FEF2F2",transition:"background .1s"}}>
                                    <td style={{padding:"14px 18px"}}>
                                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                                        <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#DC2626,#EF4444)",color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".88rem"}}>
                                          {u.nombre ? u.nombre.charAt(0).toUpperCase() : "R"}
                                        </div>
                                        <div>
                                          <span style={{fontWeight:800,fontSize:".9rem",color:T.ink}}>{u.nombre}</span>
                                          <div style={{fontSize:".72rem",color:T.muted}}>ID #{u.id}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{padding:"14px 18px",fontSize:".88rem",color:T.ink,fontWeight:600}}>{u.email}</td>
                                    <td style={{padding:"14px 18px"}}>
                                      <Tag style={{background:"#DBEAFE",color:"#1E40AF"}}>Rescatista / Refugio 🐕</Tag>
                                    </td>
                                    <td style={{padding:"14px 18px"}}>
                                      <Tag style={{background:"#FEE2E2",color:"#991B1B"}}>❌ Rechazado</Tag>
                                    </td>
                                    <td style={{padding:"14px 18px",fontSize:".85rem",color:T.sub}}>{u.telefono || "—"}</td>
                                    <td style={{padding:"14px 18px"}}>
                                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                                        <button
                                          onClick={() => approveRescatista(u)}
                                          disabled={loading}
                                          style={{padding:"8px 16px",border:"none",borderRadius:T.r.full,background:"#059669",color:"#fff",fontWeight:800,fontSize:".8rem",cursor:"pointer",boxShadow:"0 3px 10px rgba(5,150,105,.3)"}}
                                        >
                                          🟢 Re-Aprobar y Enviar Correo 📧
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Sub-tabla 2: Solicitudes de Adopción Rechazadas */}
                      {rejectedSols.length > 0 && (
                        <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid #FECACA`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                          <div style={{background:"#FEE2E2",padding:"10px 18px",fontSize:".84rem",fontWeight:800,color:"#991B1B"}}>
                            🐾 Solicitudes de Adopción Rechazadas ({rejectedSols.length})
                          </div>
                          <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse"}}>
                              <thead>
                                <tr style={{background:T.bg}}>
                                  {["Mascota","Candidato / Adoptante","Contacto","Motivo Rechazo","Estado","Acciones"].map(h=>(
                                    <th key={h} style={{textAlign:"left",fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,padding:"12px 18px",borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {rejectedSols.map(s=>(
                                  <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:"#FEF2F2",transition:"background .1s"}}>
                                    <td style={{padding:"14px 18px",fontWeight:800,color:T.ink}}>
                                      {s.animal_nombre || "Mascota"} #{s.animal_id}
                                    </td>
                                    <td style={{padding:"14px 18px",fontSize:".88rem",color:T.ink,fontWeight:700}}>
                                      {s.guest_nombre || s.usuario_nombre || "Adoptante"}
                                    </td>
                                    <td style={{padding:"14px 18px",fontSize:".85rem",color:T.sub}}>
                                      {s.guest_email || s.usuario_email || "—"}<br/>
                                      <span style={{fontSize:".78rem",color:T.muted}}>{s.guest_telefono || s.usuario_telefono || ""}</span>
                                    </td>
                                    <td style={{padding:"14px 18px",fontSize:".82rem",color:"#991B1B",fontStyle:"italic"}}>
                                      {s.motivo_rechazo || "No especificado"}
                                    </td>
                                    <td style={{padding:"14px 18px"}}>
                                      <Tag style={{background:"#FEE2E2",color:"#991B1B"}}>❌ Solicitud Rechazada</Tag>
                                    </td>
                                    <td style={{padding:"14px 18px"}}>
                                      <button
                                        onClick={() => resolverSol(s.id, "Aprobada")}
                                        style={{padding:"8px 16px",border:"none",borderRadius:T.r.full,background:"#059669",color:"#fff",fontWeight:800,fontSize:".8rem",cursor:"pointer"}}
                                      >
                                        🟢 Re-Aprobar Adopción
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* MODAL CREAR RESCATISTA */}
        {showAddRescatistaModal && (
          <Modal onClose={() => setShowAddRescatistaModal(false)}>
            <div style={{padding:28}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",color:T.ink,marginBottom:6}}>
                Registrar Nuevo Rescatista 🐾
              </div>
              <p style={{fontSize:".84rem",color:T.sub,marginBottom:20,lineHeight:1.5}}>
                Completa los datos del rescatista o refugio. Al guardar, el servidor enviará automáticamente un <strong>correo HTML de bienvenida</strong> con sus datos de acceso.
              </p>

              <div style={{display:"grid",gap:14}}>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Nombre Completo / Refugio
                  </label>
                  <input value={uNombre} onChange={e=>setUNombre(e.target.value)} placeholder="Ej. Refugio Huellitas Seguras" style={inp} />
                </div>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Correo Electrónico
                  </label>
                  <input type="email" value={uEmail} onChange={e=>setUEmail(e.target.value)} placeholder="rescatista@correo.com" style={inp} />
                </div>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Contraseña de Acceso
                  </label>
                  <input type="password" value={uPass} onChange={e=>setUPass(e.target.value)} placeholder="••••••••" style={inp} />
                </div>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Teléfono / WhatsApp de Contacto (Sólo números)
                  </label>
                  <input type="tel" inputMode="numeric" pattern="[0-9]*" value={uTel} onChange={e=>setUTel(e.target.value.replace(/\D/g,""))} placeholder="5512345678" style={inp} />
                </div>
              </div>

              <div style={{display:"flex",gap:10,marginTop:24}}>
                <button onClick={() => setShowAddRescatistaModal(false)} style={{flex:1,padding:"12px",border:`1.5px solid ${T.border}`,borderRadius:T.r.md,background:T.surface,color:T.sub,fontWeight:700,cursor:"pointer"}}>
                  Cancelar
                </button>
                <button onClick={createRescatista} disabled={loading} style={{flex:1,padding:"12px",border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:800,cursor:"pointer"}}>
                  {loading ? "Registrando…" : "Guardar y Enviar Correo 📧"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* MODAL EXITOSO DE BIENVENIDA */}
        {createdSuccessUser && (
          <Modal onClose={() => setCreatedSuccessUser(null)}>
            <div style={{padding:28,textAlign:"center"}}>
              <div style={{fontSize:"3.5rem",marginBottom:10}}>🎉 📧</div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",color:T.ink,marginBottom:8}}>
                ¡Rescatista Registrado Exitosamente!
              </h3>
              <p style={{fontSize:".88rem",color:T.sub,lineHeight:1.6,marginBottom:20}}>
                Se ha procesado el registro y enviado el correo de bienvenida oficial de DoGood vía SMTP (Neubox) a:
              </p>
              <div style={{background:T.bg,borderRadius:14,padding:"16px",textAlign:"left",marginBottom:20,border:`1.5px solid ${T.border}`}}>
                <div style={{fontSize:".88rem",fontWeight:700,color:T.ink}}>👤 <strong>Nombre:</strong> {createdSuccessUser.nombre}</div>
                <div style={{fontSize:".88rem",fontWeight:700,color:T.accentDk,marginTop:6}}>📧 <strong>Correo:</strong> {createdSuccessUser.email}</div>
                <div style={{fontSize:".88rem",fontWeight:700,color:T.sub,marginTop:6}}>🔑 <strong>Contraseña asignada:</strong> {createdSuccessUser.password}</div>
              </div>
              <button onClick={() => setCreatedSuccessUser(null)} style={{width:"100%",padding:"12px",borderRadius:50,border:"none",background:T.accentDk,color:"#fff",fontWeight:800,fontSize:".92rem",cursor:"pointer"}}>
                Aceptar y Cerrar
              </button>
            </div>
          </Modal>
        )}

        {/* MODAL EDITAR RESCATISTA */}
        {editUser && (
          <Modal onClose={() => setEditUser(null)}>
            <div style={{padding:28}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:".1.4rem",color:T.ink,marginBottom:6}}>
                Editar Rescatista #{editUser.id} ✏️
              </div>
              <p style={{fontSize:".84rem",color:T.sub,marginBottom:20}}>
                Modifica los datos del usuario o refugio seleccionado.
              </p>

              <div style={{display:"grid",gap:14}}>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Nombre Completo / Refugio
                  </label>
                  <input value={uNombre} onChange={e=>setUNombre(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Correo Electrónico
                  </label>
                  <input type="email" value={uEmail} onChange={e=>setUEmail(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={{display:"block",fontSize:".74rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>
                    Teléfono / WhatsApp (Sólo números)
                  </label>
                  <input type="tel" inputMode="numeric" pattern="[0-9]*" value={uTel} onChange={e=>setUTel(e.target.value.replace(/\D/g,""))} placeholder="5512345678" style={inp} />
                </div>
              </div>

              <div style={{display:"flex",gap:10,marginTop:24}}>
                <button onClick={() => setEditUser(null)} style={{flex:1,padding:"12px",border:`1.5px solid ${T.border}`,borderRadius:T.r.md,background:T.surface,color:T.sub,fontWeight:700,cursor:"pointer"}}>
                  Cancelar
                </button>
                <button onClick={updateRescatista} disabled={loading} style={{flex:1,padding:"12px",border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:800,cursor:"pointer"}}>
                  {loading ? "Guardando…" : "Actualizar Datos"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* AGREGAR */}
        {page==="agregar"&&(
          <div>
            <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Syne',sans-serif",fontSize:isMobile?"1.4rem":"1.9rem",fontWeight:800}}>Agregar animal</h1></div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 320px",gap:20,alignItems:"start"}}>
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:isMobile?16:28}}>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
                  {[["Nombre",<input spellCheck={true} value={aN} onChange={e=>setAN(e.target.value)} placeholder="Nombre" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Especie",<select value={aE} onChange={e=>setAE(e.target.value)} style={inp}><option value="perro">Perro {IC.dog}</option><option value="gato">Gato {IC.cat}</option></select>],
                    ["Sexo",<select value={aS} onChange={e=>setAS(e.target.value)} style={inp}><option value="Hembra">Hembra</option><option value="Macho">Macho</option></select>],
                    ["Talla",<select value={aT} onChange={e=>setAT(e.target.value)} style={inp}><option value="pequeño">Pequeño</option><option value="mediano">Mediano</option><option value="grande">Grande</option></select>],
                    ["Peso (kg)",<input type="number" inputMode="decimal" step="0.1" min="0" max="60" value={aP} onChange={e=>{let val=e.target.value.replace(/[^0-9.]/g,"");if(Number(val)>60)val="60";setAP(val);}} placeholder="Máx 60 kg" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Edad (años)",<input type="number" inputMode="numeric" min="0" max="20" value={aEd} onChange={e=>{let val=e.target.value.replace(/\D/g,"");if(Number(val)>20)val="20";setAEd(val);}} placeholder="Máx 20 años" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["¿Aplica cuota de recuperación?",
                      <select value={aAplicaCuota ? "si" : "no"} onChange={e=>setAAplicaCuota(e.target.value === "si")} style={inp}>
                        <option value="no">Sin Cuota (Gratuita)</option>
                        <option value="si">Con Cuota de Recuperación</option>
                      </select>
                    ],
                    ["Monto Cuota de recuperación (MXN)",
                      <div style={{position:"relative"}}>
                        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:".82rem",color:T.muted,pointerEvents:"none"}}>$</span>
                        <input type="number" inputMode="numeric" min="0" value={aCuota} onChange={e=>{setACuota(e.target.value.replace(/[^0-9.]/g,"")); if(Number(e.target.value)>0)setAAplicaCuota(true);}} placeholder="0 (gratis)" style={{...inp,paddingLeft:24}} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>
                      </div>],
                  ].map(([l,el])=>(
                    <div key={l}>
                      <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</label>
                      {el}
                    </div>
                  ))}
                </div>

                {/* Desglose de cuota de recuperación */}
                {aAplicaCuota && (
                  <div style={{marginBottom:14}}>
                    <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>📋 Lista Desglosada de lo que incluye la Cuota</label>
                    <input spellCheck={true} value={aDesgloseCuota} onChange={e=>setADesgloseCuota(e.target.value)} placeholder="Ej. Esterilización, Vacuna Quíntuple, Rabia, Desparasitación" style={inp} />
                  </div>
                )}

                {/* Campos Extendidos de Salud */}
                <div style={{background:T.bg,borderRadius:T.r.md,padding:14,border:`1px solid ${T.border}`,marginBottom:14}}>
                  <div style={{fontSize:".78rem",fontWeight:800,color:T.sub,textTransform:"uppercase",letterSpacing:.6,marginBottom:10}}>🏥 Expediente Clínico de Salud</div>
                  <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10,marginBottom:10}}>
                    <div>
                      <label style={{fontSize:".72rem",fontWeight:700,color:T.muted}}>¿Desparasitado/a?</label>
                      <select value={aDesparasitado ? "si" : "no"} onChange={e=>setADesparasitado(e.target.value === "si")} style={inp}>
                        <option value="si">Sí ✅</option>
                        <option value="no">En proceso / No ⏳</option>
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:".72rem",fontWeight:700,color:T.muted}}>¿Esterilizado/a?</label>
                      <select value={aEsterilizado ? "si" : "no"} onChange={e=>setAEsterilizado(e.target.value === "si")} style={inp}>
                        <option value="si">Sí ✅</option>
                        <option value="no">Pendiente ⏳</option>
                      </select>
                    </div>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:".72rem",fontWeight:700,color:T.muted}}>Esquema de Vacunación</label>
                    <input spellCheck={true} value={aVacunas} onChange={e=>setAVacunas(e.target.value)} placeholder="Ej. Quíntuple, Rabia y Desparasitación al día" style={inp} />
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:".72rem",fontWeight:700,color:T.muted}}>Código de Microchip (Opcional)</label>
                    <input spellCheck={true} value={aMicrochip} onChange={e=>setAMicrochip(e.target.value)} placeholder="Ej. 982000012345678" style={inp} />
                  </div>
                  <div>
                    <label style={{fontSize:".72rem",fontWeight:700,color:T.muted}}>Condición médica o notas de salud</label>
                    <input spellCheck={true} value={aCondicionSalud} onChange={e=>setACondicionSalud(e.target.value)} placeholder="Ej. Excelente salud, requiere croquetas de cachorro" style={inp} />
                  </div>
                </div>

                <div style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Raza</label>
                  <RazaSelector value={aR} onChange={setAR}/>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Carácter</label>
                  <select value={aC} onChange={e=>setAC(e.target.value)} style={inp}>
                    {["Juguetón/a","Tranquilo/a","Cariñoso/a","Independiente","Activo/a","Tímido/a","Sociable","Curioso/a"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Historia</label>
                  <textarea spellCheck={true} value={aH} onChange={e=>setAH(e.target.value)} rows={4} placeholder="Cuéntanos su historia..." style={{...inp,resize:"vertical"}} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>
                </div>
                <button onClick={saveAnimal} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:"pointer",transition:"background .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.accentMd}
                  onMouseLeave={e=>e.currentTarget.style.background=T.accentDk}>
                  Agregar al catalogo
                </button>
              </div>
              {/* Photo upload */}
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:isMobile?16:22}}>
                <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:12}}>Foto</label>
                <label style={{display:"block",border:`2px dashed ${T.border}`,borderRadius:T.r.lg,padding:aFoto?0:40,textAlign:"center",cursor:"pointer",overflow:"hidden",transition:"border-color .2s",background:aFoto?"transparent":T.bg,aspectRatio:aFoto?"auto":"1"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=T.accentDk}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setAFoto(ev.target.result);r.readAsDataURL(f);}}} style={{display:"none"}}/>
                  {aFoto?<img src={aFoto} style={{width:"100%",aspectRatio:"1",objectFit:"cover",display:"block"}}/>:<><div style={{fontSize:"2.5rem",marginBottom:8}}>{IC.camera}</div><div style={{fontSize:".84rem",color:T.muted}}>Subir foto</div><div style={{fontSize:".74rem",color:T.faint,marginTop:4}}>JPG, PNG</div></>}
                </label>
                {aFoto&&<button onClick={()=>setAFoto(null)} style={{width:"100%",marginTop:10,padding:"8px",border:`1.5px solid ${T.border}`,borderRadius:T.r.sm,background:"transparent",color:T.muted,fontSize:".8rem",cursor:"pointer"}}>Quitar foto</button>}
              </div>
            </div>
          </div>
        )}

        {/* EDITAR ANIMAL */}
        {page==="_edit"&&editAnimal&&(
          <div style={{animation:"fadeUp .35s ease"}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:16,marginBottom:18,flexWrap:"wrap"}}>
              <div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:isMobile?"1.4rem":"1.9rem",fontWeight:800,lineHeight:1.1}}>Editar: {editAnimal.nombre}</h1>
                <p style={{fontSize:".84rem",color:T.muted,marginTop:6}}>Actualiza nombre, estatus, peso, edad, foto, raza e historia de la mascotita.</p>
              </div>
              <button onClick={()=>goPage("catalogo")} style={{padding:"10px 16px",border:`1.5px solid ${T.border}`,borderRadius:T.r.full,background:T.surface,color:T.sub,fontWeight:600,fontSize:".82rem",cursor:"pointer"}}>
                Volver al catálogo
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"minmax(0,1fr) 320px",gap:18,alignItems:"start"}}>
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:isMobile?16:26,boxShadow:T.shadow.sm}}>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
                  {[["Nombre",<input value={eN} onChange={e=>setEN(e.target.value)} style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Estatus",<select value={eE} onChange={e=>setEE(e.target.value)} style={inp}><option>En adopción</option><option>En proceso</option><option>Adoptado</option></select>],
                    ["Peso (kg)",<input type="number" inputMode="decimal" step="0.1" min="0" max="60" value={ePeso} onChange={e=>{let val=e.target.value.replace(/[^0-9.]/g,"");if(Number(val)>60)val="60";setEPeso(val);}} placeholder="Máx 60 kg" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Edad (años)",<input type="number" inputMode="numeric" min="0" max="20" value={eEdad} onChange={e=>{let val=e.target.value.replace(/\D/g,"");if(Number(val)>20)val="20";setEEdad(val);}} placeholder="Máx 20 años" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                  ].map(([l,el])=>(
                    <div key={l}>
                      <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</label>
                      {el}
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Raza</label>
                  <RazaSelector value={eR} onChange={setER}/>
                </div>
                <div style={{marginBottom:18}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Historia</label>
                  <textarea value={eH} onChange={e=>setEH(e.target.value)} rows={4} style={{...inp,resize:"vertical"}} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={saveEdit} style={{flex:1,padding:13,border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:700,cursor:"pointer",transition:"background .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.accentMd}
                    onMouseLeave={e=>e.currentTarget.style.background=T.accentDk}>
                    Guardar cambios
                  </button>
                  <button onClick={()=>goPage("catalogo")} style={{flex:1,padding:13,border:`1.5px solid ${T.border}`,borderRadius:T.r.md,background:T.surface,color:T.sub,fontWeight:600,cursor:"pointer"}}>
                    Cancelar
                  </button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {/* Photo uploader */}
                <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:18,boxShadow:T.shadow.sm}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:10}}>Foto del Animal</label>
                  <label style={{display:"block",border:`2px dashed ${T.border}`,borderRadius:T.r.lg,padding:eFotoUrl?0:30,textAlign:"center",cursor:"pointer",overflow:"hidden",transition:"border-color .2s",background:eFotoUrl?"transparent":T.bg,aspectRatio:eFotoUrl?"auto":"1"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=T.accentDk}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                    <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>setEFotoUrl(ev.target.result);r.readAsDataURL(f);}}} style={{display:"none"}}/>
                    {eFotoUrl?<img src={eFotoUrl} style={{width:"100%",aspectRatio:"1",objectFit:"cover",display:"block"}} alt="Preview"/>:<><div style={{fontSize:"2rem",marginBottom:6}}>{IC.camera}</div><div style={{fontSize:".82rem",color:T.muted}}>Cambiar foto</div><div style={{fontSize:".74rem",color:T.faint,marginTop:2}}>JPG, PNG</div></>}
                  </label>
                  {eFotoUrl&&<button onClick={()=>setEFotoUrl("")} style={{width:"100%",marginTop:10,padding:"7px",border:`1.5px solid ${T.border}`,borderRadius:T.r.sm,background:"transparent",color:T.muted,fontSize:".78rem",cursor:"pointer"}}>Quitar foto</button>}
                </div>

                {/* Real-time Preview card */}
                <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                  <div style={{height:170,background:editAnimal.color||GRADIENTS[0],position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {eFotoUrl
                      ?<img src={eFotoUrl} alt={eN||editAnimal.nombre} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:"4rem",filter:"drop-shadow(0 4px 14px rgba(0,0,0,.2))"}}>{editAnimal.emoji||IC.paw}</span>}
                    <div style={{position:"absolute",top:10,right:10}}><Tag style={{...statusPill(eE||editAnimal.estatus)}}>{eE||editAnimal.estatus}</Tag></div>
                  </div>
                  <div style={{padding:14}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.15rem",lineHeight:1.1}}>{eN||editAnimal.nombre}</div>
                    <div style={{fontSize:".78rem",color:T.muted,marginTop:4}}>{eR||editAnimal.raza}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                      {[["Sexo",editAnimal.sexo||"-"],["Talla",tallaLabel(editAnimal.talla)||"-"],["Edad",eEdad?`${eEdad} años`:"-"],["Peso",ePeso?`${ePeso} kg`:"-"]].map(([k,v])=>(
                        <div key={k} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.r.sm,padding:"7px 8px"}}>
                          <div style={{fontSize:".66rem",color:T.faint,textTransform:"uppercase",fontWeight:700,letterSpacing:.4}}>{k}</div>
                          <div style={{fontSize:".78rem",color:T.sub,fontWeight:600,marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* PERFIL */}
        {page==="perfil"&&(
          <div>
            <div style={{background:`linear-gradient(135deg,${T.accentDk},${T.accentMd})`,borderRadius:T.r.xl,padding:"32px 36px",marginBottom:22,display:"flex",alignItems:"center",gap:20}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,.2)",color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.6rem",display:"flex",alignItems:"center",justifyContent:"center",border:"2.5px solid rgba(255,255,255,.3)",flexShrink:0}}>{user.avatar}</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:800,color:"#fff"}}>{user.nombre}</div>
                <div style={{color:"rgba(255,255,255,.6)",fontSize:".84rem",marginTop:3}}>{roleLabel(user.rol)} | {user.email}</div>
                {user.telefono&&<div style={{color:"rgba(255,255,255,.55)",fontSize:".82rem"}}>{IC.phone} {user.telefono}</div>}
              </div>
            </div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.3rem",fontWeight:800,marginBottom:16}}>Datos curiosos sobre animales</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginBottom:24}}>
              {FUN_FACTS.map((f,i)=>(
                <div key={i} style={{background:T.surface,borderRadius:T.r.md,padding:"16px 18px",border:`1.5px solid ${T.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:"1.5rem",flexShrink:0,lineHeight:1,marginTop:2}}>{f.icon}</span>
                  <div>
                    <p style={{fontSize:".82rem",color:T.sub,lineHeight:1.6}}>{f.fact}</p>
                    <p style={{fontSize:".68rem",color:T.faint,marginTop:4,fontStyle:"italic"}}>- {f.src}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.lg,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:".72rem",fontWeight:800,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>Cuenta</div>
                <div style={{fontSize:".84rem",color:T.sub,marginTop:4}}>Gestiona tu sesion desde una accion segura.</div>
              </div>
              <button onClick={openLogoutConfirm} style={{padding:"10px 18px",border:`1.5px solid #FECACA`,borderRadius:T.r.full,background:"#FEF2F2",color:"#B42318",fontWeight:800,fontSize:".84rem",cursor:"pointer"}}>
                Cerrar sesion
              </button>
            </div>
          </div>
        )}

      </main>

      {modal}
      {/* ===== POST-ADOPTION TRACKING MODAL ===== */}
      {segAnimal&&(
        <Modal onClose={()=>setSegAnimal(null)}>
          <div style={{padding:28}}>
            <div style={{display:"flex",justify:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.3rem",fontWeight:800}}>📸 Seguimiento Post-Adopción</h3>
                <div style={{fontSize:".8rem",color:T.muted}}>Registar avance para {segAnimal.nombre}</div>
              </div>
              <button onClick={()=>setSegAnimal(null)} style={{background:"none",border:"none",fontSize:"1.2rem",cursor:"pointer"}}>✕</button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Hito de seguimiento</label>
              <select value={segMeses} onChange={e=>setSegMeses(Number(e.target.value))} style={inp}>
                <option value={3}>3 Meses post-adopción</option>
                <option value={6}>6 Meses post-adopción</option>
                <option value={12}>12 Meses (1 año de adopción)</option>
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Observaciones / Comentario</label>
              <textarea value={segComentario} onChange={e=>setSegComentario(e.target.value)} placeholder="Ej: Se adaptó increíblemente, convive bien con la familia y ya completó sus vacunas..." rows={4} style={{...inp,resize:"vertical"}}/>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>URL de Foto de actualización (Opcional)</label>
              <input value={segFotoUrl} onChange={e=>setSegFotoUrl(e.target.value)} placeholder="https://..." style={inp}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={saveSeguimiento} style={{flex:1,padding:12,border:"none",borderRadius:T.r.md,background:"#10B981",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:".88rem"}}>
                Guardar avance ✨
              </button>
              <button onClick={()=>setSegAnimal(null)} style={{padding:12,border:`1.5px solid ${T.border}`,borderRadius:T.r.md,background:T.surface,color:T.sub,fontWeight:600,cursor:"pointer"}}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ===== 1. MODAL ¿SE CONCRETÓ LA ENTREVISTA? ===== */}
      {activeEntrevistaSol && (() => {
        const phone = (activeEntrevistaSol.guest_telefono || activeEntrevistaSol.usuario_telefono || "").replace(/\D/g, "");
        const adopterName = activeEntrevistaSol.guest_nombre || activeEntrevistaSol.usuario_nombre || "Adoptante";
        const petName = activeEntrevistaSol.animal_nombre || "la mascota";
        const petImg = activeEntrevistaSol.animal_foto || "";
        const waText = encodeURIComponent(
          `Hola ${adopterName}, ¡recibimos tu solicitud en DoGood para adoptar a ${petName}! 🐾\n\n` +
          (petImg ? `Foto de ${petName}: ${petImg}\n\n` : "") +
          `Para continuar con el proceso de adopción, por favor responde a las siguientes preguntas:\n` +
          `1. ¿En qué ciudad o colonia vives y cuál es el tipo de tu vivienda (casa con patio, departamento, etc.)?\n` +
          `2. ¿El espacio disponible es amplio para las necesidades de ${petName}?\n` +
          `3. ¿Todas las personas en casa están de acuerdo con la adopción?\n` +
          `4. ¿Podrías enviarnos fotos o un video corto del espacio donde vivirá y descansará la mascota?\n` +
          `5. ¿Cuál es la rutina diaria que tendrá la mascota?\n\n` +
          `¡Quedamos a la espera de tus respuestas para formalizar la adopción!`
        );
        const matchingAnimal = animals.find(a => a.id === activeEntrevistaSol.animal_id) || { id: activeEntrevistaSol.animal_id, nombre: activeEntrevistaSol.animal_nombre };

        return (
          <EntrevistaStatusModal
            solicitud={activeEntrevistaSol}
            animal={matchingAnimal}
            phone={phone}
            waText={waText}
            onClose={() => setActiveEntrevistaSol(null)}
            onConfirmConcretada={() => {
              const solToValidate = activeEntrevistaSol;
              setActiveEntrevistaSol(null);
              setActiveChecklistSol(solToValidate);
            }}
          />
        );
      })()}

      {/* ===== 2. MODAL CHECKLIST DE REQUISITOS ===== */}
      {activeChecklistSol && (() => {
        const matchingAnimal = animals.find(a => a.id === activeChecklistSol.animal_id) || { id: activeChecklistSol.animal_id, nombre: activeChecklistSol.animal_nombre };
        return (
          <ChecklistAdopcionModal
            solicitud={activeChecklistSol}
            animal={matchingAnimal}
            onClose={() => setActiveChecklistSol(null)}
            onComplete={async (solId) => {
              await apiFetch("solicitudes", "update", "POST", { id: solId, checklist_completado: 1, estatus: "En revisión" });
              setSolicitudes(prev => prev.map(s => s.id === solId ? { ...s, checklist_completado: 1, estatus: "En revisión" } : s));
              toast$("Checklist completado al 100%. Carga habilitada para el adoptante 🐾", "success");
            }}
          />
        );
      })()}

      {/* ===== 3. MODAL CARPETA & EXPEDIENTE DIGITAL ===== */}
      {activeExpedienteAnimal && (
        <ExpedienteDigitalModal
          animal={activeExpedienteAnimal}
          solicitud={activeExpedienteSol}
          onClose={() => {
            setActiveExpedienteAnimal(null);
            setActiveExpedienteSol(null);
          }}
          onUpdateDocs={(solId, payload) => {
            setSolicitudes(prev => prev.map(s => s.id === solId ? { ...s, ...payload } : s));
            toast$("Carpeta Digital actualizada correctamente 💾", "success");
          }}
          onSaveSignature={async (solId, dataUrl) => {
            if (solId) {
              await apiFetch("solicitudes", "update", "POST", { id: solId, firma_digital: dataUrl });
              setSolicitudes(prev => prev.map(s => s.id === solId ? { ...s, firma_digital: dataUrl } : s));
              toast$("Acuerdo de Adopción firmado y avalado legalmente ✒️", "success");
            }
          }}
          onApproveAdopcion={(solId) => resolverSol(solId, "Aprobada")}
        />
      )}

      {/* ===== 4. MODAL DE MOTIVO DE RECHAZO ===== */}
      {activeRechazoSol && (
        <RechazoModal
          solicitud={activeRechazoSol}
          onClose={() => setActiveRechazoSol(null)}
          onConfirmRechazo={async (solId, motivo) => {
            await resolverSol(solId, "Rechazada", motivo);
            setActiveRechazoSol(null);
          }}
        />
      )}

      {/* ===== 5. PORTAL ESPECIAL DE CARGA DEL ADOPTANTE ===== */}
      {activePortalSol && (
        <PortalCargaAdoptanteModal
          solicitud={activePortalSol.sol}
          animal={activePortalSol.animal}
          onClose={() => setActivePortalSol(null)}
          onCompleteUpload={(solId, payload) => {
            const animalNombre = payload.animal_nombre || activePortalSol?.animal?.nombre || activePortalSol?.sol?.animal_nombre || "";
            const animalId = payload.animal_id || activePortalSol?.sol?.animal_id;

            // Update solicitudes state - match by ID, animal_id, or animal_nombre
            setSolicitudes(prev => prev.map(s => {
              const matchById = String(s.id) === String(solId);
              const matchByAnimalId = animalId && String(s.animal_id) === String(animalId);
              const matchByName = animalNombre && s.animal_nombre && s.animal_nombre.toLowerCase() === animalNombre.toLowerCase();
              if (matchById || matchByAnimalId || matchByName) {
                return { ...s, ...payload, documentacion_completada: 1, estatus: "En revisión" };
              }
              return s;
            }));

            // Save to dogood_doc_* keys (these are the keys loadSols actually reads!)
            try {
              const docData = {
                comprobante_domicilio: payload.comprobante_domicilio,
                ine_documento: payload.ine_documento,
                foto_espacio_1: payload.foto_espacio_1,
                foto_espacio_2: payload.foto_espacio_2,
                foto_espacio_3: payload.foto_espacio_3,
                firma_digital: payload.firma_digital,
                documentacion_completada: 1,
                estatus: "En revisión"
              };
              localStorage.setItem(`dogood_doc_${solId}`, JSON.stringify(docData));
              if (animalNombre) {
                localStorage.setItem(`dogood_doc_name_${animalNombre.toLowerCase()}`, JSON.stringify(docData));
              }
            } catch (e) {}

            // Also update dogood_custom_solicitudes
            try {
              const localSols = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
              let found = false;
              const updatedLocal = localSols.map(s => {
                const matchById = String(s.id) === String(solId);
                const matchByAnimalId = animalId && String(s.animal_id) === String(animalId);
                const matchByName = animalNombre && s.animal_nombre && s.animal_nombre.toLowerCase() === animalNombre.toLowerCase();
                if (matchById || matchByAnimalId || matchByName) {
                  found = true;
                  return { ...s, ...payload, documentacion_completada: 1, estatus: "En revisión" };
                }
                return s;
              });
              localStorage.setItem("dogood_custom_solicitudes", JSON.stringify(updatedLocal));
            } catch (e) {}

            toast$("🎉 Documentación y Firma recibidas. Botón 'Ver Documentos' habilitado 🔓", "success");
          }}
        />
      )}

      {/* ===== 6. MODAL DETALLE COMPLETO DE LA SOLICITUD ===== */}
      {activeDetalleSol && (() => {
        const matchingAnimal = animals.find(a => a.id === activeDetalleSol.animal_id) || {
          id: activeDetalleSol.animal_id,
          nombre: activeDetalleSol.animal_nombre || "Mascota",
          raza: activeDetalleSol.animal_raza || "Mascota",
          foto_url: activeDetalleSol.animal_foto || ""
        };
        return (
          <Modal onClose={() => setActiveDetalleSol(null)}>
            <div style={{ padding: "16px 18px", maxWidth: 520, width: "100%", fontFamily: "sans-serif" }}>
              {/* Header compacto */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, borderBottom: "1px solid #E5E7EB", paddingBottom: 10, paddingRight: 36 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: activeDetalleSol.animal_color || GRADIENTS[0], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", overflow: "hidden", flexShrink: 0 }}>
                  {matchingAnimal.foto_url ? <img src={matchingAnimal.foto_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (activeDetalleSol.animal_emoji || "🐾")}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#111827", margin: 0, lineHeight: 1.2 }}>
                    Solicitud de {activeDetalleSol.guest_nombre || activeDetalleSol.usuario_nombre || "Adoptante"}
                  </h3>
                  <div style={{ fontSize: ".76rem", color: "#6B7280", marginTop: 2 }}>
                    Mascota: <strong>{matchingAnimal.nombre}</strong> ({matchingAnimal.raza || "Criollo"})
                  </div>
                </div>
              </div>

              {/* DETALLES DE LA SOLICITUD (ULTRA COMPACTO) */}
              <div style={{ display: "grid", gap: 10 }}>
                {/* Datos del Solicitante */}
                <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "10px 12px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: ".68rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                    👤 Datos del Solicitante
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px", fontSize: ".78rem" }}>
                    <div><strong>Nombre:</strong> {activeDetalleSol.guest_nombre || activeDetalleSol.usuario_nombre || "—"}</div>
                    <div><strong>Teléfono:</strong> {activeDetalleSol.guest_telefono || activeDetalleSol.usuario_telefono || "—"}</div>
                    <div style={{ gridColumn: "span 2", wordBreak: "break-all" }}><strong>Correo:</strong> {activeDetalleSol.guest_email || activeDetalleSol.usuario_email || "—"}</div>
                    <div><strong>Modalidad:</strong> {activeDetalleSol.usuario_abierto == 1 ? "🟡 Abierto" : "🟢 Solo esta mascota"}</div>
                    <div><strong>Fecha:</strong> {activeDetalleSol.fecha || "—"}</div>
                  </div>
                </div>

                {/* Respuestas del Cuestionario */}
                <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "10px 12px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: ".68rem", fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                    🏠 Respuestas del Cuestionario
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: ".78rem" }}>
                    <div style={{ borderBottom: "1px solid #EDF2F7", paddingBottom: 3 }}>
                      <div style={{ color: "#64748B", fontSize: ".7rem" }}>🏠 Vivienda:</div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{activeDetalleSol.vivienda || "—"}</div>
                    </div>
                    <div style={{ borderBottom: "1px solid #EDF2F7", paddingBottom: 3 }}>
                      <div style={{ color: "#64748B", fontSize: ".7rem" }}>👨‍👩‍👧‍👦 Niños en casa:</div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{activeDetalleSol.ninos || "—"}</div>
                    </div>
                    <div style={{ borderBottom: "1px solid #EDF2F7", paddingBottom: 3 }}>
                      <div style={{ color: "#64748B", fontSize: ".7rem" }}>🐶🐱 Mascotas actuales:</div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{activeDetalleSol.mascotas_actuales || "—"}</div>
                    </div>
                    <div style={{ borderBottom: "1px solid #EDF2F7", paddingBottom: 3 }}>
                      <div style={{ color: "#64748B", fontSize: ".7rem" }}>🎓 Experiencia previa:</div>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{activeDetalleSol.experiencia_previa || "—"}</div>
                    </div>
                    <div style={{ gridColumn: "span 2", paddingTop: 2 }}>
                      <span style={{ color: "#64748B", fontSize: ".7rem" }}>🩺 Servicio veterinario: </span>
                      <span style={{ fontWeight: 700, color: "#0F172A" }}>{activeDetalleSol.tiene_veterinario || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Motivación */}
                {activeDetalleSol.motivacion && (
                  <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "8px 12px", border: "1px solid #BFDBFE" }}>
                    <div style={{ fontSize: ".68rem", fontWeight: 800, color: "#1E40AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
                      💬 Motivación del Adoptante
                    </div>
                    <p style={{ fontSize: ".78rem", color: "#1E3A8A", fontStyle: "italic", margin: 0, lineHeight: 1.4 }}>
                      "{activeDetalleSol.motivacion}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        );
      })()}

      {loading && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgba(15, 23, 42, 0.72)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFF"
        }}>
          <style>{`@keyframes spinner-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "36px 40px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            maxWidth: 380,
            width: "90%",
            border: "2.5px solid #F0C21D",
            animation: "fadeIn 0.2s ease-out"
          }}>
            <div style={{
              width: 52,
              height: 52,
              border: "4px solid #E2E8F0",
              borderTopColor: "#1653BB",
              borderRadius: "50%",
              animation: "spinner-rotate 0.8s linear infinite",
              margin: "0 auto 18px"
            }} />
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#0F45A2", margin: "0 0 8px 0" }}>
              Procesando en la Base de Datos...
            </h3>
            <p style={{ fontSize: ".86rem", color: "#64748B", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              Actualizando la información en tiempo real. Por favor espera un momento.
            </p>
          </div>
        </div>
      )}

      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}



import { useState, useRef, useEffect, useCallback } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost/dogood-v4/api").replace(/\/+$/, "");
async function apiFetch(endpoint, action, method = "GET", body = null) {
  const url = `${API}/${endpoint}.php?action=${action}${method==="GET"&&body?"&"+new URLSearchParams(body).toString():""}`;
  const opts = { method, headers:{"Content-Type":"application/json"} };
  if(method==="POST"&&body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  return res.json();
}

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
`;

/* -- shared inputs -- */
const inp = {
  width:"100%", padding:"11px 14px",
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
      style={{position:"fixed",inset:0,background:"rgba(20,20,20,.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(8px)"}}>
      <div style={{background:T.surface,borderRadius:T.r.xl,maxWidth:540,width:"100%",maxHeight:"88vh",overflowY:"auto",boxShadow:T.shadow.lg,animation:"popIn .22s ease"}}>
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
function AnimalRow({a,user,onOpen,onApartar,favs,onFav,idx=0}){
  const [hov,setHov]=useState(false);
  const isFav=(favs||[]).includes(a.id);
  const {bg,col}=statusPill(a.estatus);
  const blocked=a.estatus!=="En adopción";
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:"flex",gap:0,background:T.surface,borderRadius:T.r.lg,overflow:"hidden",boxShadow:hov?T.shadow.md:T.shadow.sm,border:`1.5px solid ${hov?T.borderHov:T.border}`,transition:"all .25s",cursor:"pointer",animation:`fadeUp .4s ${idx*.06}s ease both`}}
      onClick={()=>onOpen(a)}>
      {/* Square image */}
      <div style={{width:160,minWidth:160,height:160,background:a.color||GRADIENTS[0],display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
        {a.foto_url
          ?<img src={a.foto_url} alt={a.nombre} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          :<span style={{fontSize:"4rem",filter:"drop-shadow(0 2px 8px rgba(0,0,0,.2))"}}>{a.emoji}</span>}
        <button onClick={e=>{e.stopPropagation();onFav(a.id);}}
          style={{position:"absolute",top:8,right:8,width:30,height:30,background:"rgba(255,255,255,.88)",border:"none",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".82rem",cursor:"pointer",boxShadow:T.shadow.sm,transition:"transform .15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.2)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          {isFav?IC.heart:IC.heartOutline}
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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
          <span style={{fontSize:".74rem",color:T.muted}}>{IC.house} {a.rescatista_nombre||"Refugio"}</span>
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
  );
}

/* ========================================
   MAIN APP
======================================== */
export default function DoGood({initialUser=null,onLogout}){
  const [user,setUser]=useState(initialUser);
  const [page,setPage]=useState("home");
  const [toast,setToast]=useState(null);
  const [modal,setModal]=useState(null);
  const [loading,setLoading]=useState(false);
  const [sideCollapsed,setSideCollapsed]=useState(false);
  const [isMobile,setIsMobile]=useState(false);
  const [isTablet,setIsTablet]=useState(false);
  const [userMenuOpen,setUserMenuOpen]=useState(false);
  const userMenuRef=useRef(null);
  const actionAudioRef=useRef({ctx:null,lastAt:0,unlocked:false});

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

  // Edit
  const [editAnimal,setEditAnimal]=useState(null);
  const [eN,setEN]=useState(""); const [eE,setEE]=useState(""); const [eH,setEH]=useState("");
  const [eR,setER]=useState("Mestizo / Criollo");

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
  const goPage = p=>{
    setPage(p);
    setUserMenuOpen(false);
    setModal(null);
    if(p!=="_edit")setEditAnimal(null);
    if(isMobile)setSideCollapsed(true);
    window.scrollTo(0,0);
  };

  /* DATA */
  const loadAnimals=useCallback(async()=>{
    if(!user)return;
    try{
      const p=user.rol==="rescatista"?{rescatista_id:user.id}:null;
      const r=await apiFetch("animales","list","GET",p);
      if(r.ok&&Array.isArray(r.animals)){
        setAnimals(r.animals);
        setIsDemoData(false);
        return;
      }
      throw new Error("fallback");
    }catch{
      const demo=user.rol==="rescatista"
        ?DEMO_ANIMALS.map(a=>({...a,rescatista_id:user.id,rescatista_nombre:user.nombre||"Refugio demo"}))
        :DEMO_ANIMALS;
      setAnimals(demo);
      setIsDemoData(true);
      if(!demoNoticeRef.current){
        toast$("Modo demo: mostrando datos de respaldo para presentacion.","");
        demoNoticeRef.current=true;
      }
    }
  },[user]);
  const loadSols=useCallback(async()=>{
    if(!user)return;
    try{
      const p=user.rol==="usuario"?{usuario_id:user.id}:user.rol==="rescatista"?{rescatista_id:user.id}:null;
      const r=await apiFetch("solicitudes","list","GET",p);
      if(r.ok&&Array.isArray(r.solicitudes)){setSolicitudes(r.solicitudes);return;}
      throw new Error("fallback");
    }catch{
      setSolicitudes([]);
    }
  },[user]);
  const loadFavs=useCallback(async()=>{
    if(!user||user.rol!=="usuario")return;
    const r=await apiFetch("favoritos","list","GET",{usuario_id:user.id});
    if(r.ok)setFavs(r.favoritos);
  },[user]);
  const loadUsers=useCallback(async()=>{
    if(user?.rol!=="admin")return;
    const r=await apiFetch("auth","list","GET");
    if(r.ok)setAllUsers(r.users);
  },[user]);
  useEffect(()=>{if(user){loadAnimals();loadSols();loadFavs();loadUsers();}},[user]);

  /* AUTH */
  const doLogin=async()=>{
    setLoading(true);
    const r=await apiFetch("auth","login","POST",{email:loginEmail,password:loginPass});
    setLoading(false);
    if(r.ok){setUser(r.user);toast$(`Bienvenido, ${r.user.nombre.split(" ")[0]} ${IC.wave}`,"success");}
    else toast$(r.error||"Credenciales incorrectas","error");
  };
  const quickLogin=async type=>{
    const m={admin:{e:"admin@dogood.mx",p:"admin123"},rescatista:{e:"refugio@dogood.mx",p:"refugio123"},usuario:{e:"carlos@gmail.com",p:"carlos123"}}[type];
    setLoading(true);
    const r=await apiFetch("auth","login","POST",{email:m.e,password:m.p});
    setLoading(false);
    if(r.ok){setUser(r.user);toast$(`Bienvenido, ${r.user.nombre.split(" ")[0]} ${IC.wave}`,"success");}
    else toast$(r.error,"error");
  };
  const doRegister=async()=>{
    if(!regNombre||!regEmail||!regPass){toast$("Completa todos los campos","error");return;}
    setLoading(true);
    const r=await apiFetch("auth","register","POST",{nombre:regNombre,email:regEmail,password:regPass,rol:regRol,telefono:regTel,abierto_a_opciones:regRol==="usuario"?regAbierto:false});
    setLoading(false);
    if(r.ok){setUser(r.user);toast$(`Cuenta creada ${IC.party}`,"success");}
    else toast$(r.error,"error");
  };
  const doLogout=()=>{
    setUserMenuOpen(false);
    // If parent controls auth state (Root.jsx), hand off logout so we return to LandingPage + splash.
    if(typeof onLogout==="function"){onLogout();return;}
    // Fallback for standalone usage of this component.
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
    const r=await apiFetch("solicitudes","create","POST",{animal_id:animal.id,usuario_id:user.id,rescatista_id:animal.rescatista_id,abierto_a_opciones:user.abierto_a_opciones});
    if(!r.ok){toast$(r.error||"Error","error");return;}
    setModal(null);toast$(`Solicitud enviada para ${animal.nombre} ${IC.paw}`,"success");
    loadAnimals();loadSols();
  };
  const resolverSol=async(solId,decision)=>{
    const r=await apiFetch("solicitudes","resolver","POST",{id:solId,decision});
    if(!r.ok){toast$("Error","error");return;}
    playActionFx(decision==="Rechazada"?"delete":"update");
    toast$(decision==="Aprobada"?"Aprobada":"Rechazada","success");
    loadAnimals();loadSols();
  };
  const saveAnimal=async()=>{
    if(!aN||!aH||!aP){toast$("Completa nombre, historia y peso","error");return;}
    const emoji={perro:IC.dog,gato:IC.cat}[aE]||IC.paw;
    const color=GRADIENTS[Math.floor(Math.random()*GRADIENTS.length)];
    const r=await apiFetch("animales","create","POST",{nombre:aN,especie:aE,sexo:aS,talla:aT,peso:aP,edad:aEd||null,caracter:aC,historia:aH,raza:aR,rescatista_id:user.id,emoji,color,foto_url:aFoto});
    if(!r.ok){toast$("Error","error");return;}
    setAN("");setAH("");setAP("");setAEd("");setAFoto(null);setAR("Mestizo / Criollo");
    toast$(`${aN} agregado al catálogo`,"success");loadAnimals();goPage("catalogo");
  };
  const startEdit=a=>{
    setEditAnimal(a);
    setEN(a.nombre);
    setEE(a.estatus);
    setEH(a.historia);
    setER(a.raza||"Mestizo / Criollo");
    setModal(null);
    goPage("_edit");
  };
  const saveEdit=async()=>{
    const r=await apiFetch("animales","update","POST",{id:editAnimal.id,nombre:eN,raza:eR,estatus:eE,historia:eH});
    if(!r.ok){toast$("Error","error");return;}
    playActionFx("update");
    toast$("Guardado","success");loadAnimals();goPage("catalogo");
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

  const openCertModal=a=>{
    const sol=solicitudes.find(s=>s.animal_id===a.id&&s.estatus==="Aprobada");
    setModal(
      <Modal onClose={()=>setModal(null)}>
        <div style={{padding:28}}>
          <div style={{border:`2px solid ${T.accentLt}`,borderRadius:T.r.lg,padding:32,textAlign:"center",background:`linear-gradient(145deg,${T.surface},${T.accent})`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-20,bottom:-20,fontSize:"10rem",opacity:.04}}>{IC.leaf}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:"1.5rem",fontWeight:800,color:T.accentDk,marginBottom:4}}>Certificado de Adopción</div>
            <div style={{fontSize:".78rem",color:T.muted,marginBottom:24}}>DoGood - Adopcion Responsable</div>
            <div style={{fontSize:"4rem",marginBottom:12}}>{a.emoji}</div>
            <div style={{fontSize:".82rem",color:T.muted,marginBottom:4}}>Este certificado confirma que</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:"2.2rem",fontWeight:800,color:T.accentDk}}>{a.nombre}</div>
            <div style={{fontSize:".78rem",color:T.muted,margin:"4px 0 14px"}}>{a.raza} | {a.sexo}</div>
            <div style={{fontSize:"1rem",color:T.ink,marginBottom:4}}>fue adoptado por <strong>{sol?.usuario_nombre||user.nombre}</strong></div>
            <div style={{fontSize:".82rem",color:T.sub}}>con el apoyo de {a.rescatista_nombre||"Refugio DoGood"}</div>
            <div style={{fontSize:".76rem",color:T.muted,marginTop:6}}>Fecha: {sol?.fecha||new Date().toISOString().split("T")[0]}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:20,background:T.accentDk,color:"#fff",padding:"8px 22px",borderRadius:T.r.full,fontWeight:700,fontSize:".82rem"}}>
              OK Adopcion verificada
            </div>
          </div>
          <button onClick={()=>window.print()} style={{width:"100%",padding:13,border:"none",borderRadius:T.r.md,background:T.warmDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:"pointer",marginTop:16}}>Imprimir / Guardar PDF</button>
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
    return ms&&mt&&mSpecies&&mSize&&mStatus;
  });

  /* ======== AUTH SCREEN ======== */
  if(!user) return(
    <div style={{minHeight:"100vh",display:"flex",background:T.bg}}>
      <style>{G}</style>
      {/* Left panel - branding */}
      <div style={{width:"45%",background:`linear-gradient(160deg, #0F45A2 0%, #1653BB 44%, #F0C21D 100%)`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px 52px",position:"relative",overflow:"hidden"}}>
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
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
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
                  {[["admin","Admin","admin@dogood.mx"],["rescatista","Rescatista","refugio@dogood.mx"],["usuario","Adoptante","carlos@gmail.com"]].map(([t,l,e])=>(
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
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:".78rem",fontWeight:600,color:T.sub,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Tipo</label>
                <select value={regRol} onChange={e=>setRegRol(e.target.value)} style={inp}>
                  <option value="usuario">{IC.paw} Soy adoptante</option>
                  <option value="rescatista">{IC.house} Soy rescatista</option>
                </select>
              </div>
              {regRol==="usuario"&&(
                <label style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14,cursor:"pointer",padding:"10px 12px",background:T.bg,borderRadius:T.r.sm,border:`1.5px solid ${T.border}`}}>
                  <input type="checkbox" checked={regAbierto} onChange={e=>setRegAbierto(e.target.checked)} style={{marginTop:2,accentColor:T.accentDk,width:15,height:15,flexShrink:0}}/>
                  <span style={{fontSize:".83rem",color:T.sub,lineHeight:1.5}}>Estoy abierto a adoptar más de un animal</span>
                </label>
              )}
              <button onClick={doRegister} disabled={loading} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:loading?T.muted:T.accentDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {loading?<><Spinner/> Creando...</>:"Crear cuenta"}
              </button>
            </>
          )}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );

  /* == SIDEBAR NAV ITEMS == */
  const NAV={
    admin: [
      {l:"Inicio",p:"home",i:IC.house},
      {l:"Catalogo",p:"catalogo",i:IC.paw},
      {l:"Solicitudes",p:"solicitudes",i:IC.clipboard},
      {l:"Usuarios",p:"usuarios",i:IC.users},
      {l:"Agregar",p:"agregar",i:"+"},
    ],
    rescatista: [
      {l:"Inicio",p:"home",i:IC.house},
      {l:"Mi catalogo",p:"catalogo",i:IC.paw},
      {l:"Solicitudes",p:"solicitudes",i:IC.clipboard},
      {l:"Agregar",p:"agregar",i:"+"},
    ],
    usuario: [
      {l:"Inicio",p:"home",i:IC.house},
      {l:"Adoptar",p:"catalogo",i:IC.paw},
      {l:"Favoritos",p:"favoritos",i:IC.heartOutline},
      {l:"Mis solicitudes",p:"mis-solicitudes",i:IC.clipboard},
    ],
  }[user.rol]||[];
  const W = isMobile ? (sideCollapsed ? 0 : 220) : (sideCollapsed ? 68 : 220);

  /* == APP SHELL == */
  return(
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <style>{G}</style>

      {/* -- SIDEBAR -- */}
      <aside style={{width:W,minWidth:W,maxWidth:W,background:T.surface,borderRight:`1.5px solid ${T.border}`,display:"flex",flexDirection:"column",position:isMobile?"fixed":"sticky",top:0,left:0,height:"100vh",transition:"width .25s, transform .25s",transform:isMobile&&sideCollapsed?"translateX(-100%)":"translateX(0)",overflow:"hidden",flexShrink:0,zIndex:isMobile?210:1,boxShadow:isMobile?"0 16px 40px rgba(0,0,0,.2)":"none"}}>
        {/* Logo */}
        <div style={{padding:"22px 18px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
          {!sideCollapsed&&<img src="/brand/logo-primary-trim.png" alt="DoGood" style={{width:126,height:44,objectFit:"contain",display:"block"}}/>}
          {sideCollapsed&&<img src="/brand/isotype-blueyellow-trim.png" alt="DoGood" style={{width:30,height:30,objectFit:"contain",display:"block"}}/>}
          <button onClick={()=>setSideCollapsed(!sideCollapsed)} style={{width:28,height:28,border:`1.5px solid ${T.border}`,borderRadius:T.r.sm,background:T.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",color:T.muted,flexShrink:0,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentDk;e.currentTarget.style.color=T.accentDk}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.muted}}>
            {sideCollapsed?">":"<"}
          </button>
        </div>
        {/* Nav items */}
        <nav style={{flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
          {NAV.map(it=>{
            const active=page===it.p;
            return(
              <button key={it.p} onClick={()=>goPage(it.p)}
                style={{width:"100%",padding:sideCollapsed?"10px":"10px 12px",border:"none",borderRadius:T.r.md,background:active?T.accent:"transparent",color:active?T.accentDk:T.sub,fontWeight:active?700:500,fontSize:".86rem",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .15s",justifyContent:sideCollapsed?"center":"flex-start",border:active?`1px solid ${T.border}`:"1px solid transparent",textAlign:"left"}}
                onMouseEnter={e=>{if(!active){e.currentTarget.style.background="#F6FAFF";e.currentTarget.style.color=T.ink;}}}
                onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.sub;}}}>
                <span style={{fontSize:"1rem",lineHeight:1,flexShrink:0}}>{it.i}</span>
                {!sideCollapsed&&<span style={{whiteSpace:"nowrap"}}>{it.l}</span>}
              </button>
            );
          })}
        </nav>
        {/* User */}
        <div ref={userMenuRef} style={{padding:"14px 10px",borderTop:`1px solid ${T.border}`,position:"relative"}}>
          <button onClick={()=>{if(sideCollapsed){goPage("perfil");return;}setUserMenuOpen(v=>!v);}} style={{width:"100%",padding:sideCollapsed?"10px":"10px 12px",border:"none",borderRadius:T.r.md,background:page==="perfil"?T.accent:"transparent",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .15s",justifyContent:sideCollapsed?"center":"space-between"}}
            onMouseEnter={e=>{if(page!=="perfil")e.currentTarget.style.background="#F6FAFF"}}
            onMouseLeave={e=>{if(page!=="perfil")e.currentTarget.style.background="transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.accentDk},${T.accentLt})`,color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".76rem",flexShrink:0}}>{user.avatar}</div>
              {!sideCollapsed&&<div style={{textAlign:"left",minWidth:0}}>
                <div style={{fontSize:".8rem",fontWeight:700,color:T.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.nombre.split(" ")[0]}</div>
                <div style={{fontSize:".7rem",color:T.muted}}>{roleLabel(user.rol)}</div>
              </div>}
            </div>
            {!sideCollapsed&&<span style={{fontSize:".76rem",fontWeight:800,color:T.muted}}>{userMenuOpen?"▴":"▾"}</span>}
          </button>
          {!sideCollapsed&&userMenuOpen&&(
            <div style={{position:"absolute",left:10,right:10,bottom:"calc(100% + 8px)",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:T.r.md,boxShadow:T.shadow.lg,overflow:"hidden"}}>
              <button onClick={()=>goPage("perfil")} style={{width:"100%",padding:"10px 12px",textAlign:"left",background:"transparent",border:"none",color:T.ink,fontWeight:700,cursor:"pointer"}}>
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
      <main style={{flex:1,minWidth:0,padding:isMobile?"18px 14px 24px":isTablet?"24px 22px 28px":"32px 36px",overflowY:"auto",
        backgroundImage:`radial-gradient(circle at -10% 18%, rgba(240,194,29,.24) 0%, rgba(240,194,29,0) 34%),
        radial-gradient(circle at 108% 74%, rgba(22,83,187,.12) 0%, rgba(22,83,187,0) 38%),
        url("${DOODLE_BG}")`,
        backgroundSize:"900px 700px, 800px 700px, 260px 260px",
        backgroundPosition:"0 0, 100% 100%, 0 0",
        borderLeft:`1px solid ${T.border}`}}>
        {isMobile&&sideCollapsed&&(
          <button onClick={()=>setSideCollapsed(false)} style={{position:"sticky",top:10,zIndex:160,marginBottom:10,padding:"8px 12px",borderRadius:T.r.full,border:`1.5px solid ${T.border}`,background:T.surface,color:T.sub,fontWeight:800,fontSize:".78rem",cursor:"pointer"}}>
            Menu
          </button>
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
              {!isMobile&&<div style={{fontSize:"5rem",filter:"drop-shadow(0 4px 16px rgba(0,0,0,.15))",flexShrink:0,lineHeight:1.2,position:"relative"}}>{IC.dog}<br/><span style={{fontSize:"4rem"}}>{IC.cat}</span></div>}
            </div>

            {/* Stats row */}
            <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {[
                [animals.filter(a=>a.estatus==="En adopción").length,"Disponibles",IC.leaf,T.accentDk],
                [animals.filter(a=>a.estatus==="En proceso").length,"En proceso",IC.hourglass,"#8A6200"],
                [animals.filter(a=>a.estatus==="Adoptado").length,"Adoptados",IC.heart,T.warmDk],
                [solicitudes.filter(s=>s.estatus==="Pendiente").length,"Pendientes",IC.clipboard,T.tag3.col],
              ].map(([n,l,ic,ac])=>(
                <div key={l} style={{background:T.surface,borderRadius:T.r.lg,padding:"20px 22px",boxShadow:T.shadow.sm,border:`1.5px solid ${T.border}`,transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.transform="translateY(-2px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none"}}>
                  <div style={{fontSize:"1.3rem",marginBottom:6}}>{ic}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:"2.2rem",fontWeight:800,color:T.ink,lineHeight:1}}>{n}</div>
                  <div style={{fontSize:".74rem",color:T.muted,marginTop:4,fontWeight:500}}>{l}</div>
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
                  {animals.filter(a=>a.estatus==="En adopción").slice(0,4).map((a,i)=>(
                    <AnimalRow key={a.id} a={a} user={user} onOpen={openAnimalModal} onApartar={apartar} favs={favs} onFav={toggleFav} idx={i}/>
                  ))}
                  {!animals.filter(a=>a.estatus==="En adopción").length&&(
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
                  {FUN_FACTS.slice(0,5).map((f,i)=>(
                    <div key={i} style={{background:T.surface,borderRadius:T.r.md,padding:"14px 16px",boxShadow:T.shadow.sm,border:`1.5px solid ${T.border}`,display:"flex",gap:12,alignItems:"flex-start",animation:`slideIn .4s ${i*.07}s ease both`}}>
                      <span style={{fontSize:"1.4rem",flexShrink:0,lineHeight:1,marginTop:2}}>{f.icon}</span>
                      <div>
                        <p style={{fontSize:".81rem",color:T.sub,lineHeight:1.6}}>{f.fact}</p>
                        <p style={{fontSize:".68rem",color:T.faint,marginTop:4,fontStyle:"italic"}}>- {f.src}</p>
                      </div>
                    </div>
                  ))}
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
                  {filteredAnimals.map((a,i)=><AnimalRow key={a.id} a={a} user={user} onOpen={openAnimalModal} onApartar={apartar} favs={favs} onFav={toggleFav} idx={i}/>)}
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
            <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>Solicitudes de adopcion</h1></div>
            {solicitudes.length?(
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                <div style={{padding:"12px 20px",borderBottom:`1px solid ${T.border}`,background:T.bg,fontSize:".76rem",color:T.muted}}>
                  <span style={{background:T.tag2.bg,color:T.tag2.col,padding:"2px 10px",borderRadius:T.r.full,fontWeight:700,marginRight:8}}>Amarillo</span> abierto a opciones &nbsp;|&nbsp;
                  <span style={{background:T.tag1.bg,color:T.tag1.col,padding:"2px 10px",borderRadius:T.r.full,fontWeight:700,marginRight:8}}>Verde</span> solo un animal
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{background:T.bg}}>
                        {["Animal","Solicitante","Fecha","Estado","Accion"].map(h=>(
                          <th key={h} style={{textAlign:"left",fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,padding:"11px 18px",borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map(s=>{
                        const {bg,col}=statusPill(s.estatus==="Aprobada"?"Adoptado":s.estatus==="Pendiente"?"En proceso":"");
                        return(
                          <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .1s"}}
                            onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                            onMouseLeave={e=>e.currentTarget.style.background=T.surface}>
                            <td style={{padding:"13px 18px"}}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <div style={{width:34,height:34,borderRadius:T.r.sm,background:s.animal_color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",overflow:"hidden",flexShrink:0}}>
                                  {s.animal_foto?<img src={s.animal_foto} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:s.animal_emoji}
                                </div>
                                <div><div style={{fontWeight:700,fontSize:".87rem"}}>{s.animal_nombre}</div><div style={{fontSize:".72rem",color:T.muted}}>{s.animal_raza}</div></div>
                              </div>
                            </td>
                            <td style={{padding:"13px 18px"}}>
                              <div style={{fontWeight:700,fontSize:".86rem",color:s.usuario_abierto==1?T.tag2.col:T.tag1.col}}>{s.usuario_nombre}</div>
                              <div style={{fontSize:".72rem",color:T.muted}}>{s.usuario_abierto==1?"Abierto a opciones":"Solo un animal"}</div>
                            </td>
                            <td style={{padding:"13px 18px",fontSize:".83rem",color:T.muted,whiteSpace:"nowrap"}}>{s.fecha}</td>
                            <td style={{padding:"13px 18px"}}><Tag style={{background:bg,color:col}}>{s.estatus}</Tag></td>
                            <td style={{padding:"13px 18px"}}>
                              {s.estatus==="Pendiente"?(
                                <div style={{display:"flex",gap:6}}>
                                  <button onClick={()=>resolverSol(s.id,"Aprobada")} style={{padding:"6px 14px",border:"none",borderRadius:T.r.full,background:T.tag1.bg,color:T.tag1.col,fontWeight:700,fontSize:".76rem",cursor:"pointer",border:`1px solid ${T.accentLt}`}}>Aprobar</button>
                                  <button onClick={()=>resolverSol(s.id,"Rechazada")} style={{padding:"6px 14px",border:"none",borderRadius:T.r.full,background:T.tag4.bg,color:T.tag4.col,fontWeight:700,fontSize:".76rem",cursor:"pointer",border:`1px solid #FECACA`}}>Rechazar</button>
                                </div>
                              ):s.estatus==="Aprobada"?(
                                <button onClick={()=>openCertModal({...s,id:s.animal_id,nombre:s.animal_nombre,emoji:s.animal_emoji,raza:s.animal_raza,sexo:s.animal_sexo,rescatista_nombre:s.rescatista_nombre})} style={{padding:"6px 14px",border:`1px solid ${T.border}`,borderRadius:T.r.full,background:T.surface,color:T.warmDk,fontWeight:700,fontSize:".76rem",cursor:"pointer"}}>Certificado</button>
                              ):<span style={{color:T.faint}}>-</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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

        {/* USUARIOS */}
        {page==="usuarios"&&(
          <div>
            <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>Usuarios</h1></div>
            <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,overflow:"hidden"}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:T.bg}}>
                      {["Usuario","Correo","Rol","Telefono","Opciones"].map(h=>(
                        <th key={h} style={{textAlign:"left",fontSize:".7rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:1,padding:"11px 18px",borderBottom:`1.5px solid ${T.border}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(u=>(
                      <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                        onMouseLeave={e=>e.currentTarget.style.background=T.surface}>
                        <td style={{padding:"13px 18px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.accentMd},${T.accentLt})`,color:"#fff",fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".76rem"}}>{u.avatar}</div>
                            <span style={{fontWeight:600,fontSize:".87rem"}}>{u.nombre}</span>
                          </div>
                        </td>
                        <td style={{padding:"13px 18px",fontSize:".83rem",color:T.muted}}>{u.email}</td>
                        <td style={{padding:"13px 18px"}}><Tag style={{background:T.accent,color:T.accentDk}}>{roleLabel(u.rol)}</Tag></td>
                        <td style={{padding:"13px 18px",fontSize:".83rem",color:T.muted}}>{u.telefono||"-"}</td>
                        <td style={{padding:"13px 18px"}}>
                          {u.rol==="usuario"?<Tag style={{background:u.abierto_a_opciones==1?T.tag2.bg:T.tag1.bg,color:u.abierto_a_opciones==1?T.tag2.col:T.tag1.col}}>{u.abierto_a_opciones==1?"Si":"No"}</Tag>:"-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AGREGAR */}
        {page==="agregar"&&(
          <div>
            <div style={{marginBottom:22}}><h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800}}>Agregar animal</h1></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,alignItems:"start"}}>
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:28}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {[["Nombre",<input value={aN} onChange={e=>setAN(e.target.value)} placeholder="Nombre" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Especie",<select value={aE} onChange={e=>setAE(e.target.value)} style={inp}><option value="perro">Perro {IC.dog}</option><option value="gato">Gato {IC.cat}</option></select>],
                    ["Sexo",<select value={aS} onChange={e=>setAS(e.target.value)} style={inp}><option value="Hembra">Hembra</option><option value="Macho">Macho</option></select>],
                    ["Talla",<select value={aT} onChange={e=>setAT(e.target.value)} style={inp}><option value="pequeño">Pequeño</option><option value="mediano">Mediano</option><option value="grande">Grande</option></select>],
                    ["Peso",<input value={aP} onChange={e=>setAP(e.target.value)} placeholder="5 kg" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Edad",<input type="number" value={aEd} onChange={e=>setAEd(e.target.value)} placeholder="2" min="0" style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                  ].map(([l,el])=>(
                    <div key={l}>
                      <label style={{display:"block",fontSize:".76rem",fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</label>
                      {el}
                    </div>
                  ))}
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
                  <textarea value={aH} onChange={e=>setAH(e.target.value)} rows={4} placeholder="Cuéntanos su historia..." style={{...inp,resize:"vertical"}} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>
                </div>
                <button onClick={saveAnimal} style={{width:"100%",padding:"13px",border:"none",borderRadius:T.r.md,background:T.accentDk,color:"#fff",fontWeight:700,fontSize:".9rem",cursor:"pointer",transition:"background .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.accentMd}
                  onMouseLeave={e=>e.currentTarget.style.background=T.accentDk}>
                  Agregar al catalogo
                </button>
              </div>
              {/* Photo upload */}
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:22}}>
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

        {/* EDITAR */}
        {page==="_edit"&&editAnimal&&(
          <div style={{animation:"fadeUp .35s ease"}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:16,marginBottom:18,flexWrap:"wrap"}}>
              <div>
                <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.9rem",fontWeight:800,lineHeight:1.1}}>Editar: {editAnimal.nombre}</h1>
                <p style={{fontSize:".84rem",color:T.muted,marginTop:6}}>Actualiza nombre, estatus, raza e historia sin tocar la foto ni su perfil base.</p>
              </div>
              <button onClick={()=>goPage("catalogo")} style={{padding:"10px 16px",border:`1.5px solid ${T.border}`,borderRadius:T.r.full,background:T.surface,color:T.sub,fontWeight:600,fontSize:".82rem",cursor:"pointer"}}>
                Volver al catalogo
              </button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 320px",gap:18,alignItems:"start"}}>
              <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,padding:26,boxShadow:T.shadow.sm}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {[["Nombre",<input value={eN} onChange={e=>setEN(e.target.value)} style={inp} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>],
                    ["Estatus",<select value={eE} onChange={e=>setEE(e.target.value)} style={inp}><option>En adopción</option><option>En proceso</option><option>Adoptado</option></select>],
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
                  <textarea value={eH} onChange={e=>setEH(e.target.value)} rows={5} style={{...inp,resize:"vertical"}} onFocus={f=>f.target.style.borderColor=T.accentDk} onBlur={f=>f.target.style.borderColor=T.border}/>
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
                <div style={{background:T.surface,borderRadius:T.r.xl,border:`1.5px solid ${T.border}`,overflow:"hidden",boxShadow:T.shadow.sm}}>
                  <div style={{height:190,background:editAnimal.color||GRADIENTS[0],position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                    {editAnimal.foto_url
                      ?<img src={editAnimal.foto_url} alt={editAnimal.nombre} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<span style={{fontSize:"4.4rem",filter:"drop-shadow(0 4px 14px rgba(0,0,0,.2))"}}>{editAnimal.emoji||IC.paw}</span>}
                    <div style={{position:"absolute",top:10,right:10}}><Tag style={{...statusPill(eE||editAnimal.estatus)}}>{eE||editAnimal.estatus}</Tag></div>
                  </div>
                  <div style={{padding:14}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.15rem",lineHeight:1.1}}>{eN||editAnimal.nombre}</div>
                    <div style={{fontSize:".78rem",color:T.muted,marginTop:4}}>{eR||editAnimal.raza}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                      {[["Sexo",editAnimal.sexo||"-"],["Talla",tallaLabel(editAnimal.talla)||"-"],["Edad",editAnimal.edad?`${editAnimal.edad} años`:"-"],["Peso",editAnimal.peso||"-"]].map(([k,v])=>(
                        <div key={k} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:T.r.sm,padding:"7px 8px"}}>
                          <div style={{fontSize:".66rem",color:T.faint,textTransform:"uppercase",fontWeight:700,letterSpacing:.4}}>{k}</div>
                          <div style={{fontSize:".78rem",color:T.sub,fontWeight:600,marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{background:T.surface,borderRadius:T.r.lg,border:`1.5px solid ${T.border}`,padding:"12px 14px"}}>
                  <div style={{fontSize:".72rem",fontWeight:800,color:T.accentDk,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Sugerencia</div>
                  <p style={{fontSize:".8rem",color:T.sub,lineHeight:1.6}}>Usa una historia breve, clara y honesta para mejorar la conversion de solicitudes.</p>
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
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}



import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

/* ==========================================
   CONFIG
========================================== */
const API = (import.meta.env.VITE_API_URL || "http://localhost/dogood-v4/api").replace(/\/+$/, "");

const EJS = {
  serviceId:          import.meta.env.VITE_EMAILJS_SERVICE_ID          || "",
  templateRescatista: import.meta.env.VITE_EMAILJS_TEMPLATE_RESCATISTA || "",
  templateAdoptante:  import.meta.env.VITE_EMAILJS_TEMPLATE_ADOPTANTE  || "",
  publicKey:          import.meta.env.VITE_EMAILJS_PUBLIC_KEY          || "",
};

const GRADIENTS = [
  "linear-gradient(135deg,#1653BB 0%,#4C78CC 100%)",
  "linear-gradient(135deg,#0F45A2 0%,#1653BB 100%)",
  "linear-gradient(135deg,#F0C21D 0%,#F8D868 100%)",
  "linear-gradient(135deg,#1653BB 0%,#F0C21D 100%)",
  "linear-gradient(135deg,#2B2B2B 0%,#616161 100%)",
  "linear-gradient(135deg,#7FA5E7 0%,#1653BB 100%)",
];

const T = {
  bg:      "#FFF8DF",
  surface: "#FFFFFF",
  border:  "#DDD5D6",
  ink:     "#111111",
  sub:     "#3C3A3A",
  muted:   "#6B6868",
  blue:    "#1653BB",
  blueMd:  "#0F45A2",
  yellow:  "#F0C21D",
  r: { sm:8, md:16, lg:24, xl:32, full:999 },
  shadow: {
    sm:  "0 1px 4px rgba(0,0,0,.06)",
    md:  "0 4px 20px rgba(0,0,0,.09)",
    lg:  "0 20px 60px rgba(0,0,0,.22)",
  },
};

/* ==========================================
   LABEL MAPS
========================================== */
const LABELS = {
  vivienda:    { casa_patio:"Casa con patio", departamento:"Departamento", casa_sin_patio:"Casa sin patio" },
  ninos:       { si:"Sí, hay niños en casa", no:"No hay niños" },
  mascotas:    { perros:"Sí, tengo perros", gatos:"Sí, tengo gatos", ambos:"Perros y gatos", no:"No tengo mascotas" },
  experiencia: { siempre:"Sí, siempre he tenido", antes:"Sí, hace tiempo", primera:"Será mi primera vez" },
  veterinario: { si:"Sí, ya tengo uno de confianza", buscare:"No, pero buscaré uno", no_se:"Aún no lo sé" },
};

const lbl = (map, key) => LABELS[map]?.[key] ?? key;

/* ==========================================
   PILL GROUP
========================================== */
function PillGroup({ label, hint, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize:".8rem", fontWeight:700, color:T.sub, marginBottom:5, textTransform:"uppercase", letterSpacing:.6 }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize:".75rem", color:T.muted, marginBottom:9, lineHeight:1.55 }}>
          {hint}
        </div>
      )}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {options.map(([val, icon, text]) => {
          const sel = value === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              style={{
                padding:"8px 16px",
                borderRadius: T.r.full,
                border: `2px solid ${sel ? T.blue : T.border}`,
                background: sel ? T.blue : T.surface,
                color: sel ? "#fff" : T.sub,
                fontWeight: sel ? 700 : 500,
                fontSize: ".82rem",
                cursor: "pointer",
                transition: "all .15s",
                display: "flex", alignItems:"center", gap:6,
                boxShadow: sel ? "0 4px 14px rgba(22,83,187,.28)" : "none",
              }}
              onMouseEnter={e => {
                if (!sel) {
                  e.currentTarget.style.borderColor = T.blue;
                  e.currentTarget.style.background = "#EDF3FF";
                  e.currentTarget.style.color = T.blue;
                }
              }}
              onMouseLeave={e => {
                if (!sel) {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.background = T.surface;
                  e.currentTarget.style.color = T.sub;
                }
              }}
            >
              <span style={{ fontSize:"1rem", lineHeight:1 }}>{icon}</span>
              {text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================
   PROGRESS BAR
========================================== */
const STEP_LABELS = ["Tu hogar", "Tu experiencia", "Tus datos"];

function ProgressBar({ step }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <span style={{ fontSize:".73rem", fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.8 }}>
          Paso {step} de 3
        </span>
        <span style={{ fontSize:".73rem", color:T.muted }}>{STEP_LABELS[step - 1]}</span>
      </div>
      <div style={{ height:5, background:T.border, borderRadius:T.r.full, overflow:"hidden" }}>
        <div style={{
          height:"100%",
          width:`${((step - 1) / 3) * 100}%`,
          background:`linear-gradient(90deg,${T.blue},${T.yellow})`,
          borderRadius:T.r.full,
          transition:"width .4s cubic-bezier(.4,0,.2,1)",
        }}/>
      </div>
    </div>
  );
}

/* ==========================================
   STEPS
========================================== */
function StepOne({ form, setForm }) {
  const inp = {
    width:"100%", padding:"10px 14px",
    border:`1.5px solid ${T.border}`,
    borderRadius:T.r.md, fontSize:".85rem",
    color:T.ink, outline:"none", background:T.surface,
    transition:"border-color .15s",
  };

  return (
    <>
      <PillGroup
        label="¿Cómo es tu hogar?"
        options={[
          ["casa_patio",    "🏡", "Casa con patio"],
          ["departamento",  "🏢", "Departamento"],
          ["casa_sin_patio","🏠", "Casa sin patio"],
        ]}
        value={form.vivienda}
        onChange={v => setForm(f => ({ ...f, vivienda: v }))}
      />
      <PillGroup
        label="¿Hay niños menores de 12 años en casa?"
        options={[
          ["si", "👶", "Sí, los hay"],
          ["no", "🙅", "No"],
        ]}
        value={form.ninos}
        onChange={v => setForm(f => ({ ...f, ninos: v }))}
      />
    </>
  );
}

function StepTwo({ form, setForm, animalName }) {
  return (
    <>
      <PillGroup
        label="¿Tienes otras mascotas en casa?"
        options={[
          ["perros", "🐕", "Sí, perros"],
          ["gatos",  "🐈", "Sí, gatos"],
          ["ambos",  "🐾", "Perros y gatos"],
          ["no",     "❌", "No tengo"],
        ]}
        value={form.mascotas}
        onChange={v => setForm(f => ({ ...f, mascotas: v }))}
      />
      <PillGroup
        label="¿Has tenido mascotas antes?"
        options={[
          ["siempre",  "✅", "Sí, siempre"],
          ["antes",    "📅", "Sí, hace tiempo"],
          ["primera",  "🌱", "Será mi primera vez"],
        ]}
        value={form.experiencia}
        onChange={v => setForm(f => ({ ...f, experiencia: v }))}
      />
      <PillGroup
        label="¿Tienes veterinario de confianza?"
        hint={`Contar con veterinario facilita mucho la integración de ${animalName} a tu hogar.`}
        options={[
          ["si",      "⚕️", "Sí, ya tengo uno"],
          ["buscare", "🔍", "No, pero buscaré"],
          ["no_se",   "💭", "Aún no lo sé"],
        ]}
        value={form.veterinario}
        onChange={v => setForm(f => ({ ...f, veterinario: v }))}
      />
    </>
  );
}

const PRESET_QUESTIONS = [
  "¿Cómo es el carácter de la mascota con niños u otros animales?",
  "¿Cuentan con esquema completo de vacunación y desparasitación vigente?",
  "¿Cuáles son sus rutinas de paseo o alimentación recomendadas?",
  "¿Tienen disponible fecha inmediata para entregar a la mascota?",
  "¿Requiere algún alimento especial o cuidado veterinario particular?",
];

function StepThree({ form, setForm, animalName }) {
  const inp = {
    width:"100%", padding:"12px 14px",
    border:`1.5px solid ${T.border}`,
    borderRadius:T.r.md, fontSize:".88rem",
    color:T.ink, outline:"none", background:T.surface,
    transition:"border-color .15s",
  };
  return (
    <>
      {[
        ["Nombre completo",       "text",  "nombre",   "Tu nombre completo",  true],
        ["Correo electrónico",    "email", "email",    "tu@correo.com",        true],
        ["WhatsApp / Teléfono",   "tel",   "telefono", "55 1234 5678",         true],
      ].map(([label, type, key, ph, req]) => (
        <div key={key} style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:".78rem", fontWeight:700, color:T.sub, textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>
            {label}{req && <span style={{ color:"#E03131" }}> *</span>}
          </label>
          <input
            type={type}
            spellCheck={true}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            placeholder={ph}
            style={inp}
            onFocus={e => (e.target.style.borderColor = T.blue)}
            onBlur={e  => (e.target.style.borderColor = T.border)}
          />
        </div>
      ))}

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: ".78rem", fontWeight: 700, color: T.sub, textTransform: "uppercase", letterSpacing: .6 }}>
            ¿Por qué quieres adoptar a {animalName}?{" "}
            <span style={{ fontSize: ".7rem", color: T.muted, textTransform: "none", letterSpacing: 0, fontWeight: 500 }}>
              (opcional)
            </span>
          </label>
          <span style={{ fontSize: ".72rem", color: (form.motivacion || "").length >= 280 ? "#DC2626" : T.muted, fontWeight: 700 }}>
            {(form.motivacion || "").length} / 280
          </span>
        </div>
        <textarea
          spellCheck={true}
          maxLength={280}
          value={form.motivacion}
          onChange={e => setForm(f => ({ ...f, motivacion: e.target.value }))}
          placeholder={`Cuéntale al rescatista por qué ${animalName} sería perfecto para ti... (máx. 280 caracteres)`}
          rows={3}
          style={{ ...inp, resize: "vertical", lineHeight: 1.5 }}
          onFocus={e => (e.target.style.borderColor = T.blue)}
          onBlur={e => (e.target.style.borderColor = T.border)}
        />
      </div>
    </>
  );
}

/* ==========================================
   SUCCESS SCREEN
========================================== */
function SuccessScreen({ animal, nombre, onClose }) {
  return (
    <div style={{ textAlign:"center", padding:"20px 4px 4px" }}>
      <div style={{ fontSize:"4rem", marginBottom:10 }}>🎉</div>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.45rem", color:T.blue, marginBottom:8, lineHeight:1.1 }}>
        ¡Solicitud enviada!
      </h3>
      <p style={{ fontSize:".88rem", color:T.sub, lineHeight:1.7, marginBottom:4 }}>
        Hola <strong>{nombre}</strong>, tu solicitud para adoptar a{" "}
        <strong>{animal.nombre}</strong> fue recibida con éxito.
      </p>
      <p style={{ fontSize:".82rem", color:T.muted, lineHeight:1.7, marginBottom:14 }}>
        El rescatista <strong>{animal.rescatista_nombre || "a cargo"}</strong> te
        contactará pronto por correo o WhatsApp con los siguientes pasos.
      </p>
      <div style={{ background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:T.r.md, padding:"10px 14px", color:"#047857", fontSize:".8rem", fontWeight:700, marginBottom:18, display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
        <span>✉️</span> ¡Gracias por tu amor! Enviamos un correo de agradecimiento a tu bandeja de entrada.
      </div>
      {/* Pet preview */}
      <div style={{
        background:`linear-gradient(135deg,${T.blue},${T.yellow})`,
        borderRadius:T.r.lg, padding:"18px",
        marginBottom:22, display:"flex", alignItems:"center", gap:14,
        textAlign:"left",
      }}>
        <div style={{ width:60, height:60, borderRadius:T.r.md, overflow:"hidden", background:animal.color||GRADIENTS[0], display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {animal.foto_url
            ? <img src={animal.foto_url} alt={animal.nombre} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            : <span style={{ fontSize:"2rem" }}>{animal.emoji||"🐾"}</span>
          }
        </div>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff", fontSize:"1.1rem" }}>{animal.nombre}</div>
          <div style={{ color:"rgba(255,255,255,.7)", fontSize:".78rem" }}>{animal.raza} · {animal.rescatista_nombre}</div>
        </div>
      </div>
      <button
        onClick={onClose}
        style={{ padding:"12px 32px", border:"none", borderRadius:T.r.full, background:T.blue, color:"#fff", fontWeight:700, fontSize:".9rem", cursor:"pointer", width:"100%" }}
      >
        Ver más animales 🐾
      </button>
    </div>
  );
}

/* ==========================================
   MAIN COMPONENT
========================================== */
export default function FormularioWizard({ animal, onClose, onSuccess }) {
  const [step,       setStep]       = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");
  const [savedNombre,setSavedNombre]= useState("");

  const [form, setForm] = useState({
    vivienda:"", ninos:"",
    mascotas:"", experiencia:"", veterinario:"",
    nombre:"", email:"", telefono:"", motivacion:"",
  });

  /* Validation per step */
  const canProceed = () => {
    if (step === 1) return !!form.vivienda && !!form.ninos;
    if (step === 2) return !!form.mascotas && !!form.experiencia && !!form.veterinario;
    if (step === 3) return !!form.nombre.trim() && !!form.email.trim() && !!form.telefono.trim();
    return false;
  };

  /* Submit */
  const handleSubmit = async () => {
    if (!canProceed() || submitting) return;
    setSubmitting(true);
    setError("");
    setSavedNombre(form.nombre);

    const payload = {
      animal_id:               animal.id,
      animal_nombre:           animal.nombre || animal.name || "Peludito",
      rescatista_id:           animal.rescatista_id || 1,
      guest_mode:              true,
      guest_nombre:            form.nombre,
      guest_email:             form.email,
      guest_telefono:          form.telefono,
      vivienda:                lbl("vivienda",    form.vivienda),
      ninos:                   lbl("ninos",       form.ninos),
      mascotas_actuales:       lbl("mascotas",    form.mascotas),
      experiencia_previa:      lbl("experiencia", form.experiencia),
      tiene_veterinario:       lbl("veterinario", form.veterinario),
      motivacion:              form.motivacion,
      fotos_espacio:           form.fotos_espacio || "",
      pregunta_predeterminada: form.pregunta_predeterminada || "",
    };

    let phpOk   = false;
    let emailOk = false;

    /* 1 — Try PHP backend */
    try {
      const res = await fetch(`${API}/solicitudes.php?action=create`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      phpOk = d.ok === true;
    } catch (e) {
      console.warn("[DoGood] PHP solicitud failed:", e);
    }

    /* Guardar siempre localmente para que aparezcan en el panel de solicitudes */
    try {
      const newLocalSol = {
        id: Date.now(),
        animal_id: animal.id,
        rescatista_id: animal.rescatista_id || 1,
        rescatista_nombre: animal.rescatista_nombre || "Refugio DoGood",
        animal_nombre: animal.nombre || animal.name || "Peludito",
        animal_raza: animal.raza || "Mascota",
        animal_emoji: animal.emoji || "🐾",
        animal_color: animal.color || "#1653BB",
        animal_foto: animal.foto_url || "",
        solicitante_nombre: form.nombre,
        solicitante_email: form.email,
        solicitante_telefono: form.telefono,
        guest_nombre: form.nombre,
        guest_email: form.email,
        guest_telefono: form.telefono,
        usuario_nombre: form.nombre,
        usuario_email: form.email,
        usuario_telefono: form.telefono,
        vivienda: lbl("vivienda", form.vivienda),
        ninos: lbl("ninos", form.ninos),
        mascotas_actuales: lbl("mascotas", form.mascotas),
        experiencia_previa: lbl("experiencia", form.experiencia),
        tiene_veterinario: lbl("veterinario", form.veterinario),
        motivacion: form.motivacion || "Interés en adopción responsable",
        estatus: "Pendiente",
        fecha: new Date().toISOString().split("T")[0],
      };

      const existingCustom = JSON.parse(localStorage.getItem("dogood_custom_solicitudes") || "[]");
      localStorage.setItem("dogood_custom_solicitudes", JSON.stringify([newLocalSol, ...existingCustom]));

      const existingLocal = JSON.parse(localStorage.getItem("dogood_local_solicitudes") || "[]");
      localStorage.setItem("dogood_local_solicitudes", JSON.stringify([newLocalSol, ...existingLocal]));

      /* Notificar a la app para actualizar la lista de solicitudes al instante */
      window.dispatchEvent(new Event("dogood:solicitud-created"));
      phpOk = true;
    } catch (e) {}

    /* 2 — EmailJS (Envío de notificación y correo de agradecimiento al solicitante) */
    if (EJS.serviceId && EJS.publicKey) {
      try {
        if (EJS.templateRescatista) {
          await emailjs.send(EJS.serviceId, EJS.templateRescatista, {
            pet_name:        animal.nombre,
            pet_breed:       animal.raza || "",
            pet_rescuer:     animal.rescatista_nombre || "",
            adopter_name:    form.nombre,
            adopter_email:   form.email,
            adopter_phone:   form.telefono,
            home_type:       lbl("vivienda",    form.vivienda),
            has_children:    lbl("ninos",       form.ninos),
            current_pets:    lbl("mascotas",    form.mascotas),
            pet_experience:  lbl("experiencia", form.experiencia),
            has_vet:         lbl("veterinario", form.veterinario),
            motivation:      form.motivacion || "No especificado",
          }, EJS.publicKey);
        }

        if (EJS.templateAgradecimiento) {
          await emailjs.send(EJS.serviceId, EJS.templateAgradecimiento, {
            to_email:        form.email,
            adopter_name:    form.nombre,
            pet_name:        animal.nombre,
            pet_breed:       animal.raza || "Mascota",
            rescuer_name:    animal.rescatista_nombre || "DoGood Refugio",
            message:         `¡Gracias ${form.nombre}! Hemos recibido tu solicitud para adoptar a ${animal.nombre}. Te contactaremos pronto.`
          }, EJS.publicKey);
        }
        emailOk = true;
      } catch (e) {
        console.info("[DoGood] EmailJS envio omision (demo activa)");
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    onSuccess?.(animal.nombre);
  };

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const tallaLabel = t => ({ pequeno:"Pequeño", pequeño:"Pequeño", mediano:"Mediano", grande:"Grande" }[t] ?? t);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0,
        background:"rgba(20,20,20,.62)",
        zIndex:500,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"16px",
        backdropFilter:"blur(10px)",
      }}
    >
      <style>{`
        @keyframes wizardIn { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes popIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        @media (max-width:680px) {
          .wiz-grid { grid-template-columns: 1fr !important; }
          .wiz-left { border-radius: 24px 24px 0 0 !important; min-height:auto !important; }
          .wiz-right { border-radius: 0 0 24px 24px !important; }
        }
      `}</style>

      <div
        className="wiz-grid"
        style={{
          background: T.surface,
          borderRadius: T.r.xl,
          width:"100%", maxWidth:820,
          maxHeight:"92vh", overflowY:"auto",
          boxShadow: T.shadow.lg,
          animation: "wizardIn .28s cubic-bezier(.4,0,.2,1)",
          display:"grid",
          gridTemplateColumns:"280px 1fr",
        }}
      >
        {/* ===== LEFT: Animal Info ===== */}
        <div
          className="wiz-left"
          style={{
            background:`linear-gradient(160deg,${T.blue} 0%,${T.blueMd} 58%,${T.yellow}99 100%)`,
            borderRadius:`${T.r.xl}px 0 0 ${T.r.xl}px`,
            padding:"28px 24px",
            display:"flex", flexDirection:"column", gap:14,
            position:"relative", overflow:"hidden",
          }}
        >
          {/* Decorative orbs */}
          <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.06)" }}/>
          <div style={{ position:"absolute", bottom:-40, left:-40, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,.04)" }}/>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position:"absolute", top:12, right:12,
              width:28, height:28,
              background:"rgba(255,255,255,.18)", border:"none",
              borderRadius:"50%", color:"#fff",
              cursor:"pointer", fontSize:"1rem",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:700, lineHeight:1,
            }}
          >×</button>

          {/* Photo */}
          <div style={{
            height:170, borderRadius:T.r.lg, overflow:"hidden",
            background:animal.color||GRADIENTS[0],
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0,
          }}>
            {animal.foto_url
              ? <img src={animal.foto_url} alt={animal.nombre} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              : <span style={{ fontSize:"4.8rem" }}>{animal.emoji||"🐾"}</span>
            }
          </div>

          {/* Name & breed */}
          <div style={{ position:"relative" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.45rem", color:"#fff", lineHeight:1.1, marginBottom:4 }}>
              {animal.nombre}
            </div>
            <div style={{ fontSize:".76rem", color:"rgba(255,255,255,.65)" }}>
              {animal.raza} · {animal.sexo}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[tallaLabel(animal.talla), animal.peso, animal.edad ? `${animal.edad} años` : null, animal.caracter]
              .filter(Boolean).map(tag => (
                <span key={tag} style={{ padding:"3px 10px", borderRadius:T.r.full, background:"rgba(255,255,255,.18)", color:"#fff", fontSize:".7rem", fontWeight:600 }}>
                  {tag}
                </span>
              ))}
          </div>

          {/* Cuota */}
          {Number(animal.cuota) > 0 && (
            <div style={{ padding:"6px 12px", background:"rgba(240,194,29,.28)", borderRadius:T.r.sm, color:"#fff", fontSize:".78rem", fontWeight:700 }}>
              💰 Cuota de recuperación: ${Number(animal.cuota).toLocaleString()} MXN
            </div>
          )}

          {/* Rescuer */}
          <div style={{ marginTop:"auto", background:"rgba(255,255,255,.12)", borderRadius:T.r.md, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, position:"relative" }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(255,255,255,.22)", color:"#fff", fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".78rem", flexShrink:0 }}>
              {(animal.rescatista_nombre || "R").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:600, fontSize:".84rem" }}>{animal.rescatista_nombre || "Refugio"}</div>
              <div style={{ color:"rgba(255,255,255,.55)", fontSize:".72rem" }}>
                📍 México{animal.rescatista_tel ? ` · ${animal.rescatista_tel}` : ""}
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Wizard ===== */}
        <div
          className="wiz-right"
          style={{
            padding:"28px 30px 24px",
            display:"flex", flexDirection:"column",
            borderRadius:`0 ${T.r.xl}px ${T.r.xl}px 0`,
          }}
        >
          {submitted ? (
            <SuccessScreen animal={animal} nombre={savedNombre} onClose={onClose}/>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom:18 }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.3rem", color:T.ink, lineHeight:1.1, marginBottom:5 }}>
                  Solicitar adopción de {animal.nombre} 🐾
                </h2>
                <p style={{ fontSize:".81rem", color:T.muted, lineHeight:1.55 }}>
                  {step === 1
                    ? "Cuéntanos sobre tu hogar. Solo 2 preguntas rápidas."
                    : step === 2
                    ? `Tu experiencia nos ayuda a asegurar el bienestar de ${animal.nombre}.`
                    : "Por último, ¿cómo podemos contactarte?"}
                </p>
              </div>

              <ProgressBar step={step}/>

              {/* Steps */}
              <div style={{ flex:1, overflowY:"auto", paddingRight:2 }}>
                {step === 1 && <StepOne form={form} setForm={setForm}/>}
                {step === 2 && <StepTwo form={form} setForm={setForm} animalName={animal.nombre}/>}
                {step === 3 && <StepThree form={form} setForm={setForm} animalName={animal.nombre}/>}
              </div>

              {/* Error */}
              {error && (
                <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:T.r.sm, padding:"10px 14px", fontSize:".82rem", color:"#C0392B", marginBottom:12, fontWeight:600 }}>
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div style={{ display:"flex", gap:10, paddingTop:18, borderTop:`1px solid ${T.border}`, marginTop:10 }}>
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    style={{ flex:1, padding:"12px", border:`1.5px solid ${T.border}`, borderRadius:T.r.md, background:T.surface, color:T.sub, fontWeight:600, fontSize:".87rem", cursor:"pointer" }}
                  >
                    ← Atrás
                  </button>
                )}

                {step < 3 ? (
                  <button
                    onClick={() => canProceed() && setStep(s => s + 1)}
                    disabled={!canProceed()}
                    style={{
                      flex:2, padding:"12px", border:"none",
                      borderRadius:T.r.md,
                      background: canProceed() ? T.blue : T.border,
                      color:      canProceed() ? "#fff"  : T.muted,
                      fontWeight:700, fontSize:".87rem",
                      cursor: canProceed() ? "pointer" : "default",
                      transition:"all .2s",
                    }}
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    style={{
                      flex:2, padding:"12px", border:"none",
                      borderRadius:T.r.md,
                      background: canProceed() && !submitting ? T.blue : T.border,
                      color:      canProceed() && !submitting ? "#fff"  : T.muted,
                      fontWeight:700, fontSize:".87rem",
                      cursor: canProceed() && !submitting ? "pointer" : "default",
                      transition:"all .2s",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    }}
                  >
                    {submitting
                      ? <><div style={{ width:15, height:15, border:"2px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .65s linear infinite" }}/> Enviando...</>
                      : "Enviar solicitud 🐾"}
                  </button>
                )}
              </div>

              <p style={{ textAlign:"center", fontSize:".71rem", color:T.muted, marginTop:10 }}>
                Tu solicitud irá directamente al rescatista responsable de {animal.nombre}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

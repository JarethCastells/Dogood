import { useState, useEffect, useRef } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost/dogood-v4/api").replace(/\/+$/, "");
const apiUrl = (path) => `${API_BASE}/${path.replace(/^\/+/, "")}`;
const LANDING_NOW = Date.now();

const C = {
  beige:"#F3EFEF", beigedk:"#E1DADB", beigelt:"#FCFAFA",
  cafe:"#1653BB", cafeMd:"#0F45A2", cafeLt:"#F0C21D", cafeXlt:"#F8D868",
  cream:"#FFFFFF", ink:"#121212", sub:"#3B3B3B", muted:"#6F6B6B", faint:"#B7B1B1",
  gray:"#6A6762", grayLt:"#D4CECF", graySoft:"#EDE7E8", black:"#111111",
  white:"#FFFFFF", shadow:"rgba(22,83,187,.12)", shadowMd:"rgba(22,83,187,.22)",
};
const BRAND = {
  logoPrimary:"/brand/logo-primary-trim.png",
  logoYellow:"/brand/logo-yellow-trim.png",
  logoBlack:"/brand/logo-black-trim.png",
  isotypeBlueYellow:"/brand/isotype-blueyellow-trim.png",
  isotypeYellow:"/brand/isotype-yellow-trim.png",
  handBlue:"/brand/graphic-hand-blue.jpg",
};

const E = {
  dog:"\uD83D\uDC15",
  cat:"\uD83D\uDC08",
  poodle:"\uD83D\uDC29",
  catFace:"\uD83D\uDC31",
  guideDog:"\uD83E\uDDAE",
  smileCat:"\uD83D\uDE38",
  dogFace:"\uD83D\uDC36",
  blackCat:"\uD83D\uDC08\u200D\u2B1B",
  serviceDog:"\uD83D\uDC15\u200D\uD83E\uDDBA",
  mapPin:"\uD83D\uDCCD",
  map:"\uD83D\uDDFA\uFE0F",
  paw:"\uD83D\uDC3E",
  house:"\uD83C\uDFE1",
  heart:"\u2764\uFE0F",
  clipboard:"\uD83D\uDCCB",
  check:"\u2705",
  email:"\uD83D\uDCE7",
  leaf:"\uD83C\uDF3F",
  donate:"\uD83D\uDCB8",
  volunteer:"\uD83E\uDD1D",
  homeCare:"\uD83C\uDFE0",
  phone:"\uD83D\uDCF1",
  clock:"\u23F0",
  shield:"\uD83D\uDEE1\uFE0F",
  sparkle:"\u2728",
  bath:"\uD83D\uDEC1",
  vet:"\u2695\uFE0F",
  train:"\uD83C\uDF93",
  toy:"\uD83E\uDDF8",
  food:"\uD83E\uDDB4",
  bed:"\uD83D\uDEE5\uFE0F",
  book:"\uD83D\uDCD6",
  calendar:"\uD83D\uDCC5",
};

const DOG_DOODLE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240' fill='none' stroke='#1D5FC8' stroke-width='1.1' stroke-linecap='round' stroke-linejoin='round'>
    <g opacity='.34'>
      <circle cx='24' cy='26' r='6'/><circle cx='16' cy='37' r='4'/><circle cx='29' cy='39' r='4'/><circle cx='37' cy='29' r='4'/><path d='M16 48c6-7 18-7 24 0'/>
      <path d='M70 24h20c4 0 6 2 6 6s-2 6-6 6H70c-4 0-6-2-6-6s2-6 6-6Z'/><circle cx='62' cy='27' r='4'/><circle cx='62' cy='35' r='4'/><circle cx='98' cy='27' r='4'/><circle cx='98' cy='35' r='4'/>
      <path d='M146 30l6-7 6 7'/><path d='M158 30l6-7 6 7'/><circle cx='159' cy='42' r='11'/><circle cx='155' cy='40' r='1.2' fill='#1D5FC8'/><circle cx='163' cy='40' r='1.2' fill='#1D5FC8'/><path d='M157 45h4'/>
      <circle cx='32' cy='118' r='10'/><circle cx='28' cy='115' r='1.2' fill='#1D5FC8'/><circle cx='36' cy='115' r='1.2' fill='#1D5FC8'/><path d='M29 121h6'/><path d='M22 109l4-4'/><path d='M42 109l-4-4'/>
      <path d='M84 112h24c4 0 6 2 6 6s-2 6-6 6H84c-4 0-6-2-6-6s2-6 6-6Z'/><circle cx='76' cy='114' r='4'/><circle cx='76' cy='122' r='4'/><circle cx='116' cy='114' r='4'/><circle cx='116' cy='122' r='4'/>
      <circle cx='170' cy='112' r='5'/><circle cx='162' cy='124' r='3.5'/><circle cx='174' cy='126' r='3.5'/><circle cx='181' cy='118' r='3.5'/><path d='M162 136c4-5 12-5 16 0'/>
      <path d='M118 186h18c3 0 5 2 5 4s-2 4-5 4h-18c-3 0-5-2-5-4s2-4 5-4Z'/><circle cx='112' cy='188' r='3'/><circle cx='112' cy='194' r='3'/><circle cx='144' cy='188' r='3'/><circle cx='144' cy='194' r='3'/>
      <circle cx='46' cy='182' r='2'/><circle cx='58' cy='176' r='1.8'/><circle cx='72' cy='184' r='2.2'/><circle cx='132' cy='176' r='2'/><circle cx='158' cy='182' r='1.8'/>
      <circle cx='205' cy='74' r='2.2'/><circle cx='214' cy='68' r='1.5'/><circle cx='224' cy='77' r='2'/>
      <path d='M198 152h20c3 0 5 2 5 4s-2 4-5 4h-20c-3 0-5-2-5-4s2-4 5-4Z'/><circle cx='192' cy='154' r='3'/><circle cx='192' cy='160' r='3'/><circle cx='224' cy='154' r='3'/><circle cx='224' cy='160' r='3'/>
      <circle cx='198' cy='198' r='8'/><circle cx='194' cy='195' r='1.2' fill='#1D5FC8'/><circle cx='202' cy='195' r='1.2' fill='#1D5FC8'/><path d='M195 201h6'/>
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

const sectionTexture = (base)=>({
  backgroundColor:base,
  backgroundImage:`
    linear-gradient(180deg, rgba(248,252,255,.9) 0%, rgba(238,246,255,.95) 100%),
    url("${DOG_DOODLE}"),
    radial-gradient(circle at 84% 14%, rgba(29,95,200,.14) 0, transparent 36%),
    radial-gradient(circle at 12% 84%, rgba(240,194,29,.12) 0, transparent 34%)
  `,
  backgroundSize:"100% 100%, 236px 236px, 700px 700px, 620px 620px",
  backgroundRepeat:"no-repeat, repeat, no-repeat, no-repeat",
  backgroundPosition:"center top, 0 0, 84% 12%, 13% 86%",
});

const G = `
  @font-face{
    font-family:'Fredoka';
    src:url('/brand/AddenRegular.ttf') format('truetype');
    font-weight:400 900;
    font-style:normal;
    font-display:swap;
  }
  @font-face{
    font-family:'Nunito';
    src:url('/brand/Futura.ttc') format('truetype-collection');
    font-weight:300 900;
    font-style:normal;
    font-display:swap;
  }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    font-family:'Segoe UI','Helvetica Neue',Arial,'Nunito','Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif;
    background:
      linear-gradient(180deg, rgba(250,252,255,.98) 0%, rgba(238,246,255,.99) 100%),
      url("${DOG_DOODLE}"),
      radial-gradient(circle at 86% 18%, rgba(29,95,200,.16) 0, transparent 34%),
      radial-gradient(circle at 11% 82%, rgba(240,194,29,.11) 0, transparent 32%),
      #EFF5FF;
    background-size:100% 100%, 236px 236px, 720px 720px, 660px 660px, auto;
    background-repeat:no-repeat, repeat, no-repeat, no-repeat, repeat;
    background-position:center top, 0 0, 100% 0, 0 100%, 0 0;
    background-attachment:fixed, scroll, fixed, fixed, scroll;
    color:#2C1A0E;
    overflow-x:hidden;
    -webkit-text-size-adjust:100%;
    text-size-adjust:100%;
    cursor:url("${PAW_CURSOR}") 4 2, auto;
  }
  button,input,select,textarea{
    font-family:'Segoe UI','Helvetica Neue',Arial,'Nunito','Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif;
    letter-spacing:normal;
    word-spacing:normal;
  }
  p,a,span,h1,h2,h3,h4,button{word-spacing:normal;letter-spacing:normal}
  button,a,[role="button"]{
    cursor:url("${PAW_CURSOR}") 4 2, pointer;
    transition:transform .22s ease,box-shadow .22s ease,filter .22s ease,background-color .22s ease,border-color .22s ease,color .22s ease;
    will-change:transform;
  }
  button:hover,a:hover,[role="button"]:hover{filter:saturate(1.08);transform:translateY(-2px) scale(1.015)}
  button:active,a:active,[role="button"]:active{transform:translateY(1px) scale(.98)}
  @keyframes splashFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes splashOut{from{opacity:1}to{opacity:0;pointer-events:none}}
  @keyframes logoPop{0%{opacity:0;transform:scale(.5)}70%{transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
  @keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
  @keyframes pinBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}60%{transform:translateY(-4px)}}
  @keyframes blobIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
  @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(92,61,30,.4)}70%{box-shadow:0 0 0 8px rgba(92,61,30,0)}}
  @keyframes slideInfinite{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
  @keyframes navDown{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
  @keyframes dotPulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.5);opacity:1}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes shimmerSweep{0%{transform:translateX(-130%) skewX(-16deg)}100%{transform:translateX(130%) skewX(-16deg)}}
  @keyframes orbitSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes bobSoft{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
  @keyframes driftGlow{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(14px,-10px) scale(1.05)}}
  @keyframes pawBurst{0%{opacity:0;transform:translate(12px,12px) scale(.5) rotate(0deg)}40%{opacity:.45}100%{opacity:0;transform:translate(-10px,-14px) scale(1.2) rotate(-24deg)}}
  @keyframes btnBounce{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-3px) scale(1.03)}100%{transform:translateY(0) scale(1)}}
  @keyframes petBubbleRise{0%{opacity:0;transform:translateY(8px) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translateY(-26px) scale(1.08)}}
  @keyframes floatCardA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes floatCardB{0%,100%{transform:translateY(-3px)}50%{transform:translateY(6px)}}
  @keyframes floatCardC{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(.4deg)}}
  @keyframes heroStripScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes isotypeGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(22,83,187,.4)) drop-shadow(0 0 2px rgba(240,194,29,.3))}50%{filter:drop-shadow(0 0 14px rgba(22,83,187,.7)) drop-shadow(0 0 6px rgba(240,194,29,.5))}}
  @keyframes isotypeWiggle{0%,100%{transform:rotate(0deg) scale(1)}25%{transform:rotate(-4deg) scale(1.06)}75%{transform:rotate(3deg) scale(1.04)}}
  /* Isotype: visible solo en móvil */
  .nav-isotype-mobile{display:none !important}
  @media (max-width:1100px){
    .nav-isotype-mobile{display:block !important;animation:isotypeGlow 3s ease-in-out infinite}
  }
  .reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease;}
  .reveal.visible{opacity:1;transform:none;}
  .reveal-left{opacity:0;transform:translateX(-30px);transition:opacity .7s ease,transform .7s ease;}
  .reveal-left.visible{opacity:1;transform:none;}
  .reveal-right{opacity:0;transform:translateX(30px);transition:opacity .7s ease,transform .7s ease;}
  .reveal-right.visible{opacity:1;transform:none;}
  .paw-btn{position:relative;overflow:hidden;isolation:isolate}
  .paw-btn::after{
    content:"\\1F43E";
    position:absolute;
    right:12px;
    bottom:8px;
    font-size:1rem;
    opacity:0;
    pointer-events:none;
    transform:translate(12px,12px) scale(.5) rotate(0deg);
  }
  .paw-btn:hover{animation:btnBounce .38s ease}
  .paw-btn:hover::after{animation:pawBurst .75s ease forwards}
  .process-step-card{position:relative;text-align:left;cursor:pointer}
  .process-step-card::after{
    content:"→";
    position:absolute;
    right:14px;
    bottom:12px;
    width:26px;
    height:26px;
    border-radius:999px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:${C.beigelt};
    color:${C.cafe};
    border:1px solid ${C.beigedk};
    font-weight:900;
    opacity:.86;
    transition:transform .22s ease,background-color .22s ease,color .22s ease,box-shadow .22s ease;
  }
  .process-step-card:hover,.process-step-card:focus-visible{
    transform:translateY(-6px) scale(1.015) !important;
    box-shadow:0 16px 36px ${C.shadowMd} !important;
    border-color:${C.cafeXlt} !important;
    outline:none;
  }
  .process-step-card:hover::after,.process-step-card:focus-visible::after{
    transform:translateX(3px);
    background:${C.cafe};
    color:${C.white};
    box-shadow:0 8px 18px ${C.shadowMd};
  }
  .float-card{will-change:transform,box-shadow}
  .float-card.reveal.visible{animation:floatCardA 5.3s ease-in-out infinite}
  .float-card.alt.reveal.visible{animation:floatCardB 6.1s ease-in-out infinite}
  .float-card.soft.reveal.visible{animation:floatCardC 5.7s ease-in-out infinite}
  .pet-bubble{
    position:fixed;
    z-index:99999;
    pointer-events:none;
    background:rgba(44,26,14,.9);
    color:#fff;
    border:1px solid rgba(255,255,255,.18);
    border-radius:999px;
    font-size:.72rem;
    font-weight:800;
    padding:4px 10px;
    box-shadow:0 8px 18px rgba(0,0,0,.2);
    animation:petBubbleRise .85s ease forwards;
  }
  .landing-shell.hc{filter:contrast(1.12) saturate(1.06)}
  .landing-shell.hc .hc-chip{background:${C.ink} !important;color:${C.white} !important;border-color:${C.white}55 !important}
  .landing-shell.rm *{animation:none !important;transition:none !important}
  .hero-section,.video-section,.map-section,.match-section,.process-section,.services-section,.help-section,.products-section{position:relative}
  @media (prefers-reduced-motion: reduce){
    *{animation:none !important;transition:none !important}
    .hero-copy h1,.hero-copy p,.hero-actions,.hero-kpis,.hero-art{opacity:1 !important;transform:none !important}
  }
  @media (max-width: 1100px){
    .nav-main-inner{padding-top:8px !important;padding-bottom:8px !important}
    .nav-main-head{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px}
    .nav-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
    .nav-links{width:100%;justify-content:flex-start;gap:2px;overflow-x:auto;white-space:nowrap;padding-bottom:2px !important}
    .nav-links a{flex:0 0 auto}
    .hero-grid,.video-grid,.map-grid,.match-grid,.about-grid{grid-template-columns:1fr !important;gap:22px !important}
    .steps-grid,.services-grid,.help-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}
    .metrics-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}
  }
  @media (max-width: 780px){
    .nav-top-inner{height:auto !important;padding-top:6px !important;padding-bottom:6px !important}
    .nav-top-inner>div{font-size:.68rem !important;word-spacing:0 !important;letter-spacing:0 !important;white-space:nowrap}
    /* Logo compacto en mobile para no tapar el hero */
    .brand-text{width:132px !important;height:46px !important;max-width:48vw !important}
    /* Hero: quitar decoraciones, ajustar layout */
    .hero-section{padding:100px 5% 40px !important;min-height:auto !important;align-items:flex-start !important}
    .hero-dot-bg{display:none !important}
    .hero-grid{grid-template-columns:1fr !important;gap:0 !important}
    .hero-art{display:none !important}
    .hero-pin{display:none !important}
    .hero-copy{width:100% !important;max-width:100% !important}
    .hero-copy h1{font-size:clamp(2.2rem,9vw,3rem) !important;line-height:1.06 !important;margin-bottom:14px !important}
    .hero-copy p{font-size:.96rem !important;max-width:100% !important;line-height:1.65 !important;margin-bottom:22px !important}
    /* Botones del hero en columna */
    .hero-actions{flex-direction:column !important;gap:10px !important;width:100% !important}
    .hero-actions button,.hero-actions a{width:100% !important;text-align:center !important;box-sizing:border-box !important;padding:13px 20px !important;font-size:.95rem !important}
    /* KPIs del hero — 3 columnas iguales en tarjetas */
    .hero-kpis{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:8px !important;margin-top:24px !important;width:100% !important}
    .hero-kpis>div{flex:unset !important;padding:10px 8px !important;margin-right:0 !important;padding-right:0 !important;border-right:none !important;background:rgba(255,253,249,.85) !important;border:1.5px solid #E8DFD0 !important;border-radius:14px !important;text-align:center !important}
    .hero-kpis>div:last-child{grid-column:auto !important}
    .nav-actions .nav-demo-btn{display:none !important}
    .nav-login{padding:8px 14px !important;font-size:.8rem !important;white-space:nowrap}
    .a11y-dock{display:none !important}
    .steps-grid,.services-grid,.help-grid{grid-template-columns:1fr !important}
    .products-head{gap:10px !important}
    .products-tabs{width:100%;justify-content:flex-start}
    .faq-grid{grid-template-columns:1fr !important}
    .faq-pet-big{font-size:4rem !important}
    .footer-grid{grid-template-columns:1fr !important;gap:22px !important}
    .animal-profile-layout{grid-template-columns:1fr !important}
    .animal-profile-media{min-height:310px !important}
    .animal-profile-details{padding:20px 18px 24px !important}
    .adoption-form-grid{grid-template-columns:1fr !important}
    .section-deco-blob{display:none !important}
    .video-grid{grid-template-columns:1fr !important;gap:18px !important}
    .about-right{display:none !important}
    .about-grid{grid-template-columns:1fr !important;gap:20px !important}
    .stories-grid{display:flex !important;flex-direction:row !important;overflow-x:auto !important;gap:12px !important;padding-bottom:12px !important;-webkit-overflow-scrolling:touch !important;scroll-snap-type:x mandatory !important;grid-template-columns:unset !important}
    .story-card{width:75vw !important;max-width:75vw !important;scroll-snap-align:start !important;flex-shrink:0 !important;box-sizing:border-box !important}
    .cta-stats{grid-template-columns:repeat(2,1fr) !important;gap:10px !important}
  }
  @media (max-width: 560px){
    .nav-main-inner{padding-left:4% !important;padding-right:4% !important}
    .nav-main-head{gap:6px !important}
    .nav-links a:nth-of-type(n+4){display:none}
    .nav-links{
      width:100% !important;
      overflow:visible !important;
      padding-bottom:2px !important;
      display:grid !important;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:4px !important;
    }
    .nav-links a{
      font-size:.78rem !important;
      padding:7px 4px !important;
      text-align:center !important;
      white-space:nowrap;
    }
    /* Logo compacto en pantallas muy pequeñas */
    .brand-text{width:120px !important;height:42px !important;max-width:46vw !important}
    .nav-login{padding:7px 10px !important;font-size:.76rem !important;min-width:76px}
    /* Hero todavía más ajustado */
    .hero-section{padding:95px 4% 36px !important;min-height:auto !important}
    .hero-dot-bg{display:none !important}
    .hero-copy h1{font-size:clamp(2rem,10vw,2.8rem) !important}
    .hero-actions button,.hero-actions a{font-size:.9rem !important;padding:12px 16px !important}
    /* KPIs en 3 col en móvil pequeño */
    .hero-kpis{grid-template-columns:repeat(3,1fr) !important;gap:6px !important}
    .hero-kpis>div{padding:8px 4px !important}
    .hero-kpis>div div:first-child{font-size:1.6rem !important}
    .hero-kpis>div div:last-child{font-size:.66rem !important}
    .video-grid{grid-template-columns:1fr !important;gap:0 !important}
    .video-card{min-height:240px !important;border-radius:18px !important;margin-top:18px !important}
    .match-grid{gap:12px !important}
    .match-card,.match-result{padding:14px !important;border-radius:18px !important}
    .process-section,.services-section,.help-section,.products-section{padding-top:50px !important;padding-bottom:50px !important}
    .a11y-dock{display:none !important}
    .landing-toast{right:12px !important;left:12px !important;bottom:84px !important}
    .animal-profile-page{padding:84px 12px 20px !important}
    .animal-profile-shell{border-radius:18px !important}
    .animal-profile-gallery{grid-template-columns:repeat(3,minmax(0,1fr)) !important}
    .mobile-hide-deco{display:none !important}
    .cta-stats{grid-template-columns:repeat(2,1fr) !important;gap:8px !important}
    .about-right{display:none !important}
    .about-grid{grid-template-columns:1fr !important;gap:20px !important}
    .stories-grid{display:flex !important;overflow-x:auto !important;gap:12px !important;padding-bottom:12px !important;-webkit-overflow-scrolling:touch !important;scroll-snap-type:x mandatory !important;grid-template-columns:unset !important}
    .story-card{width:80vw !important;max-width:80vw !important;scroll-snap-align:start !important;flex-shrink:0 !important;box-sizing:border-box !important}
    .services-head,.products-head{flex-direction:column !important;align-items:flex-start !important;gap:10px !important}
    .help-grid{grid-template-columns:1fr !important}
    .footer-grid{grid-template-columns:1fr !important;gap:24px !important}
    .faq-grid{grid-template-columns:1fr !important}
    .faq-orbit{display:none !important}
    .faq-pet-big{font-size:3.4rem !important}
    .section-deco-blob{display:none !important}
    .hero-mobile-pets{display:flex !important}
  }
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-thumb{background:#F0C21D;border-radius:5px}
`;

function useReveal(){
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");});
    },{threshold:.12});
    const run=()=>document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el=>obs.observe(el));
    run();
    const t=setTimeout(run,500);
    return()=>{obs.disconnect();clearTimeout(t);};
  },[]);
}

const floatCardAnim=(i=0)=>({
  animation:`${i%3===0?"floatCardA":i%3===1?"floatCardB":"floatCardC"} ${5.1+i*.25}s ease-in-out infinite`,
  animationDelay:`${(i%5)*.14}s`,
});

const LogoSVG=({size=40,color="#5C3D1E"})=>{
  const wordmark=size>=64;
  let src=wordmark?BRAND.logoPrimary:BRAND.isotypeBlueYellow;
  if(color===C.white||color===C.cafeXlt)src=wordmark?BRAND.logoYellow:BRAND.isotypeYellow;
  if(color===C.ink)src=wordmark?BRAND.logoBlack:BRAND.isotypeBlueYellow;
  return(
    <img
      src={src}
      alt="DoGood"
      style={{
        width:wordmark?size*2.5:size,
        height:wordmark?size*1.95:size,
        objectFit:"contain",
        display:"block",
      }}
    />
  );
};

function BoneShape({w=86,h=22,color=`${C.cafeXlt}22`,style={}}){
  const r=Math.max(6,Math.round(h*.33));
  return(
    <div style={{position:"absolute",width:w,height:h,borderRadius:999,background:color,...style}}>
      <span style={{position:"absolute",left:-r,top:-r,width:r*2,height:r*2,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",left:-r,bottom:-r,width:r*2,height:r*2,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",right:-r,top:-r,width:r*2,height:r*2,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",right:-r,bottom:-r,width:r*2,height:r*2,borderRadius:"50%",background:color}}/>
    </div>
  );
}

function PawPrint({size=34,color=`${C.cafeXlt}2B`,style={}}){
  const toe=Math.max(5,Math.round(size*.18));
  const padW=Math.max(14,Math.round(size*.46));
  const padH=Math.max(11,Math.round(size*.34));
  return(
    <div style={{position:"absolute",width:size,height:size,...style}}>
      <span style={{position:"absolute",left:size*.08,top:size*.28,width:toe,height:toe,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",left:size*.32,top:size*.12,width:toe,height:toe,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",left:size*.56,top:size*.18,width:toe,height:toe,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",left:size*.74,top:size*.36,width:toe,height:toe,borderRadius:"50%",background:color}}/>
      <span style={{position:"absolute",left:size*.26,top:size*.52,width:padW,height:padH,borderRadius:"60% 60% 48% 48% / 65% 65% 35% 35%",background:color}}/>
    </div>
  );
}

function Splash({onDone}){
  const [out,setOut]=useState(false);
  useEffect(()=>{
    const t1=setTimeout(()=>setOut(true),2400);
    const t2=setTimeout(()=>onDone(),2900);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  return(
    <div style={{position:"fixed",inset:0,zIndex:9999,background:C.beige,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,overflow:"hidden",
      animation:out?"splashOut .5s ease forwards":"splashFadeIn .3s ease"}}>
      <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg, rgba(255,255,255,.55), rgba(22,83,187,.08)), url('${BRAND.handBlue}') center/cover no-repeat`,opacity:.22}}/>
      <div style={{animation:"logoPop .9s .2s ease both",opacity:0}}>
        <LogoSVG size={126} color={C.cafe}/>
      </div>
      <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"3rem",color:C.cafe,animation:"fadeUp .6s .7s ease both",opacity:0,position:"relative",zIndex:1}}>DOGOOD</div>
      <div style={{fontSize:".95rem",color:C.sub,fontWeight:700,animation:"fadeUp .6s 1s ease both",opacity:0,position:"relative",zIndex:1}}>amor peludo</div>
      <div style={{marginTop:16,display:"flex",gap:8,animation:"fadeUp .4s 1.3s ease both",opacity:0}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:C.cafeLt,animation:`dotPulse 1.2s ${i*.2}s infinite`}}/>)}
      </div>
    </div>
  );
}

function Navbar({onLoginClick,onDemoClick,onOpenSection}){
  const [scrolled,setScrolled]=useState(false);
  const [compact,setCompact]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    const rs=()=>{
      const w=window.innerWidth;
      setCompact(w<1024);
      setMobile(w<700);
    };
    window.addEventListener("scroll",fn);
    window.addEventListener("resize",rs);
    rs();
    return()=>{window.removeEventListener("scroll",fn);window.removeEventListener("resize",rs);};
  },[]);
  const links=[
    ["Cómo funciona","#como-funciona"],
    ["Servicios","#servicios"],
    ["Adoptar","#adoptar"],
    ["Guías","#recursos"],
    ["Preguntas","#faq"]
  ];
  return(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:120,animation:"navDown .5s ease"}}>
      <div style={{background:`linear-gradient(90deg, ${C.ink}, ${C.cafe})`,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div className="nav-top-inner" style={{maxWidth:1240,margin:"0 auto",padding:"0 5%",height:34,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,.86)",fontSize:".74rem",fontWeight:700}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#B6B6B6",display:"inline-block"}}/>
            Querétaro, MX
          </div>
          {!compact&&<div className="nav-top-right" style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={onDemoClick} className="paw-btn" style={{padding:"4px 10px",borderRadius:50,border:"1px solid rgba(255,255,255,.25)",background:"rgba(255,255,255,.08)",color:"#FFFFFF",fontSize:".7rem",fontWeight:700,cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.18)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";}}>
              Demo guiada
            </button>
            {[["Instagram","#"],["Facebook","#"],["TikTok","#"]].map(([n,h])=>(
              <a key={n} href={h} style={{textDecoration:"none",padding:"4px 10px",borderRadius:50,background:"rgba(255,255,255,.08)",color:"#FFFFFF",fontSize:".7rem",fontWeight:700,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.18)";e.currentTarget.style.color="#FFFFFF";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="#FFFFFF";}}>
                {n}
              </a>
            ))}
          </div>}
        </div>
      </div>

      <div style={{
        background:scrolled?"rgba(250,247,242,.97)":C.beigelt,backdropFilter:"blur(16px)",
        borderBottom:scrolled?`1.5px solid ${C.beigedk}`:"1.5px solid transparent",
        boxShadow:scrolled?`0 4px 24px ${C.shadow}`:"none",transition:"all .35s"
      }}>
        <div className="nav-main-inner" style={{maxWidth:1240,margin:"0 auto",padding:"0 5%",height:compact?"auto":72,minHeight:compact?70:72,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:compact?"wrap":"nowrap"}}>
          {compact?(
            <>
              <div className="nav-main-head">
                <a href="#" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
                  <img
  src={BRAND.logoPrimary}
  alt="DoGood"
  className="brand-text"
  style={{
    width:132,
    height:46,
    objectFit:"contain",
    display:"block"
  }}
/>
                </a>
                <div className="nav-actions">
                  <button onClick={onDemoClick} className="paw-btn nav-demo-btn" style={{padding:"8px 12px",border:"1px solid #D9C2A8",borderRadius:50,background:C.cream,color:C.cafe,fontWeight:800,fontSize:".78rem",cursor:"pointer"}}>
                    Demo
                  </button>
                  <button
                    aria-label="Menú"
                    aria-expanded={menuOpen}
                    onClick={()=>setMenuOpen(o=>!o)}
                    style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:4,width:44,height:44,border:"1px solid #D9C2A8",borderRadius:12,background:C.cream,cursor:"pointer",padding:0}}
                  >
                    <span style={{display:"block",width:20,height:2.5,borderRadius:2,background:C.cafe,transition:"transform .25s ease,opacity .25s ease",transform:menuOpen?"translateY(6.5px) rotate(45deg)":"none"}}/>
                    <span style={{display:"block",width:20,height:2.5,borderRadius:2,background:C.cafe,transition:"opacity .25s ease",opacity:menuOpen?0:1}}/>
                    <span style={{display:"block",width:20,height:2.5,borderRadius:2,background:C.cafe,transition:"transform .25s ease,opacity .25s ease",transform:menuOpen?"translateY(-6.5px) rotate(-45deg)":"none"}}/>
                  </button>
                </div>
              </div>
              {menuOpen&&(
                <div style={{width:"100%",display:"flex",flexDirection:"column",gap:2,padding:"6px 0 10px",borderTop:`1px solid ${C.beigedk}`,marginTop:8}}>
                  {links.map(([l,h])=>(
                    <a
                      key={h}
                      href={h}
                      onClick={(e)=>{
                        if(h==="#como-funciona"&&onOpenSection){e.preventDefault();onOpenSection("como-funciona");}
                        setMenuOpen(false);
                      }}
                      style={{padding:"12px 14px",borderRadius:12,fontWeight:700,fontSize:".95rem",color:"#5E5E5E",textDecoration:"none"}}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              )}
            </>
          ):(
            <>
              <a href="#" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
                <img src={BRAND.logoPrimary} alt="DoGood" style={{width:200,height:70,objectFit:"contain",display:"block"}}/>
              </a>
                {links.map(([l,h])=>{
                  const handleClick = (e) => {
                    if (h === "#como-funciona" && onOpenSection) {
                      e.preventDefault();
                      onOpenSection("como-funciona");
                    }
                  };
                  return (
                    <a key={h} href={h} onClick={handleClick} style={{padding:"8px 14px",borderRadius:50,fontWeight:700,fontSize:".88rem",color:"#5E5E5E",textDecoration:"none",transition:"all .2s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background="#EFE7DC";e.currentTarget.style.color=C.cafe}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#5E5E5E";}}>
                      {l}
                    </a>
                  );
                })}
             
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Hero({ onLoginClick, onDemoClick, onConocenosClick, onHelpClick }) {
  const pets = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <section
      className="hero-section"
      style={{
        ...sectionTexture(C.beigelt),
        minHeight: "100svh",
        width: "100%",
        overflowX: "hidden",
        overflowY: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "90px 16px 40px",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${C.beigedk} 1px, transparent 1px)`,
          backgroundSize: "38px 38px",
          opacity: 0.16,
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2
        }}
      >
        <h1
          style={{
            width: "100%",
            margin: "0 0 18px",
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.2rem, 9vw, 4.2rem)",
            lineHeight: 1.05,
            color: C.cafe,
            overflowWrap: "anywhere",
            wordBreak: "normal"
          }}
        >
          Encuentra a tu compañero de vida
        </h1>

        <p
          style={{
            width: "100%",
            maxWidth: "560px",
            margin: "0 auto 30px",
            fontSize: "clamp(.95rem,3.8vw,1.1rem)",
            color: C.sub,
            lineHeight: 1.7
          }}
        >
          Plataforma de adopciones para conectar peludos con su familia ideal.
          Adopta de forma responsable y dale un lugar a quien más lo necesita.
        </p>

        <div
          className="hero-actions"
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px 14px",
            marginTop: 20
          }}
        >
          {/* Card 1: Quiero adoptar */}
          <button
            onClick={onLoginClick}
            className="paw-btn"
            style={{
              width: "100%",
              padding: "14px 24px",
              border: "none",
              borderRadius: "999px",
              background: C.cafe,
              color: C.white,
              fontWeight: 800,
              fontSize: ".95rem",
              cursor: "pointer"
            }}
          >
            Quiero adoptar
          </button>

          {/* Card 2: Cómo puedo ayudar */}
          <button
            onClick={onHelpClick}
            className="paw-btn"
            style={{
              width: "100%",
              padding: "14px 24px",
              border: "none",
              borderRadius: "999px",
              background: "#22C55E",
              color: C.white,
              fontWeight: 800,
              fontSize: ".95rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box"
            }}
          >
            Cómo puedo ayudar
          </button>

          {/* Card 3: Proceso de adopción */}
          <button
            onClick={onDemoClick}
            className="paw-btn"
            style={{
              width: "100%",
              padding: "14px 24px",
              border: `2px solid ${C.cafeLt}`,
              borderRadius: "999px",
              background: C.cream,
              color: C.cafe,
              fontWeight: 800,
              fontSize: ".95rem",
              cursor: "pointer"
            }}
          >
            Proceso de adopción
          </button>

          {/* Card 4: Conócenos */}
          <button
            onClick={onConocenosClick}
            className="paw-btn"
            style={{
              width: "100%",
              padding: "14px 24px",
              border: `2px solid ${C.cafeLt}`,
              borderRadius: "999px",
              background: C.cream,
              color: C.cafe,
              fontWeight: 800,
              fontSize: ".95rem",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            Conócenos
          </button>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
            marginTop: 32
          }}
        >
          {[
            ["100+", "Adoptados"],
            ["100+", "Familias felices"],
            ["10+", "Refugios y rescatistas independientes aliados"]
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                padding: "14px 10px",
                borderRadius: 16,
                background: "rgba(255,255,255,.55)",
                backdropFilter: "blur(8px)"
              }}
            >
              <div
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem,5vw,2rem)",
                  color: C.cafe,
                  lineHeight: 1
                }}
              >
                {n}
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: ".75rem",
                  color: C.muted,
                  fontWeight: 600,
                  lineHeight: 1.3
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            marginTop: 28,
            overflow: "hidden",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)"
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              width: "max-content",
              animation: "heroStripScroll 18s linear infinite"
            }}
          >
            {[...pets, ...pets].map((src, i) => (
              <div
                key={i}
                style={{
                  width: 90,
                  height: 90,
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: 18,
                  border: `3px solid ${C.white}`,
                  boxShadow: `0 6px 18px ${C.shadowMd}`
                }}
              >
                <img
                  src={src}
                  alt="Mascota"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function VideoSection(){
  useReveal();
  const [videoError,setVideoError]=useState(false);
  return(
    <section id="video-preview" className="video-section" style={{...sectionTexture(C.beigelt),padding:"74px 5% 60px",overflow:"hidden",position:"relative"}}>
      <div className="section-deco-blob" style={{position:"absolute",top:20,right:"10%",width:120,height:120,borderRadius:"50%",background:`${C.cafeXlt}44`,animation:"driftGlow 8s ease-in-out infinite"}}/>
      <div className="section-deco-blob" style={{position:"absolute",bottom:20,left:"6%",width:90,height:90,borderRadius:"50%",background:`${C.beigedk}66`,animation:"driftGlow 10s ease-in-out infinite",animationDelay:".8s"}}/>
      <BoneShape w={78} h={20} style={{top:44,left:"34%",transform:"rotate(18deg)"}}/>
      <PawPrint size={36} style={{top:40,right:"30%",transform:"rotate(-10deg)"}}/>
      <div className="video-grid" style={{maxWidth:1240,margin:"0 auto",display:"grid",gridTemplateColumns:"1.05fr 1.2fr",gap:30,alignItems:"start"}}>
        <div className="reveal-left video-copy">
          <div style={{fontSize:".74rem",fontWeight:800,color:"#7A5230",textTransform:"uppercase",letterSpacing:1.6,marginBottom:10}}>Historias reales</div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.9rem,3.2vw,2.9rem)",color:C.ink,lineHeight:1.1,marginBottom:14}}>
            Mira como cambian<br/>sus vidas
          </h2>
          <p style={{fontSize:".96rem",color:"#666666",lineHeight:1.8,maxWidth:470}}>
            Conoce el poder de la adopción responsable.
            Tú puedes cambiarlo todo...
            Salvar una vida, transformar su historia y darle a un perrito o gatito de la calle la oportunidad que siempre mereció.
          </p>
        </div>

        <div className="reveal-right video-card" style={{position:"relative",borderRadius:26,overflow:"hidden",border:`2px solid ${C.white}`,boxShadow:`0 22px 56px ${C.shadowMd}`,background:"#121212",minHeight:340}}>
          {!videoError?(
            <video autoPlay muted loop playsInline preload="metadata" onError={()=>setVideoError(true)} style={{width:"100%",height:"100%",display:"block",objectFit:"cover"}}>
              <source src="https://cdn.coverr.co/videos/coverr-dog-running-in-a-meadow-1579/1080p.mp4" type="video/mp4"/>
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4"/>
            </video>
          ):(
            <div style={{height:"100%",minHeight:340,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,overflow:"hidden",background:`linear-gradient(140deg, ${C.ink}, ${C.cafe} 45%, ${C.cafeMd} 75%, ${C.cafeXlt})`,backgroundSize:"180% 180%",animation:"gradientShift 10s ease infinite",color:C.white}}>
              <div style={{position:"absolute",top:-38,left:-26,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
              <div style={{position:"absolute",bottom:-46,right:-18,width:210,height:210,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
              {[{emoji:E.dog,t:"15%",l:"18%",d:0},{emoji:E.cat,t:"26%",r:"15%",d:.35},{emoji:E.paw,b:"22%",l:"20%",d:.2},{emoji:E.heart,b:"16%",r:"18%",d:.5}].map((p,i)=>(
                <div key={i} style={{position:"absolute",...(p.t?{top:p.t}:{}),...(p.b?{bottom:p.b}:{}),...(p.l?{left:p.l}:{}),...(p.r?{right:p.r}:{}),fontSize:"1.5rem",opacity:.42,animation:`bobSoft ${3.2+i*.5}s ease-in-out infinite`,animationDelay:`${p.d}s`}}>
                  {p.emoji}
                </div>
              ))}
              <div style={{position:"relative",zIndex:2,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.26)",backdropFilter:"blur(6px)",borderRadius:18,padding:"18px 28px",textAlign:"center",boxShadow:"0 16px 38px rgba(0,0,0,.26)"}}>
                <LogoSVG size={68} color={C.white}/>
                <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.52rem",letterSpacing:.5,marginTop:8}}>DOGOOD</div>
                <div style={{fontSize:".93rem",fontWeight:800,opacity:.9,marginTop:4}}>Video temporalmente no disponible</div>
                <div style={{marginTop:10,fontSize:".78rem",opacity:.75}}>Mientras tanto, explora peluditos disponibles abajo</div>
              </div>
            </div>
          )}
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(18,18,18,.55) 0%, rgba(18,18,18,0) 56%)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:0,bottom:0,left:"-24%",width:"36%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent)",animation:"shimmerSweep 7s linear infinite",pointerEvents:"none"}}/>
          <div style={{position:"absolute",left:14,bottom:12,display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.13)",backdropFilter:"blur(8px)",border:`1px solid rgba(255,255,255,.25)`,borderRadius:50,padding:"7px 12px",animation:"bobSoft 3.4s ease-in-out infinite"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#D6D6D6",display:"block",animation:"pulseDot 1.8s infinite"}}/>
            <span style={{fontSize:".74rem",fontWeight:800,color:C.white,letterSpacing:.6}}>Reproduccion automatica</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveMetricsSection({onLoginClick, onOpenProfile}) {
  useReveal();
  const [filterKind, setFilterKind] = useState("todos");
  const [activeTab, setActiveTab] = useState(null); // null, "disponibles", "adoptados", "refugios"
  const mockRefugios = [
    {
      name: "Refugio Demo",
      avatar: "RD",
      desc: "Espacio dedicado al cuidado temporal y socialización de perritos y gatitos rescatados, preparándolos para su familia ideal.",
      zone: "Querétaro, MX",
    },
    {
      name: "Casa Huellas",
      avatar: "CH",
      desc: "Asociación civil que rescata animales en situación de calle o maltrato, brindándoles atención médica y mucho amor.",
      zone: "CDMX, MX",
    },
    {
      name: "Rescatistas Independientes Qro",
      avatar: "RI",
      desc: "Red de rescatistas independientes dedicados a dar hogares temporales y rehabilitar peludos en Querétaro.",
      zone: "Querétaro, MX",
    }
  ];
  const availablePets = [
    {
      name: "Max",
      kind: "Perrito",
      age: "2 anos",
      size: "Mediano",
      zone: "CDMX",
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Mochi",
      kind: "Gatito",
      age: "1 ano",
      size: "Chico",
      zone: "Del Valle",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Luna",
      kind: "Perrita",
      age: "3 anos",
      size: "Grande",
      zone: "Coyoacan",
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80",
    },
  ];
  const adoptedStories = [
    {
      name: "Nala",
      family: "Familia Ruiz",
      text: "Ahora sale a caminar cada tarde y duerme junto a sus nuevos hermanos.",
      img: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Bruno",
      family: "Familia Torres",
      text: "Paso de vivir en resguardo a tener patio, rutina y mucho carino.",
      img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Mia",
      family: "Familia Gomez",
      text: "Su nueva familia la acompano con paciencia hasta verla confiar otra vez.",
      img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=700&q=80",
    },
  ];
  const [stats, setStats] = useState({
    disponibles: 92,
    adoptados: "+100",
    refugios: 12,
    publicaciones: 146,
  });
  const metricCards = [
    ["Disponibles en adopcion", stats.disponibles, E.paw, "metric-disponibles"],
    ["Adoptados", stats.adoptados, E.heart, "metric-adoptados"],
    ["Refugios y rescatistas afiliados", stats.refugios, E.house, "metric-refugios"],
  ];
  const scrollToMetric = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleCardClick = (target) => {
    const tabName = target.replace("metric-", "");
    if (activeTab === tabName) {
      setActiveTab(null);
    } else {
      setActiveTab(tabName);
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  useEffect(() => {
    let alive = true;
    fetch(apiUrl("animales.php?action=public"))
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok && Array.isArray(d.animals) && d.animals.length) {
          const adoptados = d.animals.filter((a) => a.estatus === "Adoptado").length;
          const disponibles = d.animals.filter((a) => a.estatus !== "Adoptado").length;
          const refugios = new Set(
            d.animals.map((a) => String(a.rescatista_id || a.rescatista_nombre || "ref"))
          ).size;
          setStats({
            disponibles,
            adoptados: "+100",
            refugios: Math.max(1, refugios),
            publicaciones: d.animals.length,
          });
          return;
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const filteredPets = availablePets.filter((p) => {
    if (filterKind === "todos") return true;
    if (filterKind === "perro") return p.kind.toLowerCase().includes("perr");
    if (filterKind === "gato") return p.kind.toLowerCase().includes("gat");
    return true;
  });

  return (
    <section
      style={{
        ...sectionTexture(C.graySoft),
        padding: "24px 5% 68px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        {/* Métricas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}
          className="metrics-desktop"
        >
          {metricCards.map(([label, val, icon, target], i) => {
            const isTabActive = activeTab === target.replace("metric-", "");
            return (
              <button
                key={label}
                onClick={() => handleCardClick(target)}
                className={`reveal paw-btn ${i === 2 ? "metric-card-3" : ""}`}
                style={{
                  textAlign: "left",
                  background: isTabActive ? "#F1ECE6" : C.cream,
                  border: `1.5px solid ${isTabActive ? C.cafe : C.beigedk}`,
                  borderRadius: 16,
                  padding: "14px 14px",
                  boxShadow: `0 8px 18px ${C.shadow}`,
                  animationDelay: `${i * 0.05}s`,
                  cursor: "pointer",
                  transition: "background .25s ease, border-color .25s ease"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: ".78rem", fontWeight: 800, color: C.sub }}>{label}</span>
                  <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                </div>
                <div
                  style={{
                    fontFamily: "'Fredoka',sans-serif",
                    fontWeight: 700,
                    fontSize: "2rem",
                    lineHeight: 1,
                    color: C.cafe,
                    marginTop: 8,
                  }}
                >
                  {val}
                </div>
              </button>
            );
          })}
        </div>

        <style>{`
          /* Móvil: menos de 560px */
          @media (max-width: 559px) {
            .disponibles-grid {
              display: flex !important;
              flex-direction: column !important;
              gap: 12px !important;
            }
            .adoptados-grid {
              display: flex !important;
              flex-direction: row !important;
              overflow-x: auto !important;
              gap: 12px !important;
              padding-bottom: 8px !important;
              scroll-snap-type: x mandatory !important;
              -webkit-overflow-scrolling: touch !important;
            }
            .disponibles-card {
              width: 100% !important;
            }
            .adoptados-card {
              min-width: 260px !important;
              flex-shrink: 0 !important;
              scroll-snap-align: start !important;
            }
            .metric-card-3 {
              grid-column: span 2;
            }
          }
          
          /* Tablet: 560px a 900px */
          @media (min-width: 560px) and (max-width: 899px) {
            .disponibles-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
            .adoptados-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
            .adoptados-card {
              min-width: auto !important;
            }
            .metrics-desktop {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .metric-card-3 {
              grid-column: auto !important;
            }
          }
          
          /* Desktop: más de 900px */
          @media (min-width: 900px) {
            .disponibles-grid {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 12px !important;
            }
            .adoptados-grid {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 12px !important;
            }
            .adoptados-card {
              min-width: auto !important;
            }
            .metrics-desktop {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .metric-card-3 {
              grid-column: auto !important;
            }
          }
        `}</style>

        {activeTab && (
          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            {/* SECCIÓN DISPONIBLES */}
            {activeTab === "disponibles" && (
              <div
                id="metric-disponibles"
                className="reveal"
                style={{
                  scrollMarginTop: 110,
                  borderRadius: 18,
                  border: `1.5px solid ${C.beigedk}`,
                  background: "rgba(255,255,255,.78)",
                  boxShadow: `0 8px 18px ${C.shadow}`,
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h3
                    style={{
                      display: "inline-flex",
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: C.cafeLt,
                      color: C.white,
                      fontFamily: "'Fredoka',sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    Disponibles en adopcion
                  </h3>
                  <button
                    onClick={() => setActiveTab(null)}
                    className="paw-btn"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: `1.5px solid ${C.beigedk}`,
                      background: C.white,
                      color: C.cafe,
                      fontWeight: 800,
                      fontSize: ".82rem",
                      cursor: "pointer",
                    }}
                  >
                    Cerrar sección ✕
                  </button>
                </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                margin: "14px 0",
              }}
            >
              {[["todos", "Todos"], ["perro", "Perros 🐶"], ["gato", "Gatos 🐱"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilterKind(val)}
                  className="paw-btn"
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: `1px solid ${filterKind === val ? C.cafe : C.beigedk}`,
                    background: filterKind === val ? C.cafe : C.white,
                    color: filterKind === val ? C.white : C.sub,
                    fontSize: ".78rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="disponibles-grid">
              {filteredPets.map((p) => (
                <div
                  key={p.name}
                  className="disponibles-card"
                  onClick={() => onOpenProfile(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onOpenProfile(p);
                  }}
                  style={{
                    background: C.white,
                    border: `1.5px solid ${C.beigedk}`,
                    borderRadius: 18,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform .25s ease, box-shadow .25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 10px 24px ${C.shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 900, fontSize: "1.1rem", color: C.cafe }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: ".85rem", color: C.sub, lineHeight: 1.55, marginTop: 4 }}>
                      {p.kind} - {p.age} - {p.size}
                    </div>
                    <div
                      style={{
                        fontSize: ".8rem",
                        color: C.muted,
                        fontWeight: 800,
                        marginTop: 6,
                      }}
                    >
                      📍 {p.zone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

            {/* SECCIÓN ADOPTADOS */}
            {activeTab === "adoptados" && (
              <div
                id="metric-adoptados"
                className="reveal"
                style={{
                  scrollMarginTop: 110,
                  borderRadius: 18,
                  border: `1.5px solid ${C.beigedk}`,
                  background: "rgba(255,255,255,.78)",
                  boxShadow: `0 8px 18px ${C.shadow}`,
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h3
                    style={{
                      display: "inline-flex",
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: "#6D45FF",
                      color: C.white,
                      fontFamily: "'Fredoka',sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    Adoptados ❤️
                  </h3>
                  <button
                    onClick={() => setActiveTab(null)}
                    className="paw-btn"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: `1.5px solid ${C.beigedk}`,
                      background: C.white,
                      color: C.cafe,
                      fontWeight: 800,
                      fontSize: ".82rem",
                      cursor: "pointer",
                    }}
                  >
                    Cerrar sección ✕
                  </button>
                </div>
            <div className="adoptados-grid" style={{ marginTop: 14 }}>
              {adoptedStories.map((s) => (
                <div
                  key={s.name}
                  className="adoptados-card"
                  style={{
                    background: C.white,
                    border: `1px solid ${C.beigedk}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={s.img}
                    alt={s.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div style={{ padding: 14 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: "1rem",
                        color: C.cafe,
                        wordBreak: "break-word",
                      }}
                    >
                      {s.name} con {s.family}
                    </div>
                    <p
                      style={{
                        fontSize: ".85rem",
                        color: C.sub,
                        lineHeight: 1.6,
                        marginTop: 8,
                        wordBreak: "break-word",
                      }}
                    >
                      {s.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

            {/* SECCIÓN REFUGIOS */}
            {activeTab === "refugios" && (
              <div
                id="metric-refugios"
                className="reveal"
                style={{
                  scrollMarginTop: 110,
                  borderRadius: 18,
                  border: `1.5px solid ${C.beigedk}`,
                  background: "rgba(255,255,255,.78)",
                  boxShadow: `0 8px 18px ${C.shadow}`,
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h3
                    style={{
                      display: "inline-flex",
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: "#22C55E",
                      color: C.white,
                      fontFamily: "'Fredoka',sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)",
                      lineHeight: 1.1,
                    }}
                  >
                    Refugios y rescatistas afiliados 🏡
                  </h3>
                  <button
                    onClick={() => setActiveTab(null)}
                    className="paw-btn"
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: `1.5px solid ${C.beigedk}`,
                      background: C.white,
                      color: C.cafe,
                      fontWeight: 800,
                      fontSize: ".82rem",
                      cursor: "pointer",
                    }}
                  >
                    Cerrar sección ✕
                  </button>
                </div>
            <div
              className="refugios-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 14,
                marginTop: 18,
              }}
            >
              {mockRefugios.map((r) => (
                <div
                  key={r.name}
                  style={{
                    background: C.white,
                    border: `1px solid ${C.beigedk}`,
                    borderRadius: 14,
                    padding: 16,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${C.cafeLt}, ${C.cafe})`,
                      color: C.white,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {r.avatar}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 900, fontSize: "1.05rem", color: C.cafe }}>
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontSize: ".82rem",
                        color: C.muted,
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      📍 {r.zone}
                    </div>
                    <p style={{ fontSize: ".85rem", color: C.sub, lineHeight: 1.5, marginTop: 8 }}>
                      {r.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
function Carousel({onLoginClick, onOpenProfile}){
  const [animals,setAnimals]=useState([]);
  const [loading,setLoading]=useState(true);
  const [mode,setMode]=useState("live");
  const [vw,setVw]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{
    const on=()=>setVw(window.innerWidth);
    window.addEventListener("resize",on);
    return()=>window.removeEventListener("resize",on);
  },[]);
  const fallback=[
    {emoji:E.dog,nombre:"Max",raza:"Labrador",edad:"2 anos",tamano:"Mediano",sexo:"Macho",ubicacion:"CDMX",historia:"Max es jugueton, noble y aprende rapido. Busca una familia que disfrute paseos diarios y tiempo de calidad.",foto_url:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafe},${C.cafeMd})`},
    {emoji:E.cat,nombre:"Mochi",raza:"Mestizo",edad:"1 ano",tamano:"Chico",sexo:"Hembra",ubicacion:"Del Valle",historia:"Mochi es tranquila, curiosa y muy carinosa cuando toma confianza. Ideal para depa y rutinas calmadas.",foto_url:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafeMd},${C.cafeLt})`},
    {emoji:E.poodle,nombre:"Luna",raza:"Poodle",edad:"3 anos",tamano:"Chico",sexo:"Hembra",ubicacion:"Coyoacan",historia:"Luna ama estar cerca de las personas. Se adapta bien a hogares pacientes y responsables.",foto_url:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafeLt},${C.cafeXlt})`},
    {emoji:E.catFace,nombre:"Canela",raza:"Siames",edad:"2 anos",tamano:"Chico",sexo:"Hembra",ubicacion:"Narvarte",historia:"Canela es observadora y dulce. Necesita un hogar seguro donde pueda explorar sin prisas.",foto_url:"https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,#8B4513,${C.cafeMd})`},
    {emoji:E.guideDog,nombre:"Thor",raza:"Pastor Aleman",edad:"4 anos",tamano:"Grande",sexo:"Macho",ubicacion:"Condesa",historia:"Thor es leal y activo. Le van bien familias con espacio, estructura y experiencia con perros grandes.",foto_url:"https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafe},#A0522D)`},
    {emoji:E.smileCat,nombre:"Mina",raza:"Ragdoll",edad:"8 meses",tamano:"Chico",sexo:"Hembra",ubicacion:"Portales",historia:"Mina es sociable, dormilona y disfruta jugar con pelotas suaves. Busca adopcion responsable indoor.",foto_url:"https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafeLt},${C.cafe})`},
    {emoji:E.dogFace,nombre:"Coco",raza:"Chihuahua",edad:"5 anos",tamano:"Chico",sexo:"Macho",ubicacion:"Nápoles",historia:"Coco es pequeno pero muy expresivo. Prefiere hogares tranquilos y compania constante.",foto_url:"https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafeXlt},${C.cafeMd})`},
    {emoji:E.blackCat,nombre:"Noche",raza:"British",edad:"2 anos",tamano:"Chico",sexo:"Macho",ubicacion:"San Rafael",historia:"Noche es independiente, limpio y afectuoso a su ritmo. Ideal para una familia paciente.",foto_url:"https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,#3A2010,${C.cafe})`},
    {emoji:E.serviceDog,nombre:"Rex",raza:"Golden",edad:"3 anos",tamano:"Grande",sexo:"Macho",ubicacion:"Santa Maria",historia:"Rex es noble y sociable. Disfruta pasear, aprender comandos y convivir con personas activas.",foto_url:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",color:`linear-gradient(135deg,${C.cafeMd},${C.cafeXlt})`},
  ];
  useEffect(()=>{
    fetch(apiUrl("animales.php?action=public"))
      .then(r=>r.json())
      .then(d=>{
        if(d.ok&&d.animals.length>0){
          const liveAnimals=d.animals.filter(a=>a.estatus!=="Adoptado");
          if(liveAnimals.length){
            setAnimals(liveAnimals);
            setMode("live");
            setLoading(false);
            return;
          }
        }
        setAnimals(fallback);
        setMode("demo");
        setLoading(false);
      })
      .catch(()=>{
        setAnimals(fallback);
        setMode("demo");
        setLoading(false);
      });
  },[]);

  const items=animals.length>0?animals:fallback;

  // Distribuir animales en 3 filas: idx%3===0 -> fila1, idx%3===1 -> fila2, idx%3===2 -> fila3
  const row1=items.filter((_,i)=>i%3===0);
  const row2=items.filter((_,i)=>i%3===1);
  const row3=items.filter((_,i)=>i%3===2);

  // Rellena cada fila para que el collage siempre ocupe bien el ancho
  const buildBaseRow=(arr,min=8)=>{
    const source=arr.length>0?arr:items.slice(0,Math.min(3,items.length));
    if(source.length===0)return [];
    const out=[...source];
    while(out.length<min)out.push(...source);
    return out.slice(0,Math.max(min,source.length));
  };

  const b1=buildBaseRow(row1);
  const b2=buildBaseRow(row2);
  const b3=buildBaseRow(row3);

  const r1=[...b1,...b1,...b1];
  const r2=[...b2,...b2,...b2];
  const r3=[...b3,...b3,...b3];

  const getWaitingDays=(a,idx)=>{
    if(typeof a?.dias_espera==="number")return Math.max(1,a.dias_espera);
    if(typeof a?.dias_en_refugio==="number")return Math.max(1,a.dias_en_refugio);
    const dateRaw=a?.fecha_ingreso||a?.created_at||a?.fecha_creacion||null;
    if(dateRaw){
      const d=new Date(dateRaw);
      if(!Number.isNaN(d.getTime())){
        const diff=Math.floor((LANDING_NOW-d.getTime())/(1000*60*60*24));
        return Math.max(1,diff);
      }
    }
    return 9+((idx*7)%54);
  };

  const Card=({a,w=220,h=208,rot=0,waitDays=0,onClick})=>{
    const [imgError,setImgError]=useState(false);
    const showImg=a.foto_url&&!imgError;
    return(
    <div onClick={onClick} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onClick?.();}} style={{width:w,height:h,flexShrink:0,borderRadius:22,overflow:"hidden",
      background:a.color||`linear-gradient(135deg,${C.cafe},${C.cafeMd})`,
      boxShadow:`0 6px 22px rgba(22,83,187,.18)`,
      transform:`rotate(${rot}deg)`,
      transition:"transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease",
      cursor:"pointer",position:"relative",
      border:`3px solid rgba(255,255,255,.9)`}}
      onMouseEnter={e=>{e.currentTarget.style.transform="rotate(0deg) scale(1.07) translateY(-4px)";e.currentTarget.style.boxShadow=`0 20px 48px rgba(22,83,187,.28)`;e.currentTarget.style.zIndex="10";}}
      onMouseLeave={e=>{e.currentTarget.style.transform=`rotate(${rot}deg)`;e.currentTarget.style.boxShadow=`0 6px 22px rgba(22,83,187,.18)`;e.currentTarget.style.zIndex="1";}}>
      {showImg
        ?<img src={a.foto_url} alt={a.nombre} loading="lazy" onError={()=>setImgError(true)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",transition:"transform .35s ease"}}/>
        :<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(w*.24)+"px"}}>{a.emoji||E.paw}</div>
      }
      {/* Días esperando badge */}
      <div style={{position:"absolute",top:9,left:9,background:"rgba(17,17,17,.72)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.2)",color:C.white,padding:"4px 9px",borderRadius:999,fontSize:".64rem",fontWeight:800,letterSpacing:.2,display:"flex",alignItems:"center",gap:4}}>
        <span style={{width:5,height:5,borderRadius:"50%",background:C.cafeXlt,display:"inline-block",animation:"pulseDot 1.8s infinite"}}/>
        {waitDays}d esperando
      </div>
      {/* Gradient overlay con nombre */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,
        background:"linear-gradient(to top,rgba(10,10,20,.9) 0%,rgba(10,10,20,.4) 55%,transparent 100%)",
        padding:"32px 13px 13px"}}>
        <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1rem,1.3vw,1.35rem)",color:C.white,lineHeight:1}}>{a.nombre}</div>
        <div style={{fontSize:"clamp(.8rem,.95vw,1rem)",color:"rgba(255,255,255,.78)",marginTop:3,display:"flex",alignItems:"center",gap:5}}>
          <span>{a.raza}</span>
          {a.ubicacion&&<><span style={{opacity:.45}}>·</span><span style={{opacity:.7,fontSize:".78em"}}>{E.mapPin}{a.ubicacion}</span></>}
        </div>
      </div>
    </div>
    );
  };

  // Alturas y velocidad por fila para look tipo collage continuo
  const k=vw<480?0.6:vw<768?0.72:vw<1024?0.86:1;
  const rowConfigs=[
    {h:Math.round(218*k),gap:Math.round(16*k),speed:45},
    {h:Math.round(234*k),gap:Math.round(16*k),speed:58},
    {h:Math.round(218*k),gap:Math.round(16*k),speed:50},
  ];

  return(
    <section id="adoptar" className="collage-section" style={{...sectionTexture(C.beige),padding:"80px 0",overflow:"hidden",position:"relative"}}>
      <div className="section-deco-blob" style={{position:"absolute",top:24,left:"8%",width:110,height:110,borderRadius:"50%",background:`${C.beigedk}70`,animation:"driftGlow 10s ease-in-out infinite"}}/>
      <div className="section-deco-blob" style={{position:"absolute",bottom:26,right:"7%",width:140,height:140,borderRadius:"50%",background:`${C.cafeXlt}2a`,animation:"driftGlow 12s ease-in-out infinite",animationDelay:".6s"}}/>
      <BoneShape w={82} h={21} style={{top:30,right:"23%",transform:"rotate(14deg)"}}/>
      <PawPrint size={34} style={{bottom:34,left:"16%",transform:"rotate(-12deg)"}}/>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 5%",marginBottom:36,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <div className="reveal">
          <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.8,marginBottom:8}}>Peluditos disponibles</div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.9rem,3vw,2.8rem)",color:C.cafe,lineHeight:1.1}}>Te estan esperando</h2>
        </div>
        <div className="reveal" style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",justifyContent:"flex-end"}}>
          <p style={{fontSize:".92rem",color:C.sub,maxWidth:340,lineHeight:1.75}}>Cada uno tiene una historia unica. Quizas el tuyo esta aqui.</p>
          <span style={{padding:"5px 10px",borderRadius:999,fontSize:".68rem",fontWeight:800,border:`1px solid ${mode==="live"?C.cafeXlt:"#F5D48B"}`,background:mode==="live"?`${C.cafe}12`:"#FFF7D6",color:mode==="live"?C.cafe:"#7A5200"}}>
            {mode==="live"?"Catalogo en vivo":"Catalogo demo"}
          </span>
        </div>
      </div>

      {/* 3 filas de collage con animación continua */}
      <div style={{display:"flex",flexDirection:"column",gap:14,padding:"2px 0 12px"}}
        onMouseEnter={e=>Array.from(e.currentTarget.querySelectorAll(".row-track")).forEach(r=>r.style.animationPlayState="paused")}
        onMouseLeave={e=>Array.from(e.currentTarget.querySelectorAll(".row-track")).forEach(r=>r.style.animationPlayState="running")}>
        {loading&&(
          <div style={{maxWidth:1240,margin:"0 auto",padding:"0 5%"}}>
            <div style={{background:C.cream,border:`1.5px dashed ${C.beigedk}`,borderRadius:16,padding:"14px 16px",fontSize:".85rem",fontWeight:700,color:C.muted}}>
              Cargando collage de adopcion...
            </div>
          </div>
        )}
        {[r1,r2,r3].map((row,ri)=>{
          const cfg=rowConfigs[ri];
          const animName=`slideInfinite${ri}`;
          return(
            <div key={ri} style={{overflow:"hidden",maskImage:"linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",WebkitMaskImage:"linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)"}}>
              <style>{`@keyframes ${animName}{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>
              <div className="row-track" style={{
                display:"flex",gap:cfg.gap,
                animation:`${animName} ${cfg.speed}s linear infinite`,
                width:"max-content",
                alignItems:"center",
                animationDirection:ri===1?"reverse":"normal",
                transform:ri===1?"translateX(-36px)":"none",
                willChange:"transform"}}>
                {row.map((a,i)=>(
                  <Card key={`${ri}-${i}`} a={a} w={Math.round((206+(i%2)*18)*k)} h={cfg.h} rot={i%2===0?-1.8:1.8} waitDays={getWaitingDays(a,i+ri*3)} onClick={()=>onOpenProfile(a)}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AnimalProfilePage({animal,onClose,waitDays=1}){
  const [activePhoto,setActivePhoto]=useState(0);
  const [showForm,setShowForm]=useState(false);
  const [sent,setSent]=useState(false);

  const nombre = animal.nombre || animal.name || "Peludito";
  const raza = animal.raza || animal.kind || "Mestizo";
  const foto = animal.foto_url || animal.img;

  const rawPhotos=[foto,animal.foto_2,animal.foto_3,animal.foto_4,animal.galeria?.[0],animal.galeria?.[1],animal.galeria?.[2]]
    .filter(Boolean);
  const photos=rawPhotos.length?rawPhotos:[null];
  const mainPhoto=photos[Math.min(activePhoto,photos.length-1)];
  const details=[
    ["Edad",animal.edad||animal.edad_texto||"Por confirmar"],
    ["Sexo",animal.sexo||"Por confirmar"],
    ["Tamano",animal.tamano||animal.talla||animal.size||"Por confirmar"],
    ["Tiempo en adopcion",`${waitDays} dias`],
  ];
  const requestSubmit=(e)=>{
    e.preventDefault();
    setSent(true);
    setTimeout(()=>setSent(false),2800);
  };
  return(
    <div className="animal-profile-page" style={{position:"fixed",inset:0,zIndex:310,overflowY:"auto",padding:"104px 5% 34px",background:`linear-gradient(180deg, rgba(250,252,255,.98), rgba(238,246,255,.99)), url("${DOG_DOODLE}")`,backgroundSize:"100% 100%,236px 236px",animation:"fadeUp .28s ease"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <button onClick={onClose} className="paw-btn" style={{marginBottom:14,padding:"10px 16px",borderRadius:999,border:`1.5px solid ${C.beigedk}`,background:C.white,color:C.cafe,fontWeight:900,cursor:"pointer",boxShadow:`0 8px 20px ${C.shadow}`}}>
          Volver al catalogo
        </button>
        <div className="animal-profile-shell" style={{background:C.cream,borderRadius:26,boxShadow:"0 28px 80px rgba(22,83,187,.18)",border:`1.5px solid ${C.beigedk}`,overflow:"hidden"}}>
          <div className="animal-profile-layout" style={{display:"grid",gridTemplateColumns:"minmax(0,1.05fr) minmax(340px,.95fr)"}}>
          <div className="animal-profile-media" style={{minHeight:560,background:animal.color||C.cafe,position:"relative",overflow:"hidden"}}>
            {mainPhoto?(
              <img src={mainPhoto} alt={nombre} style={{width:"100%",height:"100%",minHeight:560,objectFit:"cover",transition:"opacity .25s ease"}}/>
            ):(
              <div style={{height:"100%",minHeight:560,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8rem"}}>{animal.emoji||E.paw}</div>
            )}
            <div className="animal-profile-gallery" style={{position:"absolute",left:14,bottom:14,right:14,display:"grid",gridTemplateColumns:`repeat(${Math.min(4,photos.length)},minmax(0,72px))`,gap:8}}>
              {photos.map((src,i)=>(
                <button key={i} onClick={()=>setActivePhoto(i)} aria-label={`Ver foto ${i+1} de ${nombre}`} style={{height:66,borderRadius:13,border:`2px solid ${i===activePhoto?C.cafeXlt:C.white}`,boxShadow:"0 6px 16px rgba(0,0,0,.22)",overflow:"hidden",background:animal.color||C.cafe,cursor:"pointer",padding:0}}>
                  {src?<img src={src} alt={`${nombre} ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{display:"flex",height:"100%",alignItems:"center",justifyContent:"center",fontSize:"1.4rem"}}>{animal.emoji||E.paw}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="animal-profile-details" style={{padding:"30px 30px 32px",position:"relative"}}>
            <div style={{fontSize:".72rem",fontWeight:900,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Perfil de adopcion</div>
            <h3 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.8rem,4vw,2.5rem)",color:C.cafe,lineHeight:1.05,marginRight:28}}>{nombre}</h3>
            <div style={{fontSize:".92rem",fontWeight:800,color:C.sub,marginTop:4}}>{raza}</div>
            <p style={{fontSize:".92rem",color:C.sub,lineHeight:1.72,margin:"16px 0"}}>{animal.descripcion||"Este peludito busca una familia responsable. Conoce su historia, revisa si su rutina se adapta a la tuya y llena la solicitud para iniciar el proceso."}</p>
            <div style={{fontSize:".74rem",fontWeight:900,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.1,marginBottom:6}}>Historia</div>
            <p style={{fontSize:".9rem",color:C.sub,lineHeight:1.72,marginBottom:16}}>{animal.historia||"Fue rescatado y ahora espera una familia paciente, amorosa y comprometida con su bienestar a largo plazo."}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8,marginBottom:16}}>
              {details.map(([label,value])=>(
                <div key={label} style={{background:C.beigelt,border:`1px solid ${C.beigedk}`,borderRadius:12,padding:"9px 10px"}}>
                  <div style={{fontSize:".66rem",fontWeight:900,color:C.muted,textTransform:"uppercase"}}>{label}</div>
                  <div style={{fontSize:".86rem",fontWeight:800,color:C.ink,marginTop:2}}>{value}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setShowForm(v=>!v)} className="paw-btn" style={{width:"100%",padding:"14px 16px",border:"none",borderRadius:14,background:C.cafe,color:C.white,fontWeight:900,fontSize:".98rem",cursor:"pointer",boxShadow:`0 10px 24px ${C.shadowMd}`}}>
              Solicitar adopcion
            </button>
            {showForm&&(
              <form onSubmit={requestSubmit} style={{marginTop:16,background:C.beigelt,border:`1.5px solid ${C.beigedk}`,borderRadius:16,padding:14,animation:"fadeUp .25s ease"}}>
                <div className="adoption-form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[["Nombre","text","Tu nombre completo"],["Telefono","tel","55 1234 5678"],["Correo","email","tu@correo.com"],["Direccion","text","Colonia, alcaldia, ciudad"]].map(([label,type,ph])=>(
                    <label key={label} style={{display:"grid",gap:5,fontSize:".72rem",fontWeight:900,color:C.sub,textTransform:"uppercase"}}>
                      {label}
                      <input required type={type} placeholder={ph} style={{padding:"10px 11px",borderRadius:10,border:`1.5px solid ${C.beigedk}`,background:C.white,color:C.ink,outline:"none",fontSize:".86rem",textTransform:"none"}}/>
                    </label>
                  ))}
                </div>
                <label style={{display:"grid",gap:5,marginTop:10,fontSize:".72rem",fontWeight:900,color:C.sub,textTransform:"uppercase"}}>
                  Preguntas de adopcion
                  <textarea required rows={4} placeholder="Cuéntanos sobre tu hogar, experiencia con mascotas, horarios y por qué quieres adoptar." style={{resize:"vertical",padding:"10px 11px",borderRadius:10,border:`1.5px solid ${C.beigedk}`,background:C.white,color:C.ink,outline:"none",fontSize:".86rem",lineHeight:1.5,textTransform:"none"}}/>
                </label>
                {sent&&<div style={{marginTop:10,padding:"9px 10px",borderRadius:10,background:"#DCFCE7",color:"#166534",fontSize:".8rem",fontWeight:900}}>Solicitud preparada. El equipo te contactara para continuar.</div>}
                <button className="paw-btn" type="submit" style={{marginTop:12,width:"100%",padding:"12px 14px",border:"none",borderRadius:12,background:C.ink,color:C.white,fontWeight:900,cursor:"pointer"}}>
                  Enviar solicitud
                </button>
              </form>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchQuizSection({onLoginClick}){
  useReveal();
  const questions=[
    {q:"Tu ritmo ideal de convivencia?",opts:[["Activo y salgo mucho","dog"],["Tranquilo en casa","cat"]]},
    {q:"Espacio disponible en casa?",opts:[["Amplio o con patio","dog"],["Departamento pequeno","cat"]]},
    {q:"Tiempo diario para juego?",opts:[["Mas de 60 min","dog"],["20-40 min","cat"]]},
    {q:"Que energia prefieres?",opts:[["Muy sociable y expresiva","dog"],["Independiente y serena","cat"]]},
  ];
  const [answers,setAnswers]=useState({});
  const total=Object.keys(answers).length;
  const dogScore=Object.values(answers).filter(v=>v==="dog").length;
  const catScore=total-dogScore;
  const done=total===questions.length;
  const result=dogScore>=catScore
    ?{title:"Match ideal: Perro",emoji:E.dog,desc:"Te puede ir excelente con un perrito sociable y activo."}
    :{title:"Match ideal: Gato",emoji:E.cat,desc:"Tu estilo encaja muy bien con un gatito tranquilo e independiente."};

  return(
    <section className="match-section" style={{...sectionTexture(C.graySoft),padding:"86px 5%",position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.8,marginBottom:8}}>Comparador rapido</div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.8rem,3vw,2.7rem)",color:C.ink,lineHeight:1.15}}>Que peludito va contigo?</h2>
        </div>
        <div className="match-grid" style={{display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:18,alignItems:"start"}}>
          <div className="reveal-left match-card" style={{background:C.cream,border:`1.5px solid ${C.beigedk}`,borderRadius:24,padding:20,boxShadow:`0 10px 28px ${C.shadow}`}}>
            {questions.map((it,qi)=>(
              <div key={it.q} style={{marginBottom:14,paddingBottom:14,borderBottom:qi<questions.length-1?`1px dashed ${C.beigedk}`:"none"}}>
                <div style={{fontWeight:800,color:C.sub,fontSize:".95rem",marginBottom:8}}>{qi+1}. {it.q}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {it.opts.map(([label,val])=>(
                    <button key={label} onClick={()=>setAnswers(prev=>({...prev,[qi]:val}))} className="paw-btn"
                      style={{padding:"8px 14px",borderRadius:999,border:`1.5px solid ${answers[qi]===val?C.cafe:C.beigedk}`,background:answers[qi]===val?C.cafe:C.white,color:answers[qi]===val?C.white:C.sub,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="reveal-right match-result" style={{background:`linear-gradient(155deg,${C.ink},${C.cafe})`,borderRadius:24,padding:22,color:C.white,border:`1.5px solid ${C.cafeLt}`,boxShadow:`0 14px 34px ${C.shadowMd}`}}>
            <div style={{fontSize:".74rem",textTransform:"uppercase",letterSpacing:1.2,color:"rgba(255,255,255,.66)",fontWeight:800}}>Resultado</div>
            {done?(
              <>
                <div style={{fontSize:"3rem",marginTop:10}}>{result.emoji}</div>
                <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.6rem",lineHeight:1.1}}>{result.title}</div>
                <p style={{fontSize:".9rem",color:"rgba(255,255,255,.75)",lineHeight:1.7,marginTop:8}}>{result.desc}</p>
                <button onClick={onLoginClick} className="paw-btn" style={{marginTop:14,width:"100%",padding:"11px 16px",border:"none",borderRadius:14,background:C.white,color:C.cafe,fontWeight:800,cursor:"pointer"}}>
                  Ver recomendados
                </button>
              </>
            ):(
              <>
                <div style={{fontSize:"2rem",marginTop:12}}>{E.sparkle}</div>
                <div style={{fontWeight:800,fontSize:"1.02rem",marginTop:8}}>Contesta {questions.length-total} preguntas mas</div>
                <div style={{height:8,borderRadius:999,background:"rgba(255,255,255,.18)",marginTop:12,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(total/questions.length)*100}%`,background:C.cafeXlt,transition:"width .3s"}}/>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StoriesSection(){
  useReveal();
  const stories=[
    {name:"Luna",kind:"Perrita",before:"Rescatada con miedo al contacto.",after:"¡Ahora ama los viajes a la playa! Sus dueños nos comparten fotos de ella corriendo feliz frente al mar cada fin de semana.",img:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"},
    {name:"Milo",kind:"Gatito",before:"Llego con bajo peso y sin hogar.",after:"Duerme en su propia cama y acompaña a sus dueños en paseos de fin de semana.",img:"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80"},
    {name:"Thor",kind:"Perrito",before:"Estuvo meses esperando adopcion.",after:"Es el alma de los road trips familiares. Sus adoptantes nos comparten sus aventuras de camping en la montaña.",img:"https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=80"},
  ];
  return(
    <section style={{...sectionTexture(C.beigelt),padding:"84px 5%"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center", marginBottom:30}}>
          <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.8,marginBottom:8}}>Historias reales</div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.9rem,3vw,2.8rem)",color:C.cafe}}>Mira como cambian sus vidas</h2>
          <p style={{fontSize:".95rem", maxWidth: 600, margin: "10px auto 0", color:C.sub, lineHeight:1.7}}>
            Conoce el poder de la adopción responsable. Tú puedes cambiarlo todo... 
            salvar una vida, transformar su historia y darle a un perrito o gatito 
            de la calle la oportunidad que siempre mereció.
          </p>
        </div>
        <div className="stories-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
          {stories.map((s,i)=>(
            <div key={s.name} className="reveal story-card" style={{background:C.cream,border:`1.5px solid ${C.beigedk}`,borderRadius:20,overflow:"hidden",boxShadow:`0 8px 20px ${C.shadow}`,animationDelay:`${i*.08}s`}}>
              <div style={{height:190,position:"relative"}}>
                <img src={s.img} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",right:12,top:12,background:"rgba(255,255,255,.9)",color:C.cafe,padding:"4px 8px",borderRadius:999,fontSize:".68rem",fontWeight:800,display:"flex",alignItems:"center",gap:4,boxShadow:`0 4px 10px rgba(0,0,0,.15)`}}>
                  <span>📸</span>
                  <span>Historia compartida</span>
                </div>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(23,21,19,.68), transparent 52%)"}}/>
                <div style={{position:"absolute",left:12,bottom:10,color:C.white}}>
                  <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.3rem"}}>{s.name}</div>
                  <div style={{fontSize:".78rem",opacity:.84}}>{s.kind}</div>
                </div>
              </div>
              <div style={{padding:"14px 14px 16px", textAlign:"left"}}>
                <div style={{fontSize:".76rem",fontWeight:800,color:C.muted,textTransform:"uppercase"}}>Antes</div>
                <p style={{fontSize:".84rem",color:C.sub,lineHeight:1.6,margin:"4px 0 10px",wordBreak:"break-word",overflowWrap:"break-word"}}>{s.before}</p>
                <div style={{fontSize:".76rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase"}}>Despues</div>
                <p style={{fontSize:".84rem",color:C.sub,lineHeight:1.6,marginTop:4,wordBreak:"break-word",overflowWrap:"break-word"}}>{s.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ProcessSection({ onClose }) {
  useReveal();

  const steps = [
    {
      n: "1",
      title: "Explora el catálogo de los peludos disponibles en adopción",
      highlight: "Filtra según lo que buscas...",
      desc: "O conoce a todos y déjate enamorar 🐶🐱 💓.",
    },
    {
      n: "2",
      title: "Manda solicitud de adopción a los peludos que te interesen",
      highlight: "Tu solicitud será enviada a quien esté cuidando al perrito o gatito que te robó el corazón 🐾.",
      desc: "Cada rescatista o refugio tiene sus propios tiempos de respuesta, pero harán lo posible por contactarte lo más pronto posible.",
    },
    {
      n: "3",
      title: "Recibe a tu mascota",
      highlight: "Una vez aprobada tu solicitud, el refugio o rescatista se pondrá en contacto contigo para continuar el proceso.",
      desc: "Los requisitos pueden variar (fotos del hogar, documentos, entrega, etc.), y se definirán directamente contigo. La aprobación depende de cada refugio o rescatista.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="process-section"
      style={{
        ...sectionTexture(C.beige),
        padding: "84px 5%",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {/* Encabezado */}
        <div
          className="reveal"
          style={{
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", width: "100%" }}>
            <div
              style={{
                fontSize: ".8rem",
                fontWeight: 800,
                color: C.cafeLt,
                textTransform: "uppercase",
                letterSpacing: "2px",
                margin: "0 auto 10px",
              }}
            >
              Proceso de adopción
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="paw-btn"
                style={{
                  position: "absolute",
                  right: 0,
                  top: -6,
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: `1.5px solid ${C.beigedk}`,
                  background: C.white,
                  color: C.cafe,
                  fontWeight: 800,
                  fontSize: ".8rem",
                  cursor: "pointer",
                }}
              >
                Cerrar ✕
              </button>
            )}
          </div>

          <h2
            style={{
              margin: 0,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
              color: C.cafe,
              lineHeight: 1.1,
            }}
          >
            Cómo funciona en 3 pasos
          </h2>
        </div>

        {/* Tarjetas - responsive con CSS classes */}
        <div className="process-steps-grid">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`reveal float-card process-step ${i % 3 === 1 ? "alt" : "soft"}`}
              style={{
                ...floatCardAnim(i),
                background: C.cream,
                border: `1.5px solid ${C.beigedk}`,
                borderRadius: 28,
                padding: "clamp(20px, 4vw, 28px)",
                boxShadow: `0 12px 30px ${C.shadow}`,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Número */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#2559C3",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  marginBottom: 22,
                  flexShrink: 0,
                }}
              >
                {step.n}
              </div>

              {/* Título */}
              <h3
                style={{
                  margin: "0 0 18px",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                  lineHeight: 1.25,
                  color: C.cafe,
                }}
              >
                {step.title}
              </h3>

              {/* Destacado */}
              <div
                style={{
                  background: "#2559C3",
                  color: "#fff",
                  padding: "clamp(14px, 3vw, 18px) clamp(16px, 4vw, 20px)",
                  borderRadius: 16,
                  fontWeight: 700,
                  fontSize: "clamp(0.9rem, 2.5vw, 1.08rem)",
                  lineHeight: 1.45,
                  marginBottom: 22,
                }}
              >
                {step.highlight}
              </div>

              {/* Descripción */}
              <p
                style={{
                  margin: 0,
                  color: C.sub,
                  fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                  lineHeight: 1.7,
                  flex: 1,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <style>{`
          /* Móvil: menos de 700px - una columna */
          @media (max-width: 699px) {
            .process-steps-grid {
              display: flex !important;
              flex-direction: column !important;
              gap: 20px !important;
            }
            .process-step {
              width: 100% !important;
              min-height: auto !important;
            }
          }
          
          /* Tablet: 700px a 1000px - dos columnas */
          @media (min-width: 700px) and (max-width: 999px) {
            .process-steps-grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 20px !important;
            }
            .process-step:last-child {
              grid-column: span 2 !important;
              max-width: 50% !important;
              margin: 0 auto !important;
            }
          }
          
          /* Desktop: más de 1000px - tres columnas */
          @media (min-width: 1000px) {
            .process-steps-grid {
              display: grid !important;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 24px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

const recommendedPlaces = {
  veterinaria: [
    { name: "Clínica Veterinaria San Francisco", phone: "+525512345678", zone: "Querétaro & CDMX", type: "Salud" },
    { name: "Hospital Veterinario Animalia", phone: "+525598765432", zone: "Querétaro & CDMX", type: "Salud" },
    { name: "Doctor Huellas Vet", phone: "+524427654321", zone: "Querétaro, Qro", type: "Salud" }
  ],
  grooming: [
    { name: "Grooming Club Móvil", phone: "+525523456789", zone: "CDMX", type: "Higiene" },
    { name: "Estética Canina Pelu2", phone: "+524423456789", zone: "Querétaro, Qro", type: "Higiene" },
    { name: "Estética Veterinaria Burbujas", phone: "+525534567890", zone: "CDMX", type: "Higiene" }
  ],
  entrenamiento: [
    { name: "Adiestramiento Canino K9", phone: "+524421234567", zone: "Querétaro, Qro", type: "Conducta" },
    { name: "Entrenamiento Positivo Pro", phone: "+525545678901", zone: "CDMX", type: "Conducta" },
    { name: "Colegio Canino Educando", phone: "+525556789012", zone: "CDMX & Qro", type: "Conducta" }
  ]
};

function RecommendedPlacesModal({ type, onClose }) {
  const titles = {
    veterinaria: "Clínicas Veterinarias Recomendadas 🩺",
    grooming: "Salones de Baño y Grooming Recomendados 🧼",
    entrenamiento: "Entrenadores Caninos Recomendados 🦮"
  };
  const list = recommendedPlaces[type] || [];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(18,18,18,0.72)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      padding: 16
    }}>
      <div style={{
        background: C.cream,
        border: `1.5px solid ${C.beigedk}`,
        borderRadius: 24,
        width: "100%",
        maxWidth: 500,
        boxShadow: `0 24px 64px rgba(0,0,0,0.36)`,
        padding: 24,
        position: "relative",
        animation: "modalZoom .3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: 18,
          right: 18,
          background: C.white,
          border: `1.5px solid ${C.beigedk}`,
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: `0 2px 6px rgba(0,0,0,0.1)`
        }}>✕</button>
        
        <h3 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: "1.4rem",
          color: C.cafe,
          margin: "0 0 18px",
          paddingRight: 24
        }}>{titles[type]}</h3>

        <p style={{ fontSize: ".88rem", color: C.sub, marginBottom: 18, lineHeight: 1.6 }}>
          Lugares y profesionales de confianza que te sugerimos para el cuidado constante de tu peludito:
        </p>

        <div style={{ display: "grid", gap: 12, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
          {list.map((item, i) => (
            <div key={i} style={{
              background: C.white,
              border: `1px solid ${C.beigedk}`,
              borderRadius: 14,
              padding: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 800, color: C.ink, fontSize: ".92rem" }}>{item.name}</div>
                <div style={{ fontSize: ".76rem", color: C.muted, marginTop: 4 }}>📍 {item.zone}</div>
              </div>
              <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="paw-btn" style={{
                background: C.cafe,
                color: C.white,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: ".78rem",
                fontWeight: 800,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}>
                💬 WhatsApp
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesSection({ onSelectService }) {
  useReveal();
  const services = [
    { type: "veterinaria", icon: E.vet, title: "Consulta veterinaria", desc: "Revisión general, esquema de vacunas y plan preventivo.", time: "30-45 min", tag: "Salud" },
    { type: "grooming", icon: E.bath, title: "Baño y grooming", desc: "Baño, corte de uñas y limpieza para piel y pelaje saludable.", time: "40-70 min", tag: "Higiene" },
    { type: "entrenamiento", icon: E.train, title: "Entrenamiento básico", desc: "Rutina de obediencia, socialización y hábitos en casa.", time: "4 sesiones", tag: "Conducta" },
  ];
  return (
    <section id="servicios" className="services-section" style={{ ...sectionTexture(C.graySoft), padding: "86px 5%", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="reveal services-head" style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: ".74rem", fontWeight: 800, color: C.cafeLt, textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 8 }}>Servicios petcare</div>
            <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 3vw, 2.8rem)", color: C.cafe, lineHeight: 1.12 }}>Todo para su bienestar</h2>
          </div>
          <p style={{ maxWidth: 370, fontSize: ".9rem", lineHeight: 1.7, color: C.sub, textAlign: "left" }}>Recomendamos servicios locales para que el cuidado de tu peludito sea siempre excelente.</p>
        </div>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {services.map((s, i) => (
            <div key={s.title} className={`reveal float-card ${i % 3 === 1 ? "alt" : "soft"}`} style={{ ...floatCardAnim(i), background: C.cream, border: `1.5px solid ${C.beigedk}`, borderRadius: 20, padding: "20px 18px", boxShadow: `0 8px 20px ${C.shadow}`, transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 36px ${C.shadowMd}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 8px 20px ${C.shadow}`; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: "2rem" }}>{s.icon}</div>
                <span className="hc-chip" style={{ fontSize: ".68rem", fontWeight: 800, color: C.cafe, border: `1px solid ${C.beigedk}`, padding: "4px 9px", borderRadius: 999, background: C.white }}>{s.tag}</span>
              </div>
              <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: C.ink, lineHeight: 1.2, textAlign: "left" }}>{s.title}</div>
              <p style={{ marginTop: 8, fontSize: ".85rem", lineHeight: 1.7, color: C.sub, minHeight: 56, textAlign: "left" }}>{s.desc}</p>
              <div style={{ fontSize: ".76rem", fontWeight: 800, color: C.muted, marginBottom: 18, textAlign: "left" }}>Duración estimada: {s.time}</div>
              <button className="paw-btn" onClick={() => onSelectService(s.type)} style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "none", background: C.cafe, color: C.white, fontWeight: 800, cursor: "pointer" }}>
                Ver lugares recomendados
              </button>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

function ProductsSection(){
  useReveal();
  const [tab,setTab]=useState("perro");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articleContents = {
    "Alimentación y Digestión": {
      title: "Alimentación y Digestión Saludable 🥣",
      intro: "Una nutrición adecuada es el pilar fundamental para la salud y longevidad de tu perro.",
      body: "Elegir las croquetas o el alimento correcto depende de su edad, tamaño y nivel de actividad física. Es importante buscar fórmulas que tengan proteína de alta calidad como primer ingrediente y evitar rellenos innecesarios. Mantener un horario de comidas estable ayuda a regular su sistema digestivo y previene problemas estomacales comunes."
    },
    "Paseos y Socialización": {
      title: "Paseos y Socialización Positiva 🦮",
      intro: "El paseo diario es más que solo ejercicio físico; es estimulación mental esencial.",
      body: "Llevar siempre correa y una placa con tus datos actualizados es indispensable para su seguridad. Permite que tu perro olfatee su entorno, ya que esto le ayuda a relajarse. La socialización con otros perros y personas debe ser progresiva y siempre recompensada con premios para crear asociaciones positivas."
    },
    "Descanso y Articulaciones": {
      title: "Descanso y Cuidado Articular 🛌",
      intro: "Un descanso de calidad es vital para la recuperación muscular y el cuidado de las articulaciones.",
      body: "Los perros duermen entre 12 y 14 horas al día. Proporcionarles una cama adecuada, preferentemente ortopédica o con soporte de espuma viscoelástica, previene problemas en articulaciones como codos y cadera, especialmente en razas grandes o perros de edad avanzada."
    },
    "Higiene y Arena Sanitaria": {
      title: "Higiene, Areneros y Arena Sanitaria 🐈",
      intro: "Los gatos son extremadamente limpios y su arenero es un santuario de privacidad.",
      body: "El arenero debe estar ubicado en un lugar tranquilo y ventilado, lejos de su comida y agua. Es recomendable limpiar los desechos diariamente y cambiar la arena por completo una vez a la semana. Si tienes más de un gato, la regla general es tener un arenero por gato más uno adicional."
    },
    "Rascadores y Enriquecimiento": {
      title: "Rascadores y Enriquecimiento Ambiental 🌳",
      intro: "El rascado es una conducta felina natural y necesaria para limar sus uñas y marcar territorio.",
      body: "Proporcionar rascadores verticales y horizontales estables evitará que utilicen los sillones o cortinas. El enriquecimiento ambiental con repisas altas, juguetes interactivos y túneles ayuda a prevenir el aburrimiento, la obesidad y comportamientos destructivos en gatos de interior."
    },
    "Snacks y Premios Saludables": {
      title: "Snacks, Premios y Nutrición Felina 🍗",
      intro: "Los premios son excelentes para reforzar conductas positivas y fortalecer el vínculo con tu gato.",
      body: "Opta por snacks saludables bajos en calorías y ricos en taurina (un aminoácido esencial para el corazón y la vista de los felinos). Evita darles comida casera condimentada y asegúrate de que siempre tengan acceso a agua fresca corriente, idealmente en una fuente para gatos."
    }
  };

  const topics=[
    {type:"perro",name:"Alimentación y Digestión",icon:E.food,desc:"Aprende a elegir la mejor fórmula balanceada para mantener su energía y digestión saludable."},
    {type:"perro",name:"Paseos y Socialización",icon:E.toy,desc:"Consejos para un paseo seguro: la importancia del uso de correa, placas de identificación y socialización."},
    {type:"perro",name:"Descanso y Articulaciones",icon:E.bed,desc:"Cómo influye un descanso adecuado y un soporte ortopédico en la salud de las articulaciones de tu compañero."},
    {type:"gato",name:"Higiene y Arena Sanitaria",icon:E.check,desc:"Todo sobre el control de olores, tipos de arena y cómo mantener un arenero limpio y libre de estrés."},
    {type:"gato",name:"Rascadores y Enriquecimiento",icon:E.toy,desc:"Estimula el instinto natural de tu felino mediante rascadores y juegos verticales para evitar el aburrimiento."},
    {type:"gato",name:"Snacks y Premios Saludables",icon:E.heart,desc:"Cómo consentir a tu gato de forma segura con premios que aporten taurina y vitaminas esenciales."},
  ];

  const filtered=topics.filter(p=>p.type===tab);

  return(
    <section id="productos" className="products-section" style={{...sectionTexture(C.beige),padding:"86px 5%"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        
        <div className="reveal products-head" style={{ marginBottom: 32, textAlign: "left" }}>
          <div style={{ fontSize: ".8rem", fontWeight: 800, color: C.cafeLt, textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 12 }}>Bienestar y cuidado animal</div>
          
          <div className="products-head-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px 48px", alignItems: "start", marginBottom: 28 }}>
            <p style={{ fontSize: "1.02rem", lineHeight: 1.75, color: C.cafe, margin: 0, fontWeight: 600 }}>
              Adoptar una mascota es el inicio de una gran aventura, y queremos acompañarte en cada paso del camino. 
              En esta sección encontrarás información, recomendaciones y recursos compartidos por profesionales 
              que te ayudarán a comprender mejor las necesidades de tu compañero peludo en cada etapa de su vida.
            </p>
            <p style={{ fontSize: ".92rem", lineHeight: 1.7, color: C.sub, margin: 0 }}>
              Aquí podrás aprender sobre alimentación, salud, comportamiento, educación, bienestar, 
              enriquecimiento, productos recomendados y muchos otros temas que te ayudarán a tomar mejores 
              decisiones como tutor responsable y a brindarle una vida plena, segura y feliz a tu mascota.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1.5px solid ${C.beigedk}`, paddingTop: 20, flexWrap: "wrap", gap: 14 }}>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: C.cafe, margin: 0 }}>Recursos y Guías Temáticas</h3>
            <div className="products-tabs" style={{ display: "flex", gap: 8 }}>
              {[["perro", "Para Perros"], ["gato", "Para Gatos"]].map(([v, l]) => (
                <button key={v} onClick={()=>setTab(v)} className="paw-btn" style={{ padding: "8px 18px", borderRadius: 999, border: `1.5px solid ${tab === v ? C.cafe : C.beigedk}`, background: tab === v ? C.cafe : C.cream, color: tab === v ? C.white : C.sub, fontWeight: 800, fontSize: ".82rem", cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
          {filtered.map((p,i)=>(
            <div key={p.name} className={`float-card ${i%3===1?"alt":"soft"}`} style={{...floatCardAnim(i),background:C.cream,border:`1.5px solid ${C.beigedk}`,borderRadius:18,padding:"16px 14px",boxShadow:`0 8px 18px ${C.shadow}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:"1.8rem"}}>{p.icon}</span>
              </div>
              <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.05rem",color:C.ink,lineHeight:1.2,textAlign:"left"}}>{p.name}</div>
              <p style={{marginTop:7,fontSize:".83rem",lineHeight:1.65,color:C.sub,minHeight:54,textAlign:"left"}}>{p.desc}</p>
              <button className="paw-btn" onClick={() => setSelectedArticle(articleContents[p.name])} style={{marginTop:8,width:"100%",padding:"10px 12px",border:"none",borderRadius:11,background:C.cafe,color:C.white,fontWeight:800,cursor:"pointer"}}>
                Leer artículo
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(18,18,18,0.72)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          padding: 16
        }}>
          <div style={{
            background: C.cream,
            border: `1.5px solid ${C.beigedk}`,
            borderRadius: 24,
            width: "100%",
            maxWidth: 550,
            boxShadow: `0 24px 64px rgba(0,0,0,0.36)`,
            padding: 28,
            position: "relative",
            animation: "modalZoom .3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            <button onClick={() => setSelectedArticle(null)} style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: C.white,
              border: `1.5px solid ${C.beigedk}`,
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: `0 2px 6px rgba(0,0,0,0.1)`
            }}>✕</button>
            
            <h3 style={{
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: C.cafe,
              margin: "0 0 14px",
              paddingRight: 24,
              textAlign: "left"
            }}>{selectedArticle.title}</h3>

            <div style={{ background: C.beigelt, borderRadius: 14, padding: "14px 16px", marginBottom: 18, borderLeft: `4px solid ${C.cafeLt}`, textAlign: "left" }}>
              <p style={{ fontSize: ".88rem", fontWeight: 700, color: C.cafe, margin: 0, lineHeight: 1.5 }}>
                {selectedArticle.intro}
              </p>
            </div>

            <p style={{ fontSize: ".9rem", color: C.sub, lineHeight: 1.7, margin: 0, textAlign: "left", whiteSpace: "pre-line" }}>
              {selectedArticle.body}
            </p>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button className="paw-btn" onClick={() => setSelectedArticle(null)} style={{
                background: C.cafe,
                color: C.white,
                padding: "10px 24px",
                borderRadius: 12,
                fontSize: ".88rem",
                fontWeight: 800,
                border: "none",
                cursor: "pointer"
              }}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 800px) {
          .products-head-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

function HelpSection({onLoginClick, onClose}){
  useReveal();
  const items=[
    {icon:E.donate,title:"Donar",desc:"Apoya alimento, vacunas y esterilizacion.",cta:"Donar ahora"},
    {icon:E.volunteer,title:"Voluntariado",desc:"Ayuda en traslados, ferias y difusion.",cta:"Quiero ayudar"},
    {icon:E.homeCare,title:"Hogar temporal",desc:"Recibe por dias a un peludito en transicion.",cta:"Ser hogar temporal"},
  ];
  return(
    <section className="help-section" id="ayudar" style={{...sectionTexture(C.beigelt),padding:"84px 5%"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:24,position:"relative"}}>
          {onClose && (
            <button
              onClick={onClose}
              className="paw-btn"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                padding: "6px 14px",
                borderRadius: 999,
                border: `1.5px solid ${C.beigedk}`,
                background: C.white,
                color: C.cafe,
                fontWeight: 800,
                fontSize: ".8rem",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              Cerrar ✕
            </button>
          )}
          <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.8,marginBottom:8}}>Quiero ayudar</div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.9rem,3vw,2.8rem)",color:C.cafe}}>Tambien puedes cambiar vidas sin adoptar</h2>
        </div>
        <div className="help-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {items.map((it,i)=>(
            <div key={it.title} className={`reveal float-card ${i%3===1?"alt":"soft"}`} style={{...floatCardAnim(i),background:C.cream,border:`1.5px solid ${C.beigedk}`,borderRadius:20,padding:"20px 18px",boxShadow:`0 8px 20px ${C.shadow}`}}>
              <div style={{fontSize:"2rem",marginBottom:8}}>{it.icon}</div>
              <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.2rem",color:C.ink}}>{it.title}</div>
              <p style={{marginTop:8,fontSize:".86rem",lineHeight:1.7,color:C.sub,minHeight:56}}>{it.desc}</p>
              <button className="paw-btn" onClick={onLoginClick} style={{marginTop:10,width:"100%",padding:"11px 14px",borderRadius:12,border:"none",background:i===1?C.ink:C.cafe,color:C.white,fontWeight:800,cursor:"pointer"}}>
                {it.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourcesSection(){
  useReveal();
  const posts=[
    {title:"Checklist para adoptar en departamento",meta:"Guia rapida - 6 min",desc:"Lo basico para preparar espacios, horarios y rutina en depa.",tag:"Guia"},
    {title:"Primeros 30 dias: adaptacion sin estres",meta:"Bienestar - 8 min",desc:"Senales de ansiedad y como ayudar al nuevo integrante.",tag:"Salud"},
    {title:"Plan de visitas al veterinario",meta:"Prevencion - 5 min",desc:"Calendario sugerido para vacunas y desparasitacion.",tag:"Veterinaria"},
  ];
  return(
    <section id="recursos" style={{...sectionTexture(C.beigelt),padding:"86px 5%"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div className="reveal" style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"flex-end",flexWrap:"wrap",marginBottom:20}}>
          <div>
            <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.8,marginBottom:8}}>Guias y recursos</div>
            <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.9rem,3vw,2.8rem)",color:C.cafe}}>Aprende antes de adoptar</h2>
          </div>
          <a href="#faq" style={{textDecoration:"none",fontWeight:800,color:C.cafe,fontSize:".86rem"}}>Ver preguntas frecuentes</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
          {posts.map((p,i)=>(
            <article key={p.title} className={`reveal float-card ${i%3===1?"alt":"soft"}`} style={{...floatCardAnim(i),background:C.cream,border:`1.5px solid ${C.beigedk}`,borderRadius:18,padding:"16px 14px",boxShadow:`0 8px 18px ${C.shadow}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <span className="hc-chip" style={{fontSize:".66rem",fontWeight:800,color:C.cafe,border:`1px solid ${C.beigedk}`,padding:"4px 9px",borderRadius:999,background:C.white}}>{p.tag}</span>
                <span style={{fontSize:".8rem"}}>{E.book}</span>
              </div>
              <h3 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.06rem",lineHeight:1.2,color:C.ink}}>{p.title}</h3>
              <div style={{marginTop:6,fontSize:".74rem",fontWeight:800,color:C.muted}}>{p.meta}</div>
              <p style={{marginTop:8,fontSize:".83rem",lineHeight:1.66,color:C.sub,minHeight:54}}>{p.desc}</p>
              <a href="#faq" style={{display:"inline-flex",marginTop:8,fontSize:".82rem",fontWeight:800,color:C.cafe,textDecoration:"none"}}>Leer guia</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConocenosSection({ onClose }){
  useReveal();
  const cards=[
    {icon:E.paw,title:"Adopcion responsable",desc:"Cada proceso es supervisado. Conectamos rescatistas verificados con adoptantes comprometidos con el bienestar animal."},
    {icon:E.house,title:"Refugios aliados",desc:"Trabajamos con refugios y rescatistas independientes de todo Mexico."},
    {icon:E.heart,title:"Post-adopcion",desc:"No terminamos con la adopcion. Acompanamos al adoptante y al animal en su adaptacion."},
    {icon:E.clipboard,title:"Proceso sencillo",desc:"Registrate, busca, aparta y sigue el proceso desde tu perfil. Simple y transparente."},
  ];
  return(
    <section id="conocenos" style={{...sectionTexture(C.beige),padding:"90px 5%",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-40,right:-40,fontSize:"20rem",opacity:.025,pointerEvents:"none",lineHeight:1}}>{E.paw}</div>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:56,position:"relative"}}>
          {onClose && (
            <button
              onClick={onClose}
              className="paw-btn"
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                padding: "6px 14px",
                borderRadius: 999,
                border: `1.5px solid ${C.beigedk}`,
                background: C.white,
                color: C.cafe,
                fontWeight: 800,
                fontSize: ".8rem",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              Cerrar ✕
            </button>
          )}
          <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.8,marginBottom:10}}>Nuestra mision</div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(1.9rem,3vw,2.8rem)",color:C.cafe,lineHeight:1.1,marginBottom:14}}>Por que DoGood?</h2>
          <p style={{fontSize:".95rem",color:C.sub,maxWidth:480,margin:"0 auto",lineHeight:1.8}}>Creemos que cada animal merece una familia y cada familia merece encontrar a su companero ideal.</p>
        </div>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            {cards.map((c,i)=>(
              <div key={i} className={`reveal float-card ${i%3===1?"alt":"soft"}`} style={{...floatCardAnim(i),background:C.cream,borderRadius:22,padding:"22px 20px",boxShadow:`0 4px 20px ${C.shadow}`,border:`1.5px solid ${C.beigedk}`,transition:"all .3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=`0 16px 36px ${C.shadowMd}`;e.currentTarget.style.borderColor=C.cafeXlt}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 20px ${C.shadow}`;e.currentTarget.style.borderColor=C.beigedk}}>
                <div style={{width:48,height:48,borderRadius:14,background:C.beigedk,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:14}}>{c.icon}</div>
                <h3 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.05rem",color:C.cafe,marginBottom:8,lineHeight:1.2}}>{c.title}</h3>
                <p style={{fontSize:".82rem",color:C.sub,lineHeight:1.65}}>{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="reveal-right about-right" style={{position:"relative",height:400}}>
            <div style={{position:"absolute",inset:0,background:`linear-gradient(145deg,${C.cafe},${C.cafeMd})`,borderRadius:"40% 60% 55% 45% / 50% 45% 55% 50%",boxShadow:`0 20px 56px ${C.shadowMd}`}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
              <div style={{width:160,height:160,borderRadius:"50%",overflow:"hidden",border:"4px solid rgba(255,255,255,.9)",boxShadow:`0 12px 32px rgba(0,0,0,.25)`,animation:"floatSlow 4s ease-in-out infinite"}}>
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80" alt="Perrito" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{width:130,height:130,borderRadius:"50%",overflow:"hidden",border:"4px solid rgba(255,255,255,.9)",boxShadow:`0 10px 28px rgba(0,0,0,.2)`,animation:"floatSlow 4.5s ease-in-out infinite",animationDelay:".7s"}}>
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80" alt="Gatito" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            </div>
            {[{n:"100+",l:"rescatados",pos:{top:16,right:-16}},{n:"100+",l:"adoptados",pos:{bottom:32,left:-20}}].map((s,i)=>(
              <div key={i} style={{position:"absolute",...s.pos,background:C.cream,borderRadius:16,padding:"12px 18px",textAlign:"center",boxShadow:`0 8px 24px ${C.shadowMd}`,border:`1.5px solid ${C.beigedk}`}}>
                <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.7rem",color:C.cafe,lineHeight:1}}>{s.n}</div>
                <div style={{fontSize:".72rem",color:C.muted,fontWeight:700}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection(){
  useReveal();
  const [open,setOpen]=useState(null);
  const bannerRef=useRef();
  const [bannerVisible,setBannerVisible]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setBannerVisible(true);},{threshold:.15});
    if(bannerRef.current)obs.observe(bannerRef.current);
    return()=>obs.disconnect();
  },[]);
  const faqs=[
    {q:"Como funciona el proceso de adopcion?",a:"Registrate en DoGood, explora los animales disponibles, aparta al que te llame y el rescatista coordinara los siguientes pasos contigo."},
    {q:"Es gratuito adoptar a traves de DoGood?",a:"Si, usar DoGood es completamente gratuito para adoptantes. Algunos refugios pueden pedir un donativo simbolico para gastos veterinarios."},
    {q:"Como se que los rescatistas son confiables?",a:"Todos los rescatistas pasan por verificacion. Puedes ver su historial y resenas de otros adoptantes en su perfil."},
    {q:"Puedo adoptar si vivo en departamento?",a:"Si. Al crear tu perfil indicas tu situacion de vivienda y el rescatista te ayuda a encontrar un animal compatible."},
    {q:"Que pasa si la adopcion no funciona?",a:"Lo mas importante es el bienestar del animal. El rescatista puede orientarte. Nunca abandones al animal."},
    {q:"Como registro mi refugio en DoGood?",a:"Registrate con el rol de Rescatista, completa tu perfil y podras subir animales al catalogo de inmediato."},
  ];
  return(
    <section id="faq" style={{...sectionTexture(C.beigelt),padding:"80px 0 90px"}}>
      <div ref={bannerRef} style={{
        background:`linear-gradient(135deg,${C.beige} 0%,${C.beigedk} 40%,${C.cafeXlt}55 100%)`,
        margin:"0 0 60px",padding:"0 5%",position:"relative",overflow:"hidden",height:220,
        display:"flex",alignItems:"center",
        opacity:bannerVisible?1:0,
        transform:bannerVisible?"none":"translateY(40px) scale(.97)",
        transition:"opacity .8s ease, transform .8s ease",
        borderTop:`2px solid ${C.beigedk}`,borderBottom:`2px solid ${C.beigedk}`}}>
        <div style={{position:"absolute",top:-20,right:"35%",width:90,height:55,background:C.cafeXlt,borderRadius:50,opacity:.5}}/>
        <div style={{position:"absolute",bottom:-18,right:"48%",width:65,height:42,background:C.cafeXlt,borderRadius:50,opacity:.4}}/>
        <div style={{position:"absolute",top:12,right:"14%",width:55,height:38,background:C.beigedk,borderRadius:50,opacity:.8}}/>
        <div style={{position:"absolute",top:0,bottom:0,left:"-30%",width:"24%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent)",animation:"shimmerSweep 9s linear infinite",opacity:.35}}/>
        <div style={{maxWidth:400,position:"relative",zIndex:2}}>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(2.2rem,4vw,3rem)",color:C.cafe,lineHeight:1.05,
            opacity:bannerVisible?1:0,transform:bannerVisible?"none":"translateX(-20px)",transition:"opacity .6s .2s ease,transform .6s .2s ease"}}>
            Preguntas<br/>frecuentes
          </h2>
          <p style={{fontSize:".88rem",color:C.sub,marginTop:8,fontWeight:700,
            opacity:bannerVisible?1:0,transform:bannerVisible?"none":"translateX(-20px)",transition:"opacity .6s .4s ease,transform .6s .4s ease"}}>
            Todo lo que necesitas saber
          </p>
        </div>
        <div style={{position:"absolute",right:"2%",bottom:0,display:"flex",alignItems:"flex-end",zIndex:2}}>
          <div className="faq-orbit" style={{position:"relative",width:175,height:160,marginRight:4,opacity:bannerVisible?1:0,transition:"opacity .7s .3s ease",animation:"orbitSlow 18s linear infinite"}}>
            <div style={{position:"absolute",inset:8,borderRadius:"50%",border:`2.5px dashed ${C.cafe}55`}}/>
            {[E.dog,E.cat,E.poodle,E.catFace,E.guideDog,E.smileCat].map((e,i)=>(
              <div key={i} style={{position:"absolute",
                top:["0%","15%","52%","60%","-5%","35%"][i],
                left:["35%","68%","70%","8%","12%","88%"][i],
                fontSize:["2.2rem","1.7rem","1.8rem","1.5rem","1.4rem","1.3rem"][i],
                animation:`float ${2.8+i*.35}s ease-in-out infinite`,animationDelay:`${i*.25}s`,
                opacity:bannerVisible?1:0,transition:`opacity .5s ${.3+i*.08}s ease`}}>
                {e}
              </div>
            ))}
          </div>
          <div className="faq-pet-big" style={{fontSize:"7.5rem",lineHeight:1,opacity:bannerVisible?1:0,transition:"opacity .7s .1s ease",animation:"bobSoft 4s ease-in-out infinite"}}>{E.cat}</div>
          <div className="faq-pet-big" style={{fontSize:"6rem",lineHeight:1,marginBottom:8,opacity:bannerVisible?1:0,transition:"opacity .7s .05s ease",animation:"bobSoft 3.6s ease-in-out infinite",animationDelay:".3s"}}>{E.dog}</div>
        </div>
        <div style={{position:"absolute",bottom:10,left:18,display:"flex",alignItems:"center",gap:6,opacity:.4}}>
          <LogoSVG size={20} color={C.cafe}/>
          <span style={{fontFamily:"'Fredoka',sans-serif",fontSize:".75rem",color:C.cafe,fontWeight:700}}>DOGOOD</span>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 5%"}}>
        <div className="faq-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {faqs.map((f,i)=>(
            <div key={i} className="reveal" onClick={()=>setOpen(open===i?null:i)}
              style={{background:open===i?C.cafe:C.cream,borderRadius:20,padding:"22px 24px",cursor:"pointer",
                boxShadow:open===i?`0 16px 48px ${C.shadowMd}`:`0 2px 12px ${C.shadow}`,
                border:`2px solid ${open===i?C.cafe:C.beigedk}`,
                transition:"all .3s ease",transform:open===i?"translateY(-4px)":"none"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{width:38,height:38,borderRadius:12,
                  background:open===i?"rgba(255,255,255,.2)":C.beigedk,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                  fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1rem",
                  color:open===i?C.white:C.cafe,transition:"all .3s"}}>
                  {i+1}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:".9rem",color:open===i?C.white:C.ink,lineHeight:1.4,marginBottom:open===i?10:0,transition:"color .3s"}}>
                    {f.q}
                  </div>
                  {open===i&&(
                    <div style={{fontSize:".86rem",color:"rgba(255,255,255,.85)",lineHeight:1.75,animation:"fadeUp .25s ease",paddingTop:2}}>
                      {f.a}
                    </div>
                  )}
                </div>
                <div style={{width:26,height:26,borderRadius:"50%",
                  background:open===i?"rgba(255,255,255,.2)":C.beigedk,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                  transition:"all .3s",transform:open===i?"rotate(45deg)":"none"}}>
                  <span style={{color:open===i?C.white:C.cafe,fontSize:"1rem",fontWeight:300,lineHeight:1}}>+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({onLoginClick}){
  useReveal();
  const stats=[
    {n:"100+",l:"Adoptados",icon:E.paw},
    {n:"100+",l:"Familias felices",icon:E.heart},
    {n:"10+",l:"Refugios y rescatistas independientes aliados",icon:E.house},
    {n:"$0",l:"Costo para adoptantes",icon:E.check},
  ];
  return(
    <section style={{padding:"90px 5%",background:`linear-gradient(160deg,${C.ink} 0%,${C.cafe} 60%,${C.cafeMd} 100%)`,backgroundSize:"180% 180%",animation:"gradientShift 14s ease infinite",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-100,right:-100,width:400,height:400,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
      <div style={{position:"absolute",bottom:-80,left:-80,width:320,height:320,borderRadius:"50%",background:"rgba(255,255,255,.03)"}}/>
      <div style={{position:"absolute",top:0,bottom:0,left:"-35%",width:"26%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,.09), transparent)",animation:"shimmerSweep 10s linear infinite"}}/>
      <div style={{position:"absolute",top:"20%",right:"8%",fontSize:"8rem",opacity:.06,lineHeight:1,animation:"float 5s ease-in-out infinite"}}>{E.dog}</div>
      <div style={{position:"absolute",bottom:"15%",left:"5%",fontSize:"6rem",opacity:.05,lineHeight:1,animation:"float 4s ease-in-out infinite",animationDelay:"1s"}}>{E.cat}</div>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div className="reveal" style={{textAlign:"center",marginBottom:64}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:50,padding:"6px 18px",marginBottom:20}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:C.cafeXlt,display:"block",animation:"pulseDot 1.8s infinite"}}/>
            <span style={{fontSize:".76rem",fontWeight:800,color:C.cafeXlt,textTransform:"uppercase",letterSpacing:1.2}}>Unete hoy, es gratis</span>
          </div>
          <h2 style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"clamp(2.2rem,4vw,3.5rem)",color:C.white,lineHeight:1.1,marginBottom:16,animation:"bobSoft 5.2s ease-in-out infinite"}}>
            Un animal te esta<br/><span style={{color:C.cafeXlt}}>esperando ahora</span>
          </h2>
          <p style={{fontSize:"1rem",color:"rgba(255,255,255,.65)",lineHeight:1.8,maxWidth:500,margin:"0 auto 36px"}}>
            Adopta de forma responsable y dale un hogar a quien mas lo necesita. Cada adopcion cambia dos vidas.
          </p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={onLoginClick} className="paw-btn" style={{padding:"15px 40px",border:"none",borderRadius:50,background:C.white,color:C.cafe,fontWeight:800,fontSize:"1rem",cursor:"pointer",transition:"all .25s",boxShadow:"0 8px 32px rgba(0,0,0,.2)",animation:"bobSoft 3.8s ease-in-out infinite"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,.3)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,.2)"}}>
              Quiero adoptar
            </button>
            <button onClick={onLoginClick} className="paw-btn" style={{padding:"15px 36px",border:"2px solid rgba(255,255,255,.35)",borderRadius:50,background:"transparent",color:C.white,fontWeight:700,fontSize:"1rem",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.borderColor="rgba(255,255,255,.7)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,.35)"}}>
              Quiero ser aliado
            </button>
          </div>
        </div>
        <div className="cta-stats" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {stats.map((s,i)=>(
            <div key={i} className="reveal" style={{background:"rgba(255,255,255,.07)",backdropFilter:"blur(10px)",borderRadius:20,padding:"24px 20px",textAlign:"center",border:"1px solid rgba(255,255,255,.1)",transition:"all .3s",animation:`bobSoft ${4.2+i*.25}s ease-in-out infinite`,animationDelay:`${i*.15}s`}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.14)";e.currentTarget.style.transform="translateY(-6px)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.07)";e.currentTarget.style.transform="none"}}>
              <div style={{fontSize:"2.5rem",marginBottom:10}}>{s.icon}</div>
              <div style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"2.4rem",color:C.cafeXlt,lineHeight:1,marginBottom:6}}>{s.n}</div>
              <div style={{fontSize:".8rem",color:"rgba(255,255,255,.55)",fontWeight:600,lineHeight:1.4}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return(
    <footer style={{background:C.ink,padding:"48px 5% 28px"}}>
      <div style={{maxWidth:1240,margin:"0 auto"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:40,marginBottom:40,paddingBottom:32,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <LogoSVG size={32} color={C.cafeXlt}/>
              <span style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.4rem",color:C.cafeXlt}}>DOGOOD</span>
            </div>
            <p style={{fontSize:".85rem",color:"rgba(255,255,255,.4)",lineHeight:1.75,maxWidth:280}}>
              Plataforma de adopcion responsable que conecta animales rescatados con familias amorosas en Mexico.
            </p>
            <div style={{display:"flex",gap:10,marginTop:18}}>
              {[["Instagram","https://instagram.com"],["Facebook","https://facebook.com"],["TikTok","https://tiktok.com"]].map(([label,href],i)=>(
                <a key={i} href={href} target="_blank" rel="noreferrer" style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:800,cursor:"pointer",transition:"background .2s",color:"rgba(255,255,255,.8)",textDecoration:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>
                  {label.slice(0,2)}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:".72rem",fontWeight:800,color:C.cafeXlt,textTransform:"uppercase",letterSpacing:1.5,marginBottom:16}}>Navegacion</div>
            {[["Conocenos","#conocenos"],["Video","#video-preview"],["Adoptar","#adoptar"],["Guias","#recursos"],["FAQ","#faq"]].map(([l,h])=>(
              <a key={l} href={h} style={{display:"block",fontSize:".85rem",color:"rgba(255,255,255,.45)",marginBottom:10,cursor:"pointer",transition:"color .2s",textDecoration:"none"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.cafeXlt}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.45)"}>
                {l}
              </a>
            ))}
          </div>
          <div>
            <div style={{fontSize:".72rem",fontWeight:800,color:C.cafeXlt,textTransform:"uppercase",letterSpacing:1.5,marginBottom:16}}>Contacto</div>
            {[
              [E.phone,"WhatsApp: +52 55 1234 5678"],
              [E.email,"hola@dogood.mx"],
              [E.mapPin,"Av. Insurgentes Sur, CDMX"],
              [E.clock,"Lun a Sab 9:00 - 19:00"],
            ].map(([ic,t])=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:8,fontSize:".84rem",color:"rgba(255,255,255,.4)",marginBottom:10}}>
                <span>{ic}</span><span>{t}</span>
              </div>
            ))}
            <a href="https://wa.me/525512345678" target="_blank" rel="noreferrer" style={{display:"inline-flex",marginTop:8,padding:"8px 14px",borderRadius:999,border:"1px solid rgba(255,255,255,.2)",color:C.white,textDecoration:"none",fontSize:".78rem",fontWeight:800,background:"rgba(255,255,255,.07)"}}>
              Escribir por WhatsApp
            </a>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <span style={{fontSize:".78rem",color:"rgba(255,255,255,.25)"}}>2026 DoGood - Todos los derechos reservados</span>
          <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
            <a href="#faq" style={{fontSize:".78rem",color:"rgba(255,255,255,.35)",textDecoration:"none"}}>Ayuda</a>
            <a href="#" style={{fontSize:".78rem",color:"rgba(255,255,255,.35)",textDecoration:"none"}}>Aviso de privacidad</a>
            <a href="#" style={{fontSize:".78rem",color:"rgba(255,255,255,.35)",textDecoration:"none"}}>Terminos y condiciones</a>
            <span style={{fontSize:".78rem",color:"rgba(255,255,255,.25)"}}>Hecho con amor para los animales de Mexico</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AccessibilityDock({fontScale,setFontScale,highContrast,setHighContrast,reduceMotion,setReduceMotion}){
  const [open,setOpen]=useState(false);
  const bump=(delta)=>setFontScale(v=>Math.max(92,Math.min(118,v+delta)));
  return(
    <div className="a11y-dock" style={{position:"fixed",right:16,bottom:16,zIndex:180,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
      {open&&(
        <div style={{width:260,background:"rgba(255,253,249,.96)",backdropFilter:"blur(10px)",border:`1.5px solid ${C.beigedk}`,borderRadius:16,padding:"12px 12px 10px",boxShadow:`0 14px 34px ${C.shadowMd}`}}>
          <div style={{fontSize:".74rem",fontWeight:800,color:C.cafeLt,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8}}>Accesibilidad</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:".82rem",color:C.sub,fontWeight:700}}>Tamano de texto</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <button onClick={()=>bump(-2)} style={{width:24,height:24,borderRadius:8,border:`1px solid ${C.beigedk}`,background:C.white,cursor:"pointer",fontWeight:800}}>-</button>
              <span style={{fontSize:".76rem",fontWeight:800,color:C.cafe,minWidth:40,textAlign:"center"}}>{fontScale}%</span>
              <button onClick={()=>bump(2)} style={{width:24,height:24,borderRadius:8,border:`1px solid ${C.beigedk}`,background:C.white,cursor:"pointer",fontWeight:800}}>+</button>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:".82rem",color:C.sub,fontWeight:700}}>
              Contraste alto
              <input type="checkbox" checked={highContrast} onChange={e=>setHighContrast(e.target.checked)} style={{accentColor:C.cafe}}/>
            </label>
            <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:".82rem",color:C.sub,fontWeight:700}}>
              Reducir movimiento
              <input type="checkbox" checked={reduceMotion} onChange={e=>setReduceMotion(e.target.checked)} style={{accentColor:C.cafe}}/>
            </label>
          </div>
        </div>
      )}
      <button className="paw-btn" onClick={()=>setOpen(v=>!v)} style={{padding:"10px 14px",borderRadius:999,border:`1.5px solid ${C.beigedk}`,background:C.cafe,color:C.white,fontWeight:800,fontSize:".82rem",cursor:"pointer",boxShadow:`0 10px 24px ${C.shadowMd}`}}>
        {open?"Cerrar ajustes":"A11y"}
      </button>
    </div>
  );
}

function LandingToast({msg,type="info"}){
  if(!msg)return null;
  const bg=type==="success"?C.cafe:type==="error"?"#B91C1C":"#2C1A0E";
  return(
    <div className="landing-toast" style={{position:"fixed",right:18,bottom:18,zIndex:360,background:bg,color:C.white,padding:"11px 16px",borderRadius:12,fontSize:".82rem",fontWeight:800,boxShadow:`0 12px 28px ${C.shadowMd}`,animation:"fadeUp .25s ease"}}>
      {msg}
    </div>
  );
}

function LoginModal({onClose,onLogin,onNotify}){
  const [tab,setTab]=useState("login");
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [nombre,setNombre]=useState(""); const [regEmail,setRegEmail]=useState("");
  const [regPass,setRegPass]=useState(""); const [rol,setRol]=useState("usuario");
  const [tel,setTel]=useState(""); const [abierto,setAbierto]=useState(false);
  const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const doLogin=async()=>{
    setLoading(true);setErr("");
    try{const r=await fetch(apiUrl("auth.php?action=login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})});const d=await r.json();if(d.ok){onNotify?.("Inicio de sesion exitoso","success");onLogin(d.user);}else {const m=d.error||"Credenciales incorrectas";setErr(m);onNotify?.(m,"error");}}
    catch{const m="No se puede conectar. Verifica que XAMPP este corriendo.";setErr(m);onNotify?.(m,"error");}
    setLoading(false);
  };
  const quickLogin=async type=>{
    const m={admin:{e:"admin@dogood.mx",p:"admin123"},rescatista:{e:"refugio@dogood.mx",p:"refugio123"},usuario:{e:"carlos@gmail.com",p:"carlos123"}}[type];
    setLoading(true);setErr("");
    try{const r=await fetch(apiUrl("auth.php?action=login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:m.e,password:m.p})});const d=await r.json();if(d.ok){onNotify?.(`Bienvenido ${d.user?.nombre?.split(" ")[0]||""}`,"success");onLogin(d.user);}else {setErr(d.error);onNotify?.(d.error,"error");}}
    catch{const m="No se puede conectar al servidor.";setErr(m);onNotify?.(m,"error");}
    setLoading(false);
  };
  const doRegister=async()=>{
    if(!nombre||!regEmail||!regPass){const m="Completa todos los campos";setErr(m);onNotify?.(m,"error");return;}
    setLoading(true);setErr("");
    try{const r=await fetch(apiUrl("auth.php?action=register"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre,email:regEmail,password:regPass,rol,telefono:tel,abierto_a_opciones:rol==="usuario"?abierto:false})});const d=await r.json();if(d.ok){onNotify?.("Cuenta creada correctamente","success");onLogin(d.user);}else {const m=d.error||"Error al registrar";setErr(m);onNotify?.(m,"error");}}
    catch{const m="No se puede conectar al servidor.";setErr(m);onNotify?.(m,"error");}
    setLoading(false);
  };
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(44,26,14,.65)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(10px)"}}>
      <div style={{background:C.cream,borderRadius:28,width:"100%",maxWidth:480,boxShadow:"0 32px 80px rgba(0,0,0,.3)",overflow:"hidden",animation:"fadeUp .3s ease"}}>
        <div style={{background:`linear-gradient(135deg,${C.cafe},${C.cafeMd})`,padding:"26px 28px 22px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-24,bottom:-24,fontSize:"9rem",opacity:.08,lineHeight:1}}>{E.paw}</div>
          <button onClick={onClose} style={{position:"absolute",top:12,right:12,width:30,height:30,background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",color:C.white,cursor:"pointer",fontSize:".9rem",display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <LogoSVG size={34} color={C.white}/>
            <span style={{fontFamily:"'Fredoka',sans-serif",fontWeight:700,fontSize:"1.6rem",color:C.white}}>DOGOOD</span>
          </div>
          <div style={{fontSize:".84rem",color:"rgba(255,255,255,.6)",marginTop:2}}>Adopcion responsable para todos</div>
        </div>
        <div style={{padding:"22px 28px 28px"}}>
        
          {err&&<div style={{background:"#FEE2E2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 14px",fontSize:".84rem",color:"#C0392B",marginBottom:14,fontWeight:700}}>{err}</div>}
          {tab==="login"?(
            <>
              {[["Correo","email",email,setEmail,"tu@correo.com"],["Contrasena","password",pass,setPass,"........"]].map(([l,t,v,fn,ph])=>(
                <div key={l} style={{marginBottom:14}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:800,color:C.sub,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</label>
                  <input type={t} value={v} onChange={e=>fn(e.target.value)} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&doLogin()}
                    style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${C.beigedk}`,borderRadius:12,fontSize:".9rem",color:C.ink,outline:"none",background:C.white}}
                    onFocus={e=>e.target.style.borderColor=C.cafe} onBlur={e=>e.target.style.borderColor=C.beigedk}/>
                </div>
              ))}
             
              <div style={{marginTop:16,background:C.beige,borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:".68rem",fontWeight:800,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Cuentas de prueba</div>
                {[["admin","Admin - admin@dogood.mx"],["rescatista","Rescatista - refugio@dogood.mx"],["usuario","Adoptante - carlos@gmail.com"]].map(([t,l])=>(
                  <button key={t} onClick={()=>quickLogin(t)} style={{display:"flex",width:"100%",padding:"8px 10px",marginBottom:5,background:C.white,border:`1px solid ${C.beigedk}`,borderRadius:9,fontSize:".79rem",cursor:"pointer",color:C.ink,fontWeight:600,transition:"border-color .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.cafe}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.beigedk}>{l}</button>
                ))}
              </div>
            </>
          ):(
            <>
              {[["Nombre completo","text",nombre,setNombre,"Tu nombre"],["Correo","email",regEmail,setRegEmail,"tu@correo.com"],["Telefono","tel",tel,setTel,"55 1234 5678"],["Contrasena","password",regPass,setRegPass,"........"]].map(([l,t,v,fn,ph])=>(
                <div key={l} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:".76rem",fontWeight:800,color:C.sub,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>{l}</label>
                  <input type={t} value={v} onChange={e=>fn(e.target.value)} placeholder={ph}
                    style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${C.beigedk}`,borderRadius:12,fontSize:".9rem",color:C.ink,outline:"none",background:C.white}}
                    onFocus={e=>e.target.style.borderColor=C.cafe} onBlur={e=>e.target.style.borderColor=C.beigedk}/>
                </div>
              ))}
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:".76rem",fontWeight:800,color:C.sub,textTransform:"uppercase",letterSpacing:.6,marginBottom:6}}>Tipo de cuenta</label>
                <select value={rol} onChange={e=>setRol(e.target.value)} style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${C.beigedk}`,borderRadius:12,fontSize:".9rem",color:C.ink,outline:"none",background:C.white}}>
                  <option value="usuario">Soy adoptante</option>
                  <option value="rescatista">Soy rescatista</option>
                </select>
              </div>
              {rol==="usuario"&&(
                <label style={{display:"flex",gap:10,marginBottom:14,cursor:"pointer",padding:"10px 12px",background:C.beige,borderRadius:10,border:`1px solid ${C.beigedk}`}}>
                  <input type="checkbox" checked={abierto} onChange={e=>setAbierto(e.target.checked)} style={{marginTop:2,accentColor:C.cafe,width:15,height:15,flexShrink:0}}/>
                  <span style={{fontSize:".83rem",color:C.sub,lineHeight:1.5}}>Estoy abierto a adoptar mas de un animal</span>
                </label>
              )}
              <button onClick={doRegister} disabled={loading} style={{width:"100%",padding:"13px",border:"none",borderRadius:12,background:loading?C.muted:C.cafe,color:C.white,fontWeight:800,fontSize:".95rem",cursor:loading?"default":"pointer"}}>
                {loading?"Creando cuenta...":"Crear cuenta"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({onLogin}){
  const [splashDone,setSplashDone]=useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const [fontScale,setFontScale]=useState(100);
  const [highContrast,setHighContrast]=useState(false);
  const [reduceMotion,setReduceMotion]=useState(false);
  const [toast,setToast]=useState(null);
  const [selectedAnimal,setSelectedAnimal]=useState(null);
  const [showProcess, setShowProcess] = useState(false);
  const [showConocenos, setShowConocenos] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const demoTimers=useRef([]);
  useReveal();

  const toggleProcessSection = () => {
    if (showProcess) {
      setShowProcess(false);
    } else {
      setShowProcess(true);
      setTimeout(() => {
        document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const toggleConocenosSection = () => {
    if (showConocenos) {
      setShowConocenos(false);
    } else {
      setShowConocenos(true);
      setTimeout(() => {
        document.getElementById("conocenos")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const toggleHelpSection = () => {
    if (showHelp) {
      setShowHelp(false);
    } else {
      setShowHelp(true);
      setTimeout(() => {
        document.getElementById("ayudar")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const openAnimalProfile=(animal)=>{
    setSelectedAnimal(animal);
    const slug=String(animal?.nombre||animal?.name||"peludito").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    window.history.pushState({dogoodAnimalProfile:true},"",`#perfil-${slug||"adopcion"}`);
    setTimeout(()=>window.scrollTo({top:0,behavior:"smooth"}),20);
  };

  const closeAnimalProfile=()=>{
    setSelectedAnimal(null);
    window.history.pushState(null,"","#adoptar");
    setTimeout(()=>document.getElementById("adoptar")?.scrollIntoView({behavior:"smooth",block:"start"}),20);
  };

  const notify=(msg,type="info")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),2600);
  };

  const runGuidedDemo=()=>{
      const steps=[
      ["como-funciona","Proceso de adopcion"],
      ["adoptar","Collage de peluditos"],
      ["servicios","Servicios recomendados"],
      ["faq","Preguntas frecuentes"],
    ];
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current=[];
    notify("Iniciando demo guiada (aprox. 60s)","success");
    steps.forEach(([id,label],i)=>{
      const t=setTimeout(()=>{
        if (id === "como-funciona") {
          setShowProcess(true);
        }
        setTimeout(() => {
          const el=document.getElementById(id);
          if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
        }, 120);
        notify(`Paso ${i+1}: ${label}`,"info");
      },i*8500);
      demoTimers.current.push(t);
    });
  };

  useEffect(()=>{
    const prev=document.documentElement.style.fontSize;
    document.documentElement.style.fontSize=`${fontScale}%`;
    return()=>{document.documentElement.style.fontSize=prev||"100%";};
  },[fontScale]);

  useEffect(()=>()=>demoTimers.current.forEach(clearTimeout),[]);

  return(
    <>
      <style>{G}</style>
      {!splashDone&&<Splash onDone={()=>setSplashDone(true)}/>}
      {splashDone&&(
        <div className={`landing-shell${highContrast?" hc":""}${reduceMotion?" rm":""}`} style={{position:"relative"}}>
          <div style={{position:"relative",zIndex:1}}>
            <Navbar
              onLoginClick={() => setShowLogin(true)}
              onDemoClick={runGuidedDemo}
              onOpenSection={(id) => {
                if (id === "como-funciona") {
                  setShowProcess(true);
                  setTimeout(() => {
                    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 120);
                } else if (id === "conocenos") {
                  setShowConocenos(true);
                  setTimeout(() => {
                    document.getElementById("conocenos")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 120);
                }
              }}
            />
            <Hero onLoginClick={() => setShowLogin(true)} onDemoClick={toggleProcessSection} onConocenosClick={toggleConocenosSection} onHelpClick={toggleHelpSection} />

            <LiveMetricsSection onLoginClick={()=>setShowLogin(true)} onOpenProfile={openAnimalProfile}/>
            <StoriesSection/>
            <ResourcesSection/>
            {/* MatchQuizSection queda reservado para una etapa posterior del comparador. */}
            {/* <MatchQuizSection onLoginClick={()=>setShowLogin(true)}/> */}
            <Carousel onLoginClick={()=>setShowLogin(true)} onOpenProfile={openAnimalProfile}/>
            {showProcess && (
              <div id="como-funciona" style={{ scrollMarginTop: 110 }}>
                <ProcessSection onClose={() => setShowProcess(false)}/>
              </div>
            )}
            {showConocenos && (
              <div id="conocenos" style={{ scrollMarginTop: 110 }}>
                <ConocenosSection onClose={() => setShowConocenos(false)}/>
              </div>
            )}
            <ServicesSection onSelectService={setSelectedService}/>
            <ProductsSection onLoginClick={()=>setShowLogin(true)}/>
            <FAQSection/>
            {showHelp && (
              <div id="ayudar" style={{ scrollMarginTop: 110 }}>
                <HelpSection onLoginClick={()=>setShowLogin(true)} onClose={() => setShowHelp(false)}/>
              </div>
            )}

            {selectedAnimal&&(
              <AnimalProfilePage
                animal={selectedAnimal}
                waitDays={selectedAnimal.dias_espera || selectedAnimal.dias_en_refugio || 14}
                onClose={closeAnimalProfile}
              />
            )}
            {selectedService && (
              <RecommendedPlacesModal type={selectedService} onClose={() => setSelectedService(null)} />
            )}

            {showLogin&&<LoginModal onClose={()=>setShowLogin(false)} onNotify={notify} onLogin={u=>{setShowLogin(false);onLogin(u);}}/>}
          </div>
          <AccessibilityDock
            fontScale={fontScale}
            setFontScale={setFontScale}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            reduceMotion={reduceMotion}
            setReduceMotion={setReduceMotion}
          />
          <LandingToast msg={toast?.msg} type={toast?.type}/>
        </div>
      )}
    </>
  );
}

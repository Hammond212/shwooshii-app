import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const LANDING_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --white:#FFFFFF;
  --bg:#F7F8FC;
  --ink:#0F0F1A;
  --ink2:#3D3D5C;
  --muted:#8888A8;
  --orange:#FF6B35;
  --orange2:#FF8C5A;
  --orange-bg:#FFF1EC;
  --teal:#00C9A7;
  --teal-bg:#E6FBF7;
  --lavender:#7C6FEA;
  --lavender-bg:#F0EEFF;
  --yellow:#FFD166;
  --yellow-bg:#FFF8E6;
  --pink:#FF5FA2;
  --border:#E2E4EF;
  --radius:16px;
  --radius-sm:10px;
  --shadow:0 4px 24px rgba(15,15,26,0.08);
  --shadow-hover:0 12px 48px rgba(15,15,26,0.16);
}
html{scroll-behavior:smooth}
body{
  background:var(--white);
  color:var(--ink);
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:16px;line-height:1.65;
  overflow-x:hidden;
}
a{text-decoration:none;color:inherit}

/* ─── SCROLL PROGRESS BAR (Periodic Motion) ─── */
#progress-bar{
  position:fixed;top:0;left:0;height:3px;width:0%;z-index:200;
  background:linear-gradient(90deg,var(--orange),var(--pink),var(--lavender),var(--teal));
  transition:width .1s linear;
  border-radius:0 2px 2px 0;
}

/* ─── NAV ─── */
nav{
  position:sticky;top:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 5%;height:68px;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(16px);
  border-bottom:1px solid var(--border);
}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.15rem;color:var(--ink)}
/* Rotational Motion — logo spins on hover */
.logo-mark{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,var(--orange),var(--pink));
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:800;font-size:.9rem;
  box-shadow:0 4px 12px rgba(255,107,53,0.35);
  transition:transform .6s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
}
.logo:hover .logo-mark{transform:rotate(360deg);box-shadow:0 6px 20px rgba(255,107,53,0.5)}
.nav-links{display:flex;align-items:center;gap:2rem}
.nav-links a{color:var(--ink2);font-size:.875rem;font-weight:500;transition:color .2s;position:relative}
.nav-links a::after{display:none}
.nav-links a:hover{color:var(--orange)}
.nav-links a:hover::after{width:100%}
.nav-cta{
  padding:.55rem 1.4rem;
  background:var(--orange);color:#fff;
  border-radius:100px;font-weight:700;font-size:.875rem;
  box-shadow:0 4px 14px rgba(255,107,53,0.3);
  transition:all .25s;
}
.nav-cta:hover{background:var(--orange2);transform:translateY(-2px) scale(1.03);box-shadow:0 8px 24px rgba(255,107,53,0.45)}

/* ─── MATRIX CANVAS ─── */
#matrix-canvas{
  position:absolute;top:0;left:0;width:100%;height:100%;
  pointer-events:none;z-index:0;opacity:1;
}

/* ─── HERO ─── */
.hero{
  padding:5rem 5% 2rem;
  position:relative;overflow:hidden;
  background:var(--white);
}
/* Linear Motion — blobs drift across */
.blob1{
  position:absolute;top:-120px;right:-80px;
  width:600px;height:600px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,107,53,0.13) 0%,transparent 65%);
  pointer-events:none;
  animation:blobDrift1 18s ease-in-out infinite;
}
.blob2{
  position:absolute;bottom:-80px;left:-60px;
  width:420px;height:420px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(0,201,167,0.11) 0%,transparent 65%);
  pointer-events:none;
  animation:blobDrift2 22s ease-in-out infinite 2s;
}
.blob3{
  position:absolute;top:40%;left:40%;
  width:300px;height:300px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(124,111,234,0.08) 0%,transparent 65%);
  pointer-events:none;
  animation:blobDrift3 26s ease-in-out infinite 4s;
}
/* Linear — straight drift paths */
@keyframes blobDrift1{
  0%{transform:translate(0,0)}
  33%{transform:translate(-60px,40px)}
  66%{transform:translate(40px,-30px)}
  100%{transform:translate(0,0)}
}
@keyframes blobDrift2{
  0%{transform:translate(0,0)}
  50%{transform:translate(80px,-60px)}
  100%{transform:translate(0,0)}
}
@keyframes blobDrift3{
  0%{transform:translate(0,0)}
  25%{transform:translate(-50px,30px)}
  75%{transform:translate(50px,-30px)}
  100%{transform:translate(0,0)}
}

.hero-inner{
  max-width:1140px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr;
  gap:4rem;align-items:flex-start;
  position:relative;z-index:1;
}
.hero-tag{
  display:inline-flex;align-items:center;gap:.6rem;
  background:var(--orange-bg);color:var(--orange);
  border-radius:100px;padding:.3rem .9rem .3rem .5rem;
  font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  margin-bottom:1.5rem;border:1px solid rgba(255,107,53,0.2);
}
#heart-canvas{display:block;flex-shrink:0}


@keyframes oscPulse{
  0%,100%{transform:scale(1);opacity:1}
  50%{transform:scale(1.5);opacity:.5}
}
.hero h1{
  font-size:clamp(2.5rem,5vw,4rem);
  font-weight:800;line-height:1.1;letter-spacing:-.02em;
  margin-bottom:1.25rem;color:var(--ink);
  animation:heroFadeUp .6s .1s cubic-bezier(.22,1,.36,1) both;
}
@keyframes heroFadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.highlight{position:relative;display:inline-block;color:var(--orange)}
.highlight::after{display:none}
@keyframes underlinePeriodic{
  0%,100%{transform:scaleX(1);opacity:1}
  50%{transform:scaleX(.85);opacity:.6}
}
/* Typewriter */
.typewriter{color:var(--orange);position:relative}
.typewriter::after{
  content:'|';display:inline-block;color:var(--orange);
  margin-left:2px;
  animation:cursorBlink .65s step-end infinite;
}
@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}
.typewriter.teal{color:var(--teal)}
.typewriter.teal::after{color:var(--teal)}

.hero-sub{
  font-size:1.05rem;color:var(--ink2);
  line-height:1.75;max-width:480px;margin-bottom:2.25rem;
  animation:heroFadeUp .6s .2s cubic-bezier(.22,1,.36,1) both;
}
.hero-actions{
  display:flex;gap:.875rem;align-items:center;flex-wrap:wrap;margin-bottom:2.5rem;
  animation:heroFadeUp .6s .3s cubic-bezier(.22,1,.36,1) both;
}
.btn-orange{
  padding:.8rem 2rem;background:var(--orange);color:#fff;
  border-radius:100px;font-weight:700;font-size:.95rem;
  box-shadow:0 4px 16px rgba(255,107,53,0.35);
  transition:all .25s;display:inline-flex;align-items:center;gap:.5rem;
  position:relative;overflow:hidden;
}
/* Linear shimmer sweep */
.btn-orange::before{
  content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);
  animation:shimmer 3s linear infinite;
}
@keyframes shimmer{0%{left:-100%}100%{left:200%}}
.btn-orange:hover{background:var(--orange2);transform:translateY(-2px) scale(1.03);box-shadow:0 10px 28px rgba(255,107,53,.45)}
.btn-line{
  padding:.8rem 2rem;border:2px solid var(--border);color:var(--ink2);
  border-radius:100px;font-weight:600;font-size:.95rem;
  transition:all .25s;display:inline-flex;align-items:center;gap:.5rem;
}
.btn-line:hover{border-color:var(--ink2);color:var(--ink);transform:translateY(-1px)}

.hero-stats{
  display:flex;gap:2.5rem;flex-wrap:wrap;
  animation:heroFadeUp .6s .4s cubic-bezier(.22,1,.36,1) both;
}
.hstat-num{font-size:1.75rem;font-weight:800;line-height:1}
.hstat-num.o{color:var(--orange)}
.hstat-num.t{color:var(--teal)}
.hstat-num.l{color:var(--lavender)}
.hstat-label{font-size:.75rem;color:var(--muted);font-weight:500;margin-top:.25rem;letter-spacing:.03em}

/* ─── HERO CARDS (Oscillatory) ─── */
.hero-right{position:relative;height:500px;z-index:1}
.hcard{
  position:absolute;background:#fff;
  border-radius:var(--radius);padding:1.25rem 1.5rem;
  box-shadow:var(--shadow);border:1px solid var(--border);
}
/* Oscillatory — smooth sine bob */
.hcard-1{top:0;left:10%;width:280px;animation:bob1 5s ease-in-out infinite,fadeInCard .8s .3s both}
.hcard-2{top:175px;right:0;width:260px;animation:bob2 6.5s ease-in-out infinite .8s,fadeInCard .8s .6s both}
.hcard-3{bottom:10px;left:0;width:248px;animation:bob3 7.5s ease-in-out infinite 1.4s,fadeInCard .8s .9s both}
@keyframes bob1{0%,100%{transform:translateY(0) rotate(-.5deg)}50%{transform:translateY(-14px) rotate(.5deg)}}
@keyframes bob2{0%,100%{transform:translateY(0) rotate(.5deg)}50%{transform:translateY(-10px) rotate(-.5deg)}}
@keyframes bob3{0%,100%{transform:translateY(0) rotate(-.3deg)}50%{transform:translateY(-16px) rotate(.3deg)}}
@keyframes fadeInCard{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.hcard:hover{
  box-shadow:var(--shadow-hover);
  animation-play-state:paused;
  transform:translateY(-6px) scale(1.02) !important;
  transition:transform .3s,box-shadow .3s;
}
.card-user{display:flex;align-items:center;gap:.75rem;margin-bottom:.875rem}
.card-av{
  width:40px;height:40px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:.8rem;color:#fff;flex-shrink:0;
}
.av-o{background:linear-gradient(135deg,var(--orange),var(--pink))}
.av-t{background:linear-gradient(135deg,var(--teal),#00A88E)}
.av-l{background:linear-gradient(135deg,var(--lavender),#5A4FD4)}
.card-name{font-weight:700;font-size:.875rem;color:var(--ink)}
.card-role{font-size:.72rem;color:var(--muted)}
.card-project{
  background:var(--bg);border-radius:var(--radius-sm);
  padding:.625rem .875rem;margin-bottom:.625rem;
  border-left:3px solid var(--orange);
}
.card-project.teal{border-left-color:var(--teal)}
.card-project.lavender{border-left-color:var(--lavender)}
.card-ptitle{font-size:.8rem;font-weight:700;color:var(--ink);margin-bottom:.2rem}
.card-psub{font-size:.7rem;color:var(--muted);line-height:1.4}
.card-footer{display:flex;justify-content:space-between;align-items:center;margin-top:.625rem}
.card-tag{font-size:.65rem;font-weight:700;padding:.2rem .6rem;border-radius:100px;letter-spacing:.04em}
.ct-o{background:var(--orange-bg);color:var(--orange)}
.ct-t{background:var(--teal-bg);color:#009D85}
.ct-l{background:var(--lavender-bg);color:var(--lavender)}
.card-likes{font-size:.72rem;font-weight:700;color:var(--pink);display:flex;align-items:center;gap:.25rem}

/* ─── ROTATING ORBIT RINGS (Rotational) ─── */
.orbit-ring{display:none}
.orbit-1-off{width:340px;height:340px;top:50%;left:50%;margin:-170px 0 0 -170px;animation:rotateCW 28s linear infinite}
.orbit-2-off{width:480px;height:480px;top:50%;left:50%;margin:-240px 0 0 -240px;border-color:rgba(0,201,167,0.12);animation:rotateCCW 38s linear infinite}
.orbit-dot-off{position:absolute;width:10px;height:10px;border-radius:50%;top:-5px;left:50%;margin-left:-5px}
.od-o-off{background:var(--orange);box-shadow:0 0 8px rgba(255,107,53,.6)}
.od-t-off{background:var(--teal);box-shadow:0 0 8px rgba(0,201,167,.6)}
@keyframes rotateCW{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rotateCCW{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}

/* ─── SECTION BASE ─── */
.section{padding:5.5rem 5%}
.section-inner{max-width:1140px;margin:0 auto}
.eyebrow{
  font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  display:flex;align-items:center;gap:.6rem;margin-bottom:.875rem;
}
.ey-o{color:var(--orange)}
.ey-t{color:var(--teal)}
.ey-l{color:var(--lavender)}
.eyebrow::before{content:'';width:20px;height:2px;border-radius:1px}
.ey-o::before{background:var(--orange)}
.ey-t::before{background:var(--teal)}
.ey-l::before{background:var(--lavender)}
.section-title{
  font-size:clamp(1.75rem,3.5vw,2.6rem);
  font-weight:800;letter-spacing:-.02em;line-height:1.15;
  color:var(--ink);margin-bottom:.875rem;
}
.section-sub{font-size:1rem;color:var(--ink2);max-width:480px;line-height:1.75}

/* ─── SCROLL REVEAL (Periodic Motion) ─── */
.reveal{
  opacity:0;transform:translateY(40px);
  transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);
}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-delay-1{transition-delay:.1s}
.reveal-delay-2{transition-delay:.2s}
.reveal-delay-3{transition-delay:.3s}
.reveal-delay-4{transition-delay:.4s}
.reveal-delay-5{transition-delay:.5s}
.reveal-delay-6{transition-delay:.6s}

/* ─── WHAT SECTION ─── */
.what{background:var(--bg)}
.what-grid{display:grid;grid-template-columns:1fr;max-width:700px;margin-top:3.5rem}
.what-text p{color:var(--ink2);line-height:1.8;margin-bottom:1rem}
.what-text strong{color:var(--ink)}
.pill-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem}
.pill{padding:.35rem .9rem;border-radius:100px;font-size:.78rem;font-weight:600;transition:transform .2s}
.pill:hover{transform:scale(1.06)}
.po{background:var(--orange-bg);color:var(--orange)}
.pt{background:var(--teal-bg);color:#007D6A}
.pl{background:var(--lavender-bg);color:var(--lavender)}
.py{background:var(--yellow-bg);color:#A07800}
.mock-card{
  background:#fff;border-radius:20px;box-shadow:var(--shadow-hover);
  padding:2rem;border:1px solid var(--border);position:relative;overflow:hidden;
}
.mock-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--orange),var(--teal),var(--lavender));
  animation:rainbowShift 6s linear infinite;
  background-size:200% auto;
}
@keyframes rainbowShift{0%{background-position:0%}100%{background-position:200%}}
.mock-profile{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
.mock-av{
  width:52px;height:52px;border-radius:14px;
  background:linear-gradient(135deg,var(--orange),var(--pink));
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:800;font-size:.95rem;
  /* Rotational on hover */
  transition:transform .5s cubic-bezier(.34,1.56,.64,1);
}
.mock-card:hover .mock-av{transform:rotate(10deg) scale(1.08)}
.mock-name{font-weight:800;font-size:1rem;color:var(--ink)}
.mock-handle{font-size:.78rem;color:var(--muted)}
.mock-verified{
  display:inline-flex;align-items:center;gap:.25rem;
  background:var(--teal-bg);color:#007D6A;
  font-size:.65rem;font-weight:700;padding:.15rem .5rem;
  border-radius:100px;margin-top:.25rem;
}
.mock-projects{display:flex;flex-direction:column;gap:.625rem}
.mock-proj{
  background:var(--bg);border-radius:var(--radius-sm);
  padding:.75rem 1rem;display:flex;justify-content:space-between;align-items:flex-start;
  border-left:3px solid var(--orange);
  transition:transform .2s,box-shadow .2s;
}
.mock-proj:nth-child(2){border-left-color:var(--teal)}
.mock-proj:nth-child(3){border-left-color:var(--lavender)}
.mock-proj:hover{transform:translateX(5px);box-shadow:var(--shadow)}
.mock-proj-title{font-size:.82rem;font-weight:700;color:var(--ink);margin-bottom:.2rem}
.mock-proj-sub{font-size:.7rem;color:var(--muted)}
.mock-proj-likes{font-size:.72rem;color:var(--pink);font-weight:700}

/* ─── FEATURES ─── */
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3.5rem}
.feat-card{
  background:#fff;border-radius:var(--radius);
  padding:2rem;border:1px solid var(--border);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
  position:relative;overflow:hidden;
}
.feat-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:var(--shadow-hover)}
.feat-icon{
  width:52px;height:52px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  font-size:1.5rem;margin-bottom:1.25rem;
  font-weight:700;
  transition:transform .5s cubic-bezier(.34,1.56,.64,1);
}
.feat-card:hover .feat-icon{transform:rotate(12deg) scale(1.1)}
.fi-o{background:var(--orange-bg);color:var(--orange)}
.fi-t{background:var(--teal-bg);color:var(--teal)}
.fi-l{background:var(--lavender-bg);color:var(--lavender)}
.fi-y{background:var(--yellow-bg);color:#A07800}
.feat-card h3{font-size:1rem;font-weight:700;color:var(--ink);margin-bottom:.6rem}
.feat-card p{font-size:.875rem;color:var(--ink2);line-height:1.7}
.feat-card::after{display:none}
.fc-o::after{background:linear-gradient(90deg,var(--orange),var(--pink))}
.fc-t::after{background:linear-gradient(90deg,var(--teal),#00A88E)}
.fc-l::after{background:linear-gradient(90deg,var(--lavender),#8B7FF0)}
.fc-y::after{background:linear-gradient(90deg,var(--yellow),#FFA500)}
.feat-card:hover::after{transform:scaleX(1)}

/* ─── WHO ─── */
.who{background:var(--bg)}
.who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3.5rem}
.who-card{
  background:#fff;border-radius:var(--radius);
  padding:2rem;border:1px solid var(--border);
  transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
}
.who-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-hover)}
.who-badge{
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.35rem .875rem;border-radius:100px;
  font-size:.72rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
  margin-bottom:1.25rem;
}
.wb-o{background:var(--orange-bg);color:var(--orange)}
.wb-t{background:var(--teal-bg);color:#007D6A}
.wb-l{background:var(--lavender-bg);color:var(--lavender)}
.who-card h3{font-size:1.15rem;font-weight:800;color:var(--ink);margin-bottom:.75rem;line-height:1.3}
.who-card p{font-size:.875rem;color:var(--ink2);line-height:1.7;margin-bottom:1.25rem}
.who-list{list-style:none}
.who-list li{
  font-size:.82rem;color:var(--ink2);
  padding:.4rem 0;display:flex;align-items:flex-start;gap:.5rem;
  border-bottom:1px solid var(--border);
  transition:padding-left .2s;
}
.who-list li:hover{padding-left:.4rem}
.who-list li:last-child{border-bottom:none}
.who-list li::before{content:'→';font-size:.7rem;flex-shrink:0;margin-top:3px}
.wl-o li::before{color:var(--orange)}
.wl-t li::before{color:var(--teal)}
.wl-l li::before{color:var(--lavender)}

/* ─── MISSION ─── */
.mission{
  background:linear-gradient(135deg,var(--ink) 0%,#1E1830 100%);
  padding:5rem 5%;color:#fff;text-align:center;
  position:relative;overflow:hidden;
}
/* Periodic — rotating glow behind mission */
.mission-glow{
  position:absolute;top:50%;left:50%;
  width:600px;height:600px;border-radius:50%;
  background:conic-gradient(from 0deg,rgba(255,107,53,.1),rgba(0,201,167,.08),rgba(124,111,234,.06),rgba(255,107,53,.1));
  transform:translate(-50%,-50%);
  animation:rotateCW 20s linear infinite;
  pointer-events:none;
}
.mission-inner{position:relative;z-index:1;max-width:760px;margin:0 auto}
.mission blockquote{
  font-size:clamp(1.4rem,3vw,2.1rem);
  font-weight:800;line-height:1.4;letter-spacing:-.02em;margin-bottom:1.25rem;
}
.mission blockquote .o{color:var(--orange)}
.mission blockquote .t{color:var(--teal)}
.mission p{color:rgba(255,255,255,.6);font-size:.95rem;line-height:1.8;margin-bottom:2rem}
.mission-tags{display:flex;justify-content:center;flex-wrap:wrap;gap:.75rem}
.mtag{
  padding:.4rem 1rem;border-radius:100px;border:1px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.7);font-size:.78rem;font-weight:500;
  transition:all .25s;cursor:default;
}
.mtag:hover{border-color:var(--orange);color:var(--orange);transform:translateY(-2px)}

/* ─── HOW ─── */
.how-steps{
  display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;
  margin-top:3.5rem;position:relative;
}
.how-steps::before{
  content:'';position:absolute;
  top:32px;left:calc(12.5% + 16px);right:calc(12.5% + 16px);height:2px;
  background:linear-gradient(90deg,var(--orange),var(--yellow),var(--teal),var(--lavender));
  border-radius:1px;z-index:0;opacity:.3;
  /* Periodic — flowing line */
  animation:flowLine 3s linear infinite;
  background-size:200% auto;
}
@keyframes flowLine{0%{background-position:0%}100%{background-position:200%}}
.how-step{text-align:center;position:relative;z-index:1}
.step-circle{
  width:64px;height:64px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:1rem;margin:0 auto 1.25rem;
  transition:transform .4s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
}
/* Oscillatory — vibrate on hover */
.step-circle:hover{animation:vibrate .3s ease-in-out 3}
@keyframes vibrate{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-3px) rotate(-3deg)}
  40%{transform:translateX(3px) rotate(3deg)}
  60%{transform:translateX(-2px) rotate(-2deg)}
  80%{transform:translateX(2px) rotate(2deg)}
}
.sc-1{background:var(--orange-bg);color:var(--orange);box-shadow:0 0 0 6px rgba(255,107,53,.08)}
.sc-2{background:var(--yellow-bg);color:#A07800;box-shadow:0 0 0 6px rgba(255,209,102,.08)}
.sc-3{background:var(--teal-bg);color:#007D6A;box-shadow:0 0 0 6px rgba(0,201,167,.08)}
.sc-4{background:var(--lavender-bg);color:var(--lavender);box-shadow:0 0 0 6px rgba(124,111,234,.08)}
.how-step h4{font-size:.95rem;font-weight:700;color:var(--ink);margin-bottom:.5rem}
.how-step p{font-size:.82rem;color:var(--muted);line-height:1.65}

/* ─── CTA ─── */
.cta-section{background:var(--bg);padding:5.5rem 5%;text-align:center}
.cta-box{
  max-width:640px;margin:0 auto;
  background:#fff;border-radius:24px;
  padding:3.5rem 3rem;box-shadow:var(--shadow-hover);
  border:1px solid var(--border);position:relative;overflow:hidden;
}
.cta-box::before{
  content:'';position:absolute;top:0;left:0;right:0;height:5px;
  background:linear-gradient(90deg,var(--orange),var(--pink),var(--lavender),var(--teal),var(--orange));
  background-size:200% auto;
  animation:rainbowShift 4s linear infinite;
}
.cta-box h2{
  font-size:clamp(1.6rem,3.5vw,2.4rem);
  font-weight:800;letter-spacing:-.02em;color:var(--ink);margin-bottom:1rem;
}
.cta-box p{color:var(--ink2);font-size:.95rem;margin-bottom:2rem;line-height:1.75}
.cta-actions{display:flex;gap:.875rem;justify-content:center;flex-wrap:wrap}

/* ─── FOOTER ─── */
footer{
  background:#fff;border-top:1px solid var(--border);
  padding:2.5rem 5%;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;
}
.footer-logo{display:flex;align-items:center;gap:.6rem;font-weight:800;color:var(--ink)}
.footer-links{display:flex;gap:2rem}
.footer-links a{color:var(--muted);font-size:.82rem;font-weight:500;transition:color .2s,transform .2s;display:inline-block}
.footer-links a:hover{color:var(--orange);transform:translateY(-2px)}
.footer-copy{font-size:.75rem;color:var(--muted)}

/* ─── RESPONSIVE ─── */
@media(max-width:960px){
  .hero-inner,.what-grid{grid-template-columns:1fr}
  .hero-right{display:none}
  .feat-grid,.who-grid{grid-template-columns:1fr 1fr}
  .how-steps{grid-template-columns:1fr 1fr}
  .how-steps::before{display:none}
  .nav-links{display:none}
  nav,footer{padding-left:1.5rem;padding-right:1.5rem}
  .section{padding:4rem 5%}
}
@media(max-width:600px){
  .feat-grid,.who-grid,.how-steps{grid-template-columns:1fr}
  .hero{padding:4rem 1.5rem 3rem}
  .cta-box{padding:2.5rem 1.5rem}
}
@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
}

/* ─── DARK MODE ─── */
body.dark{
  --white:#0F0F1A;--bg:#13131F;--ink:#F0F0FF;--ink2:#A0A0C0;
  --muted:#6060A0;--border:#2A2A40;
  --shadow:0 4px 24px rgba(0,0,0,0.3);
  --shadow-hover:0 12px 48px rgba(0,0,0,0.5);
}
body.dark nav{background:rgba(15,15,26,0.92)}
body.dark .feat-card,body.dark .who-card,body.dark .cta-box{background:#1A1A2E}
body.dark footer{background:#1A1A2E}
body.dark .what{background:#13131F}
body.dark .who{background:#13131F}
body.dark .cta-section{background:#13131F}
body.dark .h-scroll-card{background:#1E1E32}
body.dark .hstat-box{background:#1A1A2E;box-shadow:4px 4px 10px rgba(0,0,0,0.4),-4px -4px 10px rgba(255,255,255,0.03)}
body.dark .mock-proj{background:#1E1E32}

/* ─── CLAY CARDS ─── */
.clay{
  border-radius:24px;
  box-shadow:8px 8px 0px rgba(0,0,0,0.06),inset 0 -4px 0 rgba(0,0,0,0.06),inset 0 4px 0 rgba(255,255,255,0.8);
}

/* ─── ACCENT RING PULSE ─── */
@keyframes accentPing{
  0%{transform:scale(1);opacity:.6}
  100%{transform:scale(1.22);opacity:0}
}
.accent-ring{
  position:absolute;inset:-3px;border-radius:inherit;
  border:2px solid var(--orange);
  animation:accentPing 2s cubic-bezier(0,0,.2,1) infinite;
  pointer-events:none;
}


/* ─── NAV AUTH BUTTONS ─── */
.nav-auth{display:flex;align-items:center;gap:.75rem}
.nav-signin{
  padding:.5rem 1.1rem;color:var(--ink2);
  font-weight:600;font-size:.85rem;border-radius:100px;
  border:1px solid transparent;transition:all .2s;
}
.nav-signin:hover{color:var(--orange);background:var(--orange-bg)}

/* ─── WORD ROTATOR (BUILD / SHIP / CONNECT) ─── */
.word-rotator{
  position:relative;display:inline-block;
  min-width:78px;height:1em;vertical-align:middle;
  text-align:left;
}
.word-slide{
  position:absolute;left:0;top:0;
  opacity:0;transform:translateY(8px);
  transition:opacity .45s ease, transform .45s ease;
  white-space:nowrap;
}
.word-slide.active{opacity:1;transform:translateY(0)}
.word-slide.exit{opacity:0;transform:translateY(-8px)}
`

const LANDING_HTML = `

<!-- Scroll progress bar (Periodic) -->
<div id="progress-bar"></div>

<!-- NAV -->
<nav>
  <div class="logo">
    <div class="logo-mark">S</div>
    Shwooshii
  </div>
  <div class="nav-links">
    <a href="#what">About</a>
    <a href="#features">Features</a>
    <a href="#community">Community</a>
    <a href="#how">How it works</a>
  </div>
  <div class="nav-auth">
    <a href="#" class="nav-signin" data-nav="/auth">Sign in</a>
    <a href="#" class="nav-cta" data-nav="/auth?mode=signup">Sign up</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <canvas id="matrix-canvas"></canvas>
  <div class="blob1 parallax-slow" data-speed="-0.3" aria-hidden="true"></div>
  <div class="blob2 parallax-fast" data-speed="-0.5" aria-hidden="true"></div>
  <div class="blob3 parallax-slow" data-speed="-0.2" aria-hidden="true"></div>

  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-tag">
  <canvas id="heart-canvas" width="32" height="28"></canvas>
  <span class="word-rotator" id="word-rotator" aria-live="polite">
    <span class="word-slide active">BUILD</span>
  </span>
</div>
      <h1>
        Where builders<br>
        <span class="highlight typewriter" id="typewriter">prove their craft.</span>
      </h1>
      <p class="hero-sub">Shwooshii is the creative hub for developers, founders, and problem-solvers. Showcase real projects, post startup ideas, and connect with people who actually build.</p>
      <div class="hero-actions">
        <a href="#" class="btn-orange" data-nav="/auth?mode=signup">Create your profile →<span class="accent-ring"></span></a>
        <a href="#" class="btn-line" data-nav="/auth">Sign in</a>
      </div>
      <div class="hero-stats">
        <div class="hstat-box">
          <div class="hstat-num o">182+</div>
          <div class="hstat-label">Developers</div>
        </div>
        <div class="hstat-box">
          <div class="hstat-num t">40+</div>
          <div class="hstat-label">Projects live</div>
        </div>
        <div class="hstat-box">
          <div class="hstat-num l">5</div>
          <div class="hstat-label">Universities</div>
        </div>
      </div>
    </div>

    <div class="hero-right" aria-label="Platform preview">

    </div>
  </div>
</section>

<!-- WHAT -->
<section class="section what" id="what">
  <div class="section-inner">
    <div class="eyebrow ey-o reveal">What is Shwooshii</div>
    <div class="what-grid">
      <div class="what-text reveal reveal-delay-1">
        <h2 class="section-title">LinkedIn grew up.<br>GitHub got social.<br>Shwooshii came next.</h2>
        <p>Most developer portfolios are just CVs in disguise. Most communities are group chats that go nowhere. <strong>Shwooshii is where you prove what you can actually do.</strong></p>
        <p>Every profile answers one question: <strong>what problem did you solve?</strong> Not what degree you have — what you built, and why it matters.</p>
        <p>Built from Botswana. Open to the world. For the generation that doesn't wait for permission.</p>
        <div class="pill-row">
          <span class="pill po">Developer portfolios</span>
          <span class="pill pt">Startup ideas</span>
          <span class="pill pl">Problem solving</span>
          <span class="pill po">Founder network</span>
          <span class="pill py">Verified skills</span>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="section" id="features">
  <div class="section-inner">
    <div class="eyebrow ey-t reveal">Features</div>
    <h2 class="section-title reveal reveal-delay-1">Everything you need to build in public.</h2>
    <p class="section-sub reveal reveal-delay-2">From portfolio to community to startup hub — one platform, built for builders at every level.</p>
    <div class="feat-grid">
      <div class="feat-card fc-o tilt reveal reveal-delay-1"><div class="feat-icon fi-o">&#9646;</div><h3>Verified portfolios</h3><p>Show real work with real context. Every project includes the problem you solved, your stack, and a live link.</p></div>
      <div class="feat-card fc-t tilt reveal reveal-delay-2"><div class="feat-icon fi-t">&#10022;</div><h3>Startup ideas board</h3><p>Post problems you want to solve. Find founders who share your energy. Turn ideas into real collaborations.</p></div>
      <div class="feat-card fc-l tilt reveal reveal-delay-3"><div class="feat-icon fi-l">&#8853;</div><h3>Co-founder matching</h3><p>Find the person who completes your team based on skills and what you're actually building together.</p></div>
      <div class="feat-card fc-y tilt reveal reveal-delay-4"><div class="feat-icon fi-y">&#9651;</div><h3>Trust score</h3><p>Reputation built through what you ship. Verified badges show employers you're a builder, not just a candidate.</p></div>
      <div class="feat-card fc-o tilt reveal reveal-delay-5"><div class="feat-icon fi-o">&#10022;</div><h3>Social dev feed</h3><p>Share wins, ask questions, comment on real projects. A community that moves at the speed of shipping.</p></div>
      <div class="feat-card fc-t tilt reveal reveal-delay-6"><div class="feat-icon fi-t">&#9678;</div><h3>Problem-first culture</h3><p>Every project starts with a problem statement. Shwooshii filters for builders who build what matters.</p></div>
    </div>
  </div>
</section>

<!-- WHO -->
<section class="section who" id="community">
  <div class="section-inner">
    <div class="eyebrow ey-l reveal">Community</div>
    <h2 class="section-title reveal reveal-delay-1">Three kinds of builders.<br>One platform.</h2>
    <p class="section-sub reveal reveal-delay-2">From your first commit to your first funding round — Shwooshii grows with you.</p>
    <div class="who-grid">
      <div class="who-card reveal reveal-delay-1">
        <div class="who-badge wb-o">{ } Developers</div>
        <h3>Build a reputation that opens doors</h3>
        <p>Beginner to senior — your portfolio is your proof of work. Show what you've built and what it solved.</p>
        <ul class="who-list wl-o">
          <li>Verified skill badges from real projects</li>
          <li>Get discovered by companies in Botswana</li>
          <li>Peer code reviews and feedback</li>
          <li>Climb the Trust Score leaderboard</li>
        </ul>
      </div>
      <div class="who-card reveal reveal-delay-2">
        <div class="who-badge wb-t">&#8599; Founders</div>
        <h3>From idea to team in one place</h3>
        <p>Shwooshii is where you find the technical co-founder, the early users, and the community that believes in it.</p>
        <ul class="who-list wl-t">
          <li>Post startup ideas publicly</li>
          <li>Find a co-founder by skill match</li>
          <li>Get early validation from builders</li>
          <li>Build in public with your community</li>
        </ul>
      </div>
      <div class="who-card reveal reveal-delay-3">
        <div class="who-badge wb-l">&#9670; Learners & Mentors</div>
        <h3>Learn by building. Teach by shipping.</h3>
        <p>Ask real questions in real context. Help others where you're strong. Build your reputation as you grow.</p>
        <ul class="who-list wl-l">
          <li>Connect with senior dev mentors</li>
          <li>Get feedback on live projects</li>
          <li>Join startup teams as a learner</li>
          <li>Earn recognition for contributions</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- MISSION -->
<section class="mission">
  <div class="mission-glow" aria-hidden="true"></div>
  <div class="mission-inner">
    <div class="eyebrow ey-o reveal" style="justify-content:center;margin-bottom:1.25rem">Our mission</div>
    <blockquote class="reveal reveal-delay-1">
      "Africa's next generation of builders doesn't need permission — they need a place to <span class="o">prove</span> what they can <span class="t">build.</span>"
    </blockquote>
    <p class="reveal reveal-delay-2">Shwooshii exists to accelerate problem-solving through technology. The best ideas come from people who live with the problem firsthand — and have the skills to build the solution.</p>
    <div class="mission-tags reveal reveal-delay-3">
      <span class="mtag">Build in public</span>
      <span class="mtag">Solve real problems</span>
      <span class="mtag">Community-first</span>
      <span class="mtag">Africa-born</span>
      <span class="mtag">Open to the world</span>
    </div>
  </div>
</section>

<!-- HOW -->
<section class="section" id="how">
  <div class="section-inner">
    <div class="eyebrow ey-o reveal">How it works</div>
    <h2 class="section-title reveal reveal-delay-1">Four steps to get noticed.</h2>
    <div class="how-steps">
      <div class="how-step reveal reveal-delay-1"><div class="step-circle sc-1">01</div><h4>Create your identity</h4><p>Sign up and set up your verified developer profile — name, role, bio, and links.</p></div>
      <div class="how-step reveal reveal-delay-2"><div class="step-circle sc-2">02</div><h4>Showcase your work</h4><p>Upload projects, add your stack, and explain what problem you solved.</p></div>
      <div class="how-step reveal reveal-delay-3"><div class="step-circle sc-3">03</div><h4>Connect & contribute</h4><p>Follow builders, give feedback, post in the feed, join startup ideas.</p></div>
      <div class="how-step reveal reveal-delay-4"><div class="step-circle sc-4">04</div><h4>Build your Trust Score</h4><p>Ship more, contribute more — become visible to companies and co-founders.</p></div>
    </div>
  </div>
</section>

<!-- HORIZONTAL SCROLL — Tech stack -->
<section class="h-scroll-wrap" style="padding:3rem 0;background:var(--bg);border-top:1px solid var(--border);overflow:hidden">
  <div style="max-width:1140px;margin:0 auto;padding:0 5%;margin-bottom:1.5rem">
    <div class="eyebrow ey-o reveal">Built with</div>
    <h2 class="section-title reveal reveal-delay-1" style="font-size:1.6rem">Tools builders use on Shwooshii</h2>
  </div>
  <div class="h-scroll-track" id="h-track">
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--orange);font-weight:800;margin-bottom:.5rem">&#9670; React</div><p style="font-size:.82rem;color:var(--muted)">Frontend framework for modern UIs</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--teal);font-weight:800;margin-bottom:.5rem">&#9646; Supabase</div><p style="font-size:.82rem;color:var(--muted)">Open source backend & database</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--lavender);font-weight:800;margin-bottom:.5rem">&#8853; Next.js</div><p style="font-size:.82rem;color:var(--muted)">Full-stack React framework</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--orange);font-weight:800;margin-bottom:.5rem">&#9651; Node.js</div><p style="font-size:.82rem;color:var(--muted)">JavaScript backend runtime</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--teal);font-weight:800;margin-bottom:.5rem">&#10022; Python</div><p style="font-size:.82rem;color:var(--muted)">Data, scripts & automation</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--lavender);font-weight:800;margin-bottom:.5rem">&#9678; Flutter</div><p style="font-size:.82rem;color:var(--muted)">Cross-platform mobile apps</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--pink);font-weight:800;margin-bottom:.5rem">&#9646; TypeScript</div><p style="font-size:.82rem;color:var(--muted)">Typed JavaScript at scale</p></div>
    <div class="h-scroll-card clay distort"><div style="font-size:1.5rem;color:var(--orange);font-weight:800;margin-bottom:.5rem">&#8901; PostgreSQL</div><p style="font-size:.82rem;color:var(--muted)">Relational database power</p></div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section" id="cta">
  <div class="cta-box reveal">
    <div class="eyebrow ey-o" style="justify-content:center;margin-bottom:1rem">Early access</div>
    <h2>Ready to build<br>in public?</h2>
    <p>Shwooshii is launching soon. Join the waitlist and be first to create your verified developer portfolio — free, forever.</p>
    <div class="cta-actions">
      <a href="#" class="btn-orange" data-nav="/auth?mode=signup">Sign up free →<span class="accent-ring"></span></a>
      <a href="#" class="btn-line" data-nav="/auth">Sign in</a>
    </div>
  </div>
</section>

<!-- FOOTER -->


<footer>
  <div class="footer-logo">
    <div class="logo-mark">S</div>
    Shwooshii
  </div>
  <div class="footer-links">
    <a href="#what">About</a>
    <a href="#features">Features</a>
    <a href="#community">Community</a>
    <a href="#cta">Join</a>
  </div>
  <div class="footer-copy">© 2026 Shwooshii — Built for builders.</div>
</footer>

`

const LANDING_JS = `
// ── 0. BEATING HEART CANVAS ──────────────────────────────────
(function(){
  const canvas = document.getElementById('heart-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Heart path using parametric equations
  function heartPoint(t, scale, cx, cy){
    const x = scale * 16 * Math.pow(Math.sin(t), 3);
    const y = -scale * (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
    return [cx + x, cy + y];
  }

  let frame = 0;

  function drawHeart(scale, glowAlpha){
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2 + 1;
    const steps = 200;

    // Outer glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16 * scale);
    grd.addColorStop(0, \`rgba(255,107,53,\${glowAlpha * 0.4})\`);
    grd.addColorStop(1, 'rgba(255,107,53,0)');
    ctx.beginPath();
    for(let i = 0; i <= steps; i++){
      const t = (i / steps) * Math.PI * 2;
      const [x, y] = heartPoint(t, scale * 1.5, cx, cy);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    // Main heart body
    ctx.beginPath();
    for(let i = 0; i <= steps; i++){
      const t = (i / steps) * Math.PI * 2;
      const [x, y] = heartPoint(t, scale, cx, cy);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Gradient fill — dark red to bright orange-red
    const grad = ctx.createLinearGradient(cx, cy - 12*scale, cx, cy + 12*scale);
    grad.addColorStop(0, '#FF2D55');
    grad.addColorStop(0.4, '#FF5F6D');
    grad.addColorStop(1, '#FF6B35');
    ctx.fillStyle = grad;
    ctx.fill();

    // Highlight shine (top left)
    ctx.beginPath();
    ctx.ellipse(cx - 3*scale, cy - 4*scale, 2.5*scale, 1.5*scale, -Math.PI/4, 0, Math.PI*2);
    ctx.fillStyle = \`rgba(255,255,255,\${0.35 + glowAlpha * 0.15})\`;
    ctx.fill();
  }

  // Heartbeat rhythm: lub-DUB pattern
  // 0→expand(lub) → contract → expand(DUB bigger) → contract → rest
  function getBeat(t){
    const bpm = 72;
    const period = 60 / bpm; // seconds per beat
    const phase = (t % period) / period; // 0..1 within one beat

    // lub (small bump at 0.0–0.12)
    if(phase < 0.07) return 1 + 0.08 * Math.sin(phase / 0.07 * Math.PI);
    // DUB (big bump at 0.14–0.30)
    if(phase < 0.14) return 1 - 0.03 * ((phase - 0.07) / 0.07);
    if(phase < 0.28) return 1 + 0.18 * Math.sin((phase - 0.14) / 0.14 * Math.PI);
    // diastole: decay and rest
    return 1 - 0.04 * Math.sin((phase - 0.28) / 0.72 * Math.PI);
  }

  function getGlow(t){
    const bpm = 72;
    const period = 60 / bpm;
    const phase = (t % period) / period;
    if(phase < 0.28) return Math.max(0, Math.sin(phase / 0.28 * Math.PI));
    return 0;
  }

  let startTime = null;
  function loop(ts){
    if(!startTime) startTime = ts;
    const t = (ts - startTime) / 1000; // seconds

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const scale = getBeat(t);
      const glow = getGlow(t);
      drawHeart(scale, glow);
    } else {
      drawHeart(1, 0);
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// ── 1. SCROLL PROGRESS BAR (Periodic Motion) ──────────────────
// Lenis & GSAP initialised below — progress bar handled by lenis.on('scroll')
const bar = document.getElementById('progress-bar');
if(typeof Lenis !== 'undefined'){
  const lenis = window._lenis = new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smooth:true});
  function lenisRaf(time){lenis.raf(time);requestAnimationFrame(lenisRaf);}
  requestAnimationFrame(lenisRaf);
  if(typeof ScrollTrigger !== 'undefined'){
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time=>lenis.raf(time*1000));
    gsap.ticker.lagSmoothing(0);
  }
  lenis.on('scroll',({progress})=>{bar.style.width=(progress*100)+'%';});
} else {
  window.addEventListener('scroll',()=>{
    const max=document.body.scrollHeight-innerHeight;
    bar.style.width=(scrollY/max*100)+'%';
  },{passive:true});
}

// ── 2. TYPEWRITER (existing) ──────────────────────────────────
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = document.getElementById('typewriter');
  const phrases = [
    {text:'prove their craft.', color:'orange'},
    {text:'ship real solutions.', color:'teal'},
    {text:'build what matters.', color:'orange'},
    {text:'connect with founders.', color:'teal'},
    {text:'change the game.', color:'orange'},
  ];
  let pi=0, ci=0, deleting=false, wait=0;
  function tick(){
    const {text, color} = phrases[pi];
    el.className = 'highlight typewriter ' + (color === 'teal' ? 'teal' : '');
    if(!deleting){
      el.textContent = text.slice(0, ci+1);
      ci++;
      if(ci === text.length){ deleting=true; wait=80; }
    } else {
      if(wait-- > 0){ setTimeout(tick, 30); return; }
      el.textContent = text.slice(0, ci-1);
      ci--;
      if(ci === 0){ deleting=false; pi=(pi+1)%phrases.length; }
    }
    setTimeout(tick, deleting ? 32 : 68);
  }
  setTimeout(tick, 900);
})();

// ── 3. MATRIX RAIN — 0s and 1s falling ──────────────────────
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;
  const FONT_SIZE = 14;
  const COLORS = [
    {r:255,g:107,b:53},  // orange
    {r:0,g:201,b:167},   // teal
    {r:124,g:111,b:234}, // lavender
    {r:255,g:95,b:162},  // pink
    {r:255,g:209,b:102}, // yellow
  ];

  function init(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols = Math.floor(W / FONT_SIZE);
    drops = Array.from({length: cols}, () => ({
      y: Math.random() * -100,  // start above viewport at random heights
      speed: Math.random() * 1.2 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      bright: Math.random() > 0.85, // some columns are brighter/lead
      trailLen: Math.floor(Math.random() * 12 + 6),
    }));
  }

  init();
  window.addEventListener('resize', init, {passive:true});

  function draw(){
    // Fade canvas with white overlay — creates trail effect on white bg
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = \`\${FONT_SIZE}px monospace\`;
    ctx.textAlign = 'center';

    drops.forEach((drop, i) => {
      const x = i * FONT_SIZE + FONT_SIZE / 2;
      const {r, g, b} = drop.color;

      // Draw trail (fading older chars)
      for(let t = 1; t <= drop.trailLen; t++){
        const ty = (drop.y - t) * FONT_SIZE;
        if(ty < 0 || ty > H) continue;
        const alpha = (1 - t / drop.trailLen) * 0.18;
        ctx.fillStyle = \`rgba(\${r},\${g},\${b},\${alpha})\`;
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, ty);
      }

      // Draw head (brightest character)
      const headY = drop.y * FONT_SIZE;
      if(headY >= 0 && headY <= H){
        const headAlpha = drop.bright ? 0.75 : 0.45;
        ctx.fillStyle = \`rgba(\${r},\${g},\${b},\${headAlpha})\`;
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, headY);
      }

      // Move drop down
      drop.y += drop.speed;

      // Reset when it falls off bottom — random restart from top
      if(drop.y * FONT_SIZE > H + drop.trailLen * FONT_SIZE){
        drop.y = Math.random() * -20;
        drop.speed = Math.random() * 1.2 + 0.4;
        drop.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        drop.bright = Math.random() > 0.85;
        drop.trailLen = Math.floor(Math.random() * 12 + 6);
      }
    });
  }

  function loop(){ draw(); requestAnimationFrame(loop); }
  loop();
})();

// ── 4. PERIODIC — Scroll reveal (IntersectionObserver) ────────
(function(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, {threshold: .12});
  els.forEach(el => obs.observe(el));
})();

// ── 5. OSCILLATORY — Stats counter animation ──────────────────
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const stats = document.querySelectorAll('.hstat-num');
  const targets = [182, 40, 5];
  const suffixes = ['+', '+', ''];
  let started = false;
  function countUp(){
    if(started) return; started = true;
    stats.forEach((el, i) => {
      let end = targets[i], dur = 1400;
      const step = timestamp => {
        if(!step.start) step.start = timestamp;
        const prog = Math.min((timestamp - step.start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 4);
        el.textContent = Math.round(end * ease) + suffixes[i];
        if(prog < 1) requestAnimationFrame(step);
        else el.textContent = end + suffixes[i];
      };
      requestAnimationFrame(step);
    });
  }
  const obs = new IntersectionObserver(e => { if(e[0].isIntersecting) countUp(); }, {threshold:.5});
  const statsEl = document.querySelector('.hero-stats');
  if(statsEl) obs.observe(statsEl);
})();

// ── 6. PERSPECTIVE TILT HOVER ─────────────────────────────────
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = -(y / rect.height) * 14;
    const ry = (x / rect.width) * 14;
    card.style.transform = \`perspective(800px) rotateX(\${rx}deg) rotateY(\${ry}deg) translateZ(8px)\`;
    card.style.boxShadow = \`\${-ry*.5}px \${rx*.5}px 30px rgba(15,15,26,0.15)\`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.transition = 'transform .5s ease, box-shadow .5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// ── 8. PIXEL DISTORTION on hover (canvas glitch) ──────────────
document.querySelectorAll('.distort').forEach(el => {
  el.addEventListener('mouseenter', () => {
    let count = 0;
    const glitch = setInterval(() => {
      const r = () => (Math.random() - .5) * 6;
      el.style.transform = \`translate(\${r()}px,\${r()}px) skewX(\${r()*.5}deg)\`;
      if(++count > 5){ clearInterval(glitch); el.style.transform = ''; }
    }, 40);
  });
});

// ── 9. DARK/LIGHT THEME TOGGLE ────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');
if(themeBtn){
  let dark = false;
  themeBtn.addEventListener('click', () => {
    dark = !dark;
    document.body.classList.toggle('dark', dark);
    themeBtn.innerHTML = dark ? '&#9788;' : '&#9790;';
    // Smooth color transition
    document.body.style.transition = 'background .4s, color .4s';
    setTimeout(() => document.body.style.transition = '', 500);
  });
}

// ── 10. GSAP HERO STAGGER ENTRANCE ────────────────────────────
gsap.from('.hero-left > *', {
  y: 30, opacity: 0, duration: 0.8,
  stagger: 0.12, ease: 'power3.out', delay: 1.9,
});

// ── 11. MISSION QUOTE WORD-BY-WORD REVEAL ─────────────────────
const quote = document.querySelector('.mission blockquote');
if(quote){
  const text = quote.innerHTML;
  const words = text.split(/(\\s+|<[^>]+>)/g);
  quote.innerHTML = words.map(w =>
    w.startsWith('<') || w.trim() === '' ? w :
    \`<span class="word-reveal" style="display:inline-block;overflow:hidden"><span style="display:inline-block">\${w}</span></span>\`
  ).join('');
  gsap.from('.word-reveal > span', {
    y: '110%', duration: 0.6, stagger: 0.04, ease: 'power3.out',
    scrollTrigger: { trigger: quote, start: 'top 80%' }
  });
}

// ── PAGE LOADER HIDE ────────────────────────────────────────
// Loader removed — SPA has nothing to wait for.

// ── GSAP + SCROLLTRIGGER SETUP ──────────────────────────────
(function(){
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Sync with Lenis if available
  if(window._lenis){
    window._lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => window._lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ScrollTrigger reveals
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el,
      {opacity:0, y:50},
      {opacity:1, y:0, duration:0.9, ease:'power3.out',
       scrollTrigger:{trigger:el, start:'top 88%', toggleActions:'play none none none'}}
    );
  });

  // Section titles slide in
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.fromTo(el,
      {x:-30, opacity:0},
      {x:0, opacity:1, duration:1, ease:'power2.out',
       scrollTrigger:{trigger:el, start:'top 85%', toggleActions:'play none none none'}}
    );
  });

  // Parallax blobs
  document.querySelectorAll('[data-speed]').forEach(el => {
    gsap.to(el, {
      yPercent: parseFloat(el.dataset.speed) * 100, ease:'none',
      scrollTrigger:{trigger:el.closest('section')||el.parentElement, start:'top bottom', end:'bottom top', scrub:true}
    });
  });

  // Hero stagger entrance after loader
  setTimeout(() => {
    gsap.from('.hero-left > *', {y:30, opacity:0, duration:0.8, stagger:0.12, ease:'power3.out'});
  }, 2000);

  // Horizontal scroll scrub
  const track = document.getElementById('h-track');
  if(track){
    const overflow = track.scrollWidth - track.parentElement.offsetWidth;
    if(overflow > 0){
      gsap.to(track, {x:-overflow, ease:'none',
        scrollTrigger:{trigger:track.parentElement, start:'top 80%', end:'+='+overflow, scrub:1}});
    }
  }

  // Mission word reveal
  const quote = document.querySelector('.mission blockquote');
  if(quote && !quote.dataset.split){
    quote.dataset.split = '1';
    const words = quote.textContent.split(' ');
    quote.innerHTML = words.map(w =>
      \`<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block">\${w}&nbsp;</span></span>\`
    ).join('');
    gsap.from('.mission blockquote span > span', {
      y:'110%', duration:0.6, stagger:0.04, ease:'power3.out',
      scrollTrigger:{trigger:quote, start:'top 80%'}
    });
  }
})();

// Nav clicks are bound in React (see Landing.jsx useEffect).


// \u2500\u2500 WORD SLIDESHOW: BUILD / SHIP / CONNECT \u2500\u2500
(function(){
  const el = document.getElementById('word-rotator');
  if (!el) return;
  const words = ['BUILD', 'SHIP', 'CONNECT'];
  let i = 0;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.innerHTML = '<span class="word-slide active">BUILD \u00b7 SHIP \u00b7 CONNECT</span>';
    return;
  }

  function show(idx){
    const current = el.querySelector('.word-slide');
    if (current) {
      current.classList.remove('active');
      current.classList.add('exit');
      setTimeout(() => current.remove(), 450);
    }
    const next = document.createElement('span');
    next.className = 'word-slide';
    next.textContent = words[idx];
    el.appendChild(next);
    // force reflow so the transition fires
    void next.offsetWidth;
    next.classList.add('active');
  }

  // Kick off after the first word has been visible a beat
  setTimeout(function cycle(){
    i = (i + 1) % words.length;
    show(i);
    setTimeout(cycle, 2200);
  }, 2200);
})();
`

export default function Landing() {
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const injected = useRef(false)

  // ── Navigation: bind in React, not in the injected script ──
  // (Injected scripts can race the paint; React refs cannot.)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onNavClick = (e) => {
      const el = e.target.closest('[data-nav]')
      if (!el || !root.contains(el)) return
      e.preventDefault()
      navigate(el.dataset.nav)
    }

    root.addEventListener('click', onNavClick)
    return () => root.removeEventListener('click', onNavClick)
  }, [navigate])

  // ── Inject the vanilla landing script AFTER first paint ──
  useEffect(() => {
    if (injected.current) return
    injected.current = true

    let raf1, raf2

    // Double rAF guarantees the browser has painted the innerHTML
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const tag = document.createElement('script')
        tag.id = 'shwooshii-landing-script'
        tag.textContent = LANDING_JS
        document.body.appendChild(tag)
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      const old = document.getElementById('shwooshii-landing-script')
      if (old) old.remove()
    }
  }, [])

  return (
    <>
      <style>{LANDING_CSS}</style>
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />
    </>
  )
}

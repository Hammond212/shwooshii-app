/* Shwooshii design tokens — single source of truth.
   Matches the landing page exactly. */

export const C = {
  // Brand
  orange:    '#FF6B35',
  orange2:   '#FF8C5A',
  orangeBg:  '#FFF1EC',
  teal:      '#00C9A7',
  tealBg:    '#E6FBF7',
  tealDark:  '#007D6A',
  lavender:  '#7C6FEA',
  lavBg:     '#F0EEFF',
  yellow:    '#FFD166',
  yellowBg:  '#FFF8E6',
  yellowDark:'#A07800',
  pink:      '#FF5FA2',
  pinkBg:    '#FFF0F6',

  // Neutrals
  ink:    '#0F0F1A',
  ink2:   '#3D3D5C',
  muted:  '#8888A8',
  border: '#E2E4EF',
  bg:     '#F7F8FC',
  white:  '#FFFFFF',

  // Shadows
  shadow:   '0 4px 24px rgba(15,15,26,0.08)',
  shadowLg: '0 12px 48px rgba(15,15,26,0.14)',
}

export const FONT = "'Plus Jakarta Sans', sans-serif"

/* Base stylesheet shared by every app page. */
export const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{
  background:${C.white};
  color:${C.ink};
  font-family:${FONT};
  font-size:16px;line-height:1.65;
  -webkit-font-smoothing:antialiased;
}
a{text-decoration:none;color:inherit}

/* ── Page shell ── */
.page{min-height:100vh;background:${C.white}}
.wrap{max-width:1080px;margin:0 auto;padding:2.5rem 1.5rem 5rem}

/* ── Eyebrow label ── */
.eyebrow{
  font-size:.7rem;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;display:flex;align-items:center;gap:.6rem;
  margin-bottom:.75rem;color:${C.orange};
}
.eyebrow::before{content:'';width:20px;height:2px;border-radius:1px;background:currentColor}
.eyebrow.teal{color:${C.teal}}
.eyebrow.lav{color:${C.lavender}}

/* ── Headings ── */
.h1{font-size:clamp(1.9rem,4vw,2.6rem);font-weight:800;letter-spacing:-.03em;line-height:1.12}
.h2{font-size:1.35rem;font-weight:800;letter-spacing:-.02em}
.h3{font-size:1rem;font-weight:700;letter-spacing:-.01em}
.sub{color:${C.ink2};font-size:.95rem;line-height:1.7}
.dim{color:${C.muted};font-size:.85rem}

/* ── Buttons ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:.45rem;
  padding:.7rem 1.5rem;border-radius:100px;border:none;cursor:pointer;
  font-family:${FONT};font-weight:700;font-size:.875rem;
  transition:all .2s;white-space:nowrap;
}
.btn-primary{
  background:${C.orange};color:#fff;
  box-shadow:0 4px 14px rgba(255,107,53,0.3);
}
.btn-primary:hover{
  background:${C.orange2};transform:translateY(-2px);
  box-shadow:0 8px 22px rgba(255,107,53,0.4);
}
.btn-ghost{
  background:${C.white};color:${C.ink2};
  border:1.5px solid ${C.border};
}
.btn-ghost:hover{border-color:${C.ink2};color:${C.ink}}
.btn-teal{
  background:${C.tealBg};color:${C.tealDark};
  border:1.5px solid rgba(0,201,167,0.3);
}
.btn-teal:hover{background:${C.teal};color:#fff;border-color:${C.teal}}
.btn-danger{
  background:${C.white};color:${C.pink};
  border:1.5px solid ${C.pinkBg};
}
.btn-danger:hover{background:${C.pinkBg};border-color:${C.pink}}
.btn-sm{padding:.5rem 1.1rem;font-size:.8rem}

/* ── Cards ── */
.card{
  background:${C.white};
  border:1px solid ${C.border};
  border-radius:16px;
  transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s;
}
.card-pad{padding:1.5rem}
.card-hover:hover{
  transform:translateY(-4px);
  box-shadow:${C.shadowLg};
  border-color:transparent;
}

/* ── Stat tiles ── */
.stat{
  background:${C.bg};border:1px solid ${C.border};
  border-radius:16px;padding:1.25rem 1.5rem;
}
.stat-n{font-size:1.9rem;font-weight:800;line-height:1;letter-spacing:-.02em}
.stat-l{font-size:.72rem;color:${C.muted};font-weight:600;letter-spacing:.08em;
  text-transform:uppercase;margin-top:.35rem}

/* ── Pills / badges ── */
.pill{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.25rem .75rem;border-radius:100px;
  font-size:.72rem;font-weight:700;letter-spacing:.03em;
}
.pill-o{background:${C.orangeBg};color:${C.orange}}
.pill-t{background:${C.tealBg};color:${C.tealDark}}
.pill-l{background:${C.lavBg};color:${C.lavender}}
.pill-y{background:${C.yellowBg};color:${C.yellowDark}}
.pill-p{background:${C.pinkBg};color:${C.pink}}
.pill-g{background:${C.bg};color:${C.muted};border:1px solid ${C.border}}

/* ── Avatar ── */
.av{
  border-radius:50%;flex-shrink:0;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  font-weight:800;color:#fff;
  background:linear-gradient(135deg,${C.orange},${C.pink});
}
.av img{width:100%;height:100%;object-fit:cover}
.av-t{background:linear-gradient(135deg,${C.teal},#00A88E)}
.av-l{background:linear-gradient(135deg,${C.lavender},#5A4FD4)}

/* ── Forms ── */
.fld{margin-bottom:1.1rem}
.fld label{
  display:block;font-size:.72rem;font-weight:700;
  color:${C.ink2};letter-spacing:.05em;text-transform:uppercase;
  margin-bottom:.45rem;
}
.fld input,.fld textarea,.fld select{
  width:100%;padding:.8rem 1rem;
  background:${C.white};
  border:1.5px solid ${C.border};
  border-radius:10px;
  font-family:${FONT};font-size:.9rem;color:${C.ink};
  outline:none;transition:border-color .2s,box-shadow .2s;
}
.fld textarea{resize:vertical;min-height:90px;line-height:1.6}
.fld input:focus,.fld textarea:focus,.fld select:focus{
  border-color:${C.orange};
  box-shadow:0 0 0 4px rgba(255,107,53,0.1);
}
.fld input::placeholder,.fld textarea::placeholder{color:#B8B8CC}
.fld select{cursor:pointer}
.hint{font-size:.72rem;color:${C.muted};margin-top:.35rem}

/* ── Selectable chip (skills / tech) ── */
.chip{
  padding:.4rem .9rem;border-radius:100px;
  border:1.5px solid ${C.border};background:${C.white};
  font-family:${FONT};font-size:.8rem;font-weight:600;
  color:${C.muted};cursor:pointer;transition:all .18s;
}
.chip:hover{border-color:${C.muted}}
.chip.on{border-color:${C.orange};background:${C.orangeBg};color:${C.orange}}

/* ── Alerts ── */
.alert{
  display:flex;align-items:flex-start;gap:.6rem;
  border-radius:10px;padding:.8rem 1rem;margin-bottom:1.25rem;
  font-size:.85rem;line-height:1.55;
}
.alert-err{background:${C.pinkBg};border:1px solid #FFD6E5;color:#D6336C}
.alert-ok{background:${C.tealBg};border:1px solid rgba(0,201,167,0.25);color:${C.tealDark}}

/* ── Empty state ── */
.empty{
  grid-column:1/-1;text-align:center;padding:4.5rem 2rem;
  background:${C.bg};border:1px dashed ${C.border};border-radius:20px;
}
.empty-icon{
  width:56px;height:56px;border-radius:16px;margin:0 auto 1.25rem;
  background:${C.orangeBg};color:${C.orange};
  display:flex;align-items:center;justify-content:center;
  font-size:1.5rem;font-weight:800;
}

/* ── Divider ── */
.rule{height:1px;background:${C.border};border:none;margin:2rem 0}

/* ── Grid ── */
.grid{display:grid;gap:1.25rem}
.grid-3{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.grid-stats{grid-template-columns:repeat(3,1fr)}

/* ── Skeleton ── */
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.skel{
  border-radius:16px;
  background:linear-gradient(90deg,${C.bg} 25%,#EEF0FA 50%,${C.bg} 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;
}

/* ── Entrance ── */
@keyframes riseIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.rise{animation:riseIn .55s cubic-bezier(.23,1,.32,1) both}

@media(max-width:700px){
  .grid-stats{grid-template-columns:1fr}
  .wrap{padding:2rem 1.25rem 4rem}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`

/* Deterministic colour for a tech tag */
const TAG_SETS = [
  ['pill-o'], ['pill-t'], ['pill-l'], ['pill-y'], ['pill-p'],
]
export const tagClass = (tag) =>
  TAG_SETS[(tag || 'x').charCodeAt(0) % TAG_SETS.length][0]

export const initials = (name) =>
  (name || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()

export const timeSince = (ts) => {
  if (!ts) return ''
  const d = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  if (d < 2592000) return `${Math.floor(d / 86400)}d ago`
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

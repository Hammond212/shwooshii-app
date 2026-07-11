import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from '../lib/supabase.js'
import { C, FONT } from '../lib/theme.js'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.snav{
  position:sticky;top:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 5%;height:68px;
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(16px);
  border-bottom:1px solid ${C.border};
  font-family:${FONT};
}
.snav-logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.1rem;color:${C.ink}}
.snav-mark{
  width:34px;height:34px;border-radius:10px;
  background:linear-gradient(135deg,${C.orange},${C.pink});
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-weight:800;font-size:.85rem;
  box-shadow:0 4px 12px rgba(255,107,53,0.35);
  transition:transform .6s cubic-bezier(.34,1.56,.64,1);
}
.snav-logo:hover .snav-mark{transform:rotate(360deg)}

.snav-links{display:flex;align-items:center;gap:.35rem}
.snav-link{
  display:flex;align-items:center;gap:.4rem;
  padding:.5rem 1rem;border-radius:100px;
  font-size:.875rem;font-weight:600;color:${C.muted};
  transition:all .2s;
}
.snav-link:hover{color:${C.ink};background:${C.bg}}
.snav-link.on{color:${C.orange};background:${C.orangeBg}}

.snav-right{display:flex;align-items:center;gap:.6rem}
.snav-new{
  padding:.55rem 1.25rem;border-radius:100px;
  background:${C.orange};color:#fff;
  font-weight:700;font-size:.85rem;
  box-shadow:0 4px 14px rgba(255,107,53,0.3);
  transition:all .2s;display:flex;align-items:center;gap:.35rem;
}
.snav-new:hover{
  background:${C.orange2};transform:translateY(-2px);
  box-shadow:0 8px 22px rgba(255,107,53,0.4);
}
.snav-icon{
  width:38px;height:38px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:transparent;border:1px solid transparent;
  color:${C.muted};cursor:pointer;transition:all .2s;
  font-family:${FONT};
}
.snav-icon:hover{background:${C.bg};border-color:${C.border};color:${C.ink}}

.snav-burger{display:none}

@media(max-width:820px){
  .snav{padding:0 1.25rem}
  .snav-links{
    position:absolute;top:68px;left:0;right:0;
    flex-direction:column;align-items:stretch;gap:0;
    background:${C.white};border-bottom:1px solid ${C.border};
    padding:.5rem;
    box-shadow:${C.shadow};
  }
  .snav-links:not(.open){display:none}
  .snav-link{border-radius:10px;padding:.75rem 1rem}
  .snav-burger{
    display:flex;align-items:center;justify-content:center;
    width:38px;height:38px;border-radius:10px;
    background:transparent;border:1px solid ${C.border};
    color:${C.ink};cursor:pointer;font-size:1.1rem;
  }
  .snav-new span{display:none}
}
`

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
)

const HomeIcon  = <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>
const CompassIc = <><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></>
const PlusIcon  = <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
const GearIcon  = <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>
const ExitIcon  = <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>

export default function Nav({ user, onLogout }) {
  const loc = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    onLogout()
    navigate('/')
  }

  const on = (p) => loc.pathname === p ? 'snav-link on' : 'snav-link'

  return (
    <nav className="snav">
      <style>{CSS}</style>

      <Link to="/home" className="snav-logo">
        <div className="snav-mark">S</div>
        Shwooshii
      </Link>

      <div className={`snav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <Link to="/home" className={on('/home')}>
          <Icon d={HomeIcon} /> Home
        </Link>
        <Link to="/discover" className={on('/discover')}>
          <Icon d={CompassIc} /> Discover
        </Link>
      </div>

      <div className="snav-right">
        <Link to="/project/new" className="snav-new" aria-label="New project">
          <Icon d={PlusIcon} /> <span>New project</span>
        </Link>
        <Link to="/settings" className="snav-icon" aria-label="Settings">
          <Icon d={GearIcon} />
        </Link>
        <button onClick={handleLogout} className="snav-icon" aria-label="Sign out">
          <Icon d={ExitIcon} />
        </button>
        <button
          className="snav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}

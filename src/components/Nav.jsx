import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Plus, Settings, LogOut, Menu, X } from 'lucide-react'
import { signOut } from '../lib/supabase'

export default function Nav({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    onLogout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    display: 'flex', alignItems: 'center', gap: '.4rem',
    padding: '.4rem .75rem', borderRadius: '6px',
    fontSize: '.85rem', fontWeight: 500,
    color: isActive(path) ? '#A78BFA' : '#9CA3AF',
    textDecoration: 'none',
    background: isActive(path) ? 'rgba(139,92,246,0.1)' : 'transparent',
    transition: 'all .2s',
    fontFamily: 'Space Grotesk, sans-serif',
  })

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2.5rem', height: 64,
      background: 'rgba(5,5,8,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139,92,246,0.12)',
    }}>
      {/* Glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.5),rgba(6,182,212,0.5),transparent)',
      }} />

      {/* Logo */}
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'linear-gradient(135deg,#6D28D9,#06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Orbitron,sans-serif', fontWeight: 900, fontSize: '.85rem',
          boxShadow: '0 0 15px rgba(139,92,246,0.4)',
        }}>S</div>
        <span style={{ fontFamily:'Orbitron,sans-serif', fontWeight:700, fontSize:'1rem', letterSpacing:'.05em', color:'#fff' }}>
          SHWOOSHII
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }} className="desktop-nav">
        <Link to="/" style={linkStyle('/')}><Home size={15}/> Home</Link>
        <Link to="/discover" style={linkStyle('/discover')}><Compass size={15}/> Discover</Link>
        <Link to="/project/new" style={{
          ...linkStyle('/project/new'),
          background: 'rgba(139,92,246,0.15)',
          color: '#A78BFA',
          border: '1px solid rgba(139,92,246,0.25)',
        }}><Plus size={15}/> New project</Link>
      </div>

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
        <Link to="/settings" style={{
          padding: '.4rem', borderRadius: '6px',
          color: '#9CA3AF', display:'flex', alignItems:'center',
          transition:'color .2s', textDecoration:'none',
        }}>
          <Settings size={18}/>
        </Link>
        <button onClick={handleLogout} style={{
          padding: '.4rem', borderRadius: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9CA3AF', display:'flex', alignItems:'center',
          transition:'color .2s',
        }}>
          <LogOut size={18}/>
        </button>
      </div>
    </nav>
  )
}

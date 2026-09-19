import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Nav({ user }) {
  const location = useLocation()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '?'
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const navLink = (to, label) => (
    <Link to={to} style={{
      color: location.pathname === to ? 'var(--purple-lite)' : 'var(--muted2)',
      textDecoration: 'none',
      fontSize: '.85rem',
      fontWeight: 600,
      transition: 'color .15s',
      letterSpacing: '.02em',
    }}>{label}</Link>
  )

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px',
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif", fontSize: '.6rem', fontWeight: 700, color: '#fff',
          }}>Sw</div>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '.9rem', fontWeight: 700, color: '#fff' }}>
            Shwooshii
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {navLink('/home', 'Home')}
        {navLink('/reader', 'Doc Reader')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.7rem', fontWeight: 700, boxShadow: '0 0 12px rgba(139,92,246,0.3)',
        }}>{initials}</div>
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6, padding: '5px 10px',
          color: 'var(--muted)', fontSize: '.75rem', cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'all .15s',
        }}>Sign out</button>
      </div>
    </nav>
  )
}


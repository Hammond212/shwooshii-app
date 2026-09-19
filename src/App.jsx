import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase, getUser } from './lib/supabase.js'
import Nav from './components/Nav.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DocReader from './pages/DocReader.jsx'

const NO_NAV = ['/auth']

function Shell({ user, setUser }) {
  const location = useLocation()
  const showNav = user && !NO_NAV.includes(location.pathname)

  return (
    <>
      {showNav && <Nav user={user} />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/home" replace /> : <Auth onAuth={() => getUser().then(setUser)} />}
          />
          {user ? (
            <>
              <Route path="/home" element={<Dashboard user={user} />} />
              <Route path="/reader" element={<DocReader />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth" replace />} />
          )}
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser().then(u => { setUser(u); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif", fontSize: '.9rem', fontWeight: 700, color: '#fff',
            animation: 'pulse 1.5s ease-in-out infinite', margin: '0 auto 1rem',
          }}>Sw</div>
          <p style={{ color: 'var(--muted)', fontSize: '.78rem', fontWeight: 600, letterSpacing: '.12em' }}>LOADING</p>
          <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.92)} }`}</style>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Shell user={user} setUser={setUser} />
    </Router>
  )
}

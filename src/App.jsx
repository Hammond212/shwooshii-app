import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase, getUser } from './lib/supabase.js'
import Nav from './components/Nav.jsx'
import Landing from './pages/Landing.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Discover from './pages/Discover.jsx'
import ProfileView from './pages/ProfileView.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'
import ProjectNew from './pages/ProjectNew.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'

// Routes where the app nav bar should be hidden
const NO_NAV = ['/', '/auth']

function Shell({ user, setUser }) {
  const location = useLocation()
  const showNav = user && !NO_NAV.includes(location.pathname)

  return (
    <>
      {showNav && <Nav user={user} onLogout={() => setUser(null)} />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          {/* Public — always available */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/auth"
            element={user ? <Navigate to="/home" replace /> : <Auth onAuth={() => getUser().then(setUser)} />}
          />

          {/* Protected */}
          {user ? (
            <>
              <Route path="/home" element={<Dashboard user={user} />} />
              <Route path="/discover" element={<Discover user={user} />} />
              <Route path="/profile/:username" element={<ProfileView user={user} />} />
              <Route path="/settings" element={<ProfileEdit user={user} />} />
              <Route path="/project/new" element={<ProjectNew user={user} />} />
              <Route path="/project/:id" element={<ProjectDetail user={user} />} />
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
        minHeight: '100vh', background: '#0A0A0F',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '2px solid rgba(255,107,53,0.15)',
            borderTop: '2px solid #FF6B35',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '.8rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '.1em',
          }}>LOADING</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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

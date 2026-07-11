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
        minHeight: '100vh', background: '#FFFFFF',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            border: '3px solid #FFF1EC',
            borderTop: '3px solid #FF6B35',
            animation: 'spin .9s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{
            color: '#8888A8', fontSize: '.78rem', fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '.12em',
          }}>LOADING</p>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
            @keyframes spin { to { transform: rotate(360deg) } }
          `}</style>
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

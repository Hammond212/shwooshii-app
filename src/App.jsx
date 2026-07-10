import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, getUser } from './lib/supabase'
import Nav from './components/Nav'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import ProfileView from './pages/ProfileView'
import ProfileEdit from './pages/ProfileEdit'
import ProjectNew from './pages/ProjectNew'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getUser().then(u => { setUser(u); setLoading(false) })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#050508' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{
            width:48, height:48, borderRadius:'50%',
            border:'2px solid rgba(139,92,246,0.2)',
            borderTop:'2px solid #8B5CF6',
            animation:'spin 1s linear infinite',
            margin:'0 auto 1rem'
          }} />
          <p style={{ color:'#6B7280', fontSize:'.85rem', fontFamily:'Space Grotesk,sans-serif' }}>Loading...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    )
  }

  return (
    <Router>
      {user && <Nav user={user} onLogout={() => setUser(null)} />}
      <div style={{ position:'relative', zIndex:1 }}>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<Auth onAuth={() => getUser().then(setUser)} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/discover" element={<Discover user={user} />} />
              <Route path="/profile/:username" element={<ProfileView user={user} />} />
              <Route path="/settings" element={<ProfileEdit user={user} />} />
              <Route path="/project/new" element={<ProjectNew user={user} />} />
              <Route path="/project/:id" element={<ProjectDetail user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  )
}

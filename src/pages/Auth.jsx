import React, { useState } from 'react'
import { signUp, signIn, createProfile } from '../lib/supabase.js'

const ORANGE = '#FF6B35'
const TEAL = '#00C9A7'
const DARK = '#0A0A0F'
const DARK2 = '#13131F'
const MUTED = 'rgba(255,255,255,0.35)'
const BORDER = 'rgba(255,255,255,0.08)'

const inp = {
  width: '100%',
  padding: '.85rem 1rem .85rem 2.8rem',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  color: '#fff',
  outline: 'none',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '.9rem',
  transition: 'border-color .2s, box-shadow .2s',
}

const Field = ({ icon, ...props }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '.9rem', pointerEvents: 'none' }}>{icon}</span>
    <input {...props} style={inp}
      onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.08)' }}
      onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = 'none' }}
    />
  </div>
)

export default function Auth({ onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('developer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const { data, error: err } = await signUp(email, password)
        if (err) throw err
        const { error: pErr } = await createProfile(data.user.id, {
          username: username.toLowerCase().replace(/\s/g, ''),
          full_name: fullName,
          role,
        })
        if (pErr) throw pErr
      } else {
        const { error: err } = await signIn(email, password)
        if (err) throw err
      }
      onAuth()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.22); font-family: 'Plus Jakarta Sans', sans-serif; }
        select option { background: #13131F; }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-40px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>

      {/* Blobs */}
      <div style={{ position: 'fixed', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(255,107,53,0.1) 0%,transparent 65%)', pointerEvents: 'none', animation: 'float1 18s ease-in-out infinite' }}/>
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(0,201,167,0.08) 0%,transparent 65%)', pointerEvents: 'none', animation: 'float2 22s ease-in-out infinite' }}/>

      {/* Marquee */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '10px 0', background: 'rgba(255,107,53,0.03)', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '3rem', width: 'max-content', animation: 'marquee 28s linear infinite' }}>
          {[...Array(3)].map((_, j) => ['BUILD','SHIP','CONNECT','SHWOOSHII','PROVE YOUR CRAFT','BOTSWANA & BEYOND'].map((item, i) => (
            <span key={`${j}-${i}`} style={{ fontWeight: 800, fontSize: '.62rem', letterSpacing: '.2em', color: i % 2 === 0 ? ORANGE : 'rgba(255,255,255,0.15)', whiteSpace: 'nowrap' }}>{item} <span style={{ color: TEAL }}>◆</span></span>
          )))}
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${ORANGE}, ${TEAL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: '#fff', margin: '0 auto 1rem', boxShadow: `0 0 24px rgba(255,107,53,0.35)` }}>S</div>
          <h1 style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '.08em', color: '#fff', margin: '0 0 .3rem 0' }}>SHWOOSHII</h1>
          <p style={{ color: MUTED, fontSize: '.85rem', margin: 0 }}>{isSignUp ? 'Create your builder profile' : 'Welcome back, builder'}</p>
        </div>

        {/* Form card */}
        <div style={{ background: DARK2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2rem', boxShadow: '0 0 60px rgba(0,0,0,0.4)' }}>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(255,95,162,0.08)', border: '1px solid rgba(255,95,162,0.2)', borderRadius: 10, padding: '.75rem 1rem', marginBottom: '1.25rem', color: '#FF5FA2', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
            {isSignUp && (
              <>
                <Field icon="@" type="text" placeholder="Username (no spaces)" value={username} onChange={e => setUsername(e.target.value)} required />
                <Field icon="✦" type="text" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inp, paddingLeft: '1rem', cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,107,53,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = 'none' }}>
                  <option value="developer">Developer</option>
                  <option value="founder">Founder</option>
                  <option value="designer">Designer</option>
                  <option value="mentor">Mentor</option>
                </select>
              </>
            )}
            <Field icon="✉" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
            <Field icon="⬡" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

            <button type="submit" disabled={loading} style={{ padding: '.9rem', background: `linear-gradient(135deg, ${ORANGE}, #FF8C5A)`, color: '#fff', border: 'none', borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '.95rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, boxShadow: '0 0 24px rgba(255,107,53,0.3)', letterSpacing: '.03em', transition: 'all .2s', marginTop: '.25rem' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 36px rgba(255,107,53,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(255,107,53,0.3)' }}>
              {loading ? 'Loading...' : isSignUp ? 'Create account →' : 'Sign in →'}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.82rem', color: MUTED }}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, fontWeight: 700, fontSize: '.82rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </div>

        {/* Tagline */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '.72rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '.1em' }}>
          BUILD · SHIP · CONNECT
        </p>
      </div>
    </div>
  )
}

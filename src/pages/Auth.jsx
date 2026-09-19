import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Auth({ onAuth }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else onAuth()
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSuccess('Check your email to confirm your account!')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--bg2)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '40px 32px',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--purple), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff',
          }}>Sw</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Shwooshii</h1>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--bg3)', borderRadius: 10, padding: 4, marginBottom: 28, gap: 4,
        }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }} style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: 8,
              background: tab === t ? 'var(--purple)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted)',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '.85rem', fontWeight: 500, cursor: 'pointer',
            }}>{t === 'login' ? 'Sign in' : 'Sign up'}</button>
          ))}
        </div>

        {error && <div style={{
          background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
          borderRadius: 8, padding: '10px 14px', fontSize: '.82rem', color: '#F87171', marginBottom: 16,
        }}>{error}</div>}

        {success && <div style={{
          background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
          borderRadius: 8, padding: '10px 14px', fontSize: '.82rem', color: '#34D399', marginBottom: 16,
        }}>{success}</div>}

        <form onSubmit={tab === 'login' ? handleLogin : handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'signup' && (
            <div>
              <label style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}
          <div>
            <label style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
          Your AI-powered study companion.<br />Upload slides. Listen. Learn.
        </p>
      </div>
    </div>
  )
}

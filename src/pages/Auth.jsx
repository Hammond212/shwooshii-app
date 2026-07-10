import React, { useState } from 'react'
import { signUp, signIn, createProfile } from '../lib/supabase'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'

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
          username: username.toLowerCase().replace(/\s/g,''),
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

  const field = (icon, placeholder, value, setValue, type='text') => (
    <div style={{ position:'relative' }}>
      <div style={{
        position:'absolute', left:'.875rem', top:'50%', transform:'translateY(-50%)',
        color:'#6B7280', display:'flex', alignItems:'center', pointerEvents:'none',
      }}>{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        required
        style={{ paddingLeft:'2.75rem' }}
      />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)',
    }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{
            width:56, height:56, borderRadius:14,
            background:'linear-gradient(135deg,#6D28D9,#06B6D4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Orbitron,sans-serif', fontWeight:900, fontSize:'1.3rem',
            boxShadow:'0 0 30px rgba(139,92,246,0.4)',
            margin:'0 auto 1rem',
          }}>S</div>
          <h1 style={{
            fontFamily:'Orbitron,sans-serif', fontSize:'1.4rem', fontWeight:700,
            letterSpacing:'.05em', color:'#fff', marginBottom:'.35rem',
          }}>SHWOOSHII</h1>
          <p style={{ color:'#6B7280', fontSize:'.85rem' }}>
            {isSignUp ? 'Create your builder profile' : 'Welcome back, builder'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background:'rgba(8,8,15,0.9)',
          border:'1px solid rgba(139,92,246,0.2)',
          borderRadius:16,
          padding:'2rem',
          backdropFilter:'blur(20px)',
          boxShadow:'0 0 40px rgba(139,92,246,0.08)',
        }}>
          {error && (
            <div style={{
              display:'flex', alignItems:'center', gap:'.5rem',
              background:'rgba(236,72,153,0.08)',
              border:'1px solid rgba(236,72,153,0.2)',
              borderRadius:8, padding:'.75rem 1rem', marginBottom:'1.25rem',
              color:'#F472B6', fontSize:'.82rem',
            }}>
              <AlertCircle size={14}/>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {isSignUp && (
              <>
                {field(<User size={16}/>, 'Username (no spaces)', username, setUsername)}
                {field(<User size={16}/>, 'Full name', fullName, setFullName)}
                <select value={role} onChange={e=>setRole(e.target.value)}>
                  <option value="developer">Developer</option>
                  <option value="founder">Founder</option>
                  <option value="designer">Designer</option>
                  <option value="mentor">Mentor</option>
                </select>
              </>
            )}
            {field(<Mail size={16}/>, 'Email address', email, setEmail, 'email')}
            {field(<Lock size={16}/>, 'Password', password, setPassword, 'password')}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{
              width:'100%', marginTop:'.5rem', opacity: loading ? .6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
            <p style={{ color:'#6B7280', fontSize:'.82rem' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => { setIsSignUp(!isSignUp); setError('') }} style={{
                background:'none', border:'none', cursor:'pointer',
                color:'#A78BFA', fontWeight:600, fontSize:'.82rem',
                fontFamily:'Space Grotesk,sans-serif',
              }}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

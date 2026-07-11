import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { signUp, signIn, createProfile } from '../lib/supabase.js'

/* ── Design tokens (match landing page) ── */
const C = {
  orange:   '#FF6B35',
  orange2:  '#FF8C5A',
  orangeBg: '#FFF1EC',
  teal:     '#00C9A7',
  tealBg:   '#E6FBF7',
  ink:      '#0F0F1A',
  ink2:     '#3D3D5C',
  muted:    '#8888A8',
  bg:       '#F7F8FC',
  white:    '#FFFFFF',
  border:   '#E2E4EF',
  pink:     '#FF5FA2',
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  .auth-root{
    min-height:100vh;
    font-family:'Plus Jakarta Sans',sans-serif;
    background:${C.white};
    color:${C.ink};
    display:grid;
    grid-template-columns:1fr 1fr;
  }
  /* ── LEFT: brand panel ── */
  .auth-brand{
    position:relative;
    background:${C.bg};
    border-right:1px solid ${C.border};
    padding:3rem;
    display:flex;flex-direction:column;justify-content:space-between;
    overflow:hidden;
  }
  .blob-a{
    position:absolute;top:-140px;right:-120px;
    width:480px;height:480px;border-radius:50%;
    background:radial-gradient(ellipse,rgba(255,107,53,0.14) 0%,transparent 65%);
    pointer-events:none;animation:driftA 20s ease-in-out infinite;
  }
  .blob-b{
    position:absolute;bottom:-120px;left:-100px;
    width:380px;height:380px;border-radius:50%;
    background:radial-gradient(ellipse,rgba(0,201,167,0.12) 0%,transparent 65%);
    pointer-events:none;animation:driftB 24s ease-in-out infinite 2s;
  }
  @keyframes driftA{0%,100%{transform:translate(0,0)}50%{transform:translate(-40px,36px)}}
  @keyframes driftB{0%,100%{transform:translate(0,0)}50%{transform:translate(50px,-40px)}}

  .brand-logo{
    display:flex;align-items:center;gap:10px;
    font-weight:800;font-size:1.15rem;color:${C.ink};
    text-decoration:none;position:relative;z-index:1;
    width:fit-content;
  }
  .brand-mark{
    width:36px;height:36px;border-radius:10px;
    background:linear-gradient(135deg,${C.orange},${C.pink});
    display:flex;align-items:center;justify-content:center;
    color:#fff;font-weight:800;font-size:.9rem;
    box-shadow:0 4px 12px rgba(255,107,53,0.35);
    transition:transform .6s cubic-bezier(.34,1.56,.64,1);
  }
  .brand-logo:hover .brand-mark{transform:rotate(360deg)}

  .brand-body{position:relative;z-index:1;max-width:400px}
  .brand-body h2{
    font-size:2.4rem;font-weight:800;letter-spacing:-.03em;
    line-height:1.15;margin-bottom:1rem;
  }
  .brand-body h2 .accent{color:${C.orange}}
  .brand-body p{color:${C.ink2};font-size:.95rem;line-height:1.7}

  .brand-points{
    position:relative;z-index:1;
    display:flex;flex-direction:column;gap:.9rem;
    margin-top:2rem;
  }
  .bp{display:flex;align-items:flex-start;gap:.75rem;font-size:.875rem;color:${C.ink2}}
  .bp-dot{
    width:22px;height:22px;border-radius:7px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    font-size:.68rem;font-weight:800;margin-top:1px;
  }
  .bp-o{background:${C.orangeBg};color:${C.orange}}
  .bp-t{background:${C.tealBg};color:#007D6A}

  .brand-foot{
    position:relative;z-index:1;
    display:flex;gap:2rem;flex-wrap:wrap;
  }
  .bstat-n{font-size:1.5rem;font-weight:800;line-height:1}
  .bstat-l{font-size:.7rem;color:${C.muted};font-weight:500;margin-top:.2rem;letter-spacing:.04em}

  /* ── RIGHT: form panel ── */
  .auth-form-wrap{
    display:flex;align-items:center;justify-content:center;
    padding:3rem 2rem;
  }
  .auth-card{width:100%;max-width:400px}

  .form-head{margin-bottom:2rem}
  .form-head h1{
    font-size:1.9rem;font-weight:800;letter-spacing:-.02em;
    margin-bottom:.4rem;
  }
  .form-head p{color:${C.muted};font-size:.9rem}

  .tab-switch{
    display:flex;background:${C.bg};border:1px solid ${C.border};
    border-radius:100px;padding:4px;margin-bottom:1.75rem;
  }
  .tab-btn{
    flex:1;padding:.55rem;border:none;border-radius:100px;
    background:transparent;cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-weight:700;font-size:.85rem;color:${C.muted};
    transition:all .25s;
  }
  .tab-btn.on{
    background:${C.white};color:${C.ink};
    box-shadow:0 2px 8px rgba(15,15,26,0.08);
  }

  .fld{margin-bottom:1rem}
  .fld label{
    display:block;font-size:.72rem;font-weight:700;
    color:${C.ink2};letter-spacing:.05em;text-transform:uppercase;
    margin-bottom:.45rem;
  }
  .fld input,.fld select{
    width:100%;padding:.8rem 1rem;
    background:${C.white};
    border:1.5px solid ${C.border};
    border-radius:10px;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.9rem;color:${C.ink};
    outline:none;transition:border-color .2s, box-shadow .2s;
  }
  .fld input:focus,.fld select:focus{
    border-color:${C.orange};
    box-shadow:0 0 0 4px rgba(255,107,53,0.1);
  }
  .fld input::placeholder{color:#B8B8CC}
  .fld select{cursor:pointer}
  .fld-hint{font-size:.72rem;color:${C.muted};margin-top:.35rem}

  .roles{display:flex;gap:.5rem;flex-wrap:wrap}
  .role-pill{
    padding:.5rem 1rem;border-radius:100px;
    border:1.5px solid ${C.border};background:${C.white};
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:.82rem;font-weight:600;color:${C.muted};
    cursor:pointer;transition:all .18s;
  }
  .role-pill:hover{border-color:${C.muted}}
  .role-pill.on{
    border-color:${C.orange};background:${C.orangeBg};color:${C.orange};
  }

  .submit{
    width:100%;padding:.9rem;margin-top:.5rem;
    background:${C.orange};color:#fff;border:none;border-radius:100px;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-weight:700;font-size:.95rem;cursor:pointer;
    box-shadow:0 4px 16px rgba(255,107,53,0.35);
    transition:all .2s;
  }
  .submit:hover:not(:disabled){
    background:${C.orange2};transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(255,107,53,0.45);
  }
  .submit:disabled{opacity:.6;cursor:not-allowed}

  .err{
    display:flex;align-items:flex-start;gap:.6rem;
    background:#FFF0F5;border:1px solid #FFD6E5;
    border-radius:10px;padding:.75rem .9rem;margin-bottom:1.25rem;
    color:#D6336C;font-size:.82rem;line-height:1.5;
  }

  .foot-note{
    text-align:center;margin-top:1.5rem;
    font-size:.82rem;color:${C.muted};
  }
  .foot-note button{
    background:none;border:none;cursor:pointer;
    color:${C.orange};font-weight:700;font-size:.82rem;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .back-link{
    display:inline-flex;align-items:center;gap:.35rem;
    color:${C.muted};font-size:.82rem;font-weight:500;
    text-decoration:none;margin-bottom:1.5rem;
    transition:color .2s;
  }
  .back-link:hover{color:${C.orange}}

  @media(max-width:900px){
    .auth-root{grid-template-columns:1fr}
    .auth-brand{display:none}
    .auth-form-wrap{padding:2rem 1.5rem;min-height:100vh}
  }
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`

const ROLES = ['developer', 'founder', 'designer', 'mentor']

export default function Auth({ onAuth }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp] = useState(params.get('mode') === 'signup')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole]         = useState('developer')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    setIsSignUp(params.get('mode') === 'signup')
  }, [params])

  const switchMode = (signup) => {
    setIsSignUp(signup)
    setError('')
    navigate(signup ? '/auth?mode=signup' : '/auth', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
        if (clean.length < 3) throw new Error('Username must be at least 3 characters (letters, numbers, underscore).')
        const { data, error: err } = await signUp(email, password)
        if (err) throw err
        const { error: pErr } = await createProfile(data.user.id, {
          username: clean,
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
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <style>{CSS}</style>

      {/* ── LEFT: brand ── */}
      <aside className="auth-brand">
        <div className="blob-a" aria-hidden="true" />
        <div className="blob-b" aria-hidden="true" />

        <Link to="/" className="brand-logo">
          <div className="brand-mark">S</div>
          Shwooshii
        </Link>

        <div className="brand-body">
          <h2>
            Your work is<br />
            your <span className="accent">résumé.</span>
          </h2>
          <p>
            Shwooshii is where developers, founders and problem-solvers prove
            what they can build — and find the people to build it with.
          </p>

          <div className="brand-points">
            <div className="bp">
              <div className="bp-dot bp-o">✓</div>
              <span>Showcase projects with the problem you actually solved</span>
            </div>
            <div className="bp">
              <div className="bp-dot bp-t">✓</div>
              <span>Build a verified Trust Score through real contribution</span>
            </div>
            <div className="bp">
              <div className="bp-dot bp-o">✓</div>
              <span>Find a co-founder, a mentor, or your next collaborator</span>
            </div>
          </div>
        </div>

        <div className="brand-foot">
          <div>
            <div className="bstat-n" style={{ color: C.orange }}>182+</div>
            <div className="bstat-l">Developers</div>
          </div>
          <div>
            <div className="bstat-n" style={{ color: C.teal }}>40+</div>
            <div className="bstat-l">Projects live</div>
          </div>
          <div>
            <div className="bstat-n" style={{ color: '#7C6FEA' }}>5</div>
            <div className="bstat-l">Universities</div>
          </div>
        </div>
      </aside>

      {/* ── RIGHT: form ── */}
      <main className="auth-form-wrap">
        <div className="auth-card">
          <Link to="/" className="back-link">← Back to home</Link>

          <div className="form-head">
            <h1>{isSignUp ? 'Create your profile' : 'Welcome back'}</h1>
            <p>{isSignUp
              ? 'Join the builders proving their craft.'
              : 'Sign in to your Shwooshii account.'}</p>
          </div>

          {/* Tab switch */}
          <div className="tab-switch" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              className={`tab-btn ${!isSignUp ? 'on' : ''}`}
              onClick={() => switchMode(false)}
            >Sign in</button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              className={`tab-btn ${isSignUp ? 'on' : ''}`}
              onClick={() => switchMode(true)}
            >Sign up</button>
          </div>

          {error && (
            <div className="err" role="alert">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div className="fld">
                  <label htmlFor="au-name">Full name</label>
                  <input
                    id="au-name"
                    type="text"
                    placeholder="Kgosi Batlang"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="fld">
                  <label htmlFor="au-user">Username</label>
                  <input
                    id="au-user"
                    type="text"
                    placeholder="kgosi"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                  <div className="fld-hint">
                    Your profile will live at shwooshii.com/{username.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'username'}
                  </div>
                </div>

                <div className="fld">
                  <label>I am a…</label>
                  <div className="roles">
                    {ROLES.map(r => (
                      <button
                        key={r}
                        type="button"
                        className={`role-pill ${role === r ? 'on' : ''}`}
                        onClick={() => setRole(r)}
                        aria-pressed={role === r}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="fld">
              <label htmlFor="au-email">Email</label>
              <input
                id="au-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="fld">
              <label htmlFor="au-pass">Password</label>
              <input
                id="au-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
              {isSignUp && <div className="fld-hint">At least 6 characters.</div>}
            </div>

            <button type="submit" className="submit" disabled={loading}>
              {loading
                ? 'Just a second…'
                : isSignUp ? 'Create my profile →' : 'Sign in →'}
            </button>
          </form>

          <div className="foot-note">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button" onClick={() => switchMode(!isSignUp)}>
              {isSignUp ? 'Sign in' : 'Sign up free'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

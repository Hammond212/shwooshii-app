import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createProject } from '../lib/supabase.js'
import { C, BASE_CSS } from '../lib/theme.js'

const CSS = BASE_CSS + `
.pn-wrap{max-width:680px;margin:0 auto;padding:2.5rem 1.5rem 5rem}
.pn-back{
  display:inline-flex;align-items:center;gap:.35rem;
  color:${C.muted};font-size:.82rem;font-weight:600;
  margin-bottom:1.5rem;transition:color .2s;
}
.pn-back:hover{color:${C.orange}}
.pn-sec{
  background:${C.white};border:1px solid ${C.border};
  border-radius:18px;padding:1.75rem;margin-bottom:1.25rem;
}
.pn-sec-h{
  font-size:.95rem;font-weight:800;color:${C.ink};
  margin-bottom:1.25rem;padding-bottom:.85rem;
  border-bottom:1px solid ${C.border};
  display:flex;align-items:center;gap:.5rem;
}
.pn-sec-n{
  width:22px;height:22px;border-radius:7px;
  background:${C.orangeBg};color:${C.orange};
  display:flex;align-items:center;justify-content:center;
  font-size:.7rem;font-weight:800;
}
.pn-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem}
.pn-custom{display:flex;gap:.5rem}
.pn-custom input{flex:1}
.pn-picked{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.85rem}
.pn-tag{
  display:inline-flex;align-items:center;gap:.35rem;
  padding:.25rem .7rem;border-radius:100px;
  background:${C.orangeBg};color:${C.orange};
  border:1px solid rgba(255,107,53,0.25);
  font-size:.75rem;font-weight:700;
}
.pn-tag button{
  background:none;border:none;cursor:pointer;color:${C.orange};
  padding:0;display:flex;align-items:center;font-size:.7rem;
}
.pn-submit{width:100%;padding:.95rem;font-size:.95rem}
`

const TECH = ['React','Vue','Next.js','Node.js','Python','TypeScript','Supabase',
  'PostgreSQL','Tailwind CSS','MongoDB','Firebase','Docker','AWS','GraphQL',
  'Flutter','React Native','Go','Rust']

export default function ProjectNew({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', problem_solved: '', description: '',
    github_url: '', live_url: '', image_url: '',
  })
  const [techs, setTechs]   = useState([])
  const [custom, setCustom] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggle = (t) =>
    setTechs(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const addCustom = () => {
    const t = custom.trim()
    if (t && !techs.includes(t)) setTechs(prev => [...prev, t])
    setCustom('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Give your project a title.'); return }
    setSaving(true)
    setError('')
    try {
      const { data, error: err } = await createProject(user.id, {
        ...form, technologies: techs,
      })
      if (err) throw err
      navigate(data?.[0]?.id ? `/project/${data[0].id}` : '/home')
    } catch (err) {
      setError(err.message || 'Could not publish. Try again.')
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="pn-wrap">

        <Link to="/home" className="pn-back">← Back</Link>

        <header style={{ marginBottom: '2rem' }} className="rise">
          <div className="eyebrow">New project</div>
          <h1 className="h1" style={{ marginBottom: '.5rem' }}>Share what you built</h1>
          <p className="sub">
            The problem you solved matters more than the tech you used. Lead with that.
          </p>
        </header>

        {error && (
          <div className="alert alert-err" role="alert">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          {/* 1. Details */}
          <section className="pn-sec rise" style={{ animationDelay: '.05s' }}>
            <div className="pn-sec-h">
              <span className="pn-sec-n">1</span> Project details
            </div>

            <div className="fld">
              <label htmlFor="pn-title">Project title *</label>
              <input
                id="pn-title"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Uniplace"
                required
              />
            </div>

            <div className="fld">
              <label htmlFor="pn-prob">Problem solved</label>
              <textarea
                id="pn-prob"
                value={form.problem_solved}
                onChange={e => set('problem_solved', e.target.value)}
                placeholder="Students in Botswana had no safe way to buy and sell on campus…"
              />
              <div className="hint">
                This is the most important field. What was broken before you built this?
              </div>
            </div>

            <div className="fld" style={{ marginBottom: 0 }}>
              <label htmlFor="pn-desc">Description</label>
              <textarea
                id="pn-desc"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="A short overview of what you built and how it works…"
                style={{ minHeight: 76 }}
              />
            </div>
          </section>

          {/* 2. Stack */}
          <section className="pn-sec rise" style={{ animationDelay: '.1s' }}>
            <div className="pn-sec-h">
              <span className="pn-sec-n">2</span> Tech stack
            </div>

            <div className="pn-chips">
              {TECH.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${techs.includes(t) ? 'on' : ''}`}
                  onClick={() => toggle(t)}
                  aria-pressed={techs.includes(t)}
                >
                  {techs.includes(t) ? '✓ ' : ''}{t}
                </button>
              ))}
            </div>

            <div className="pn-custom">
              <input
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); addCustom() }
                }}
                placeholder="Something else? Add it…"
                aria-label="Add custom technology"
                style={{
                  padding: '.8rem 1rem',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '.9rem',
                  outline: 'none',
                }}
              />
              <button type="button" onClick={addCustom} className="btn btn-teal btn-sm">
                Add
              </button>
            </div>

            {techs.length > 0 && (
              <div className="pn-picked">
                {techs.map(t => (
                  <span key={t} className="pn-tag">
                    {t}
                    <button
                      type="button"
                      onClick={() => setTechs(prev => prev.filter(x => x !== t))}
                      aria-label={`Remove ${t}`}
                    >✕</button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* 3. Links */}
          <section className="pn-sec rise" style={{ animationDelay: '.15s' }}>
            <div className="pn-sec-h">
              <span className="pn-sec-n">3</span> Links &amp; media
            </div>

            <div className="fld">
              <label htmlFor="pn-live">Live URL</label>
              <input
                id="pn-live"
                type="url"
                value={form.live_url}
                onChange={e => set('live_url', e.target.value)}
                placeholder="https://uniplace.co.bw"
              />
              <div className="hint">A working link is the strongest proof you can give.</div>
            </div>

            <div className="fld">
              <label htmlFor="pn-gh">GitHub repo</label>
              <input
                id="pn-gh"
                type="url"
                value={form.github_url}
                onChange={e => set('github_url', e.target.value)}
                placeholder="https://github.com/you/project"
              />
            </div>

            <div className="fld" style={{ marginBottom: 0 }}>
              <label htmlFor="pn-img">Cover image URL</label>
              <input
                id="pn-img"
                type="url"
                value={form.image_url}
                onChange={e => set('image_url', e.target.value)}
                placeholder="https://…"
              />
              <div className="hint">Optional. A screenshot works well.</div>
            </div>
          </section>

          <button
            type="submit"
            className="btn btn-primary pn-submit"
            disabled={saving}
          >
            {saving ? 'Publishing…' : 'Publish project →'}
          </button>
        </form>
      </div>
    </div>
  )
}

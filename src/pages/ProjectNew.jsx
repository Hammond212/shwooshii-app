import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../lib/supabase.js'

const ORANGE = '#FF6B35'
const TEAL = '#00C9A7'
const DARK = '#0A0A0F'
const DARK2 = '#13131F'
const BORDER = 'rgba(255,255,255,0.08)'
const MUTED = 'rgba(255,255,255,0.35)'

const TECH_OPTIONS = ['React','Vue','Next.js','Node.js','Python','TypeScript','Supabase',
  'PostgreSQL','Tailwind CSS','MongoDB','Firebase','Docker','AWS','GraphQL','Flutter','React Native','Go','Rust']

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  input::placeholder,textarea::placeholder { color: rgba(255,255,255,0.22); font-family: 'Plus Jakarta Sans', sans-serif; }
  textarea { resize: vertical; }
`

const inp = {
  width: '100%', padding: '.8rem 1rem',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${BORDER}`, borderRadius: 10,
  color: '#fff', outline: 'none',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '.875rem', transition: 'border-color .2s, box-shadow .2s',
}

const onFocus = e => { e.target.style.borderColor = 'rgba(255,107,53,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.08)' }
const onBlur  = e => { e.target.style.borderColor = BORDER; e.target.style.boxShadow = 'none' }

const Label = ({ children }) => (
  <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.5rem' }}>
    {children}
  </div>
)

const Section = ({ title, children }) => (
  <div style={{ background: DARK2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '1.75rem', marginBottom: '1.25rem' }}>
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#fff', marginBottom: '1.25rem', paddingBottom: '.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {title}
    </div>
    {children}
  </div>
)

export default function ProjectNew({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', problem_solved: '', github_url: '', live_url: '', image_url: '' })
  const [technologies, setTechnologies] = useState([])
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleTech = (t) => {
    setTechnologies(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const addCustomTech = () => {
    const t = techInput.trim()
    if (t && !technologies.includes(t)) setTechnologies(prev => [...prev, t])
    setTechInput('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Project title is required'); return }
    setSaving(true)
    setError('')
    try {
      const { data, error: err } = await createProject(user.id, { ...form, technologies })
      if (err) throw err
      // Navigate to dashboard after success
      if (data && data[0] && data[0].id) {
        navigate(`/project/${data[0].id}`)
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError(err.message || 'Failed to create project')
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: DARK, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{css}</style>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, color: ORANGE, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '.75rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ width: 16, height: 1, background: ORANGE, display: 'inline-block' }}/>
            Projects
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '2rem', fontWeight: 900, letterSpacing: '-.03em', margin: '0 0 .5rem 0' }}>Share a project</h1>
          <p style={{ color: MUTED, fontSize: '.875rem', margin: 0 }}>Show the community what you built — and the problem you solved.</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,95,162,0.08)', border: '1px solid rgba(255,95,162,0.2)', borderRadius: 10, padding: '.75rem 1rem', marginBottom: '1.25rem', color: '#FF5FA2', fontSize: '.82rem' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Project basics */}
          <Section title="Project details">
            <div style={{ marginBottom: '1rem' }}>
              <Label>Project title *</Label>
              <input style={inp} placeholder="e.g. Student Marketplace" value={form.title} onChange={e => set('title', e.target.value)} onFocus={onFocus} onBlur={onBlur} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Label>Problem solved</Label>
              <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.25)', marginBottom: '.4rem' }}>What real-world problem does this solve? Most important field.</div>
              <textarea style={{ ...inp, minHeight: 90 }} placeholder="e.g. Students had no safe way to buy/sell items on campus..." value={form.problem_solved} onChange={e => set('problem_solved', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <Label>Description</Label>
              <textarea style={{ ...inp, minHeight: 80 }} placeholder="A short overview of what you built..." value={form.description} onChange={e => set('description', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </Section>

          {/* Tech stack */}
          <Section title="Tech stack">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '1rem' }}>
              {TECH_OPTIONS.map(t => (
                <button key={t} type="button" onClick={() => toggleTech(t)} style={{
                  padding: '.28rem .8rem', borderRadius: 100,
                  border: technologies.includes(t) ? '1px solid rgba(255,107,53,0.5)' : `1px solid ${BORDER}`,
                  background: technologies.includes(t) ? 'rgba(255,107,53,0.12)' : 'transparent',
                  color: technologies.includes(t) ? ORANGE : MUTED,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
                }}>
                  {technologies.includes(t) ? '✓ ' : ''}{t}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <input style={{ ...inp, flex: 1 }} placeholder="Add custom tech..." value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onFocus={onFocus} onBlur={onBlur}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech() } }} />
              <button type="button" onClick={addCustomTech} style={{ padding: '.8rem 1.25rem', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)', color: ORANGE, borderRadius: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '.82rem', cursor: 'pointer' }}>Add</button>
            </div>
            {technologies.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem', marginTop: '.75rem' }}>
                {technologies.map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', padding: '.22rem .7rem', borderRadius: 100, background: 'rgba(255,107,53,0.12)', color: ORANGE, border: '1px solid rgba(255,107,53,0.25)', fontSize: '.72rem', fontWeight: 600 }}>
                    {t}
                    <button type="button" onClick={() => setTechnologies(prev => prev.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, padding: 0, fontSize: '.7rem', lineHeight: 1, display: 'flex', alignItems: 'center' }}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* Links */}
          <Section title="Links & media">
            <div style={{ marginBottom: '1rem' }}>
              <Label>GitHub repo</Label>
              <input style={inp} placeholder="https://github.com/..." value={form.github_url} onChange={e => set('github_url', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Label>Live URL</Label>
              <input style={inp} placeholder="https://..." value={form.live_url} onChange={e => set('live_url', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <Label>Cover image URL</Label>
              <input style={inp} placeholder="https://... (Cloudinary, Imgur, etc.)" value={form.image_url} onChange={e => set('image_url', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </Section>

          {/* Submit */}
          <button type="submit" disabled={saving} style={{ width: '100%', padding: '1rem', background: `linear-gradient(135deg, ${ORANGE}, #FF8C5A)`, color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1, boxShadow: '0 0 24px rgba(255,107,53,0.3)', letterSpacing: '.02em', transition: 'all .2s' }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.boxShadow = '0 0 36px rgba(255,107,53,0.5)' }}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,107,53,0.3)'}>
            {saving ? 'Publishing...' : '↑ Publish project'}
          </button>
        </form>
      </div>
    </div>
  )
}

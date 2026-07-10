import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProject } from '../lib/supabase'
import { Plus, X, Rocket } from 'lucide-react'

const Field = ({ label, hint, ...props }) => (
  <div style={{ marginBottom:'1.25rem' }}>
    <label style={{ display:'block', fontSize:'.75rem', fontWeight:600,
      color:'#6B7280', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'.4rem' }}>
      {label}
    </label>
    {hint && <p style={{ fontSize:'.75rem', color:'#6B7280', marginBottom:'.5rem' }}>{hint}</p>}
    {props.textarea
      ? <textarea rows={props.rows||3} placeholder={props.placeholder} value={props.value} onChange={props.onChange} style={{ resize:'vertical' }}/>
      : <input type={props.type||'text'} placeholder={props.placeholder} value={props.value} onChange={props.onChange}/>
    }
  </div>
)

const TECH_OPTIONS = ['React','Vue','Next.js','Node.js','Python','TypeScript','Supabase','PostgreSQL',
  'Tailwind CSS','MongoDB','Firebase','Docker','AWS','GraphQL','REST API','Flutter','React Native']

export default function ProjectNew({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title:'', description:'', problem_solved:'',
    github_url:'', live_url:'', image_url:'',
  })
  const [technologies, setTechnologies] = useState([])
  const [techInput, setTechInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addTech = (t) => {
    const trimmed = t.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies(prev => [...prev, trimmed])
    }
    setTechInput('')
  }

  const removeTech = (t) => setTechnologies(prev => prev.filter(x => x !== t))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Project title is required'); return }
    setSaving(true)
    setError('')
    const { data, error: err } = await createProject(user.id, { ...form, technologies })
    if (err) { setError(err.message); setSaving(false); return }
    navigate(`/project/${data[0].id}`)
  }

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'3rem 2rem' }}>
      <div style={{ marginBottom:'2rem' }}>
        <div className="s-label">Projects</div>
        <h1 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.5rem', fontWeight:700 }}>Share a project</h1>
        <p style={{ color:'#6B7280', fontSize:'.875rem', marginTop:'.5rem' }}>
          Show the community what you built — and the problem you solved.
        </p>
      </div>

      {error && (
        <div style={{
          background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.2)',
          borderRadius:8, padding:'.75rem 1rem', marginBottom:'1.5rem',
          color:'#F472B6', fontSize:'.82rem',
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          background:'#08080F', border:'1px solid rgba(139,92,246,0.12)',
          borderRadius:14, padding:'2rem', marginBottom:'1.5rem',
        }}>
          <Field label="Project title *" placeholder="e.g. Student Marketplace" value={form.title} onChange={e=>set('title',e.target.value)}/>
          <Field label="Problem solved" hint="What real-world problem does this solve? This is the most important field."
            placeholder="e.g. Students had no safe way to buy/sell items on campus..." value={form.problem_solved} onChange={e=>set('problem_solved',e.target.value)} textarea rows={3}/>
          <Field label="Description" placeholder="A short overview of what you built..." value={form.description} onChange={e=>set('description',e.target.value)} textarea rows={3}/>
        </div>

        <div style={{
          background:'#08080F', border:'1px solid rgba(139,92,246,0.12)',
          borderRadius:14, padding:'2rem', marginBottom:'1.5rem',
        }}>
          <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'.9rem', fontWeight:600, marginBottom:'1.25rem',
            paddingBottom:'.75rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>Tech stack</h3>

          {/* Quick pick */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1rem' }}>
            {TECH_OPTIONS.map(t => (
              <button key={t} type="button" onClick={() => technologies.includes(t) ? removeTech(t) : addTech(t)} style={{
                padding:'.25rem .75rem', borderRadius:100,
                fontSize:'.75rem', fontWeight:500,
                background: technologies.includes(t) ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                color: technologies.includes(t) ? '#A78BFA' : '#6B7280',
                border: technologies.includes(t) ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.06)',
                cursor:'pointer', fontFamily:'Space Grotesk,sans-serif', transition:'all .15s',
              }}>
                {technologies.includes(t) ? '✓ ' : ''}{t}
              </button>
            ))}
          </div>

          {/* Custom tech */}
          <div style={{ display:'flex', gap:'.5rem' }}>
            <input placeholder="Add custom tech..." value={techInput}
              onChange={e=>setTechInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addTech(techInput) }}}
              style={{ flex:1 }}
            />
            <button type="button" onClick={()=>addTech(techInput)} className="btn btn-outline" style={{ padding:'.6rem 1rem', flexShrink:0 }}>
              <Plus size={16}/>
            </button>
          </div>

          {technologies.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginTop:'.75rem' }}>
              {technologies.map(t => (
                <span key={t} style={{
                  display:'inline-flex', alignItems:'center', gap:'.3rem',
                  padding:'.25rem .65rem', borderRadius:100,
                  background:'rgba(139,92,246,0.15)', color:'#A78BFA',
                  border:'1px solid rgba(139,92,246,0.25)',
                  fontSize:'.75rem', fontWeight:500,
                }}>
                  {t}
                  <button type="button" onClick={()=>removeTech(t)} style={{ background:'none',border:'none',cursor:'pointer',color:'#A78BFA',display:'flex',alignItems:'center',padding:0 }}>
                    <X size={11}/>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{
          background:'#08080F', border:'1px solid rgba(139,92,246,0.12)',
          borderRadius:14, padding:'2rem', marginBottom:'1.5rem',
        }}>
          <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'.9rem', fontWeight:600, marginBottom:'1.25rem',
            paddingBottom:'.75rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>Links</h3>
          <Field label="GitHub repo" placeholder="https://github.com/..." value={form.github_url} onChange={e=>set('github_url',e.target.value)}/>
          <Field label="Live URL" placeholder="https://..." value={form.live_url} onChange={e=>set('live_url',e.target.value)}/>
          <Field label="Cover image URL" placeholder="https://... (Cloudinary, Imgur, etc.)" value={form.image_url} onChange={e=>set('image_url',e.target.value)}/>
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary" style={{ width:'100%' }}>
          <Rocket size={16}/>
          {saving ? 'Publishing...' : 'Publish project'}
        </button>
      </form>
    </div>
  )
}

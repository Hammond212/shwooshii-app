import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, getAllSkills, getUserSkills, addSkill, removeSkill } from '../lib/supabase'
import { Save, User, Link as LinkIcon, MapPin, Code } from 'lucide-react'

const Section = ({ title, icon, children }) => (
  <div style={{
    background:'#08080F', border:'1px solid rgba(139,92,246,0.12)',
    borderRadius:14, padding:'1.75rem', marginBottom:'1.5rem',
  }}>
    <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'1.5rem',
      paddingBottom:'1rem', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ color:'#A78BFA' }}>{icon}</div>
      <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:'.9rem', fontWeight:600, color:'#fff' }}>{title}</h3>
    </div>
    {children}
  </div>
)

const Field = ({ label, ...props }) => (
  <div style={{ marginBottom:'1rem' }}>
    <label style={{ display:'block', fontSize:'.75rem', fontWeight:600,
      color:'#6B7280', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'.4rem' }}>
      {label}
    </label>
    {props.textarea
      ? <textarea rows={4} {...props} style={{ resize:'vertical' }}/>
      : <input {...props}/>
    }
  </div>
)

export default function ProfileEdit({ user }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name:'', bio:'', avatar_url:'', location:'',
    role:'developer', website_url:'', github_url:'', linkedin_url:'', twitter_url:'',
  })
  const [allSkills, setAllSkills] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProfile(user.id), getAllSkills(), getUserSkills(user.id)]).then(([p, s, us]) => {
      if (p.data) { setForm(p.data); setUsername(p.data.username) }
      setAllSkills(s.data || [])
      setUserSkills(us.data || [])
      setLoading(false)
    })
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await updateProfile(user.id, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleSkill = async (skill) => {
    const has = userSkills.find(us => us.skill_id === skill.id)
    if (has) {
      await removeSkill(user.id, skill.id)
      setUserSkills(s => s.filter(us => us.skill_id !== skill.id))
    } else {
      await addSkill(user.id, skill.id)
      setUserSkills(s => [...s, { skill_id: skill.id, skills: skill }])
    }
  }

  const hasSkill = (id) => userSkills.some(us => us.skill_id === id)

  const byCategory = allSkills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',color:'#6B7280' }}>Loading...</div>

  return (
    <div style={{ maxWidth:700, margin:'0 auto', padding:'3rem 2rem' }}>
      <div style={{ marginBottom:'2rem' }}>
        <div className="s-label">Settings</div>
        <h1 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.5rem', fontWeight:700 }}>Edit your profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Section title="Basic info" icon={<User size={16}/>}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <Field label="Full name" value={form.full_name||''} onChange={e=>set('full_name',e.target.value)} placeholder="Your name"/>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'.75rem', fontWeight:600,
                color:'#6B7280', letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'.4rem' }}>Role</label>
              <select value={form.role||'developer'} onChange={e=>set('role',e.target.value)}>
                <option value="developer">Developer</option>
                <option value="founder">Founder</option>
                <option value="designer">Designer</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>
          <Field label="Bio" value={form.bio||''} onChange={e=>set('bio',e.target.value)} placeholder="Tell the community about yourself..." textarea/>
          <Field label="Location" value={form.location||''} onChange={e=>set('location',e.target.value)} placeholder="Gaborone, Botswana"/>
          <Field label="Avatar URL" value={form.avatar_url||''} onChange={e=>set('avatar_url',e.target.value)} placeholder="https://..."/>
        </Section>

        <Section title="Social links" icon={<LinkIcon size={16}/>}>
          <Field label="GitHub" value={form.github_url||''} onChange={e=>set('github_url',e.target.value)} placeholder="https://github.com/username"/>
          <Field label="LinkedIn" value={form.linkedin_url||''} onChange={e=>set('linkedin_url',e.target.value)} placeholder="https://linkedin.com/in/username"/>
          <Field label="Website" value={form.website_url||''} onChange={e=>set('website_url',e.target.value)} placeholder="https://yoursite.com"/>
          <Field label="Twitter / X" value={form.twitter_url||''} onChange={e=>set('twitter_url',e.target.value)} placeholder="https://twitter.com/username"/>
        </Section>

        <button type="submit" disabled={saving} className="btn btn-primary" style={{ width:'100%', marginBottom:'2rem' }}>
          <Save size={15}/>
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save changes'}
        </button>
      </form>

      {/* Skills */}
      <Section title="Skills" icon={<Code size={16}/>}>
        <p style={{ color:'#6B7280', fontSize:'.82rem', marginBottom:'1.5rem' }}>
          Click to add or remove skills from your profile.
        </p>
        {Object.entries(byCategory).map(([cat, skills]) => (
          <div key={cat} style={{ marginBottom:'1.25rem' }}>
            <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.1em',
              textTransform:'uppercase', color:'#6B7280', marginBottom:'.6rem' }}>{cat}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
              {skills.map(s => {
                const active = hasSkill(s.id)
                return (
                  <button key={s.id} onClick={() => toggleSkill(s)} style={{
                    padding:'.3rem .85rem', borderRadius:100,
                    fontSize:'.78rem', fontWeight:500,
                    background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#A78BFA' : '#6B7280',
                    border: active ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.06)',
                    cursor:'pointer', transition:'all .15s',
                    fontFamily:'Space Grotesk,sans-serif',
                  }}>
                    {active && '✓ '}{s.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </Section>

      {/* View profile link */}
      {username && (
        <div style={{ textAlign:'center' }}>
          <a href={`/profile/${username}`}
            style={{ color:'#A78BFA', fontSize:'.85rem', textDecoration:'none', fontWeight:500 }}>
            View public profile →
          </a>
        </div>
      )}
    </div>
  )
}

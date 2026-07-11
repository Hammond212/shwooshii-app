import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getProfile, updateProfile, getAllSkills, getUserSkills, addSkill, removeSkill,
} from '../lib/supabase.js'
import { C, BASE_CSS, initials } from '../lib/theme.js'

const CSS = BASE_CSS + `
.pe-wrap{max-width:680px;margin:0 auto;padding:2.5rem 1.5rem 5rem}
.pe-back{
  display:inline-flex;align-items:center;gap:.35rem;
  color:${C.muted};font-size:.82rem;font-weight:600;
  margin-bottom:1.5rem;transition:color .2s;
}
.pe-back:hover{color:${C.orange}}

.pe-sec{
  background:${C.white};border:1px solid ${C.border};
  border-radius:18px;padding:1.75rem;margin-bottom:1.25rem;
}
.pe-sec-h{
  font-size:.95rem;font-weight:800;color:${C.ink};
  margin-bottom:1.25rem;padding-bottom:.85rem;
  border-bottom:1px solid ${C.border};
}
.pe-preview{
  display:flex;align-items:center;gap:1rem;
  background:${C.bg};border:1px solid ${C.border};
  border-radius:14px;padding:1rem 1.15rem;margin-bottom:1.25rem;
}
.pe-preview-av{width:52px;height:52px;font-size:.95rem}
.pe-preview-n{font-size:.95rem;font-weight:800;color:${C.ink}}
.pe-preview-h{font-size:.78rem;color:${C.muted}}

.pe-two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.pe-roles{display:flex;gap:.5rem;flex-wrap:wrap}
.pe-cat{margin-bottom:1.15rem}
.pe-cat-l{
  font-size:.68rem;font-weight:800;letter-spacing:.1em;
  text-transform:uppercase;color:${C.muted};margin-bottom:.55rem;
}
.pe-chips{display:flex;flex-wrap:wrap;gap:.4rem}
.pe-save{width:100%;padding:.95rem;font-size:.95rem}

@media(max-width:600px){.pe-two{grid-template-columns:1fr}}
`

const ROLES = ['developer', 'founder', 'designer', 'mentor']

export default function ProfileEdit({ user }) {
  const [form, setForm] = useState({
    full_name: '', bio: '', avatar_url: '', location: '',
    role: 'developer', website_url: '', github_url: '',
    linkedin_url: '', twitter_url: '',
  })
  const [username, setUsername] = useState('')
  const [allSkills, setAllSkills]   = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    let alive = true
    Promise.all([
      getProfile(user.id),
      getAllSkills(),
      getUserSkills(user.id),
    ]).then(([p, s, us]) => {
      if (!alive) return
      if (p.data) {
        setForm(f => ({ ...f, ...p.data }))
        setUsername(p.data.username || '')
      }
      setAllSkills(s.data || [])
      setUserSkills(us.data || [])
      setLoading(false)
    })
    return () => { alive = false }
  }, [user.id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { error: err } = await updateProfile(user.id, {
        full_name:    form.full_name,
        bio:          form.bio,
        avatar_url:   form.avatar_url,
        location:     form.location,
        role:         form.role,
        website_url:  form.website_url,
        github_url:   form.github_url,
        linkedin_url: form.linkedin_url,
        twitter_url:  form.twitter_url,
      })
      if (err) throw err
      setSaved(true)
      setTimeout(() => setSaved(false), 2600)
    } catch (err) {
      setError(err.message || 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const hasSkill = (id) => userSkills.some(s => s.skill_id === id)

  const toggleSkill = async (skill) => {
    if (hasSkill(skill.id)) {
      setUserSkills(prev => prev.filter(s => s.skill_id !== skill.id))
      await removeSkill(user.id, skill.id)
    } else {
      setUserSkills(prev => [...prev, { skill_id: skill.id, skills: skill }])
      await addSkill(user.id, skill.id)
    }
  }

  const byCat = allSkills.reduce((acc, s) => {
    const c = s.category || 'other'
    ;(acc[c] = acc[c] || []).push(s)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="pe-wrap">
          <div className="skel" style={{ height: 90, marginBottom: '1.25rem' }} />
          <div className="skel" style={{ height: 300, marginBottom: '1.25rem' }} />
          <div className="skel" style={{ height: 200 }} />
        </div>
      </div>
    )
  }

  const name = form.full_name || username || 'Builder'

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="pe-wrap">

        <Link to="/home" className="pe-back">← Back</Link>

        <header style={{ marginBottom: '2rem' }} className="rise">
          <div className="eyebrow lav">Settings</div>
          <h1 className="h1" style={{ marginBottom: '.5rem' }}>Edit your profile</h1>
          <p className="sub">This is what other builders see when they find you.</p>
        </header>

        {error && (
          <div className="alert alert-err" role="alert">
            <span aria-hidden="true">⚠</span><span>{error}</span>
          </div>
        )}
        {saved && (
          <div className="alert alert-ok" role="status">
            <span aria-hidden="true">✓</span><span>Profile saved.</span>
          </div>
        )}

        <form onSubmit={save}>
          {/* Basics */}
          <section className="pe-sec rise" style={{ animationDelay: '.05s' }}>
            <div className="pe-sec-h">Basic info</div>

            {/* Live preview */}
            <div className="pe-preview">
              <div className="av pe-preview-av">
                {form.avatar_url
                  ? <img src={form.avatar_url} alt=""
                      onError={e => { e.currentTarget.style.display = 'none' }} />
                  : initials(name)}
              </div>
              <div>
                <div className="pe-preview-n">{name}</div>
                <div className="pe-preview-h">@{username}</div>
              </div>
              {username && (
                <Link to={`/profile/${username}`} className="btn btn-ghost btn-sm"
                  style={{ marginLeft: 'auto' }}>
                  View
                </Link>
              )}
            </div>

            <div className="fld">
              <label htmlFor="pe-name">Full name</label>
              <input
                id="pe-name"
                value={form.full_name || ''}
                onChange={e => set('full_name', e.target.value)}
                placeholder="Kgosi Batlang"
              />
            </div>

            <div className="fld">
              <label>I am a…</label>
              <div className="pe-roles">
                {ROLES.map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`chip ${form.role === r ? 'on' : ''}`}
                    onClick={() => set('role', r)}
                    aria-pressed={form.role === r}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="fld">
              <label htmlFor="pe-bio">Bio</label>
              <textarea
                id="pe-bio"
                value={form.bio || ''}
                onChange={e => set('bio', e.target.value)}
                placeholder="What do you build, and why?"
                maxLength={280}
              />
              <div className="hint">{(form.bio || '').length}/280</div>
            </div>

            <div className="pe-two">
              <div className="fld">
                <label htmlFor="pe-loc">Location</label>
                <input
                  id="pe-loc"
                  value={form.location || ''}
                  onChange={e => set('location', e.target.value)}
                  placeholder="Gaborone, Botswana"
                />
              </div>
              <div className="fld">
                <label htmlFor="pe-av">Avatar URL</label>
                <input
                  id="pe-av"
                  type="url"
                  value={form.avatar_url || ''}
                  onChange={e => set('avatar_url', e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="pe-sec rise" style={{ animationDelay: '.1s' }}>
            <div className="pe-sec-h">Links</div>
            <div className="pe-two">
              <div className="fld">
                <label htmlFor="pe-gh">GitHub</label>
                <input id="pe-gh" type="url" value={form.github_url || ''}
                  onChange={e => set('github_url', e.target.value)}
                  placeholder="https://github.com/you" />
              </div>
              <div className="fld">
                <label htmlFor="pe-li">LinkedIn</label>
                <input id="pe-li" type="url" value={form.linkedin_url || ''}
                  onChange={e => set('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/you" />
              </div>
              <div className="fld">
                <label htmlFor="pe-web">Website</label>
                <input id="pe-web" type="url" value={form.website_url || ''}
                  onChange={e => set('website_url', e.target.value)}
                  placeholder="https://yoursite.com" />
              </div>
              <div className="fld">
                <label htmlFor="pe-tw">Twitter / X</label>
                <input id="pe-tw" type="url" value={form.twitter_url || ''}
                  onChange={e => set('twitter_url', e.target.value)}
                  placeholder="https://x.com/you" />
              </div>
            </div>
          </section>

          <button type="submit" className="btn btn-primary pe-save" disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>
        </form>

        {/* Skills — saves instantly, outside the form */}
        <section className="pe-sec rise" style={{ marginTop: '1.25rem', animationDelay: '.15s' }}>
          <div className="pe-sec-h">Skills</div>
          <p className="dim" style={{ marginBottom: '1.35rem' }}>
            Tap to add or remove. Saves automatically.
          </p>

          {Object.entries(byCat).map(([cat, list]) => (
            <div key={cat} className="pe-cat">
              <div className="pe-cat-l">{cat}</div>
              <div className="pe-chips">
                {list.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`chip ${hasSkill(s.id) ? 'on' : ''}`}
                    onClick={() => toggleSkill(s)}
                    aria-pressed={hasSkill(s.id)}
                  >
                    {hasSkill(s.id) ? '✓ ' : ''}{s.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

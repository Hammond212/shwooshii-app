import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getProfileByUsername, getUserProjects, getUserSkills,
  getFollowerCount, isFollowing, follow, unfollow,
} from '../lib/supabase.js'
import { C, BASE_CSS, initials } from '../lib/theme.js'
import ProjectCard from '../components/ProjectCard.jsx'

const CSS = BASE_CSS + `
.pv-wrap{max-width:900px;margin:0 auto;padding:2.5rem 1.5rem 5rem}
.pv-card{
  background:${C.bg};border:1px solid ${C.border};
  border-radius:22px;padding:2rem;margin-bottom:1.75rem;
  position:relative;overflow:hidden;
}
.pv-blob{
  position:absolute;top:-120px;right:-100px;
  width:340px;height:340px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,107,53,0.12) 0%,transparent 65%);
  pointer-events:none;
}
.pv-top{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1.25rem;flex-wrap:wrap;position:relative;z-index:1;
}
.pv-id{display:flex;align-items:center;gap:1.25rem}
.pv-av{width:76px;height:76px;font-size:1.3rem;box-shadow:0 6px 22px rgba(255,107,53,0.3)}
.pv-name{font-size:1.7rem;font-weight:800;letter-spacing:-.03em;line-height:1.15;margin-bottom:.35rem}
.pv-meta{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
.pv-handle{font-size:.85rem;color:${C.muted};font-weight:500}

.pv-stats{
  display:flex;gap:1.75rem;flex-wrap:wrap;
  margin-top:1.5rem;padding-top:1.5rem;
  border-top:1px solid ${C.border};
  position:relative;z-index:1;
}
.pv-stat{display:flex;align-items:baseline;gap:.35rem}
.pv-stat-n{font-size:1.15rem;font-weight:800;letter-spacing:-.02em}
.pv-stat-l{font-size:.78rem;color:${C.muted}}

.pv-bio{
  color:${C.ink2};font-size:.92rem;line-height:1.75;
  margin-top:1.1rem;max-width:620px;position:relative;z-index:1;
}
.pv-links{
  display:flex;gap:1.1rem;flex-wrap:wrap;margin-top:1.1rem;
  position:relative;z-index:1;
}
.pv-link{font-size:.82rem;font-weight:700;color:${C.muted};transition:color .2s}
.pv-link:hover{color:${C.orange}}

.pv-sec{
  background:${C.white};border:1px solid ${C.border};
  border-radius:18px;padding:1.6rem;margin-bottom:1.75rem;
}
.pv-skills{display:flex;flex-wrap:wrap;gap:.45rem}
`

const CAT_PILL = {
  frontend: 'pill-o', backend: 'pill-t', design: 'pill-p',
  devops:   'pill-l', database: 'pill-y', tools: 'pill-g',
}

export default function ProfileView({ user }) {
  const { username } = useParams()

  const [profile, setProfile]     = useState(null)
  const [projects, setProjects]   = useState([])
  const [skills, setSkills]       = useState([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(false)
  const [loading, setLoading]     = useState(true)
  const [busy, setBusy]           = useState(false)

  const own = profile?.user_id === user.id

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const { data: p } = await getProfileByUsername(username)
      if (!alive) return
      if (!p) { setProfile(null); setLoading(false); return }

      setProfile(p)
      const [pr, sk, fc, fol] = await Promise.all([
        getUserProjects(p.user_id),
        getUserSkills(p.user_id),
        getFollowerCount(p.user_id),
        isFollowing(user.id, p.user_id),
      ])
      if (!alive) return
      setProjects(pr.data || [])
      setSkills(sk.data || [])
      setFollowers(fc || 0)
      setFollowing(fol)
      setLoading(false)
    })()
    return () => { alive = false }
  }, [username, user.id])

  const toggleFollow = async () => {
    if (busy || !profile) return
    setBusy(true)
    const next = !following
    setFollowing(next)
    setFollowers(n => n + (next ? 1 : -1))
    try {
      next
        ? await follow(user.id, profile.user_id)
        : await unfollow(user.id, profile.user_id)
    } catch {
      setFollowing(!next)
      setFollowers(n => n + (next ? -1 : 1))
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="pv-wrap">
          <div className="skel" style={{ height: 220, marginBottom: '1.75rem' }} />
          <div className="grid grid-3">
            {[0,1,2].map(i => <div key={i} className="skel" style={{ height: 320 }} />)}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="pv-wrap">
          <div className="empty">
            <div className="empty-icon">?</div>
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Profile not found</h3>
            <p className="dim" style={{ marginBottom: '1.5rem' }}>
              No builder with the handle @{username}.
            </p>
            <Link to="/discover" className="btn btn-primary">Find builders →</Link>
          </div>
        </div>
      </div>
    )
  }

  const name = profile.full_name || profile.username

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="pv-wrap">

        {/* Profile card */}
        <section className="pv-card rise">
          <div className="pv-blob" aria-hidden="true" />

          <div className="pv-top">
            <div className="pv-id">
              <div className="av pv-av">
                {profile.avatar_url
                  ? <img src={profile.avatar_url} alt="" />
                  : initials(name)}
              </div>
              <div>
                <h1 className="pv-name">{name}</h1>
                <div className="pv-meta">
                  <span className="pv-handle">@{profile.username}</span>
                  {profile.role && <span className="pill pill-o">{profile.role}</span>}
                  {profile.is_verified && <span className="pill pill-t">✓ Verified</span>}
                </div>
              </div>
            </div>

            {own ? (
              <Link to="/settings" className="btn btn-ghost">Edit profile</Link>
            ) : (
              <button
                onClick={toggleFollow}
                className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`}
                aria-pressed={following}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="pv-stats">
            <div className="pv-stat">
              <span className="pv-stat-n" style={{ color: C.orange }}>{projects.length}</span>
              <span className="pv-stat-l">projects</span>
            </div>
            <div className="pv-stat">
              <span className="pv-stat-n" style={{ color: C.teal }}>{followers}</span>
              <span className="pv-stat-l">followers</span>
            </div>
            {profile.trust_score > 0 && (
              <div className="pv-stat">
                <span className="pv-stat-n" style={{ color: C.lavender }}>{profile.trust_score}</span>
                <span className="pv-stat-l">trust score</span>
              </div>
            )}
            {profile.location && (
              <div className="pv-stat">
                <span className="pv-stat-l">◎ {profile.location}</span>
              </div>
            )}
          </div>

          {profile.bio && <p className="pv-bio">{profile.bio}</p>}

          {(profile.github_url || profile.linkedin_url || profile.website_url || profile.twitter_url) && (
            <div className="pv-links">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="pv-link">
                  GitHub ↗
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="pv-link">
                  LinkedIn ↗
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="pv-link">
                  Website ↗
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="pv-link">
                  Twitter ↗
                </a>
              )}
            </div>
          )}
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="pv-sec rise" style={{ animationDelay: '.06s' }}>
            <div className="eyebrow teal">Skills</div>
            <div className="pv-skills">
              {skills.map(s => (
                <span
                  key={s.id}
                  className={`pill ${CAT_PILL[s.skills?.category] || 'pill-g'}`}
                  style={{ padding: '.35rem .9rem', fontSize: '.8rem' }}
                >
                  {s.skills?.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        <section className="rise" style={{ animationDelay: '.1s' }}>
          <div className="eyebrow" style={{ marginBottom: '1.4rem' }}>
            Projects ({projects.length})
          </div>

          {projects.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">◎</div>
              <h3 className="h3" style={{ marginBottom: '.5rem' }}>
                {own ? 'You haven\u2019t shared a project yet' : 'No projects yet'}
              </h3>
              {own && (
                <Link to="/project/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Share your first project →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-3">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

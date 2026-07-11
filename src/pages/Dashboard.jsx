import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, getUserProjects, getFollowerCount } from '../lib/supabase.js'
import { C, FONT, BASE_CSS, initials } from '../lib/theme.js'
import ProjectCard from '../components/ProjectCard.jsx'

const CSS = BASE_CSS + `
.dash-head{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1.5rem;flex-wrap:wrap;margin-bottom:2.5rem;
}
.dash-who{display:flex;align-items:center;gap:1.25rem}
.dash-av{width:66px;height:66px;font-size:1.15rem;box-shadow:0 6px 20px rgba(255,107,53,0.3)}
.dash-name{font-size:1.75rem;font-weight:800;letter-spacing:-.03em;line-height:1.15;margin-bottom:.35rem}
.dash-meta{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap}
.dash-handle{font-size:.85rem;color:${C.muted};font-weight:500}
.dash-acts{display:flex;gap:.6rem;flex-wrap:wrap}

.dash-bio{
  background:${C.bg};border:1px solid ${C.border};border-radius:14px;
  padding:1.1rem 1.35rem;margin-bottom:2rem;
  color:${C.ink2};font-size:.9rem;line-height:1.7;
}

.sec-head{
  display:flex;align-items:center;justify-content:space-between;
  gap:1rem;margin-bottom:1.4rem;flex-wrap:wrap;
}
.sec-link{
  font-size:.82rem;font-weight:700;color:${C.orange};
  display:flex;align-items:center;gap:.3rem;transition:gap .2s;
}
.sec-link:hover{gap:.5rem}
`

export default function Dashboard({ user }) {
  const [profile, setProfile]   = useState(null)
  const [projects, setProjects] = useState([])
  const [followers, setFollowers] = useState(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      getProfile(user.id),
      getUserProjects(user.id),
      getFollowerCount(user.id),
    ]).then(([p, pr, fc]) => {
      if (!alive) return
      if (p.data) setProfile(p.data)
      if (pr.data) setProjects(pr.data)
      setFollowers(fc || 0)
      setLoading(false)
    })
    return () => { alive = false }
  }, [user])

  if (loading) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="wrap">
          <div className="skel" style={{ height: 90, marginBottom: '2.5rem' }} />
          <div className="grid grid-stats" style={{ marginBottom: '2.5rem' }}>
            {[0,1,2].map(i => <div key={i} className="skel" style={{ height: 96 }} />)}
          </div>
          <div className="grid grid-3">
            {[0,1,2].map(i => <div key={i} className="skel" style={{ height: 320 }} />)}
          </div>
        </div>
      </div>
    )
  }

  const name = profile?.full_name || profile?.username || 'Builder'

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="wrap">

        {/* Header */}
        <header className="dash-head rise">
          <div className="dash-who">
            <div className="av dash-av">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" />
                : initials(name)}
            </div>
            <div>
              <h1 className="dash-name">{name}</h1>
              <div className="dash-meta">
                {profile?.username && (
                  <span className="dash-handle">@{profile.username}</span>
                )}
                {profile?.role && (
                  <span className="pill pill-o">{profile.role}</span>
                )}
                {profile?.is_verified && (
                  <span className="pill pill-t">✓ Verified</span>
                )}
              </div>
            </div>
          </div>

          <div className="dash-acts">
            <Link to="/project/new" className="btn btn-primary">
              + New project
            </Link>
            <Link to="/settings" className="btn btn-ghost">
              Edit profile
            </Link>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-stats rise" style={{ marginBottom: '2rem', animationDelay: '.08s' }}>
          <div className="stat">
            <div className="stat-n" style={{ color: C.orange }}>{projects.length}</div>
            <div className="stat-l">Projects</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: C.teal }}>{profile?.trust_score || 0}</div>
            <div className="stat-l">Trust score</div>
          </div>
          <div className="stat">
            <div className="stat-n" style={{ color: C.lavender }}>{followers}</div>
            <div className="stat-l">Followers</div>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div className="dash-bio rise" style={{ animationDelay: '.12s' }}>
            {profile.bio}
          </div>
        )}

        {/* Projects */}
        <section className="rise" style={{ animationDelay: '.16s' }}>
          <div className="sec-head">
            <div className="eyebrow">Your projects</div>
            <Link to="/discover" className="sec-link">
              Browse discover →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">↑</div>
              <h3 className="h3" style={{ marginBottom: '.5rem' }}>No projects yet</h3>
              <p className="dim" style={{ marginBottom: '1.5rem', maxWidth: 360, margin: '0 auto 1.5rem' }}>
                Share your first project and start proving what you can build.
              </p>
              <Link to="/project/new" className="btn btn-primary">
                Share your first project →
              </Link>
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

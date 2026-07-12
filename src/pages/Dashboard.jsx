import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, getUserProjects, getAllProjects } from '../lib/supabase.js'
import { initials, timeSince } from '../lib/theme.js'
import ProjectCard from '../components/ProjectCard.jsx'

const O = '#FF6B35'
const O2 = '#FF8C5A'
const OBG = '#FFF1EC'
const INK = '#0F0F1A'
const INK2 = '#3D3D5C'
const MUTED = '#8888A8'
const BORDER = '#F0EEE8'
const WHITE = '#FFFFFF'
const BG = '#FAFAF8'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${WHITE};color:${INK};font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}

/* ── Layout ── */
.hm{min-height:100vh;background:${WHITE}}
.hm-inner{max-width:1100px;margin:0 auto;padding:2.5rem 1.5rem 5rem;display:grid;grid-template-columns:1fr 300px;gap:3rem}
@media(max-width:900px){.hm-inner{grid-template-columns:1fr;gap:2rem}}

/* ── Greeting ── */
.hm-greet{margin-bottom:2.5rem}
.hm-greet-eyebrow{
  font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:${O};display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem;
}
.hm-greet-eyebrow::before{content:'';width:18px;height:2px;border-radius:1px;background:${O}}
.hm-greet h1{
  font-size:clamp(1.8rem,4vw,2.4rem);font-weight:900;letter-spacing:-.03em;
  line-height:1.12;color:${INK};margin-bottom:.5rem;
}
.hm-greet h1 span{color:${O}}
.hm-greet p{color:${MUTED};font-size:.95rem;line-height:1.65;max-width:520px}

/* ── Quick actions ── */
.hm-actions{display:flex;gap:.75rem;margin-bottom:3rem;flex-wrap:wrap}
.hm-btn-primary{
  display:inline-flex;align-items:center;gap:.45rem;
  padding:.75rem 1.6rem;border-radius:100px;border:none;cursor:pointer;
  background:${O};color:${WHITE};font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:.9rem;
  box-shadow:0 4px 18px rgba(255,107,53,0.3);
  transition:all .2s;text-decoration:none;
}
.hm-btn-primary:hover{background:${O2};transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,107,53,0.4)}
.hm-btn-ghost{
  display:inline-flex;align-items:center;gap:.45rem;
  padding:.75rem 1.6rem;border-radius:100px;cursor:pointer;
  background:${WHITE};color:${INK2};border:1.5px solid ${BORDER};
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.9rem;
  transition:all .2s;text-decoration:none;
}
.hm-btn-ghost:hover{border-color:${O};color:${O}}

/* ── Section header ── */
.hm-sec-hd{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:1.4rem;flex-wrap:wrap;gap:.75rem;
}
.hm-sec-label{
  font-size:.7rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;
  color:${O};display:flex;align-items:center;gap:.5rem;
}
.hm-sec-label::before{content:'';width:18px;height:2px;border-radius:1px;background:${O}}
.hm-sec-link{
  font-size:.82rem;font-weight:700;color:${MUTED};
  text-decoration:none;transition:color .2s;display:flex;align-items:center;gap:.3rem;
}
.hm-sec-link:hover{color:${O}}

/* ── Project grid ── */
.hm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.1rem}

/* ── Empty ── */
.hm-empty{
  background:${BG};border:1.5px dashed ${BORDER};
  border-radius:20px;padding:3.5rem 2rem;text-align:center;
}
.hm-empty-icon{
  width:52px;height:52px;border-radius:16px;
  background:${OBG};color:${O};
  display:flex;align-items:center;justify-content:center;
  font-size:1.4rem;font-weight:800;margin:0 auto 1.1rem;
}
.hm-empty h3{font-size:1rem;font-weight:800;color:${INK};margin-bottom:.45rem}
.hm-empty p{font-size:.85rem;color:${MUTED};line-height:1.65;max-width:300px;margin:0 auto 1.5rem}

/* ── Divider ── */
.hm-rule{height:1px;background:${BORDER};border:none;margin:2.5rem 0}

/* ── SIDEBAR ── */
.hm-sidebar{}

/* Profile card */
.hm-profile-card{
  background:${BG};border:1px solid ${BORDER};
  border-radius:20px;padding:1.5rem;margin-bottom:1.25rem;
  position:relative;overflow:hidden;
}
.hm-profile-card::before{
  content:'';position:absolute;top:-60px;right:-60px;
  width:180px;height:180px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(255,107,53,0.1) 0%,transparent 65%);
  pointer-events:none;
}
.hm-profile-top{display:flex;align-items:center;gap:.9rem;margin-bottom:1.1rem}
.hm-av{
  width:48px;height:48px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,${O},#FF5FA2);
  display:flex;align-items:center;justify-content:center;
  font-size:.9rem;font-weight:800;color:${WHITE};
  overflow:hidden;box-shadow:0 4px 14px rgba(255,107,53,0.3);
}
.hm-av img{width:100%;height:100%;object-fit:cover}
.hm-profile-name{font-size:1rem;font-weight:800;color:${INK};margin-bottom:.2rem}
.hm-profile-handle{font-size:.78rem;color:${MUTED}}
.hm-profile-role{
  display:inline-flex;padding:.25rem .75rem;border-radius:100px;
  background:${OBG};color:${O};font-size:.68rem;font-weight:700;
  letter-spacing:.04em;margin-top:.75rem;
}
.hm-profile-bio{
  font-size:.82rem;color:${INK2};line-height:1.65;
  margin-top:.75rem;padding-top:.75rem;border-top:1px solid ${BORDER};
}
.hm-edit-link{
  display:flex;align-items:center;justify-content:center;gap:.35rem;
  margin-top:1rem;padding:.6rem;border-radius:10px;
  border:1.5px solid ${BORDER};background:${WHITE};
  font-size:.8rem;font-weight:700;color:${MUTED};
  text-decoration:none;transition:all .2s;
}
.hm-edit-link:hover{border-color:${O};color:${O}}

/* Tip card */
.hm-tip{
  background:${OBG};border:1px solid rgba(255,107,53,0.2);
  border-radius:20px;padding:1.4rem;margin-bottom:1.25rem;
}
.hm-tip-label{
  font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${O};margin-bottom:.6rem;
}
.hm-tip-t{font-size:.85rem;color:${INK2};line-height:1.65}
.hm-tip-t strong{color:${O};font-weight:700}

/* Discover prompt */
.hm-disc{
  background:${WHITE};border:1px solid ${BORDER};
  border-radius:20px;padding:1.4rem;
}
.hm-disc p{font-size:.85rem;color:${INK2};line-height:1.6;margin-bottom:1rem}

/* ── Skeleton ── */
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.skel{
  border-radius:16px;
  background:linear-gradient(90deg,${BG} 25%,#EDEAE3 50%,${BG} 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;
}

/* ── Entrance ── */
@keyframes riseIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.rise{animation:riseIn .5s cubic-bezier(.23,1,.32,1) both}

@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`

function Greeting({ name }) {
  const h = new Date().getHours()
  const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return (
    <div className="hm-greet rise">
      <div className="hm-greet-eyebrow">Your space</div>
      <h1>{time}, <span>{name.split(' ')[0]}</span>.</h1>
      <p>What are you building today?</p>
    </div>
  )
}

export default function Dashboard({ user }) {
  const [profile, setProfile]     = useState(null)
  const [myProjects, setMyProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([
      getProfile(user.id),
      getUserProjects(user.id),
      getAllProjects(6),
    ]).then(([p, pr, ap]) => {
      if (!alive) return
      if (p.data) setProfile(p.data)
      setMyProjects(pr.data || [])
      setAllProjects((ap.data || []).filter(p => p.user_id !== user.id).slice(0, 6))
      setLoading(false)
    })
    return () => { alive = false }
  }, [user])

  if (loading) {
    return (
      <div className="hm">
        <style>{CSS}</style>
        <div className="hm-inner">
          <div>
            <div className="skel" style={{ height: 100, marginBottom: '2rem' }} />
            <div className="skel" style={{ height: 52, width: 280, marginBottom: '2.5rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.1rem' }}>
              {[0,1,2].map(i => <div key={i} className="skel" style={{ height: 320 }} />)}
            </div>
          </div>
          <div>
            <div className="skel" style={{ height: 200, marginBottom: '1.25rem' }} />
            <div className="skel" style={{ height: 120 }} />
          </div>
        </div>
      </div>
    )
  }

  const name = profile?.full_name || profile?.username || 'Builder'

  return (
    <div className="hm">
      <style>{CSS}</style>
      <div className="hm-inner">

        {/* ── MAIN COLUMN ── */}
        <main>
          <Greeting name={name} />

          {/* Quick actions */}
          <div className="hm-actions rise" style={{ animationDelay: '.07s' }}>
            <Link to="/project/new" className="hm-btn-primary">
              + Share a project
            </Link>
            <Link to="/discover" className="hm-btn-ghost">
              Browse builders →
            </Link>
          </div>

          {/* My projects */}
          <section className="rise" style={{ animationDelay: '.12s' }}>
            <div className="hm-sec-hd">
              <div className="hm-sec-label">Your projects</div>
              {myProjects.length > 0 && (
                <Link to={`/profile/${profile?.username}`} className="hm-sec-link">
                  View all →
                </Link>
              )}
            </div>

            {myProjects.length === 0 ? (
              <div className="hm-empty">
                <div className="hm-empty-icon">↑</div>
                <h3>Nothing here yet</h3>
                <p>Share your first project and start proving what you can build.</p>
                <Link to="/project/new" className="hm-btn-primary" style={{ display: 'inline-flex' }}>
                  Share a project →
                </Link>
              </div>
            ) : (
              <div className="hm-grid">
                {myProjects.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            )}
          </section>

          {/* Community projects */}
          {allProjects.length > 0 && (
            <>
              <hr className="hm-rule" />
              <section className="rise" style={{ animationDelay: '.18s' }}>
                <div className="hm-sec-hd">
                  <div className="hm-sec-label">From the community</div>
                  <Link to="/discover" className="hm-sec-link">
                    See all →
                  </Link>
                </div>
                <div className="hm-grid">
                  {allProjects.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>

        {/* ── SIDEBAR ── */}
        <aside className="hm-sidebar">

          {/* Profile card */}
          <div className="hm-profile-card rise" style={{ animationDelay: '.1s' }}>
            <div className="hm-profile-top">
              <div className="hm-av">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" />
                  : initials(name)}
              </div>
              <div>
                <div className="hm-profile-name">{name}</div>
                <div className="hm-profile-handle">@{profile?.username}</div>
              </div>
            </div>

            {profile?.role && (
              <div className="hm-profile-role">{profile.role}</div>
            )}

            {profile?.bio && (
              <p className="hm-profile-bio">{profile.bio}</p>
            )}

            <Link to="/settings" className="hm-edit-link">
              Edit profile
            </Link>
          </div>

          {/* Tip */}
          <div className="hm-tip rise" style={{ animationDelay: '.15s' }}>
            <div className="hm-tip-label">💡 Quick tip</div>
            <p className="hm-tip-t">
              The <strong>Problem solved</strong> field on your project is the most important thing people see.
              Lead with the problem, not the tech.
            </p>
          </div>

          {/* Discover prompt */}
          <div className="hm-disc rise" style={{ animationDelay: '.2s' }}>
            <div className="hm-sec-label" style={{ marginBottom: '.75rem' }}>Discover</div>
            <p>Find builders working with the same tools you are. Follow their work.</p>
            <Link to="/discover" className="hm-btn-primary" style={{ display: 'inline-flex', fontSize: '.82rem', padding: '.6rem 1.25rem' }}>
              Explore →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

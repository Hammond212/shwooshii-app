import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  getProject, likeProject, unlikeProject, hasLiked, deleteProject,
} from '../lib/supabase.js'
import { C, BASE_CSS, tagClass, initials, timeSince } from '../lib/theme.js'

const CSS = BASE_CSS + `
.pd-wrap{max-width:760px;margin:0 auto;padding:2.5rem 1.5rem 5rem}
.pd-back{
  display:inline-flex;align-items:center;gap:.35rem;
  color:${C.muted};font-size:.82rem;font-weight:600;
  margin-bottom:1.5rem;transition:color .2s;
}
.pd-back:hover{color:${C.orange}}

.pd-cover{
  width:100%;height:300px;border-radius:20px;overflow:hidden;
  margin-bottom:1.75rem;background:linear-gradient(135deg,${C.orangeBg},${C.tealBg});
  border:1px solid ${C.border};
  display:flex;align-items:center;justify-content:center;
}
.pd-cover img{width:100%;height:100%;object-fit:cover}
.pd-glyph{
  font-size:5rem;font-weight:800;letter-spacing:-.04em;
  background:linear-gradient(135deg,${C.orange},${C.teal});
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  opacity:.4;
}

.pd-head{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1.25rem;flex-wrap:wrap;margin-bottom:1.75rem;
}
.pd-title{font-size:2rem;font-weight:800;letter-spacing:-.03em;
  line-height:1.15;margin-bottom:.65rem}
.pd-by{display:flex;align-items:center;gap:.5rem;color:${C.muted};font-size:.85rem}
.pd-by-av{width:26px;height:26px;font-size:.55rem}
.pd-acts{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}

.pd-like{
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.6rem 1.2rem;border-radius:100px;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:.85rem;
  background:${C.white};border:1.5px solid ${C.border};color:${C.muted};
  transition:all .2s;
}
.pd-like:hover{border-color:${C.pink};color:${C.pink}}
.pd-like.on{background:${C.pinkBg};border-color:${C.pink};color:${C.pink}}

.pd-hero{
  background:linear-gradient(135deg,${C.tealBg},${C.orangeBg});
  border:1px solid rgba(0,201,167,0.25);
  border-radius:18px;padding:1.75rem;margin-bottom:1.25rem;
}
.pd-hero-l{
  font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${C.tealDark};margin-bottom:.7rem;
  display:flex;align-items:center;gap:.5rem;
}
.pd-hero-l::before{content:'';width:18px;height:2px;background:${C.teal};border-radius:1px}
.pd-hero-t{font-size:1.05rem;color:${C.ink};line-height:1.7;font-weight:500}

.pd-sec{
  background:${C.white};border:1px solid ${C.border};
  border-radius:18px;padding:1.75rem;margin-bottom:1.25rem;
}
.pd-sec-h{font-size:.7rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${C.orange};margin-bottom:.9rem;display:flex;align-items:center;gap:.5rem}
.pd-sec-h::before{content:'';width:18px;height:2px;background:${C.orange};border-radius:1px}
.pd-sec-t{color:${C.ink2};line-height:1.8;font-size:.95rem}
.pd-tags{display:flex;flex-wrap:wrap;gap:.45rem}
`

export default function ProjectDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [liked, setLiked]     = useState(false)
  const [likes, setLikes]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy]       = useState(false)

  const owner = project && project.user_id === user.id

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data } = await getProject(id)
      if (!alive) return
      if (data) {
        setProject(data)
        setLikes(data.likes_count || 0)
        const l = await hasLiked(user.id, id)
        if (alive) setLiked(l)
      }
      setLoading(false)
    })()
    return () => { alive = false }
  }, [id, user.id])

  const toggleLike = async () => {
    if (busy) return
    setBusy(true)
    const next = !liked
    setLiked(next)
    setLikes(n => n + (next ? 1 : -1))
    try {
      next ? await likeProject(user.id, id) : await unlikeProject(user.id, id)
    } catch {
      setLiked(!next)
      setLikes(n => n + (next ? -1 : 1))
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    await deleteProject(id)
    navigate('/home')
  }

  if (loading) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="pd-wrap">
          <div className="skel" style={{ height: 300, marginBottom: '1.75rem' }} />
          <div className="skel" style={{ height: 120, marginBottom: '1.25rem' }} />
          <div className="skel" style={{ height: 160 }} />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="pd-wrap">
          <div className="empty">
            <div className="empty-icon">?</div>
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Project not found</h3>
            <p className="dim" style={{ marginBottom: '1.5rem' }}>
              It may have been deleted.
            </p>
            <Link to="/discover" className="btn btn-primary">Browse projects →</Link>
          </div>
        </div>
      </div>
    )
  }

  const author = project.profiles
  const aname  = author?.full_name || author?.username || 'builder'

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="pd-wrap">

        <Link to="/home" className="pd-back">← Back</Link>

        {/* Cover */}
        <div className="pd-cover rise">
          {project.image_url
            ? <img src={project.image_url} alt=""
                onError={e => { e.currentTarget.style.display = 'none' }} />
            : <span className="pd-glyph">{(project.title || '?')[0].toUpperCase()}</span>
          }
        </div>

        {/* Header */}
        <header className="pd-head rise" style={{ animationDelay: '.05s' }}>
          <div>
            <h1 className="pd-title">{project.title}</h1>
            {author && (
              <Link to={`/profile/${author.username}`} className="pd-by">
                <div className="av pd-by-av">
                  {author.avatar_url
                    ? <img src={author.avatar_url} alt="" />
                    : initials(aname)}
                </div>
                @{author.username}
                <span style={{ color: C.border }}>·</span>
                {timeSince(project.created_at)}
              </Link>
            )}
          </div>

          <div className="pd-acts">
            <button
              className={`pd-like ${liked ? 'on' : ''}`}
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              ♥ {likes}
            </button>

            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="btn btn-primary btn-sm">
                Live demo ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm">
                Code ↗
              </a>
            )}
            {owner && (
              <button onClick={remove} className="btn btn-danger btn-sm" aria-label="Delete project">
                Delete
              </button>
            )}
          </div>
        </header>

        {/* Problem solved */}
        {project.problem_solved && (
          <section className="pd-hero rise" style={{ animationDelay: '.1s' }}>
            <div className="pd-hero-l">Problem solved</div>
            <p className="pd-hero-t">{project.problem_solved}</p>
          </section>
        )}

        {/* Description */}
        {project.description && (
          <section className="pd-sec rise" style={{ animationDelay: '.14s' }}>
            <div className="pd-sec-h">About</div>
            <p className="pd-sec-t">{project.description}</p>
          </section>
        )}

        {/* Stack */}
        {project.technologies?.length > 0 && (
          <section className="pd-sec rise" style={{ animationDelay: '.18s' }}>
            <div className="pd-sec-h">Built with</div>
            <div className="pd-tags">
              {project.technologies.map(t => (
                <span key={t} className={`pill ${tagClass(t)}`}
                  style={{ padding: '.35rem .9rem', fontSize: '.8rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

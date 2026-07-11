import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { C, FONT, tagClass, initials, timeSince } from '../lib/theme.js'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.pc{
  display:flex;flex-direction:column;height:100%;
  background:${C.white};border:1px solid ${C.border};
  border-radius:18px;overflow:hidden;cursor:pointer;
  font-family:${FONT};
  will-change:transform;
}
.pc-media{
  height:150px;position:relative;overflow:hidden;
  background:linear-gradient(135deg,${C.orangeBg},${C.tealBg});
  display:flex;align-items:center;justify-content:center;
  border-bottom:1px solid ${C.border};
}
.pc-media img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.23,1,.32,1)}
.pc:hover .pc-media img{transform:scale(1.06)}
.pc-glyph{
  font-size:2.6rem;font-weight:800;letter-spacing:-.04em;
  background:linear-gradient(135deg,${C.orange},${C.teal});
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  opacity:.35;
}
.pc-live{
  position:absolute;top:10px;right:10px;
  display:flex;align-items:center;gap:5px;
  background:rgba(255,255,255,0.95);
  border:1px solid rgba(0,201,167,0.35);
  border-radius:100px;padding:3px 10px;
  font-size:.62rem;font-weight:800;color:${C.tealDark};letter-spacing:.08em;
}
.pc-dot{width:5px;height:5px;border-radius:50%;background:${C.teal};animation:pcPulse 2s infinite}
@keyframes pcPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

.pc-body{padding:1.15rem 1.25rem;display:flex;flex-direction:column;flex:1}
.pc-who{display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem}
.pc-av{width:26px;height:26px;font-size:.55rem}
.pc-handle{font-size:.75rem;color:${C.muted};font-weight:500}
.pc-time{margin-left:auto;font-size:.68rem;color:${C.muted}}

.pc-title{font-size:1rem;font-weight:800;color:${C.ink};letter-spacing:-.02em;
  line-height:1.3;margin-bottom:.6rem}

.pc-prob{
  border-left:3px solid ${C.teal};
  background:${C.tealBg};
  border-radius:0 8px 8px 0;
  padding:.55rem .75rem;margin-bottom:.75rem;
}
.pc-prob-l{font-size:.62rem;font-weight:800;color:${C.tealDark};
  letter-spacing:.08em;text-transform:uppercase;margin-bottom:.2rem}
.pc-prob-t{font-size:.78rem;color:${C.ink2};line-height:1.5;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

.pc-desc{font-size:.82rem;color:${C.muted};line-height:1.6;margin-bottom:.75rem;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

.pc-tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.9rem}
.pc-more{font-size:.68rem;color:${C.muted};align-self:center}

.pc-foot{
  display:flex;align-items:center;justify-content:space-between;
  padding-top:.75rem;margin-top:auto;
  border-top:1px solid ${C.border};
}
.pc-links{display:flex;gap:.75rem}
.pc-link{font-size:.75rem;font-weight:600;color:${C.muted};transition:color .2s}
.pc-link:hover{color:${C.ink}}
.pc-link.live{color:${C.tealDark}}
.pc-likes{display:flex;align-items:center;gap:.25rem;font-size:.75rem;
  font-weight:700;color:${C.pink}}
`

export default function ProjectCard({ project, index = 0 }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hov, setHov]   = useState(false)
  const ref = useRef(null)

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setTilt({
      x: ((e.clientX - r.left) / r.width - .5) * 8,
      y: ((e.clientY - r.top) / r.height - .5) * -8,
    })
  }

  const reset = () => { setTilt({ x: 0, y: 0 }); setHov(false) }

  const techs  = (project.technologies || []).slice(0, 3)
  const extra  = Math.max(0, (project.technologies?.length || 0) - 3)
  const uname  = project.profiles?.username || 'builder'
  const fname  = project.profiles?.full_name || uname
  const avatar = project.profiles?.avatar_url

  return (
    <Link to={`/project/${project.id}`} aria-label={`View project: ${project.title}`}>
      <style>{CSS}</style>
      <article
        ref={ref}
        className="pc rise"
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={reset}
        style={{
          transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(${hov ? -4 : 0}px)`,
          boxShadow: hov ? C.shadowLg : 'none',
          borderColor: hov ? 'transparent' : C.border,
          transition: hov
            ? 'box-shadow .25s, border-color .25s'
            : 'all .5s cubic-bezier(.23,1,.32,1)',
          animationDelay: `${index * 0.05}s`,
        }}
      >
        {/* Media */}
        <div className="pc-media">
          {project.image_url
            ? <img src={project.image_url} alt="" loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none' }} />
            : <span className="pc-glyph">{(project.title || '?')[0].toUpperCase()}</span>
          }
          {project.live_url && (
            <div className="pc-live"><span className="pc-dot" />LIVE</div>
          )}
        </div>

        {/* Body */}
        <div className="pc-body">
          <div className="pc-who">
            <div className="av pc-av">
              {avatar ? <img src={avatar} alt="" /> : initials(fname)}
            </div>
            <span className="pc-handle">@{uname}</span>
            <span className="pc-time">{timeSince(project.created_at)}</span>
          </div>

          <h3 className="pc-title">{project.title}</h3>

          {project.problem_solved ? (
            <div className="pc-prob">
              <div className="pc-prob-l">Problem solved</div>
              <p className="pc-prob-t">{project.problem_solved}</p>
            </div>
          ) : project.description ? (
            <p className="pc-desc">{project.description}</p>
          ) : null}

          {techs.length > 0 && (
            <div className="pc-tags">
              {techs.map(t => (
                <span key={t} className={`pill ${tagClass(t)}`}>{t}</span>
              ))}
              {extra > 0 && <span className="pc-more">+{extra}</span>}
            </div>
          )}

          <div className="pc-foot">
            <div className="pc-links">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="pc-link" onClick={e => e.stopPropagation()}>
                  Code ↗
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                  className="pc-link live" onClick={e => e.stopPropagation()}>
                  Live ↗
                </a>
              )}
            </div>
            <span className="pc-likes">♥ {project.likes_count || 0}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

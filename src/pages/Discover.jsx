import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects, getAllProfiles, searchUsers, likeProject, unlikeProject, hasLiked } from '../lib/supabase.js'
import { initials, timeSince } from '../lib/theme.js'

/* ── Tokens ── */
const mk = (d) => ({
  bg:     d ? '#0A0A0F' : '#FAFAFA',
  bg2:    d ? '#111118' : '#FFFFFF',
  bg3:    d ? '#16161F' : '#F5F4F0',
  ink:    d ? '#F0F0FF' : '#0F0F1A',
  ink2:   d ? '#A0A0C0' : '#3D3D5C',
  muted:  d ? '#5A5A80' : '#9090A8',
  border: d ? '#1E1E2E' : '#EFEFEF',
  o:      '#FF6B35',
  o2:     '#FF8C5A',
  oBg:    d ? 'rgba(255,107,53,0.14)' : '#FFF1EC',
  card:   d ? '#111118' : '#FFFFFF',
  cardB:  d ? '#1E1E2E' : '#EFEFEF',
  input:  d ? '#16161F' : '#FFFFFF',
  shadow: d ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 20px rgba(15,15,26,0.08)',
})

const makeCSS = (d) => {
  const c = mk(d)
  return `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${c.bg};color:${c.ink};font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
button{font-family:'Plus Jakarta Sans',sans-serif}

/* ── ROOT ── */
.disc-root{min-height:100vh;background:${c.bg}}
.disc-layout{max-width:1060px;margin:0 auto;padding:0 1rem;display:grid;grid-template-columns:1fr 340px;gap:2.5rem}
@media(max-width:860px){.disc-layout{grid-template-columns:1fr;gap:0}}

/* ── TOPBAR ── */
.disc-topbar{
  position:sticky;top:68px;z-index:80;
  background:${c.bg}EE;backdrop-filter:blur(16px);
  border-bottom:1px solid ${c.border};
  padding:.75rem 0;margin-bottom:1.5rem;
}
.disc-topbar-inner{
  max-width:1060px;margin:0 auto;padding:0 1rem;
  display:flex;align-items:center;gap:.75rem;
}
.disc-search-wrap{position:relative;flex:1}
.disc-search-wrap input{
  width:100%;padding:.7rem 1rem .7rem 2.6rem;
  background:${c.input};border:1.5px solid ${c.border};
  border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.875rem;color:${c.ink};outline:none;
  transition:border-color .2s,box-shadow .2s;
}
.disc-search-wrap input:focus{border-color:${c.o};box-shadow:0 0 0 3px rgba(255,107,53,0.1)}
.disc-search-wrap input::placeholder{color:${c.muted}}
.disc-search-ic{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);color:${c.muted};pointer-events:none}
.disc-search-drop{
  position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:100;
  background:${c.card};border:1px solid ${c.border};
  border-radius:16px;overflow:hidden;box-shadow:${c.shadow};
}
.disc-search-row{
  display:flex;align-items:center;gap:.65rem;padding:.75rem 1rem;
  border-bottom:1px solid ${c.border};transition:background .15s;cursor:pointer;
}
.disc-search-row:last-child{border:none}
.disc-search-row:hover{background:${c.oBg}}
.disc-search-av{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,${c.o},#FF5FA2);
  display:flex;align-items:center;justify-content:center;
  font-size:.6rem;font-weight:800;color:#fff;overflow:hidden;
}
.disc-search-av img{width:100%;height:100%;object-fit:cover}

/* Tabs */
.disc-tabs{display:flex;background:${c.bg3};border:1px solid ${c.border};border-radius:100px;padding:3px;flex-shrink:0}
.disc-tab{
  padding:.48rem 1.1rem;border:none;border-radius:100px;background:transparent;
  cursor:pointer;font-weight:700;font-size:.8rem;color:${c.muted};transition:all .2s;
}
.disc-tab.on{background:${c.o};color:#fff;box-shadow:0 3px 10px rgba(255,107,53,0.35)}

/* Theme toggle */
.disc-theme{
  width:38px;height:38px;border-radius:100px;flex-shrink:0;
  background:${c.bg3};border:1px solid ${c.border};
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;font-size:1rem;color:${c.muted};transition:all .2s;
}
.disc-theme:hover{border-color:${c.o};color:${c.o}}

/* ── STORIES ROW ── */
.stories{
  display:flex;gap:.75rem;overflow-x:auto;padding:.75rem 0 1.25rem;
  scrollbar-width:none;-ms-overflow-style:none;
}
.stories::-webkit-scrollbar{display:none}
.story{
  display:flex;flex-direction:column;align-items:center;gap:.4rem;
  flex-shrink:0;cursor:pointer;
}
.story-ring{
  width:58px;height:58px;border-radius:50%;padding:2.5px;
  background:linear-gradient(135deg,${c.o},#FF5FA2);
  transition:transform .2s cubic-bezier(.34,1.56,.64,1);
}
.story-ring:hover{transform:scale(1.08)}
.story-ring.seen{background:${c.border}}
.story-av{
  width:100%;height:100%;border-radius:50%;
  background:${d ? '#1A1A28' : '#EEE'};
  border:2.5px solid ${c.bg};
  display:flex;align-items:center;justify-content:center;
  font-size:.72rem;font-weight:800;color:${c.o};overflow:hidden;
}
.story-av img{width:100%;height:100%;object-fit:cover}
.story-name{font-size:.65rem;font-weight:600;color:${c.ink2};
  max-width:58px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}

/* ── STACK PILLS ── */
.stack-pills{
  display:flex;gap:.4rem;overflow-x:auto;padding-bottom:.75rem;
  margin-bottom:1.5rem;scrollbar-width:none;
}
.stack-pills::-webkit-scrollbar{display:none}
.sp{
  flex-shrink:0;padding:.4rem .9rem;border-radius:100px;
  border:1.5px solid ${c.border};background:transparent;
  font-size:.78rem;font-weight:600;color:${c.muted};
  cursor:pointer;transition:all .18s;white-space:nowrap;
}
.sp:hover{border-color:${c.o};color:${c.o}}
.sp.on{background:${c.o};border-color:${c.o};color:#fff;box-shadow:0 3px 10px rgba(255,107,53,0.3)}

/* ── POST CARD (feed item) ── */
.post{
  background:${c.card};border:1px solid ${c.border};
  border-radius:20px;margin-bottom:1rem;overflow:hidden;
  transition:box-shadow .25s;
}
.post:hover{box-shadow:${c.shadow}}

/* Post header */
.post-hd{display:flex;align-items:center;gap:.75rem;padding:1rem 1.15rem .75rem}
.post-av{
  width:40px;height:40px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,${c.o},#FF5FA2);
  display:flex;align-items:center;justify-content:center;
  font-size:.72rem;font-weight:800;color:#fff;overflow:hidden;
}
.post-av img{width:100%;height:100%;object-fit:cover}
.post-meta{flex:1;min-width:0}
.post-name{font-size:.9rem;font-weight:800;color:${c.ink}}
.post-detail{font-size:.75rem;color:${c.muted};margin-top:.08rem}
.post-live{
  display:flex;align-items:center;gap:5px;
  background:${c.oBg};border:1px solid rgba(255,107,53,0.25);
  border-radius:100px;padding:3px 10px;
  font-size:.62rem;font-weight:800;color:${c.o};letter-spacing:.06em;
  flex-shrink:0;
}
.post-live-dot{
  width:5px;height:5px;border-radius:50%;background:${c.o};
  animation:livePulse 1.8s infinite;
}
@keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}

/* Post media */
.post-media{
  width:100%;background:linear-gradient(135deg,${c.oBg},${d?'rgba(255,107,53,0.05)':'#FFF8F5'});
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  min-height:200px;
}
.post-media img{width:100%;object-fit:cover;display:block;transition:transform .5s ease}
.post:hover .post-media img{transform:scale(1.02)}
.post-glyph{
  font-size:4.5rem;font-weight:900;letter-spacing:-.04em;
  color:${c.o};opacity:.18;user-select:none;
}

/* Post body */
.post-body{padding:.9rem 1.15rem}
.post-title{font-size:1.05rem;font-weight:800;color:${c.ink};
  letter-spacing:-.02em;margin-bottom:.5rem;line-height:1.3}
.post-prob{
  border-left:3px solid ${c.o};background:${c.oBg};
  border-radius:0 10px 10px 0;padding:.55rem .75rem;
  margin-bottom:.75rem;
}
.post-prob-l{font-size:.62rem;font-weight:800;color:${c.o};
  letter-spacing:.08em;text-transform:uppercase;margin-bottom:.2rem}
.post-prob-t{font-size:.82rem;color:${c.ink2};line-height:1.55;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.post-tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:.75rem}
.post-tag{
  padding:.2rem .65rem;border-radius:100px;
  background:${c.oBg};color:${c.o};
  font-size:.65rem;font-weight:700;letter-spacing:.03em;
}

/* Post actions */
.post-actions{
  display:flex;align-items:center;gap:0;
  padding:.6rem 1.15rem .9rem;border-top:1px solid ${c.border};
}
.post-act{
  display:flex;align-items:center;gap:.35rem;
  padding:.5rem .85rem;border-radius:100px;border:none;background:transparent;
  cursor:pointer;font-size:.82rem;font-weight:700;color:${c.muted};
  transition:all .2s;
}
.post-act:hover{background:${c.oBg};color:${c.o}}
.post-act.liked{color:${c.o}}
.post-act-sep{width:1px;height:18px;background:${c.border};margin:0 .25rem}
.post-link{
  display:flex;align-items:center;gap:.35rem;
  padding:.5rem .85rem;border-radius:100px;
  font-size:.82rem;font-weight:700;color:${c.muted};
  transition:all .2s;margin-left:auto;
}
.post-link:hover{background:${c.oBg};color:${c.o}}

/* ── EXPLORE GRID (builders tab) ── */
.explore-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:3px;
  border-radius:12px;overflow:hidden;
}
.explore-cell{
  aspect-ratio:1;background:${c.bg3};
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;position:relative;cursor:pointer;
}
.explore-cell img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.explore-cell:hover img{transform:scale(1.08)}
.explore-cell-glyph{
  font-size:2.2rem;font-weight:900;color:${c.o};opacity:.25;
}
.explore-cell-ov{
  position:absolute;inset:0;background:rgba(255,107,53,0);
  display:flex;align-items:center;justify-content:center;
  transition:background .25s;
}
.explore-cell:hover .explore-cell-ov{background:rgba(255,107,53,0.12)}

/* ── SIDEBAR ── */
.disc-sidebar{padding-top:1.5rem}
@media(max-width:860px){.disc-sidebar{display:none}}

.side-card{
  background:${c.card};border:1px solid ${c.border};
  border-radius:20px;padding:1.25rem;margin-bottom:1.25rem;
}
.side-label{
  font-size:.68rem;font-weight:800;letter-spacing:.12em;
  text-transform:uppercase;color:${c.o};
  display:flex;align-items:center;gap:.4rem;margin-bottom:1rem;
}
.side-label::before{content:'';width:14px;height:2px;background:${c.o};border-radius:1px}

/* Builder row */
.builder-row{
  display:flex;align-items:center;gap:.65rem;
  padding:.5rem 0;border-bottom:1px solid ${c.border};
}
.builder-row:last-child{border:none;padding-bottom:0}
.br-av{
  width:36px;height:36px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,${c.o},#FF5FA2);
  display:flex;align-items:center;justify-content:center;
  font-size:.65rem;font-weight:800;color:#fff;overflow:hidden;
}
.br-av img{width:100%;height:100%;object-fit:cover}
.br-name{font-size:.85rem;font-weight:700;color:${c.ink};
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.br-handle{font-size:.72rem;color:${c.muted}}
.br-follow{
  margin-left:auto;flex-shrink:0;
  padding:.32rem .85rem;border-radius:100px;border:1.5px solid ${c.o};
  background:transparent;color:${c.o};font-size:.75rem;font-weight:700;
  cursor:pointer;transition:all .2s;
}
.br-follow:hover{background:${c.o};color:#fff}
.br-follow.on{background:${c.o};color:#fff;border-color:${c.o}}

/* Trending tags */
.trend-tag{
  display:flex;align-items:center;justify-content:space-between;
  padding:.6rem 0;border-bottom:1px solid ${c.border};cursor:pointer;
}
.trend-tag:last-child{border:none;padding-bottom:0}
.trend-tag-n{font-size:.875rem;font-weight:700;color:${c.ink}}
.trend-tag-c{font-size:.75rem;color:${c.muted}}

/* ── EMPTY ── */
.post-empty{
  background:${c.card};border:1.5px dashed ${c.border};
  border-radius:20px;padding:4rem 2rem;text-align:center;margin-bottom:1rem;
}
.post-empty-ic{
  width:52px;height:52px;border-radius:16px;margin:0 auto 1rem;
  background:${c.oBg};color:${c.o};font-size:1.4rem;font-weight:800;
  display:flex;align-items:center;justify-content:center;
}
.post-empty h3{font-size:1rem;font-weight:800;color:${c.ink};margin-bottom:.45rem}
.post-empty p{font-size:.875rem;color:${c.muted};max-width:300px;margin:0 auto 1.5rem;line-height:1.65}
.post-empty-btn{
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.7rem 1.5rem;border-radius:100px;border:none;
  background:${c.o};color:#fff;font-weight:700;font-size:.875rem;cursor:pointer;
  box-shadow:0 4px 14px rgba(255,107,53,0.3);transition:all .2s;text-decoration:none;
}
.post-empty-btn:hover{background:${c.o2};transform:translateY(-2px)}

/* ── SKELETON ── */
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.skel{
  border-radius:16px;
  background:linear-gradient(90deg,${c.bg3} 25%,${d?'#1E1E2E':'#E8E6E0'} 50%,${c.bg3} 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;
}
.post-skel{
  background:${c.card};border:1px solid ${c.border};
  border-radius:20px;margin-bottom:1rem;overflow:hidden;
}

/* ── ENTRANCE ── */
@keyframes riseIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.rise{animation:riseIn .45s cubic-bezier(.23,1,.32,1) both}

@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`}

const STACKS = ['All','React','Supabase','Node.js','Next.js','Python','Flutter','TypeScript','Go','Firebase']

function PostSkeleton() {
  return (
    <div className="post-skel">
      <div style={{ padding: '1rem 1.15rem .75rem', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
        <div className="skel" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skel" style={{ height: 14, width: '45%', marginBottom: 6 }} />
          <div className="skel" style={{ height: 11, width: '30%' }} />
        </div>
      </div>
      <div className="skel" style={{ margin: '0 1.15rem', height: 220, borderRadius: 14 }} />
      <div style={{ padding: '.9rem 1.15rem' }}>
        <div className="skel" style={{ height: 16, width: '70%', marginBottom: 8 }} />
        <div className="skel" style={{ height: 12, width: '90%', marginBottom: 6 }} />
        <div className="skel" style={{ height: 12, width: '80%' }} />
      </div>
    </div>
  )
}

function PostCard({ project, user }) {
  const [liked, setLiked]   = useState(false)
  const [likes, setLikes]   = useState(project.likes_count || 0)
  const [busy, setBusy]     = useState(false)
  const uname = project.profiles?.username || 'builder'
  const fname = project.profiles?.full_name || uname
  const avatar = project.profiles?.avatar_url
  const techs = (project.technologies || []).slice(0, 4)

  const toggleLike = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    const next = !liked
    setLiked(next)
    setLikes(n => n + (next ? 1 : -1))
    try {
      next
        ? await likeProject(user.id, project.id)
        : await unlikeProject(user.id, project.id)
    } catch {
      setLiked(!next)
      setLikes(n => n + (next ? -1 : 1))
    } finally { setBusy(false) }
  }

  return (
    <article className="post rise">
      {/* Header */}
      <div className="post-hd">
        <Link to={`/profile/${uname}`} className="post-av">
          {avatar ? <img src={avatar} alt="" /> : initials(fname)}
        </Link>
        <div className="post-meta">
          <Link to={`/profile/${uname}`} className="post-name">{fname}</Link>
          <div className="post-detail">@{uname} · {timeSince(project.created_at)}</div>
        </div>
        {project.live_url && (
          <div className="post-live">
            <span className="post-live-dot" />LIVE
          </div>
        )}
      </div>

      {/* Media */}
      <Link to={`/project/${project.id}`}>
        <div className="post-media" style={{ height: project.image_url ? 'auto' : 200 }}>
          {project.image_url
            ? <img src={project.image_url} alt={project.title} loading="lazy"
                onError={e => e.currentTarget.parentElement.style.minHeight = '200px'} />
            : <span className="post-glyph">{(project.title || '?')[0].toUpperCase()}</span>
          }
        </div>
      </Link>

      {/* Body */}
      <div className="post-body">
        <Link to={`/project/${project.id}`}>
          <h2 className="post-title">{project.title}</h2>
        </Link>

        {project.problem_solved && (
          <div className="post-prob">
            <div className="post-prob-l">Problem solved</div>
            <p className="post-prob-t">{project.problem_solved}</p>
          </div>
        )}

        {techs.length > 0 && (
          <div className="post-tags">
            {techs.map(t => <span key={t} className="post-tag">{t}</span>)}
            {(project.technologies?.length || 0) > 4 && (
              <span className="post-tag" style={{ opacity: .6 }}>+{project.technologies.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="post-actions">
        <button className={`post-act ${liked ? 'liked' : ''}`} onClick={toggleLike} aria-label="Like">
          {liked ? '♥' : '♡'} {likes > 0 ? likes : ''}
        </button>
        <div className="post-act-sep" />
        <Link to={`/project/${project.id}`} className="post-act">
          💬 View
        </Link>
        {(project.github_url || project.live_url) && (
          <>
            <div className="post-act-sep" />
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="post-link">
                Open ↗
              </a>
            )}
            {project.github_url && !project.live_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="post-link">
                Code ↗
              </a>
            )}
          </>
        )}
      </div>
    </article>
  )
}

export default function Discover({ user }) {
  const [dark, setDark]         = useState(() => localStorage.getItem('shw-dark') === '1')
  const [tab, setTab]           = useState('feed')
  const [projects, setProjects] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [filter, setFilter]     = useState('All')
  const timerRef = useRef(null)

  const toggleDark = () => {
    setDark(d => { localStorage.setItem('shw-dark', d ? '0' : '1'); return !d })
  }

  useEffect(() => {
    let alive = true
    Promise.all([getAllProjects(40), getAllProfiles(20)]).then(([pr, pf]) => {
      if (!alive) return
      setProjects(pr.data || [])
      setProfiles(pf.data || [])
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (query.trim().length < 2) { setResults([]); return }
    timerRef.current = setTimeout(() => {
      searchUsers(query.trim()).then(r => setResults(r.data || []))
    }, 220)
    return () => clearTimeout(timerRef.current)
  }, [query])

  const c = mk(dark)
  const css = makeCSS(dark)

  const filtered = projects.filter(p =>
    filter === 'All' ||
    (p.technologies || []).some(t => t.toLowerCase().includes(filter.toLowerCase()))
  )

  // Trending stacks
  const stackCounts = {}
  projects.forEach(p => (p.technologies || []).forEach(t => { stackCounts[t] = (stackCounts[t] || 0) + 1 }))
  const trending = Object.entries(stackCounts).sort((a,b)=>b[1]-a[1]).slice(0,6)

  return (
    <div className="disc-root">
      <style>{css}</style>

      {/* Sticky topbar */}
      <div className="disc-topbar">
        <div className="disc-topbar-inner">
          <div className="disc-search-wrap">
            <span className="disc-search-ic" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search projects, builders…"
              aria-label="Search"
            />
            {results.length > 0 && (
              <div className="disc-search-drop">
                {results.map(r => (
                  <Link key={r.id} to={`/profile/${r.username}`}
                    className="disc-search-row" onClick={() => setQuery('')}>
                    <div className="disc-search-av">
                      {r.avatar_url ? <img src={r.avatar_url} alt="" /> : initials(r.full_name || r.username)}
                    </div>
                    <div>
                      <div style={{ fontSize: '.875rem', fontWeight: 700, color: c.ink }}>
                        {r.full_name || r.username}
                      </div>
                      <div style={{ fontSize: '.72rem', color: c.muted }}>@{r.username}</div>
                    </div>
                    {r.role && (
                      <span style={{ marginLeft: 'auto', padding: '.2rem .65rem', borderRadius: 100,
                        background: c.oBg, color: c.o, fontSize: '.62rem', fontWeight: 700 }}>
                        {r.role}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="disc-tabs" role="tablist">
            {[['feed','Feed'],['explore','Explore'],['builders','Builders']].map(([v,l]) => (
              <button key={v} role="tab" aria-selected={tab===v}
                className={`disc-tab ${tab===v?'on':''}`} onClick={() => setTab(v)}>
                {l}
              </button>
            ))}
          </div>

          <button className="disc-theme" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? '☀' : '☽'}
          </button>
        </div>
      </div>

      <div className="disc-layout" style={{ paddingTop: '1rem' }}>

        {/* ── MAIN COLUMN ── */}
        <main>
          {/* Stories row — builder avatars */}
          {!loading && profiles.length > 0 && (
            <div className="stories rise">
              {profiles.slice(0, 12).map(p => (
                <Link key={p.id} to={`/profile/${p.username}`} className="story">
                  <div className="story-ring">
                    <div className="story-av">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" /> : initials(p.full_name || p.username)}
                    </div>
                  </div>
                  <span className="story-name">{(p.full_name || p.username).split(' ')[0]}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Stack filter pills */}
          {tab === 'feed' && (
            <div className="stack-pills rise" style={{ animationDelay: '.06s' }}>
              {STACKS.map(s => (
                <button key={s} className={`sp ${filter===s?'on':''}`}
                  onClick={() => setFilter(s)} aria-pressed={filter===s}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* FEED */}
          {tab === 'feed' && (
            loading ? (
              [0,1,2,3].map(i => <PostSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div className="post-empty">
                <div className="post-empty-ic">◎</div>
                <h3>{filter==='All'?'No projects yet':`No ${filter} projects`}</h3>
                <p>Be the first to share one.</p>
                <Link to="/project/new" className="post-empty-btn">+ Share a project</Link>
              </div>
            ) : (
              filtered.map((p, i) => (
                <div key={p.id} className="rise" style={{ animationDelay: `${i*.04}s` }}>
                  <PostCard project={p} user={user} />
                </div>
              ))
            )
          )}

          {/* EXPLORE — Instagram-style grid */}
          {tab === 'explore' && (
            <div className="rise">
              {loading ? (
                <div className="explore-grid">
                  {[0,1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="explore-cell">
                      <div className="skel" style={{ width:'100%',height:'100%',borderRadius:0 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="explore-grid">
                  {projects.map(p => (
                    <Link key={p.id} to={`/project/${p.id}`} className="explore-cell">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.title} loading="lazy" />
                        : <span className="explore-cell-glyph">{(p.title||'?')[0].toUpperCase()}</span>
                      }
                      <div className="explore-cell-ov" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BUILDERS */}
          {tab === 'builders' && (
            <div className="rise">
              {loading ? (
                [0,1,2,3,4].map(i => (
                  <div key={i} style={{ background:c.card,border:`1px solid ${c.border}`,borderRadius:16,padding:'1rem',marginBottom:'1rem',display:'flex',gap:'.75rem',alignItems:'center' }}>
                    <div className="skel" style={{ width:42,height:42,borderRadius:'50%',flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div className="skel" style={{ height:14,width:'40%',marginBottom:6 }} />
                      <div className="skel" style={{ height:11,width:'25%' }} />
                    </div>
                  </div>
                ))
              ) : (
                profiles.map((p, i) => {
                  const name = p.full_name || p.username
                  return (
                    <Link key={p.id} to={`/profile/${p.username}`}
                      className="rise"
                      style={{ display:'flex',alignItems:'center',gap:'.75rem',
                        background:c.card,border:`1px solid ${c.border}`,borderRadius:16,
                        padding:'1rem 1.15rem',marginBottom:'.75rem',
                        transition:'all .25s',animationDelay:`${i*.04}s`,
                        textDecoration:'none'
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=c.o;e.currentTarget.style.transform='translateY(-2px)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=c.border;e.currentTarget.style.transform=''}}
                    >
                      <div className="br-av">
                        {p.avatar_url?<img src={p.avatar_url} alt=""/>:initials(name)}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div className="br-name">{name}</div>
                        <div className="br-handle">@{p.username}{p.role?` · ${p.role}`:''}</div>
                      </div>
                      {p.is_verified&&<span style={{ fontSize:'.7rem',fontWeight:800,color:c.o }}>✓</span>}
                      {p.trust_score>0&&<span style={{ fontSize:'.78rem',fontWeight:800,color:c.o }}>{p.trust_score}pts</span>}
                    </Link>
                  )
                })
              )}
            </div>
          )}
        </main>

        {/* ── SIDEBAR ── */}
        <aside className="disc-sidebar">

          {/* Trending stacks */}
          {trending.length > 0 && (
            <div className="side-card rise" style={{ animationDelay: '.1s' }}>
              <div className="side-label">Trending stacks</div>
              {trending.map(([tag, count]) => (
                <div key={tag} className="trend-tag"
                  onClick={() => { setFilter(tag); setTab('feed') }}>
                  <span className="trend-tag-n">{tag}</span>
                  <span className="trend-tag-c">{count} project{count!==1?'s':''}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggested builders */}
          {profiles.length > 0 && (
            <div className="side-card rise" style={{ animationDelay: '.15s' }}>
              <div className="side-label">Builders to follow</div>
              {profiles.slice(0, 5).map(p => {
                const name = p.full_name || p.username
                return (
                  <div key={p.id} className="builder-row">
                    <Link to={`/profile/${p.username}`} className="br-av">
                      {p.avatar_url?<img src={p.avatar_url} alt=""/>:initials(name)}
                    </Link>
                    <div style={{ flex:1,minWidth:0 }}>
                      <Link to={`/profile/${p.username}`} className="br-name">{name}</Link>
                      <div className="br-handle">@{p.username}</div>
                    </div>
                    <Link to={`/profile/${p.username}`} className="br-follow">Follow</Link>
                  </div>
                )
              })}
            </div>
          )}

          {/* Share CTA */}
          <div className="side-card rise" style={{ animationDelay: '.2s', background: c.oBg, border: `1px solid rgba(255,107,53,0.2)` }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: c.o, marginBottom: '.5rem' }}>
              Share what you're building
            </div>
            <p style={{ fontSize: '.8rem', color: c.ink2, lineHeight: 1.65, marginBottom: '1rem' }}>
              The problem you solved is more valuable than any CV. Show your work.
            </p>
            <Link to="/project/new" className="post-empty-btn" style={{ width:'100%',justifyContent:'center' }}>
              + Add a project
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

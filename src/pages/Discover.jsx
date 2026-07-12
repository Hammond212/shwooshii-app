import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects, getAllProfiles, searchUsers } from '../lib/supabase.js'
import { initials, timeSince, tagClass } from '../lib/theme.js'
import ProjectCard from '../components/ProjectCard.jsx'

/* ── Tokens ── */
const T = {
  l: { // light
    bg:     '#FFFFFF',
    bg2:    '#FAFAF8',
    ink:    '#0F0F1A',
    ink2:   '#3D3D5C',
    muted:  '#8888A8',
    border: '#F0EEE8',
    card:   '#FFFFFF',
    cardB:  '#F0EEE8',
    o:      '#FF6B35',
    o2:     '#FF8C5A',
    oBg:    '#FFF1EC',
    input:  '#FAFAF8',
  },
  d: { // dark
    bg:     '#0A0A0F',
    bg2:    '#111118',
    ink:    '#F0F0FF',
    ink2:   '#A0A0C0',
    muted:  '#5A5A80',
    border: '#1E1E2E',
    card:   '#13131F',
    cardB:  '#1E1E2E',
    o:      '#FF6B35',
    o2:     '#FF8C5A',
    oBg:    'rgba(255,107,53,0.12)',
    input:  '#0E0E18',
  },
}

const CSS = (d) => {
  const c = d ? T.d : T.l
  return `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${c.bg};color:${c.ink};font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}

.disc{min-height:100vh;background:${c.bg}}
.disc-wrap{max-width:1100px;margin:0 auto;padding:2.5rem 1.5rem 5rem}

/* ── Header ── */
.disc-hd{margin-bottom:2.5rem}
.disc-eyebrow{
  font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:${c.o};display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem;
}
.disc-eyebrow::before{content:'';width:18px;height:2px;border-radius:1px;background:${c.o}}
.disc-title{
  font-size:clamp(2rem,5vw,3.2rem);font-weight:900;
  letter-spacing:-.04em;line-height:1.08;
  color:${c.ink};margin-bottom:.6rem;
}
.disc-title span{color:${c.o}}
.disc-sub{color:${c.muted};font-size:.95rem;line-height:1.65;max-width:480px}

/* ── Stats strip ── */
.disc-stats{
  display:flex;gap:2.5rem;padding:1.25rem 0;
  border-top:1px solid ${c.border};border-bottom:1px solid ${c.border};
  margin-bottom:2rem;flex-wrap:wrap;
}
.disc-stat{display:flex;align-items:baseline;gap:.4rem}
.disc-stat-n{font-size:1.5rem;font-weight:900;letter-spacing:-.03em;color:${c.o}}
.disc-stat-l{font-size:.8rem;color:${c.muted};font-weight:500}

/* ── Search + tabs ── */
.disc-bar{display:flex;gap:.75rem;margin-bottom:1.5rem;flex-wrap:wrap;position:relative}
.disc-search{
  position:relative;flex:1;min-width:240px;
}
.disc-search-ic{
  position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);
  color:${c.muted};pointer-events:none;font-size:1rem;
}
.disc-search input{
  width:100%;padding:.85rem 1rem .85rem 2.85rem;
  background:${c.input};
  border:1.5px solid ${c.border};
  border-radius:100px;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.9rem;color:${c.ink};outline:none;
  transition:border-color .2s,box-shadow .2s;
}
.disc-search input:focus{
  border-color:${c.o};
  box-shadow:0 0 0 4px rgba(255,107,53,0.1);
}
.disc-search input::placeholder{color:${c.muted}}

.disc-tabs{
  display:flex;background:${c.bg2};
  border:1px solid ${c.border};border-radius:100px;padding:4px;flex-shrink:0;
}
.disc-tab{
  padding:.52rem 1.2rem;border:none;border-radius:100px;
  background:transparent;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:.82rem;color:${c.muted};
  transition:all .22s;
}
.disc-tab.on{
  background:${c.o};color:#fff;
  box-shadow:0 4px 12px rgba(255,107,53,0.3);
}

/* ── Search dropdown ── */
.disc-drop{
  position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:40;
  background:${c.card};border:1px solid ${c.border};
  border-radius:14px;overflow:hidden;
  box-shadow:0 12px 40px rgba(15,15,26,${d?'.5':'.12'});
}
.disc-row{
  display:flex;align-items:center;gap:.7rem;
  padding:.8rem 1.1rem;border-bottom:1px solid ${c.border};
  cursor:pointer;transition:background .15s;text-decoration:none;
}
.disc-row:last-child{border-bottom:none}
.disc-row:hover{background:${c.oBg}}
.disc-row-av{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,${c.o},#FF5FA2);
  display:flex;align-items:center;justify-content:center;
  font-size:.6rem;font-weight:800;color:#fff;overflow:hidden;
}
.disc-row-av img{width:100%;height:100%;object-fit:cover}
.disc-row-n{font-size:.875rem;font-weight:700;color:${c.ink}}
.disc-row-h{font-size:.72rem;color:${c.muted}}
.disc-row-role{
  margin-left:auto;padding:.2rem .65rem;border-radius:100px;
  background:${c.oBg};color:${c.o};
  font-size:.62rem;font-weight:700;letter-spacing:.04em;
}

/* ── Filters ── */
.disc-filters{display:flex;gap:.4rem;flex-wrap:wrap;align-items:center;margin-bottom:2rem}
.disc-flabel{font-size:.68rem;font-weight:800;color:${c.muted};
  letter-spacing:.1em;text-transform:uppercase;margin-right:.25rem}
.disc-chip{
  padding:.42rem 1rem;border-radius:100px;
  border:1.5px solid ${c.border};background:transparent;
  font-family:'Plus Jakarta Sans',sans-serif;
  font-size:.8rem;font-weight:600;color:${c.muted};
  cursor:pointer;transition:all .18s;
}
.disc-chip:hover{border-color:${c.o};color:${c.o}}
.disc-chip.on{
  border-color:${c.o};background:${c.oBg};color:${c.o};
}

/* ── Grid ── */
.disc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.15rem}
.disc-grid-dev{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}

/* ── Developer card ── */
.dv{
  background:${c.card};border:1px solid ${c.border};
  border-radius:18px;padding:1.4rem;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;
  transition:transform .25s cubic-bezier(.34,1.56,.64,1),
             box-shadow .25s,border-color .25s;
  text-decoration:none;display:block;
}
.dv:hover{
  transform:translateY(-4px);
  box-shadow:0 12px 36px rgba(255,107,53,0.12);
  border-color:${c.o};
}
.dv-top{display:flex;align-items:center;gap:.85rem;margin-bottom:1rem}
.dv-av{
  width:46px;height:46px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,${c.o},#FF5FA2);
  display:flex;align-items:center;justify-content:center;
  font-size:.82rem;font-weight:800;color:#fff;overflow:hidden;
}
.dv-av img{width:100%;height:100%;object-fit:cover}
.dv-n{font-size:.9rem;font-weight:800;color:${c.ink};
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:.15rem}
.dv-h{font-size:.75rem;color:${c.muted}}
.dv-badge{
  margin-left:auto;padding:.22rem .65rem;border-radius:100px;
  background:${c.oBg};color:${c.o};
  font-size:.6rem;font-weight:700;letter-spacing:.04em;flex-shrink:0;
}
.dv-foot{
  display:flex;align-items:center;justify-content:space-between;
  padding-top:.85rem;border-top:1px solid ${c.border};
}
.dv-role{
  padding:.28rem .8rem;border-radius:100px;
  background:${c.oBg};color:${c.o};
  font-size:.68rem;font-weight:700;letter-spacing:.04em;
}
.dv-score{font-size:.78rem;font-weight:800;color:${c.o}}
.dv-loc{
  margin-top:.75rem;padding-top:.75rem;border-top:1px solid ${c.border};
  font-size:.75rem;color:${c.muted};
}

/* ── Empty ── */
.disc-empty{
  grid-column:1/-1;text-align:center;padding:4.5rem 2rem;
  background:${c.bg2};border:1.5px dashed ${c.border};border-radius:20px;
}
.disc-empty-icon{
  width:56px;height:56px;border-radius:16px;margin:0 auto 1.25rem;
  background:${c.oBg};color:${c.o};
  display:flex;align-items:center;justify-content:center;
  font-size:1.5rem;font-weight:800;
}
.disc-empty h3{font-size:1rem;font-weight:800;color:${c.ink};margin-bottom:.5rem}
.disc-empty p{font-size:.875rem;color:${c.muted};max-width:340px;margin:0 auto 1.5rem;line-height:1.65}
.disc-btn{
  display:inline-flex;align-items:center;gap:.4rem;
  padding:.7rem 1.5rem;border-radius:100px;border:none;cursor:pointer;
  background:${c.o};color:#fff;font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:700;font-size:.875rem;
  box-shadow:0 4px 14px rgba(255,107,53,0.3);
  transition:all .2s;text-decoration:none;
}
.disc-btn:hover{background:${c.o2};transform:translateY(-2px)}

/* ── Footer ── */
.disc-count{
  text-align:center;margin-top:3rem;padding-top:2rem;
  border-top:1px solid ${c.border};
  font-size:.78rem;color:${c.muted};letter-spacing:.05em;
}

/* ── Skeleton ── */
@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}
.skel{
  border-radius:16px;
  background:linear-gradient(90deg,${c.bg2} 25%,${d?'#1A1A28':'#EDEAE3'} 50%,${c.bg2} 75%);
  background-size:200% 100%;animation:shimmer 1.5s infinite;
}

/* ── Entrance ── */
@keyframes riseIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.rise{animation:riseIn .5s cubic-bezier(.23,1,.32,1) both}

/* ── Theme toggle ── */
.disc-theme-btn{
  display:flex;align-items:center;justify-content:center;
  width:42px;height:42px;border-radius:100px;flex-shrink:0;
  background:${c.bg2};border:1.5px solid ${c.border};
  cursor:pointer;font-size:1.1rem;
  transition:all .2s;color:${c.ink};
}
.disc-theme-btn:hover{border-color:${c.o};color:${c.o}}

@media(max-width:640px){
  .disc-title{font-size:2rem}
  .disc-bar{flex-direction:column}
  .disc-tabs{align-self:flex-start}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`}

const FILTERS = ['All','React','Node.js','Python','Supabase','Next.js','Flutter','TypeScript','Go']

function DevCard({ profile }) {
  const name = profile.full_name || profile.username
  return (
    <Link to={`/profile/${profile.username}`} className="dv rise" aria-label={`View ${name}`}>
      <div className="dv-top">
        <div className="dv-av">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="" />
            : initials(name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="dv-n">{name}</div>
          <div className="dv-h">@{profile.username}</div>
        </div>
        {profile.is_verified && <span className="dv-badge">✓ Verified</span>}
      </div>
      <div className="dv-foot">
        {profile.role && <span className="dv-role">{profile.role}</span>}
        {profile.trust_score > 0 && (
          <span className="dv-score">{profile.trust_score} pts</span>
        )}
      </div>
      {profile.location && <div className="dv-loc">◎ {profile.location}</div>}
    </Link>
  )
}

export default function Discover({ user }) {
  const [dark, setDark]         = useState(() => localStorage.getItem('shw-dark') === '1')
  const [tab, setTab]           = useState('projects')
  const [projects, setProjects] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [filter, setFilter]     = useState('All')
  const timerRef = useRef(null)

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem('shw-dark', d ? '0' : '1')
      return !d
    })
  }

  useEffect(() => {
    let alive = true
    Promise.all([getAllProjects(32), getAllProfiles(24)]).then(([pr, pf]) => {
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

  const filtered = projects.filter(p =>
    filter === 'All' ||
    (p.technologies || []).some(t => t.toLowerCase().includes(filter.toLowerCase()))
  )

  const css = CSS(dark)

  return (
    <div className="disc">
      <style>{css}</style>
      <div className="disc-wrap">

        {/* Header */}
        <header className="disc-hd rise">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div className="disc-eyebrow">Discover</div>
              <h1 className="disc-title">
                Real projects.<br />
                <span>Real builders.</span>
              </h1>
              <p className="disc-sub">
                Find what people are shipping and who you want to build with.
              </p>
            </div>
            <button className="disc-theme-btn" onClick={toggleDark} aria-label="Toggle dark mode">
              {dark ? '☀' : '☽'}
            </button>
          </div>
        </header>

        {/* Stats */}
        {!loading && (
          <div className="disc-stats rise" style={{ animationDelay: '.06s' }}>
            <div className="disc-stat">
              <span className="disc-stat-n">{projects.length}</span>
              <span className="disc-stat-l">projects</span>
            </div>
            <div className="disc-stat">
              <span className="disc-stat-n">{profiles.length}</span>
              <span className="disc-stat-l">builders</span>
            </div>
            <div className="disc-stat">
              <span className="disc-stat-n">∞</span>
              <span className="disc-stat-l">problems to solve</span>
            </div>
          </div>
        )}

        {/* Search + tabs */}
        <div className="disc-bar rise" style={{ animationDelay: '.1s' }}>
          <div className="disc-search">
            <span className="disc-search-ic" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search builders by name or username…"
              aria-label="Search builders"
            />
            {results.length > 0 && (
              <div className="disc-drop">
                {results.map(r => (
                  <Link key={r.id} to={`/profile/${r.username}`} className="disc-row" onClick={() => setQuery('')}>
                    <div className="disc-row-av">
                      {r.avatar_url ? <img src={r.avatar_url} alt="" /> : initials(r.full_name || r.username)}
                    </div>
                    <div>
                      <div className="disc-row-n">{r.full_name || r.username}</div>
                      <div className="disc-row-h">@{r.username}</div>
                    </div>
                    {r.role && <span className="disc-row-role">{r.role}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="disc-tabs" role="tablist">
            {['projects', 'builders'].map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`disc-tab ${tab === t ? 'on' : ''}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tech filters */}
        {tab === 'projects' && (
          <div className="disc-filters rise" style={{ animationDelay: '.14s' }}>
            <span className="disc-flabel">Stack</span>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`disc-chip ${filter === f ? 'on' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="disc-grid">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="skel" style={{ height: i % 3 === 0 ? 380 : 320 }} />
            ))}
          </div>
        ) : tab === 'projects' ? (
          <div className="disc-grid">
            {filtered.length === 0 ? (
              <div className="disc-empty">
                <div className="disc-empty-icon">◎</div>
                <h3>{filter === 'All' ? 'No projects yet' : `No ${filter} projects`}</h3>
                <p>Be the first to share one.</p>
                <Link to="/project/new" className="disc-btn">Share a project →</Link>
              </div>
            ) : (
              filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
            )}
          </div>
        ) : (
          <div className={`disc-grid disc-grid-dev`}>
            {profiles.length === 0 ? (
              <div className="disc-empty">
                <div className="disc-empty-icon">◆</div>
                <h3>No builders yet</h3>
                <p>Sign up and be one of the first.</p>
              </div>
            ) : (
              profiles.map((p, i) => <DevCard key={p.id} profile={p} />)
            )}
          </div>
        )}

        {/* Count */}
        {!loading && (
          <p className="disc-count">
            {tab === 'projects'
              ? `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`
              : `${profiles.length} builder${profiles.length !== 1 ? 's' : ''} on Shwooshii`}
          </p>
        )}
      </div>
    </div>
  )
}

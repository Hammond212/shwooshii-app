import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects, getAllProfiles, searchUsers } from '../lib/supabase.js'
import { C, FONT, BASE_CSS, initials } from '../lib/theme.js'
import ProjectCard from '../components/ProjectCard.jsx'

const CSS = BASE_CSS + `
.disc-head{margin-bottom:2rem}
.disc-bar{
  display:flex;gap:.75rem;margin-bottom:1.5rem;flex-wrap:wrap;
  position:relative;
}
.disc-search{position:relative;flex:1;min-width:240px}
.disc-search input{
  width:100%;padding:.8rem 1rem .8rem 2.75rem;
  background:${C.white};border:1.5px solid ${C.border};
  border-radius:100px;font-family:${FONT};font-size:.9rem;
  color:${C.ink};outline:none;transition:all .2s;
}
.disc-search input:focus{
  border-color:${C.orange};box-shadow:0 0 0 4px rgba(255,107,53,0.1);
}
.disc-search input::placeholder{color:#B8B8CC}
.disc-search-ic{
  position:absolute;left:1.1rem;top:50%;transform:translateY(-50%);
  color:${C.muted};pointer-events:none;font-size:.95rem;
}

.disc-tabs{
  display:flex;background:${C.bg};border:1px solid ${C.border};
  border-radius:100px;padding:4px;flex-shrink:0;
}
.disc-tab{
  padding:.5rem 1.15rem;border:none;border-radius:100px;
  background:transparent;cursor:pointer;font-family:${FONT};
  font-weight:700;font-size:.82rem;color:${C.muted};transition:all .22s;
}
.disc-tab.on{background:${C.white};color:${C.ink};box-shadow:0 2px 8px rgba(15,15,26,0.08)}

.disc-drop{
  position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:40;
  background:${C.white};border:1px solid ${C.border};
  border-radius:14px;overflow:hidden;box-shadow:${C.shadowLg};
}
.disc-row{
  display:flex;align-items:center;gap:.7rem;
  padding:.75rem 1rem;border-bottom:1px solid ${C.border};
  transition:background .15s;
}
.disc-row:last-child{border-bottom:none}
.disc-row:hover{background:${C.orangeBg}}
.disc-row-av{width:32px;height:32px;font-size:.6rem}
.disc-row-n{font-size:.85rem;font-weight:700;color:${C.ink}}
.disc-row-h{font-size:.72rem;color:${C.muted}}

.disc-filters{display:flex;gap:.4rem;flex-wrap:wrap;align-items:center;margin-bottom:1.75rem}
.disc-flabel{font-size:.68rem;font-weight:700;color:${C.muted};
  letter-spacing:.1em;margin-right:.25rem}

.disc-stats{
  display:flex;gap:2rem;padding:1rem 0;margin-bottom:1.75rem;
  border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};
  flex-wrap:wrap;
}
.disc-stat{display:flex;align-items:baseline;gap:.35rem}
.disc-stat-n{font-size:1.3rem;font-weight:800;letter-spacing:-.02em}
.disc-stat-l{font-size:.75rem;color:${C.muted};font-weight:500}

/* Developer card */
.dv{
  background:${C.white};border:1px solid ${C.border};
  border-radius:18px;padding:1.4rem;cursor:pointer;
  font-family:${FONT};transition:all .25s cubic-bezier(.34,1.56,.64,1);
}
.dv:hover{transform:translateY(-4px);box-shadow:${C.shadowLg};border-color:transparent}
.dv-top{display:flex;align-items:center;gap:.85rem;margin-bottom:1rem}
.dv-av{width:46px;height:46px;font-size:.82rem}
.dv-n{font-size:.9rem;font-weight:800;color:${C.ink};
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dv-h{font-size:.75rem;color:${C.muted}}
.dv-foot{display:flex;align-items:center;justify-content:space-between}
.dv-score{font-size:.75rem;font-weight:800;color:${C.tealDark}}
.dv-loc{
  margin-top:.8rem;padding-top:.8rem;border-top:1px solid ${C.border};
  font-size:.75rem;color:${C.muted};
}
.grid-dev{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
`

const FILTERS = ['All','React','Node.js','Python','Supabase','Next.js','Flutter','TypeScript','Go']

function DevCard({ profile, index }) {
  const name = profile.full_name || profile.username
  return (
    <Link to={`/profile/${profile.username}`} aria-label={`View profile: ${name}`}>
      <div className="dv rise" style={{ animationDelay: `${index * 0.05}s` }}>
        <div className="dv-top">
          <div className="av av-l dv-av">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : initials(name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dv-n">{name}</div>
            <div className="dv-h">@{profile.username}</div>
          </div>
          {profile.is_verified && <span className="pill pill-t">✓</span>}
        </div>
        <div className="dv-foot">
          {profile.role && <span className="pill pill-o">{profile.role}</span>}
          {profile.trust_score > 0 && (
            <span className="dv-score">{profile.trust_score} pts</span>
          )}
        </div>
        {profile.location && <div className="dv-loc">◎ {profile.location}</div>}
      </div>
    </Link>
  )
}

export default function Discover({ user }) {
  const [tab, setTab]           = useState('projects')
  const [projects, setProjects] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [filter, setFilter]     = useState('All')

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
    if (query.trim().length < 2) { setResults([]); return }
    let alive = true
    const t = setTimeout(() => {
      searchUsers(query.trim()).then(r => { if (alive) setResults(r.data || []) })
    }, 220)
    return () => { alive = false; clearTimeout(t) }
  }, [query])

  const filtered = projects.filter(p =>
    filter === 'All' ||
    (p.technologies || []).some(t => t.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="wrap">

        {/* Header */}
        <header className="disc-head rise">
          <div className="eyebrow teal">Discover</div>
          <h1 className="h1" style={{ marginBottom: '.5rem' }}>
            Real projects.<br />Real problems solved.
          </h1>
          <p className="sub" style={{ maxWidth: 460 }}>
            Explore what builders are shipping — and find the people you want to build with.
          </p>
        </header>

        {/* Stats */}
        {!loading && (
          <div className="disc-stats rise" style={{ animationDelay: '.06s' }}>
            <div className="disc-stat">
              <span className="disc-stat-n" style={{ color: C.orange }}>{projects.length}</span>
              <span className="disc-stat-l">projects</span>
            </div>
            <div className="disc-stat">
              <span className="disc-stat-n" style={{ color: C.teal }}>{profiles.length}</span>
              <span className="disc-stat-l">builders</span>
            </div>
            <div className="disc-stat">
              <span className="disc-stat-n" style={{ color: C.muted }}>∞</span>
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
                  <Link key={r.id} to={`/profile/${r.username}`}>
                    <div className="disc-row">
                      <div className="av disc-row-av">
                        {initials(r.full_name || r.username)}
                      </div>
                      <div>
                        <div className="disc-row-n">{r.full_name || r.username}</div>
                        <div className="disc-row-h">@{r.username}</div>
                      </div>
                      {r.role && (
                        <span className="pill pill-o" style={{ marginLeft: 'auto' }}>
                          {r.role}
                        </span>
                      )}
                    </div>
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
            <span className="disc-flabel">STACK</span>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`chip ${filter === f ? 'on' : ''}`}
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
          <div className="grid grid-3">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="skel" style={{ height: i % 3 === 0 ? 380 : 320 }} />
            ))}
          </div>
        ) : tab === 'projects' ? (
          <div className="grid grid-3">
            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">◎</div>
                <h3 className="h3" style={{ marginBottom: '.5rem' }}>
                  {filter === 'All' ? 'No projects yet' : `No ${filter} projects yet`}
                </h3>
                <p className="dim" style={{ marginBottom: '1.5rem' }}>
                  Be the first to share one.
                </p>
                <Link to="/project/new" className="btn btn-primary">
                  Share a project →
                </Link>
              </div>
            ) : (
              filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
            )}
          </div>
        ) : (
          <div className="grid grid-dev">
            {profiles.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">◆</div>
                <h3 className="h3">No builders yet</h3>
              </div>
            ) : (
              profiles.map((p, i) => <DevCard key={p.id} profile={p} index={i} />)
            )}
          </div>
        )}

        {/* Count */}
        {!loading && (
          <p className="dim" style={{
            textAlign: 'center', marginTop: '3rem', paddingTop: '2rem',
            borderTop: `1px solid ${C.border}`, fontSize: '.78rem',
          }}>
            {tab === 'projects'
              ? `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`
              : `${profiles.length} builder${profiles.length !== 1 ? 's' : ''} on Shwooshii`}
          </p>
        )}
      </div>
    </div>
  )
}

import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects, getAllProfiles, searchUsers } from '../lib/supabase.js'

const esc = (s) => String(s || '').replace(/[<>"'&]/g, c =>
  ({ '<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;' }[c]))

const timeSince = (ts) => {
  const d = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (d < 60) return 'just now'
  if (d < 3600) return `${Math.floor(d/60)}m ago`
  if (d < 86400) return `${Math.floor(d/3600)}h ago`
  return `${Math.floor(d/86400)}d ago`
}

const initials = (name) =>
  (name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

const TAG_COLORS = [
  ['#FF6B35','rgba(255,107,53,0.12)'], ['#00C9A7','rgba(0,201,167,0.1)'],
  ['#7C6FEA','rgba(124,111,234,0.12)'], ['#FF5FA2','rgba(255,95,162,0.1)'],
  ['#FFD166','rgba(255,209,102,0.1)'], ['#06B6D4','rgba(6,182,212,0.1)'],
]
const tagColor = (tag) => TAG_COLORS[tag.charCodeAt(0) % TAG_COLORS.length]

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes cardIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  * { box-sizing:border-box; }
  input::placeholder { color:rgba(255,255,255,0.25); font-family:'Plus Jakarta Sans',sans-serif; }
  a { text-decoration:none; }
`

function Marquee() {
  const items = ['DISCOVER','BUILD','SHIP','CONNECT','PROVE YOUR CRAFT','BOTSWANA & BEYOND','PROBLEM SOLVERS']
  const track = [...items,...items,...items]
  return (
    <div style={{overflow:'hidden',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'12px 0',background:'rgba(255,107,53,0.03)'}}>
      <div style={{display:'flex',gap:'3.5rem',width:'max-content',animation:'marquee 32s linear infinite'}}>
        {track.map((item,i) => (
          <span key={i} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:'.68rem',letterSpacing:'.22em',color:i%2===0?'#FF6B35':'rgba(255,255,255,0.18)',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:'1.5rem'}}>
            {item}
            <span style={{color:'#00C9A7',fontSize:'.55rem'}}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Skeleton({h=340}) {
  return <div style={{height:h,borderRadius:20,background:'linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.6s infinite'}}/>
}

function ProjectCard({project,index}) {
  const [tilt,setTilt] = useState({x:0,y:0})
  const [hov,setHov] = useState(false)
  const ref = useRef(null)
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    setTilt({x:((e.clientX-r.left)/r.width-.5)*12,y:((e.clientY-r.top)/r.height-.5)*-12})
  }
  const techs = (project.technologies||[]).slice(0,3)
  const uname = project.profiles?.username||'builder'
  const fname = project.profiles?.full_name||uname
  return (
    <Link to={`/project/${project.id}`} aria-label={`View: ${project.title}`}>
      <div ref={ref} onMouseMove={onMove} onMouseEnter={()=>setHov(true)}
        onMouseLeave={()=>{setTilt({x:0,y:0});setHov(false)}}
        style={{background:hov?'rgba(22,22,38,0.98)':'rgba(14,14,26,0.85)',border:`1px solid ${hov?'rgba(255,107,53,0.28)':'rgba(255,255,255,0.06)'}`,borderRadius:20,overflow:'hidden',transform:`perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(${hov?10:0}px)`,transition:hov?'border-color .2s,background .2s':'all .55s cubic-bezier(.23,1,.32,1)',willChange:'transform',animation:'cardIn .6s cubic-bezier(.23,1,.32,1) both',animationDelay:`${index*.055}s`,cursor:'pointer'}}>

        {/* Image */}
        <div style={{height:project.image_url?210:130,background:project.image_url?'#0a0a14':'linear-gradient(135deg,rgba(255,107,53,0.07),rgba(0,201,167,0.04))',overflow:'hidden',position:'relative'}}>
          {project.image_url
            ? <img src={project.image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',transform:hov?'scale(1.07)':'scale(1)',transition:'transform .6s cubic-bezier(.23,1,.32,1)'}} loading="lazy" onError={e=>e.target.style.display='none'}/>
            : <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'3rem',fontWeight:900,background:'linear-gradient(135deg,rgba(255,107,53,0.22),rgba(0,201,167,0.14))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{(project.title||'?')[0].toUpperCase()}</span></div>
          }
          {project.image_url && <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(10,10,20,0.85))'}}/>}
          {project.live_url && (
            <div style={{position:'absolute',top:10,right:10,background:'rgba(0,201,167,0.12)',border:'1px solid rgba(0,201,167,0.28)',borderRadius:100,padding:'3px 10px',display:'flex',alignItems:'center',gap:5}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'#00C9A7',animation:'dotPulse 2s infinite'}}/>
              <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.58rem',fontWeight:700,color:'#00C9A7',letterSpacing:'.1em'}}>LIVE</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{padding:'1.1rem 1.25rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.875rem'}}>
            <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#FF6B35,#FF5FA2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.58rem',fontWeight:800,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",overflow:'hidden'}}>
              {project.profiles?.avatar_url?<img src={project.profiles.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:initials(fname)}
            </div>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.72rem',color:'rgba(255,255,255,0.35)',fontWeight:500}}>@{uname}</span>
            <span style={{marginLeft:'auto',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.65rem',color:'rgba(255,255,255,0.2)'}}>{timeSince(project.created_at)}</span>
          </div>

          <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'1rem',fontWeight:800,color:'#fff',letterSpacing:'-.02em',lineHeight:1.25,marginBottom:'.5rem',margin:'0 0 .5rem 0'}}>{project.title}</h3>

          {project.problem_solved && (
            <div style={{borderLeft:'2px solid #00C9A7',paddingLeft:'.7rem',marginBottom:'.75rem'}}>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.75rem',color:'rgba(255,255,255,0.38)',lineHeight:1.55,margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{project.problem_solved}</p>
            </div>
          )}

          {techs.length>0 && (
            <div style={{display:'flex',flexWrap:'wrap',gap:'.3rem',marginBottom:'.75rem'}}>
              {techs.map(tag=>{const[fg,bg]=tagColor(tag);return(
                <span key={tag} style={{padding:'.18rem .6rem',borderRadius:100,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.62rem',fontWeight:700,background:bg,color:fg,letterSpacing:'.04em'}}>{tag}</span>
              )})}
              {(project.technologies?.length||0)>3&&<span style={{fontSize:'.62rem',color:'rgba(255,255,255,0.25)',fontFamily:"'Plus Jakarta Sans',sans-serif",display:'flex',alignItems:'center'}}>+{project.technologies.length-3}</span>}
            </div>
          )}

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'.7rem',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display:'flex',gap:'.6rem'}}>
              {project.github_url&&<a href={project.github_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.72rem',color:'rgba(255,255,255,0.3)',textDecoration:'none'}}>GitHub ↗</a>}
              {project.live_url&&<a href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.72rem',color:'#00C9A7',textDecoration:'none'}}>Live ↗</a>}
            </div>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.72rem',color:'#FF5FA2',fontWeight:700}}>♥ {project.likes_count||0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function DevCard({profile,index}) {
  const [hov,setHov] = useState(false)
  return (
    <Link to={`/profile/${profile.username}`} aria-label={`View: ${profile.full_name||profile.username}`}>
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{background:hov?'rgba(22,22,38,0.98)':'rgba(14,14,26,0.85)',border:`1px solid ${hov?'rgba(0,201,167,0.28)':'rgba(255,255,255,0.06)'}`,borderRadius:20,padding:'1.4rem',transition:'all .25s',animation:'cardIn .6s cubic-bezier(.23,1,.32,1) both',animationDelay:`${index*.055}s`,cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:'.875rem',marginBottom:'.875rem'}}>
          <div style={{width:46,height:46,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#FF6B35,#7C6FEA)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.82rem',fontWeight:800,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",overflow:'hidden',boxShadow:hov?'0 0 0 2px #00C9A7':'0 0 0 2px transparent',transition:'box-shadow .2s'}}>
            {profile.avatar_url?<img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:initials(profile.full_name||profile.username)}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'.88rem',color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:'.12rem'}}>{profile.full_name||profile.username}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.7rem',color:'rgba(255,255,255,0.32)'}}>@{profile.username}</div>
          </div>
          {profile.is_verified&&<div style={{background:'rgba(0,201,167,0.1)',border:'1px solid rgba(0,201,167,0.22)',borderRadius:100,padding:'2px 7px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.58rem',fontWeight:700,color:'#00C9A7',letterSpacing:'.06em',whiteSpace:'nowrap'}}>✓ VERIFIED</div>}
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          {profile.role&&<div style={{background:'rgba(255,107,53,0.09)',border:'1px solid rgba(255,107,53,0.18)',borderRadius:100,padding:'3px 10px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.62rem',fontWeight:700,color:'#FF6B35',letterSpacing:'.06em'}}>{profile.role.toUpperCase()}</div>}
          {profile.trust_score>0&&<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.7rem',color:'#00C9A7',fontWeight:700}}>{profile.trust_score} pts</div>}
        </div>
        {profile.location&&<div style={{marginTop:'.7rem',paddingTop:'.7rem',borderTop:'1px solid rgba(255,255,255,0.05)',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.7rem',color:'rgba(255,255,255,0.28)'}}>◎ {profile.location}</div>}
      </div>
    </Link>
  )
}

const FILTERS = ['All','React','Node.js','Python','Supabase','Next.js','Flutter','TypeScript','Go']

export default function Discover({ user }) {
  const [tab,setTab] = useState('projects')
  const [projects,setProjects] = useState([])
  const [profiles,setProfiles] = useState([])
  const [loading,setLoading] = useState(true)
  const [query,setQuery] = useState('')
  const [results,setResults] = useState([])
  const [filter,setFilter] = useState('All')

  useEffect(() => {
    Promise.all([getAllProjects(32),getAllProfiles(24)]).then(([pr,pf]) => {
      setProjects(pr.data||[])
      setProfiles(pf.data||[])
      setLoading(false)
    })
  },[])

  useEffect(() => {
    if(query.length>1) searchUsers(query).then(r=>setResults(r.data||[]))
    else setResults([])
  },[query])

  const filtered = projects.filter(p => filter==='All' || (p.technologies||[]).some(t=>t.toLowerCase().includes(filter.toLowerCase())))

  const BG = '#0A0A0F'
  const inp = {width:'100%',padding:'.8rem 1.1rem .8rem 2.8rem',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:11,color:'#fff',outline:'none',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.875rem',transition:'border-color .2s'}

  return (
    <div style={{minHeight:'100vh',background:BG,color:'#fff'}}>
      <style>{GLOBAL_CSS}</style>
      <Marquee/>

      <div style={{maxWidth:1160,margin:'0 auto',padding:'2.5rem 1.5rem'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'clamp(2.2rem,6vw,3.8rem)',fontWeight:900,letterSpacing:'-.04em',lineHeight:1.05,margin:'0 0 .4rem 0'}}>
              Discover<span style={{color:'rgba(255,255,255,0.1)'}}>.</span>
            </h1>
            <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",color:'rgba(255,255,255,0.3)',fontSize:'.9rem',margin:0}}>
              Real projects. Real problems solved. Real builders.
            </p>
          </div>
          <Link to="/project/new">
            <button style={{padding:'.75rem 1.6rem',background:'#FF6B35',color:'#fff',borderRadius:100,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'.85rem',border:'none',cursor:'pointer',boxShadow:'0 0 20px rgba(255,107,53,0.25)',letterSpacing:'.02em',transition:'all .2s'}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 0 32px rgba(255,107,53,0.45)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='0 0 20px rgba(255,107,53,0.25)'}>
              + Share project
            </button>
          </Link>
        </div>

        {/* Stats */}
        {!loading && (
          <div style={{display:'flex',gap:'2rem',padding:'1rem 0',borderBottom:'1px solid rgba(255,255,255,0.05)',marginBottom:'2rem',flexWrap:'wrap'}}>
            {[[projects.length,'projects','#FF6B35'],[profiles.length,'builders','#00C9A7'],['∞','problems to solve','rgba(255,255,255,0.18)']].map(([n,l,c])=>(
              <div key={l} style={{display:'flex',alignItems:'baseline',gap:'.35rem'}}>
                <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'1.35rem',fontWeight:800,color:c,letterSpacing:'-.02em'}}>{n}</span>
                <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.72rem',color:'rgba(255,255,255,0.28)',fontWeight:500}}>{l}</span>
              </div>
            ))}
          </div>
        )}

        {/* Search + tabs */}
        <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,minWidth:220}}>
            <span style={{position:'absolute',left:'1rem',top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.25)',fontSize:'1rem',pointerEvents:'none'}}>⌕</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search projects, builders, technologies..." style={inp}
              onFocus={e=>{e.target.style.borderColor='rgba(255,107,53,0.35)';e.target.style.boxShadow='0 0 0 3px rgba(255,107,53,0.07)'}}
              onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.07)';e.target.style.boxShadow='none'}}/>
          </div>
          <div style={{display:'flex',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:3,flexShrink:0}}>
            {['projects','builders'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:'.48rem 1rem',borderRadius:7,background:tab===t?'rgba(255,255,255,0.08)':'transparent',border:'none',color:tab===t?'#fff':'rgba(255,255,255,0.32)',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:'.78rem',cursor:'pointer',transition:'all .2s',textTransform:'capitalize'}}>{t}</button>
            ))}
          </div>
        </div>

        {/* Search dropdown */}
        {query.length>1&&results.length>0&&(
          <div style={{background:'rgba(18,18,32,0.98)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:14,overflow:'hidden',marginBottom:'1.25rem'}}>
            {results.map(r=>(
              <Link key={r.id} to={`/profile/${r.username}`}>
                <div style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.8rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background .15s',cursor:'pointer'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,107,53,0.06)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#FF6B35,#7C6FEA)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.62rem',fontWeight:800,color:'#fff',fontFamily:"'Plus Jakarta Sans',sans-serif",flexShrink:0}}>{initials(r.full_name||r.username)}</div>
                  <div>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.85rem',fontWeight:600,color:'#fff'}}>{r.full_name||r.username}</div>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.7rem',color:'rgba(255,255,255,0.32)'}}>@{r.username}</div>
                  </div>
                  {r.role&&<span style={{marginLeft:'auto',background:'rgba(255,107,53,0.09)',border:'1px solid rgba(255,107,53,0.18)',borderRadius:100,padding:'2px 8px',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.6rem',fontWeight:700,color:'#FF6B35',letterSpacing:'.06em'}}>{r.role.toUpperCase()}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Filters */}
        {tab==='projects'&&(
          <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginBottom:'1.75rem',alignItems:'center'}}>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.68rem',color:'rgba(255,255,255,0.2)',letterSpacing:'.08em',marginRight:'.25rem'}}>STACK</span>
            {FILTERS.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:'.38rem 1rem',borderRadius:100,border:`1px solid ${filter===f?'rgba(255,107,53,0.45)':'rgba(255,255,255,0.07)'}`,background:filter===f?'rgba(255,107,53,0.1)':'transparent',color:filter===f?'#FF6B35':'rgba(255,255,255,0.38)',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.75rem',fontWeight:600,cursor:'pointer',transition:'all .2s',whiteSpace:'nowrap'}}>{f}</button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'1.1rem'}}>
            {Array.from({length:6}).map((_,i)=><Skeleton key={i} h={i%3===0?400:320}/>)}
          </div>
        ) : tab==='projects' ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:'1.1rem'}}>
            {filtered.length===0
              ? <div style={{gridColumn:'1/-1',textAlign:'center',padding:'5rem 2rem',color:'rgba(255,255,255,0.25)',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>◎</div>
                  <p style={{margin:'0 0 1.5rem 0',fontSize:'.9rem'}}>{filter==='All'?'No projects yet — be the first to share one.':`No ${filter} projects yet. Be first.`}</p>
                  <Link to="/project/new"><button style={{padding:'.7rem 1.6rem',background:'#FF6B35',color:'#fff',borderRadius:100,border:'none',cursor:'pointer',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:'.85rem'}}>Share the first one →</button></Link>
                </div>
              : filtered.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)
            }
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'.9rem'}}>
            {profiles.length===0
              ? <div style={{gridColumn:'1/-1',textAlign:'center',padding:'5rem 2rem',color:'rgba(255,255,255,0.25)',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>◆</div>
                  <p style={{margin:0}}>No builders yet. Sign up and be one of the first.</p>
                </div>
              : profiles.map((p,i)=><DevCard key={p.id} profile={p} index={i}/>)
            }
          </div>
        )}

        {/* Footer count */}
        {!loading&&(
          <div style={{textAlign:'center',marginTop:'3.5rem',paddingTop:'2.5rem',borderTop:'1px solid rgba(255,255,255,0.04)',fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'.72rem',color:'rgba(255,255,255,0.18)',letterSpacing:'.05em'}}>
            {tab==='projects'?`${filtered.length} project${filtered.length!==1?'s':''}`:` ${profiles.length} builder${profiles.length!==1?'s':''} on Shwooshii`}
          </div>
        )}
      </div>
    </div>
  )
}

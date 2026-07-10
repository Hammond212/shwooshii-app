import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, getUserProjects } from '../lib/supabase.js'
import { Plus, Settings, Compass, Zap } from 'lucide-react'
import ProjectCard from '../components/ProjectCard.jsx'

export default function Dashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProfile(user.id), getUserProjects(user.id)]).then(([p, pr]) => {
      if (p.data) setProfile(p.data)
      if (pr.data) setProjects(pr.data)
      setLoading(false)
    })
  }, [user])

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh' }}>
        <div style={{ color:'#6B7280', fontFamily:'Space Grotesk,sans-serif' }}>Loading...</div>
      </div>
    )
  }

  const initials = (profile?.full_name || profile?.username || 'U')
    .split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'3rem 2rem' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'3rem', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
          <div className="avatar" style={{ width:64, height:64, fontSize:'1.1rem', letterSpacing:'.05em' }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }}/>
              : initials
            }
          </div>
          <div>
            <h1 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.4rem', fontWeight:700, color:'#fff', marginBottom:'.25rem' }}>
              {profile?.full_name || profile?.username || 'Builder'}
            </h1>
            <div style={{ display:'flex', alignItems:'center', gap:'.75rem', flexWrap:'wrap' }}>
              {profile?.username && <span style={{ color:'#6B7280', fontSize:'.82rem' }}>@{profile.username}</span>}
              {profile?.role && (
                <span className="badge badge-purple">{profile.role}</span>
              )}
              {profile?.is_verified && <span className="badge badge-cyan">✓ Verified</span>}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <Link to="/project/new" className="btn btn-primary" style={{ fontSize:'.85rem', padding:'.6rem 1.25rem' }}>
            <Plus size={15}/> New project
          </Link>
          <Link to="/settings" className="btn btn-ghost" style={{ fontSize:'.85rem', padding:'.6rem 1.25rem' }}>
            <Settings size={15}/> Edit profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'3rem' }}>
        {[
          { label:'Projects', value: projects.length, color:'#A78BFA' },
          { label:'Trust score', value: profile?.trust_score || 0, color:'#22D3EE' },
          { label:'Connections', value: 0, color:'#F472B6' },
        ].map(s => (
          <div key={s.label} style={{
            background:'rgba(8,8,15,0.8)', border:'1px solid rgba(139,92,246,0.12)',
            borderRadius:12, padding:'1.25rem 1.5rem',
          }}>
            <div style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.75rem', fontWeight:700, color:s.color, marginBottom:'.25rem' }}>
              {s.value}
            </div>
            <div style={{ fontSize:'.72rem', color:'#6B7280', letterSpacing:'.08em', textTransform:'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bio */}
      {profile?.bio && (
        <div style={{
          background:'rgba(8,8,15,0.8)', border:'1px solid rgba(139,92,246,0.1)',
          borderRadius:12, padding:'1.25rem 1.5rem', marginBottom:'2.5rem',
          color:'#9CA3AF', fontSize:'.9rem', lineHeight:1.7,
        }}>
          {profile.bio}
        </div>
      )}

      {/* Projects section */}
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <div>
            <div className="s-label">Your projects</div>
          </div>
          <Link to="/discover" style={{
            display:'flex', alignItems:'center', gap:'.35rem',
            color:'#A78BFA', fontSize:'.82rem', textDecoration:'none', fontWeight:500,
          }}>
            <Compass size={14}/> Browse discover
          </Link>
        </div>

        {projects.length === 0 ? (
          <div style={{
            background:'rgba(8,8,15,0.6)', border:'1px dashed rgba(139,92,246,0.2)',
            borderRadius:14, padding:'4rem 2rem', textAlign:'center',
          }}>
            <div style={{
              width:56, height:56, borderRadius:14,
              background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 1.25rem',
            }}>
              <Zap size={24} color="#A78BFA"/>
            </div>
            <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:600, marginBottom:'.5rem' }}>No projects yet</h3>
            <p style={{ color:'#6B7280', fontSize:'.875rem', marginBottom:'1.5rem' }}>
              Showcase your first project and start building your reputation.
            </p>
            <Link to="/project/new" className="btn btn-primary" style={{ fontSize:'.85rem' }}>
              <Plus size={15}/> Add first project
            </Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {projects.map(p => <ProjectCard key={p.id} project={p}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

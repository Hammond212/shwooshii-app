import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProfileByUsername, getUserProjects, getUserSkills, getFollowerCount, isFollowing, follow, unfollow } from '../lib/supabase'
import { MapPin, Globe, Github, Linkedin, Twitter } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'

export default function ProfileView({ user }) {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowingState] = useState(false)
  const [loading, setLoading] = useState(true)

  const isOwn = profile?.user_id === user.id

  useEffect(() => {
    loadAll()
  }, [username])

  const loadAll = async () => {
    const { data: p } = await getProfileByUsername(username)
    if (!p) { setLoading(false); return }
    setProfile(p)
    const [pr, sk, fc, fol] = await Promise.all([
      getUserProjects(p.user_id),
      getUserSkills(p.user_id),
      getFollowerCount(p.user_id),
      isFollowing(user.id, p.user_id),
    ])
    setProjects(pr.data || [])
    setSkills(sk.data || [])
    setFollowers(fc)
    setFollowingState(fol)
    setLoading(false)
  }

  const handleFollow = async () => {
    if (following) {
      await unfollow(user.id, profile.user_id)
      setFollowingState(false)
      setFollowers(f => f - 1)
    } else {
      await follow(user.id, profile.user_id)
      setFollowingState(true)
      setFollowers(f => f + 1)
    }
  }

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',color:'#6B7280' }}>Loading...</div>
  if (!profile) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',color:'#6B7280' }}>Profile not found</div>

  const initials = (profile.full_name || profile.username || 'U')
    .split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)

  const categoryColor = {
    frontend:'#A78BFA', backend:'#22D3EE', design:'#F472B6',
    devops:'#34D399', database:'#FBBF24', tools:'#9CA3AF',
  }

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'3rem 2rem' }}>
      {/* Profile header */}
      <div style={{
        background:'#08080F', border:'1px solid rgba(139,92,246,0.15)',
        borderRadius:16, padding:'2rem', marginBottom:'2rem',
        position:'relative', overflow:'hidden',
      }}>
        {/* Glow bg */}
        <div style={{
          position:'absolute', top:0, right:0, width:300, height:300,
          background:'radial-gradient(ellipse,rgba(139,92,246,0.06),transparent 70%)',
          pointerEvents:'none',
        }}/>

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
            <div className="avatar" style={{ width:72, height:72, fontSize:'1.2rem', flexShrink:0 }}>
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }}/>
                : initials}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'.3rem', flexWrap:'wrap' }}>
                <h1 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.3rem', fontWeight:700, color:'#fff' }}>
                  {profile.full_name || profile.username}
                </h1>
                {profile.is_verified && <span className="badge badge-cyan">✓ Verified</span>}
                {profile.trust_score > 0 && (
                  <span style={{ fontFamily:'Orbitron,sans-serif', fontSize:'.72rem', color:'#22D3EE' }}>
                    {profile.trust_score} pts
                  </span>
                )}
              </div>
              <div style={{ color:'#6B7280', fontSize:'.85rem', marginBottom:'.5rem' }}>@{profile.username}</div>
              {profile.role && <span className="badge badge-purple">{profile.role}</span>}
            </div>
          </div>

          {!isOwn && (
            <button onClick={handleFollow} className={`btn ${following ? 'btn-ghost' : 'btn-outline'}`}
              style={{ fontSize:'.85rem', padding:'.6rem 1.5rem' }}>
              {following ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display:'flex', gap:'2rem', marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,0.05)', flexWrap:'wrap' }}>
          {[
            { label:'Projects', value:projects.length, color:'#A78BFA' },
            { label:'Followers', value:followers, color:'#22D3EE' },
          ].map(s => (
            <div key={s.label}>
              <span style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.1rem', fontWeight:700, color:s.color }}>{s.value}</span>
              <span style={{ color:'#6B7280', fontSize:'.8rem', marginLeft:'.4rem' }}>{s.label}</span>
            </div>
          ))}
          {profile.location && (
            <div style={{ display:'flex', alignItems:'center', gap:'.35rem', color:'#6B7280', fontSize:'.82rem' }}>
              <MapPin size={13}/>{profile.location}
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p style={{ color:'#9CA3AF', fontSize:'.9rem', lineHeight:1.7, marginTop:'1rem', maxWidth:600 }}>{profile.bio}</p>
        )}

        {/* Links */}
        <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap' }}>
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:'.35rem', color:'#9CA3AF', fontSize:'.82rem', textDecoration:'none' }}>
              <Github size={14}/> GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:'.35rem', color:'#A78BFA', fontSize:'.82rem', textDecoration:'none' }}>
              <Linkedin size={14}/> LinkedIn
            </a>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:'.35rem', color:'#22D3EE', fontSize:'.82rem', textDecoration:'none' }}>
              <Globe size={14}/> Website
            </a>
          )}
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{
          background:'#08080F', border:'1px solid rgba(139,92,246,0.12)',
          borderRadius:14, padding:'1.5rem', marginBottom:'2rem',
        }}>
          <div className="s-label" style={{ marginBottom:'1rem' }}>Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
            {skills.map(s => (
              <span key={s.id} style={{
                padding:'.3rem .85rem', borderRadius:100,
                fontSize:'.75rem', fontWeight:500,
                background:`rgba(139,92,246,0.1)`,
                color: categoryColor[s.skills?.category] || '#A78BFA',
                border:`1px solid rgba(139,92,246,0.15)`,
              }}>
                {s.skills?.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div className="s-label" style={{ marginBottom:'1.5rem' }}>
        Projects ({projects.length})
      </div>
      {projects.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'#6B7280', fontSize:'.9rem' }}>
          No projects shared yet.
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
          {projects.map(p => <ProjectCard key={p.id} project={p}/>)}
        </div>
      )}
    </div>
  )
}

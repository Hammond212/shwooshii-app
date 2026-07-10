import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProject, likeProject, unlikeProject, hasLiked, deleteProject } from '../lib/supabase'
import { Heart, Github, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react'

export default function ProjectDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [loading, setLoading] = useState(true)

  const isOwner = project?.user_id === user.id

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    const { data } = await getProject(id)
    if (data) {
      setProject(data)
      setLikes(data.likes_count || 0)
      const l = await hasLiked(user.id, id)
      setLiked(l)
    }
    setLoading(false)
  }

  const handleLike = async () => {
    if (liked) {
      await unlikeProject(user.id, id)
      setLiked(false)
      setLikes(l => l - 1)
    } else {
      await likeProject(user.id, id)
      setLiked(true)
      setLikes(l => l + 1)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    await deleteProject(id)
    navigate('/')
  }

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',color:'#6B7280' }}>Loading...</div>
  if (!project) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',color:'#6B7280' }}>Project not found</div>

  const initials = (project.profiles?.full_name || project.profiles?.username || 'U')
    .split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)

  return (
    <div style={{ maxWidth:800, margin:'0 auto', padding:'3rem 2rem' }}>
      {/* Back */}
      <Link to="/" style={{
        display:'inline-flex', alignItems:'center', gap:'.4rem',
        color:'#6B7280', fontSize:'.82rem', textDecoration:'none',
        marginBottom:'2rem', transition:'color .2s',
      }}>
        <ArrowLeft size={14}/> Back
      </Link>

      {/* Cover image */}
      {project.image_url && (
        <div style={{ width:'100%', height:320, borderRadius:14, overflow:'hidden', marginBottom:'2rem', background:'#0D0D1A' }}>
          <img src={project.image_url} alt={project.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        </div>
      )}

      {/* Header */}
      <div style={{
        background:'#08080F', border:'1px solid rgba(139,92,246,0.15)',
        borderRadius:16, padding:'2rem', marginBottom:'1.5rem',
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
          <div>
            <h1 style={{ fontFamily:'Orbitron,sans-serif', fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'.5rem' }}>
              {project.title}
            </h1>
            {/* Author */}
            {project.profiles && (
              <Link to={`/profile/${project.profiles.username}`} style={{ textDecoration:'none' }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', color:'#9CA3AF', fontSize:'.82rem' }}>
                  <div className="avatar" style={{ width:24, height:24, fontSize:'.6rem' }}>
                    {project.profiles.avatar_url
                      ? <img src={project.profiles.avatar_url} alt="" style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }}/>
                      : initials}
                  </div>
                  @{project.profiles.username}
                </div>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:'.75rem', alignItems:'center', flexWrap:'wrap' }}>
            <button onClick={handleLike} style={{
              display:'inline-flex', alignItems:'center', gap:'.4rem',
              padding:'.6rem 1.25rem', borderRadius:8,
              background: liked ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.04)',
              border: liked ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: liked ? '#F472B6' : '#6B7280',
              cursor:'pointer', fontFamily:'Space Grotesk,sans-serif',
              fontWeight:600, fontSize:'.82rem', transition:'all .2s',
            }}>
              <Heart size={14} fill={liked ? '#F472B6' : 'none'}/> {likes}
            </button>
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"
                style={{ fontSize:'.82rem', padding:'.5rem 1rem' }}>
                <Github size={14}/> Code
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline"
                style={{ fontSize:'.82rem', padding:'.5rem 1rem' }}>
                <ExternalLink size={14}/> Live demo
              </a>
            )}
            {isOwner && (
              <button onClick={handleDelete} style={{
                display:'inline-flex', alignItems:'center', gap:'.35rem',
                padding:'.5rem .85rem', borderRadius:8,
                background:'rgba(236,72,153,0.06)', border:'1px solid rgba(236,72,153,0.15)',
                color:'#F472B6', cursor:'pointer', fontSize:'.8rem',
                fontFamily:'Space Grotesk,sans-serif', transition:'all .2s',
              }}>
                <Trash2 size={13}/>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Problem solved — hero block */}
      {project.problem_solved && (
        <div style={{
          background:'linear-gradient(135deg,rgba(6,182,212,0.06),rgba(139,92,246,0.04))',
          border:'1px solid rgba(6,182,212,0.2)',
          borderRadius:14, padding:'1.75rem', marginBottom:'1.5rem',
        }}>
          <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase',
            color:'#22D3EE', marginBottom:'.75rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
            <div style={{ width:16, height:1, background:'#22D3EE', boxShadow:'0 0 4px #22D3EE' }}/>
            Problem solved
          </div>
          <p style={{ color:'#fff', lineHeight:1.75, fontSize:'1rem' }}>{project.problem_solved}</p>
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div style={{
          background:'#08080F', border:'1px solid rgba(139,92,246,0.1)',
          borderRadius:14, padding:'1.75rem', marginBottom:'1.5rem',
        }}>
          <div className="s-label" style={{ marginBottom:'.75rem' }}>About</div>
          <p style={{ color:'#9CA3AF', lineHeight:1.8 }}>{project.description}</p>
        </div>
      )}

      {/* Tech stack */}
      {project.technologies?.length > 0 && (
        <div style={{
          background:'#08080F', border:'1px solid rgba(139,92,246,0.1)',
          borderRadius:14, padding:'1.75rem',
        }}>
          <div className="s-label" style={{ marginBottom:'1rem' }}>Tech stack</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
            {project.technologies.map((t,i) => (
              <span key={i} style={{
                padding:'.35rem 1rem', borderRadius:100,
                fontSize:'.8rem', fontWeight:500,
                background:'rgba(139,92,246,0.1)', color:'#A78BFA',
                border:'1px solid rgba(139,92,246,0.2)',
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

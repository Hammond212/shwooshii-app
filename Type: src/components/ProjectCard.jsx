import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Github, ExternalLink, Eye } from 'lucide-react'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/project/${project.id}`} style={{ textDecoration:'none' }}>
      <div style={{
        background: '#08080F',
        border: '1px solid rgba(139,92,246,0.12)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color .2s, transform .2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex', flexDirection: 'column',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'
          e.currentTarget.style.transform = 'translateY(-3px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.12)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Image */}
        {project.image_url ? (
          <div style={{ width:'100%', height:160, overflow:'hidden', background:'#0D0D1A' }}>
            <img src={project.image_url} alt={project.title}
              style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          </div>
        ) : (
          <div style={{
            width:'100%', height:120,
            background: 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(6,182,212,0.05))',
            display:'flex', alignItems:'center', justifyContent:'center',
            borderBottom: '1px solid rgba(139,92,246,0.08)',
          }}>
            <span style={{
              fontFamily:'Orbitron,sans-serif', fontSize:'2rem', fontWeight:900,
              background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(6,182,212,0.3))',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>{project.title?.[0]?.toUpperCase()}</span>
          </div>
        )}

        {/* Content */}
        <div style={{ padding:'1.25rem', flex:1, display:'flex', flexDirection:'column' }}>
          <h3 style={{
            fontFamily:'Space Grotesk,sans-serif', fontWeight:700,
            fontSize:'.95rem', color:'#fff', marginBottom:'.5rem',
          }}>{project.title}</h3>

          {project.problem_solved && (
            <div style={{
              background:'rgba(6,182,212,0.06)',
              border:'1px solid rgba(6,182,212,0.12)',
              borderRadius:6, padding:'.5rem .75rem', marginBottom:'.75rem',
            }}>
              <p style={{ fontSize:'.72rem', color:'#22D3EE', fontWeight:600, marginBottom:'.15rem' }}>Problem solved</p>
              <p style={{ fontSize:'.78rem', color:'#9CA3AF', lineHeight:1.5,
                overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                {project.problem_solved}
              </p>
            </div>
          )}

          {!project.problem_solved && project.description && (
            <p style={{ fontSize:'.82rem', color:'#6B7280', lineHeight:1.6, marginBottom:'.75rem',
              overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', flex:1 }}>
              {project.description}
            </p>
          )}

          {/* Tech tags */}
          {project.technologies?.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.35rem', marginBottom:'.75rem', marginTop:'auto' }}>
              {project.technologies.slice(0,3).map((t,i) => (
                <span key={i} style={{
                  padding:'.15rem .55rem', borderRadius:4, fontSize:'.68rem', fontWeight:500,
                  background:'rgba(139,92,246,0.1)', color:'#A78BFA',
                  border:'1px solid rgba(139,92,246,0.15)',
                }}>{t}</span>
              ))}
              {project.technologies.length > 3 && (
                <span style={{ fontSize:'.68rem', color:'#6B7280' }}>+{project.technologies.length-3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            paddingTop:'.75rem', borderTop:'1px solid rgba(255,255,255,0.05)',
            marginTop:'.5rem',
          }}>
            <div style={{ display:'flex', gap:'.75rem' }}>
              {project.github_url && (
                <span style={{ color:'#6B7280' }}><Github size={14}/></span>
              )}
              {project.live_url && (
                <span style={{ color:'#6B7280' }}><ExternalLink size={14}/></span>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'.35rem',
              color:'#EC4899', fontSize:'.75rem', fontWeight:600 }}>
              <Heart size={13}/>
              {project.likes_count || 0}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

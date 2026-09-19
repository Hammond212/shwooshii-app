import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', maxWidth: 700, margin: '0 auto' }}>

      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="s-label">Dashboard</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '.4rem' }}>
          Hey, <span className="gradient-text">{name}</span> 👋
        </h1>
        <p style={{ color: 'var(--muted2)', fontSize: '.85rem' }}>What are you studying today?</p>
      </div>

      {/* Doc Reader card */}
      <Link to="/reader" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card" style={{
          padding: '1.75rem', cursor: 'pointer', marginBottom: '1rem',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--purple-lite)" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 18.75l-3.5-3H5.25A2.25 2.25 0 013 13.5v-3a2.25 2.25 0 012.25-2.25H8.5l3.5-3v13.5z" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Doc Reader</h2>
              <p style={{ fontSize: '.78rem', color: 'var(--muted2)', marginTop: 2 }}>Upload and listen to your study material</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-purple">PDF</span>
            <span className="badge badge-purple">PPTX</span>
            <span className="badge badge-purple">DOCX</span>
            <span className="badge badge-cyan">TXT</span>
          </div>
        </div>
      </Link>

      {/* Coming soon */}
      <div className="card" style={{ padding: '1.5rem', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--cyan)" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '.9rem', fontWeight: 600 }}>More tools coming soon</h3>
            <p style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Study planner, flashcards, AI notes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

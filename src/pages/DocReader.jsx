import React, { useState, useRef, useEffect, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function fmtSize(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

function splitSentences(text) {
  return (text.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [text])
    .map(s => s.trim()).filter(s => s.length > 3)
}

async function extractPDF(file) {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let out = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    out += content.items.map(item => item.str).join(' ') + '\n'
  }
  return out
}

async function extractPPTX(file) {
  const buf = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buf)
  const slideFiles = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => parseInt(a.match(/slide(\d+)/)[1]) - parseInt(b.match(/slide(\d+)/)[1]))
  if (!slideFiles.length) throw new Error('No slides found')
  let out = ''
  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.files[slideFiles[i]].async('string')
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    const nodes = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/drawingml/2006/main', 't')
    const slideText = Array.from(nodes).map(n => n.textContent).join(' ').trim()
    if (slideText) out += `Slide ${i + 1}: ${slideText}\n\n`
  }
  return out.trim()
}

async function extractDOCX(file) {
  const buf = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(buf)
  const wordDoc = zip.files['word/document.xml']
  if (!wordDoc) throw new Error('Not a valid DOCX')
  const xml = await wordDoc.async('string')
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const nodes = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 't')
  return Array.from(nodes).map(n => n.textContent).join(' ')
}

export default function DocReader() {
  const [file, setFile] = useState(null)
  const [sentences, setSentences] = useState([])
  const [idx, setIdx] = useState(0)
  const [status, setStatus] = useState({ msg: 'Upload a document to start', type: '' })
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [voices, setVoices] = useState([])
  const [voiceIdx, setVoiceIdx] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [slideCount, setSlideCount] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  const idxRef = useRef(0)
  const playingRef = useRef(false)
  const pausedRef = useRef(false)
  const sentencesRef = useRef([])
  const fileInputRef = useRef(null)

  useEffect(() => { idxRef.current = idx }, [idx])
  useEffect(() => { playingRef.current = playing }, [playing])
  useEffect(() => { pausedRef.current = paused }, [paused])
  useEffect(() => { sentencesRef.current = sentences }, [sentences])

  useEffect(() => {
    const load = () => {
      const v = speechSynthesis.getVoices()
      if (v.length) {
        const sorted = [...v].sort((a, b) => (a.lang.startsWith('en') ? -1 : 0) - (b.lang.startsWith('en') ? -1 : 0))
        setVoices(sorted.map((voice) => ({ voice, label: `${voice.name} (${voice.lang})` })))
      }
    }
    load()
    speechSynthesis.onvoiceschanged = load
    return () => { speechSynthesis.cancel(); speechSynthesis.onvoiceschanged = null }
  }, [])

  const processFile = useCallback(async (f) => {
    setStatus({ msg: 'Reading file…', type: 'active' })
    setFile(f)
    setSlideCount(0)
    const ext = f.name.split('.').pop().toLowerCase()
    try {
      let text = ''
      if (ext === 'pdf') text = await extractPDF(f)
      else if (ext === 'pptx' || ext === 'ppt') text = await extractPPTX(f)
      else if (ext === 'docx' || ext === 'doc') text = await extractDOCX(f)
      else text = await f.text()
      text = text.replace(/\s+/g, ' ').trim()
      if (!text) { setStatus({ msg: 'No readable text found', type: 'error' }); return }
      const s = splitSentences(text)
      setSentences(s); sentencesRef.current = s
      setIdx(0); idxRef.current = 0
      if (ext === 'pptx' || ext === 'ppt') setSlideCount((text.match(/Slide \d+:/g) || []).length)
      setStatus({ msg: `${s.length} sentences ready`, type: 'success' })
    } catch (e) {
      setStatus({ msg: e.message, type: 'error' })
    }
  }, [])

  const speakFrom = useCallback((startIdx) => {
    speechSynthesis.cancel()
    setPlaying(true); playingRef.current = true
    setPaused(false); pausedRef.current = false
    setIdx(startIdx); idxRef.current = startIdx
    const speakNext = () => {
      const ci = idxRef.current
      if (ci >= sentencesRef.current.length) {
        setPlaying(false); playingRef.current = false
        setStatus({ msg: 'Finished ✓', type: 'success' })
        return
      }
      setIdx(ci)
      setStatus({ msg: `Sentence ${ci + 1} of ${sentencesRef.current.length}`, type: 'active' })
      const u = new SpeechSynthesisUtterance(sentencesRef.current[ci])
      u.rate = speed; u.pitch = pitch
      if (voices[voiceIdx]) u.voice = voices[voiceIdx].voice
      u.onend = () => { if (playingRef.current && !pausedRef.current) { idxRef.current = ci + 1; setIdx(ci + 1); speakNext() } }
      u.onerror = (e) => { if (e.error !== 'interrupted') setStatus({ msg: 'Error: ' + e.error, type: 'error' }) }
      speechSynthesis.speak(u)
    }
    speakNext()
  }, [speed, pitch, voices, voiceIdx])

  const handlePlay = useCallback(() => {
    if (!sentencesRef.current.length) return
    if (pausedRef.current) {
      setPaused(false); pausedRef.current = false
      speechSynthesis.resume()
      setStatus({ msg: 'Resuming…', type: 'active' })
    } else { speakFrom(idxRef.current) }
  }, [speakFrom])

  const handlePause = useCallback(() => {
    setPaused(true); pausedRef.current = true
    speechSynthesis.pause()
    setStatus({ msg: 'Paused', type: '' })
  }, [])

  const handleStop = useCallback(() => {
    speechSynthesis.cancel()
    setPlaying(false); playingRef.current = false
    setPaused(false); pausedRef.current = false
    setIdx(0); idxRef.current = 0
    setStatus({ msg: 'Stopped', type: '' })
  }, [])

  const handlePrev = useCallback(() => {
    speechSynthesis.cancel()
    const ni = Math.max(0, idxRef.current - 1)
    setIdx(ni); idxRef.current = ni
    if (playingRef.current) speakFrom(ni)
  }, [speakFrom])

  const handleNext = useCallback(() => {
    speechSynthesis.cancel()
    const ni = Math.min(sentencesRef.current.length - 1, idxRef.current + 1)
    setIdx(ni); idxRef.current = ni
    if (playingRef.current) speakFrom(ni)
  }, [speakFrom])

  const reset = useCallback(() => {
    speechSynthesis.cancel()
    setFile(null); setSentences([]); setIdx(0); setSlideCount(0)
    setPlaying(false); setPaused(false)
    idxRef.current = 0; playingRef.current = false; pausedRef.current = false; sentencesRef.current = []
    setStatus({ msg: 'Upload a document to start', type: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const pct = sentences.length ? Math.round((idx / sentences.length) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="s-label">Doc Reader</div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '.4rem' }}>
          Read to <span className="gradient-text">me</span>
        </h1>
        <p style={{ color: 'var(--muted2)', fontSize: '.85rem' }}>
          Upload a document — PDF, PPTX, DOCX, or TXT — and listen to it read aloud.
        </p>
      </div>

      {!file && (
        <div
          className="card"
          style={{
            textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer',
            border: dragOver ? '1.5px solid var(--purple)' : undefined,
            background: dragOver ? 'rgba(139,92,246,0.05)' : undefined,
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]) }}
        >
          <input ref={fileInputRef} type="file" accept=".txt,.pdf,.md,.rtf,.pptx,.ppt,.docx,.doc" style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]) }} />
          <div style={{
            width: 48, height: 48, borderRadius: 12, margin: '0 auto .8rem',
            background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--purple-lite)" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p style={{ color: 'var(--muted2)', fontSize: '.88rem' }}>
            <span style={{ color: 'var(--purple-lite)', fontWeight: 600 }}>Tap to upload</span> or drag and drop
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '.72rem', fontFamily: "'Space Mono', monospace", marginTop: 8 }}>
            .pdf &nbsp; .pptx &nbsp; .docx &nbsp; .txt &nbsp; .md
          </p>
        </div>
      )}

      {file && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--purple-lite)" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
            <div style={{ fontSize: '.72rem', color: 'var(--muted)', fontFamily: "'Space Mono', monospace", marginTop: 2 }}>{fmtSize(file.size)} · {sentences.length} sentences</div>
          </div>
          <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {slideCount > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {Array.from({ length: Math.min(slideCount, 12) }, (_, i) => {
            const sentence = sentences[idx] || ''
            const activeSlide = sentence.match(/^Slide (\d+):/)
            const isActive = activeSlide && parseInt(activeSlide[1]) === i + 1
            return <span key={i} className={isActive ? 'badge badge-purple' : 'tag'} style={{ fontSize: '.7rem' }}>Slide {i + 1}</span>
          })}
          {slideCount > 12 && <span className="tag">+{slideCount - 12} more</span>}
        </div>
      )}

      {sentences.length > 0 && (
        <div className="card" style={{ borderLeft: '3px solid var(--purple)', padding: '1rem 1.25rem', fontSize: '.92rem', lineHeight: 1.7, marginBottom: '1rem', minHeight: 60 }}>
          {sentences[idx] || ''}
        </div>
      )}

      {sentences.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: pct + '%', background: 'var(--purple)', borderRadius: 2, transition: 'width .3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '.7rem', color: 'var(--muted)', fontFamily: "'Space Mono', monospace" }}>
            <span>{idx} of {sentences.length}</span>
            <span>{pct}%</span>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '.68rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Voice</label>
            <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))} style={{ fontSize: '.82rem', padding: '.6rem .8rem' }}>
              {voices.length ? voices.map((v, i) => <option key={i} value={i}>{v.label}</option>) : <option>No voices</option>}
            </select>
          </div>
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontSize: '.65rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Speed</label>
            <div style={{ fontSize: '.75rem', color: 'var(--purple-lite)', fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{speed.toFixed(1)}×</div>
            <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={e => setSpeed(parseFloat(e.target.value))} style={{ width: 70, accentColor: 'var(--purple)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontSize: '.65rem', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Pitch</label>
            <div style={{ fontSize: '.75rem', color: 'var(--purple-lite)', fontFamily: "'Space Mono', monospace", marginBottom: 4 }}>{pitch.toFixed(1)}</div>
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} style={{ width: 70, accentColor: 'var(--purple)' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        <button className="btn btn-primary" disabled={!sentences.length || (playing && !paused)} onClick={handlePlay} style={{ flex: 1 }}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          {paused ? 'Resume' : 'Play'}
        </button>
        <button className="btn btn-outline" disabled={!playing || paused} onClick={handlePause}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
        </button>
        <button className="btn btn-outline" disabled={!playing && !paused} onClick={handleStop}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
        </button>
        <button className="btn btn-ghost" disabled={!sentences.length} onClick={handlePrev}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
        </button>
        <button className="btn btn-ghost" disabled={!sentences.length} onClick={handleNext}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.78rem', color: 'var(--muted)' }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: status.type === 'active' ? 'var(--cyan)' : status.type === 'error' ? '#F87171' : status.type === 'success' ? '#34D399' : 'var(--muted)',
          animation: status.type === 'active' ? 'pulse 1.2s infinite' : 'none',
        }} />
        <span>{status.msg}</span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </div>
    </div>
  )
}

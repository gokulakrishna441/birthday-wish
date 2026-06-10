import { useState, useEffect, useRef } from 'react'
import { Play, Square, VolumeX } from 'lucide-react'

function AudioPlayer() {
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioCtxRef = useRef(null)
  const audioTimeoutRef = useRef(null)
  const currentNoteIndexRef = useRef(0)

  // Synthesize Happy Birthday song using Web Audio API
  const playBirthdayTune = () => {
    if (audioPlaying) {
      // Stop tune
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      clearTimeout(audioTimeoutRef.current)
      setAudioPlaying(false)
      return
    }

    setAudioPlaying(true)
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    // Happy Birthday notes and durations
    const notes = [
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 1.0 }, // Happy Birthday to you
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 1.0 }, // Happy Birthday to you
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 523.25, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 293.66, d: 1.0 }, // Happy Birthday dear Sister
      { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.15 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 1.0 }  // Happy Birthday to you
    ]

    currentNoteIndexRef.current = 0

    const playNextNote = () => {
      if (!audioCtxRef.current || currentNoteIndexRef.current >= notes.length) {
        setAudioPlaying(false)
        if (audioCtxRef.current) {
          audioCtxRef.current.close()
          audioCtxRef.current = null
        }
        return
      }

      const note = notes[currentNoteIndexRef.current]
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Use a premium soft triangle wave for chime sound
      osc.type = 'triangle'
      osc.frequency.value = note.f

      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05)
      gainNode.gain.setValueAtTime(0.3, now + note.d * 0.8)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.d)

      osc.start(now)
      osc.stop(now + note.d)

      currentNoteIndexRef.current++
      audioTimeoutRef.current = setTimeout(playNextNote, note.d * 1000 + 50)
    }

    playNextNote()
  }

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
      clearTimeout(audioTimeoutRef.current)
    }
  }, [])

  return (
    <div className="audio-player-container glass-container" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '8px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={playBirthdayTune}
        >
          {audioPlaying ? <Square size={16} fill="white" /> : <Play size={16} fill="white" />}
        </button>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>Musical Chimes Playback</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{audioPlaying ? 'Playing Happy Birthday Melody' : 'Click to play birthday chimes'}</p>
        </div>
      </div>
      {audioPlaying ? (
        <div className="sound-wave">
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
          <span className="sound-bar" />
        </div>
      ) : (
        <VolumeX size={20} style={{ color: 'var(--text-muted)' }} />
      )}
    </div>
  )
}

export default AudioPlayer

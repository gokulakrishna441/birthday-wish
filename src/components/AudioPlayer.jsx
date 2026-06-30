import { useState, useEffect, useRef } from 'react'
import { Play, Square, VolumeX } from 'lucide-react'

function AudioPlayer() {
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef(null)

  const startSong = () => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const songPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}birthday_song.mp3`
    const audio = new Audio(songPath)
    audio.loop = true
    audio.volume = 0.85
    audioRef.current = audio

    audio.play()
      .then(() => {
        setAudioPlaying(true)
      })
      .catch((err) => {
        console.warn('Could not autoplay birthday song:', err)
        audioRef.current = null
      })
  }

  const togglePlayback = () => {
    if (audioPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      setAudioPlaying(false)
    } else {
      startSong()
    }
  }

  // Autoplay as soon as Sister Mode loads
  useEffect(() => {
    startSong()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="audio-player-container glass-container" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn btn-primary"
          style={{ padding: '8px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={togglePlayback}
        >
          {audioPlaying ? <Square size={16} fill="white" /> : <Play size={16} fill="white" />}
        </button>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>Birthday Song 🎵</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {audioPlaying ? 'Playing your birthday song on loop ♾️' : 'Click to play birthday music'}
          </p>
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

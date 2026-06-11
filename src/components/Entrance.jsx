import { useState } from 'react'
import { Sparkles, Gift, Key, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react'
import FloatingParticles from './FloatingParticles'
import { logVisit } from '../firebase'

const SISTER_PASSCODE = (import.meta.env.VITE_SISTER_PASSCODE || 'SISTER').toUpperCase().trim()

function Entrance({ onEnter }) {
  const [view, setView] = useState('welcome') // 'welcome', 'sister_passcode'
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const handleGuestEnter = async () => {
    setLoggingIn(true)
    await logVisit('guest')
    onEnter('visitor')
  }

  const handleSisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (code.toUpperCase().trim() === SISTER_PASSCODE) {
      setLoggingIn(true)
      await logVisit('sister')
      onEnter('sister')
    } else {
      setError('Incorrect passcode. Please check and try again!')
    }
  }

  return (
    <div className="entrance-container" style={{ position: 'relative' }}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .shake-error {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>

      {/* Floating particles background */}
      <FloatingParticles type="entrance" />

      {/* Sister Login Trigger (Subtle button in the top corner) */}
      {view === 'welcome' && (
        <button 
          onClick={() => setView('sister_passcode')}
          disabled={loggingIn}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-primary)'
            e.currentTarget.style.borderColor = 'rgba(255, 74, 147, 0.3)'
            e.currentTarget.style.background = 'rgba(255, 74, 147, 0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          }}
        >
          <Key size={12} />
          <span>Sister Mode 👑</span>
        </button>
      )}

      <div className="entrance-card glass-container fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* Loading Overlay */}
        {loggingIn && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,5,24,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100
          }}>
            <Loader2 size={40} className="spinning-loader" style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <p style={{ color: 'white', fontWeight: '500' }}>Opening surprise world...</p>
          </div>
        )}

        {/* 1. Welcome Gate Screen */}
        {view === 'welcome' && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <Sparkles size={48} className="sparkle-text" style={{ margin: '0 auto 10px' }} />
              <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>To A Special Sister</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                We created a magical space filled with surprises, music, memories, and wishes just for you.
              </p>
            </div>

            <div style={{ position: 'relative', height: '150px', margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div 
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  filter: 'blur(20px)',
                  position: 'absolute',
                  opacity: 0.6,
                  animation: 'pulse-star 2s infinite alternate'
                }}
              />
              <Gift size={64} style={{ color: 'var(--accent-primary)', position: 'relative', filter: 'drop-shadow(0 0 10px rgba(255, 74, 147, 0.5))' }} />
            </div>

            <button className="btn btn-primary" onClick={handleGuestEnter} style={{ width: '100%', padding: '14px 28px', fontSize: '1.05rem' }}>
              Open Surprise 💖
            </button>
          </>
        )}

        {/* 2. Sister Passcode Verification */}
        {view === 'sister_passcode' && (
          <div className="fade-in" style={{ textAlign: 'left' }}>
            <button 
              onClick={() => { setView('welcome'); setError(''); setCode(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: '20px',
                padding: 0
              }}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '10px' }}>Sister Passcode 👑</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you the birthday girl? Enter your secret passcode to unlock your greeting card and birthday cake!
            </p>

            <form onSubmit={handleSisterSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter secret passcode..."
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.25)',
                    border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  className={error ? 'shake-error' : ''}
                />
                
                {error && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    marginTop: '8px'
                  }}>
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Unlock Surprise 🔑
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default Entrance

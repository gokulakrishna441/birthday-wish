import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Heart, Key, AlertCircle } from 'lucide-react'

import FloatingParticles from './components/FloatingParticles'
import FloatingWishes from './components/FloatingWishes'
import ConfettiOverlay from './components/ConfettiOverlay'
import GreetingHeader from './components/GreetingHeader'
import AudioPlayer from './components/AudioPlayer'
import Card3D from './components/Card3D'
import VirtualCake from './components/VirtualCake'
import MemoryGallery from './components/MemoryGallery'
import WishesWall from './components/WishesWall'
import { db, isFirebaseEnabled, logVisit } from './firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const SISTER_PASSCODE = (import.meta.env.VITE_SISTER_PASSCODE || 'SISTER').toUpperCase().trim()

const DEFAULT_WISHES = [
  { id: 'default1', text: "May your year be filled with laughter, endless joy, and wonderful surprises! 💖", sender: "With Love", color: "pink", timestamp: 1 },
  { id: 'default2', text: "To my partner in crime and the best sister in the world - thank you for always having my back. 🌟", sender: "Your Sibling", color: "indigo", timestamp: 2 },
  { id: 'default3', text: "Wishing you a day as beautiful, bright, and amazing as you are! Happy Birthday! 🎉", sender: "Best Wishes", color: "gold", timestamp: 3 }
]

function App() {
  const [userRole, setUserRole] = useState('visitor') // Default to guest/visitor directly!
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [confetti, setConfetti] = useState([])
  const [memories, setMemories] = useState([])
  const [wishes, setWishes] = useState(() => {
    if (!isFirebaseEnabled) {
      const saved = localStorage.getItem('birthday_wishes')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load wishes from localStorage:', e)
        }
      }
      return DEFAULT_WISHES
    }
    return []
  })

  // Silent automatic logging on initial load
  useEffect(() => {
    const runLogging = async () => {
      const logged = sessionStorage.getItem('logged_visit')
      if (!logged) {
        await logVisit('guest')
        sessionStorage.setItem('logged_visit', 'guest')
      }
    }
    runLogging()
  }, [])

  // Fetch wishes globally (Firestore only)
  useEffect(() => {
    if (isFirebaseEnabled) {
      const wishesRef = collection(db, 'wishes')
      const q = query(wishesRef, orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        if (list.length > 0) {
          setWishes(list)
        } else {
          setWishes(DEFAULT_WISHES)
        }
      }, (error) => {
        console.error('Failed to load wishes from Firestore:', error)
        setWishes(DEFAULT_WISHES)
      })
      return () => unsubscribe()
    }
  }, [])

  // Fetch memory image URLs for floating wishes avatars
  useEffect(() => {
    if (isFirebaseEnabled) {
      const memoriesRef = collection(db, 'memories')
      const q = query(memoriesRef, orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => doc.data().src).filter(Boolean)
        setMemories(list)
      }, (error) => {
        console.error('Failed to load memories in App:', error)
      })
      return () => unsubscribe()
    }
  }, [])

  // Trigger confetti celebration
  const triggerConfetti = () => {
    const confettiColors = ['#ff4a93', '#8c52ff', '#ffbe3b', '#fb7185', '#a855f7', '#ff6b6b']
    const emojis = ['❤️', '💖', '💕', '💗', '💝', '✨']
    const newConfetti = Array.from({ length: 90 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: Math.random() * 100, // percentage left
      y: Math.random() * -20 - 5, // initial top position offset
      size: Math.random() * 10 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 3.5 + 2.5,
      rotation: Math.random() * 360,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }))
    setConfetti(newConfetti)
    
    // Clear confetti after animation completes
    setTimeout(() => {
      setConfetti([])
    }, 8000)
  }

  const handleSisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (code.toUpperCase().trim() === SISTER_PASSCODE) {
      setUserRole('sister')
      setShowPasscodeModal(false)
      triggerConfetti()
      await logVisit('sister')
    } else {
      setError('Incorrect passcode. Please check and try again!')
    }
  }

  return (
    <>
      <div className="layout-container fade-in" style={{ position: 'relative' }}>
        
        {/* Floating particles background in main application */}
        <FloatingParticles type="main" count={90} />

        {/* Floating wishes in background across all tabs */}
        <FloatingWishes wishes={wishes} memories={memories} />

        {/* Confetti Rain Overlay */}
        <ConfettiOverlay confetti={confetti} />

        {/* Sister Login Trigger (Subtle button in the top corner) */}
        {userRole === 'visitor' && (
          <button 
            onClick={() => setShowPasscodeModal(true)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              zIndex: 100
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-primary)'
              e.currentTarget.style.borderColor = 'rgba(255, 74, 147, 0.3)'
              e.currentTarget.style.background = 'rgba(255, 74, 147, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <Key size={12} />
            <span>Sister Mode 👑</span>
          </button>
        )}

        {/* Elegant Greeting Header */}
        <GreetingHeader role={userRole} />

        {/* Main Content Area: Vertical Scroll Flow */}
        {userRole === 'visitor' ? (
          <main style={{ marginTop: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <section className="scroll-section fade-in">
              <MemoryGallery />
            </section>
            <section className="scroll-section fade-in">
              <WishesWall wishes={wishes} setWishes={setWishes} onCelebrate={triggerConfetti} showStaticGrid={false} />
            </section>
          </main>
        ) : (
          <>
            {/* Custom Synthesized Chimes Music Player */}
            <AudioPlayer />
            
            <main style={{ marginTop: '40px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
              <section className="scroll-section fade-in">
                <Card3D />
              </section>
              <section className="scroll-section fade-in">
                <VirtualCake onCelebrate={triggerConfetti} />
              </section>
              <section className="scroll-section fade-in">
                <MemoryGallery />
              </section>
              <section className="scroll-section fade-in">
                <WishesWall wishes={wishes} setWishes={setWishes} onCelebrate={triggerConfetti} showStaticGrid={true} showForm={false} />
              </section>
            </main>
          </>
        )}

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '80px', padding: '30px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            Made with <Heart size={12} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)' }} /> for a wonderful sister | Antigravity Design
          </p>
        </footer>
      </div>

      {/* Passcode Modal Overlay (rendered under body to guarantee centering) */}
      {showPasscodeModal && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,5,24,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
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
          
          <div className="glass-container fade-in" style={{ padding: '30px', maxWidth: '400px', width: '100%', position: 'relative' }}>
            <button 
              onClick={() => { setShowPasscodeModal(false); setError(''); setCode(''); }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: '1.6rem', color: 'white', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>Sister Passcode 👑</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you the birthday girl? Enter the secret passcode to unlock your greeting card and birthday cake!
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
        </div>,
        document.body
      )}
    </>
  )
}

export default App

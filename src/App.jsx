import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

import Entrance from './components/Entrance'
import FloatingParticles from './components/FloatingParticles'
import FloatingWishes from './components/FloatingWishes'
import ConfettiOverlay from './components/ConfettiOverlay'
import GreetingHeader from './components/GreetingHeader'
import AudioPlayer from './components/AudioPlayer'
import Card3D from './components/Card3D'
import VirtualCake from './components/VirtualCake'
import MemoryGallery from './components/MemoryGallery'
import WishesWall from './components/WishesWall'
import { db, isFirebaseEnabled } from './firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

const DEFAULT_WISHES = [
  { id: 'default1', text: "May your year be filled with laughter, endless joy, and wonderful surprises! 💖", sender: "With Love", color: "pink", timestamp: 1 },
  { id: 'default2', text: "To my partner in crime and the best sister in the world - thank you for always having my back. 🌟", sender: "Your Sibling", color: "indigo", timestamp: 2 },
  { id: 'default3', text: "Wishing you a day as beautiful, bright, and amazing as you are! Happy Birthday! 🎉", sender: "Best Wishes", color: "gold", timestamp: 3 }
]

function App() {
  const [userRole, setUserRole] = useState(null) // null, 'visitor', 'sister'
  const [confetti, setConfetti] = useState([])
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

  // Trigger confetti celebration
  const triggerConfetti = () => {
    const confettiColors = ['#ff4a93', '#8c52ff', '#ffbe3b', '#fb7185', '#38bdf8', '#a855f7']
    const newConfetti = Array.from({ length: 80 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: Math.random() * 100, // percentage left
      y: Math.random() * -20 - 5, // initial top position offset
      size: Math.random() * 10 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    }))
    setConfetti(newConfetti)
    
    // Clear confetti after animation completes
    setTimeout(() => {
      setConfetti([])
    }, 6000)
  }

  const handleEnter = (role) => {
    setUserRole(role)
    triggerConfetti()
  }

  if (!userRole) {
    return <Entrance onEnter={handleEnter} />
  }

  return (
    <div className="layout-container fade-in" style={{ position: 'relative' }}>
      
      {/* Floating particles background in main application */}
      <FloatingParticles type="main" />

      {/* Floating wishes in background across all tabs */}
      <FloatingWishes wishes={wishes} />

      {/* Confetti Rain Overlay */}
      <ConfettiOverlay confetti={confetti} />

      {/* Elegant Greeting Header */}
      <GreetingHeader role={userRole} />

      {/* Main Content Area: Vertical Scroll Flow */}
      {userRole === 'visitor' ? (
        <main style={{ marginTop: '20px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
          <section className="scroll-section fade-in">
            <MemoryGallery />
          </section>
          <section className="scroll-section fade-in">
            <WishesWall wishes={wishes} setWishes={setWishes} onCelebrate={triggerConfetti} />
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
              <WishesWall wishes={wishes} setWishes={setWishes} onCelebrate={triggerConfetti} />
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
  )
}

export default App

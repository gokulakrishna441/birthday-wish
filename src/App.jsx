import { useState } from 'react'
import { 
  Heart, 
  Cake, 
  BookOpen, 
  Image as ImageIcon 
} from 'lucide-react'

import Entrance from './components/Entrance'
import FloatingParticles from './components/FloatingParticles'
import ConfettiOverlay from './components/ConfettiOverlay'
import GreetingHeader from './components/GreetingHeader'
import AudioPlayer from './components/AudioPlayer'
import Card3D from './components/Card3D'
import VirtualCake from './components/VirtualCake'
import MemoryGallery from './components/MemoryGallery'
import WishesWall from './components/WishesWall'

function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [activeTab, setActiveTab] = useState('card') // 'card', 'cake', 'memories', 'wishes'
  const [confetti, setConfetti] = useState([])

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

  const handleEnter = () => {
    setHasEntered(true)
    triggerConfetti()
  }

  if (!hasEntered) {
    return <Entrance onEnter={handleEnter} />
  }

  return (
    <div className="layout-container fade-in" style={{ position: 'relative' }}>
      
      {/* Floating particles background in main application */}
      <FloatingParticles type="main" />

      {/* Confetti Rain Overlay */}
      <ConfettiOverlay confetti={confetti} />

      {/* Elegant Greeting Header */}
      <GreetingHeader />

      {/* Custom Synthesized Chimes Music Player */}
      <AudioPlayer />

      {/* Tab Navigation Menu */}
      <div style={{ textAlign: 'center' }}>
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            <BookOpen size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            3D Card
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cake' ? 'active' : ''}`}
            onClick={() => setActiveTab('cake')}
          >
            <Cake size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Virtual Cake
          </button>
          <button 
            className={`tab-btn ${activeTab === 'memories' ? 'active' : ''}`}
            onClick={() => setActiveTab('memories')}
          >
            <ImageIcon size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Memory Gallery
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wishes' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishes')}
          >
            <Heart size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Wishes Wall
          </button>
        </div>
      </div>

      {/* Main Tabbed Content Area */}
      <main style={{ marginTop: '20px', minHeight: '400px' }}>
        {activeTab === 'card' && <Card3D />}
        {activeTab === 'cake' && <VirtualCake onCelebrate={triggerConfetti} />}
        {activeTab === 'memories' && <MemoryGallery />}
        {activeTab === 'wishes' && <WishesWall onCelebrate={triggerConfetti} />}
      </main>

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

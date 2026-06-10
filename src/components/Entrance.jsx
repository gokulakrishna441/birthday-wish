import { Sparkles, Gift } from 'lucide-react'
import FloatingParticles from './FloatingParticles'

function Entrance({ onEnter }) {
  return (
    <div className="entrance-container">
      {/* Floating particles background */}
      <FloatingParticles type="entrance" />

      <div className="entrance-card glass-container fade-in">
        <div style={{ marginBottom: '24px' }}>
          <Sparkles size={48} className="sparkle-text" style={{ margin: '0 auto 10px' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>To A Very Special Sister</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            We created a magical space filled with surprises, music, memories, and wishes just for you.
          </p>
        </div>

        <div style={{ position: 'relative', height: '160px', margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

        <button className="btn btn-primary" onClick={onEnter}>
          Open Surprise 💖
        </button>
      </div>
    </div>
  )
}

export default Entrance

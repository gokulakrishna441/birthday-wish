import { Sparkles } from 'lucide-react'

function GreetingHeader({ role }) {
  const isSister = role === 'sister'

  return (
    <header className="header-container">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
        <span style={{ color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
          Celebration Space
        </span>
        <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h1 className="greeting-title">
        Happy Birthday, <span className="sparkle-text">Sister!</span> 🎉
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
        {isSister 
          ? "Today we celebrate you! Flip through your 3D greeting card, blow out the cake candles, visit your memory gallery, and see your wishes."
          : "Today we celebrate our wonderful sister! Share a memory in our gallery and leave your lovely wishes on the wall."
        }
      </p>
    </header>
  )
}

export default GreetingHeader

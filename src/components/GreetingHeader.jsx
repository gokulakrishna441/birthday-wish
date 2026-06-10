import { Sparkles } from 'lucide-react'

function GreetingHeader() {
  return (
    <header style={{ textAlign: 'center', marginBottom: '40px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
        <span style={{ color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
          Celebration Space
        </span>
        <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '12px' }}>
        Happy Birthday, <span className="sparkle-text">Sister!</span> 🎉
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
        Today we celebrate you! Flip through your card, blow out your cake candles, visit our memory gallery, and add a wish.
      </p>
    </header>
  )
}

export default GreetingHeader

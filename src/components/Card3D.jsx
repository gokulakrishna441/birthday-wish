import { useState } from 'react'
import { Heart } from 'lucide-react'

function Card3D({ memories }) {
  const [cardOpen, setCardOpen] = useState(false)

  return (
    <div className="fade-in" style={{ textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
        Hover and click the card to open and read a heartfelt letter!
      </p>
      <div className="card-3d-wrapper">
        <div 
          className={`card-3d ${cardOpen ? 'open' : ''}`}
          onClick={() => setCardOpen(!cardOpen)}
        >
          {/* Front Side */}
          <div className="card-side card-front">
            <div style={{ 
              border: '2px solid var(--accent-gold)', 
              boxShadow: 'inset 0 0 15px rgba(255, 190, 59, 0.15), 0 0 12px rgba(255, 190, 59, 0.1)',
              padding: '20px', 
              borderRadius: '14px', 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '12px', filter: 'drop-shadow(0 0 10px rgba(255, 190, 59, 0.55))' }}>👑</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: 'var(--accent-gold)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '8px' }}>For My Sister</h2>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Click to unfold</p>
            </div>
          </div>

          {/* Back Side (visible during folding) */}
          <div className="card-side card-back" style={{ background: '#fdfbf7', border: '1px solid #dfd8cb' }}>
            <div style={{ 
              border: '1px solid rgba(0,0,0,0.05)', 
              padding: '12px 12px 24px', 
              borderRadius: '10px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              {(memories && memories.length > 0) ? (
                <img 
                  src={memories[memories.length - 1]} 
                  alt="Sister Portrait" 
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    marginBottom: '14px'
                  }}
                  onError={(e) => {
                    // Fallback to heart if image fails to load
                    e.target.style.display = 'none';
                    const fallbackEl = e.target.nextSibling;
                    if (fallbackEl) fallbackEl.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'rgba(255, 74, 147, 0.03)',
                  border: '1px dashed rgba(255, 74, 147, 0.2)',
                  borderRadius: '6px',
                  display: (memories && memories.length > 0) ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px'
                }}
              >
                <Heart size={44} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)', opacity: 0.5 }} />
              </div>
              <span style={{ 
                fontFamily: 'Caveat, cursive', 
                fontSize: '1.5rem', 
                color: 'var(--accent-primary)', 
                fontWeight: 'bold',
                textShadow: '0 1px 1px rgba(0,0,0,0.05)'
              }}>
                To My Beautiful Sister ✨
              </span>
            </div>
          </div>

          {/* Inside Right (fixed side) */}
          <div className="card-inside" style={{ background: '#fdfbf7', border: '1px solid #dfd8cb' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: 'Caveat, cursive', color: '#1f162e', fontSize: '2.1rem', marginBottom: '10px', borderBottom: '1px solid #ebdcb9', paddingBottom: '4px', fontWeight: 'bold' }}>
                  Dearest Sister,
                </h3>
                <p style={{ color: '#4a3f5c', fontSize: '1.25rem', fontFamily: 'Caveat, cursive', lineHeight: '1.35', textAlign: 'left', marginBottom: '10px', fontStyle: 'italic' }}>
                  "Having a sister is like having a best friend you can’t get rid of. You know whatever you do, they’ll still be there."
                </p>
                <p style={{ color: '#332747', fontSize: '1.25rem', fontFamily: 'Caveat, cursive', lineHeight: '1.35', textAlign: 'left' }}>
                  You inspire me every day with your kindness, strength, and beautiful heart. Thank you for filling our lives with so much laughter and love. 
                  I hope this year brings you all the happiness you deserve.
                </p>
              </div>
              <div style={{ textAlign: 'right', marginTop: '5px' }}>
                <p style={{ fontWeight: 'bold', fontFamily: 'Caveat, cursive', fontSize: '1.35rem', color: 'var(--accent-primary)' }}>Always & Forever,</p>
                <p style={{ fontWeight: 'bold', fontFamily: 'Caveat, cursive', fontSize: '1.35rem', color: '#1f162e' }}>Your Loving Family 💖</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Card3D

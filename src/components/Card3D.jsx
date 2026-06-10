import { useState } from 'react'
import { Heart } from 'lucide-react'

function Card3D() {
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
            <div style={{ border: '2px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎁</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'white', marginBottom: '8px' }}>For My Sister</h2>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Click to unfold</p>
            </div>
          </div>

          {/* Back Side (visible during folding) */}
          <div className="card-side card-back">
            <div style={{ border: '1px solid rgba(0,0,0,0.08)', padding: '20px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Heart size={36} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)' }} />
            </div>
          </div>

          {/* Inside Right (fixed side) */}
          <div className="card-inside">
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#1f162e', fontSize: '1.6rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                Dearest Sister,
              </h3>
              <p style={{ color: '#4a3f5c', fontSize: '1rem', lineHeight: '1.5', textAlign: 'left', marginBottom: '12px', fontStyle: 'italic' }}>
                "Having a sister is like having a best friend you can’t get rid of. You know whatever you do, they’ll still be there."
              </p>
              <p style={{ color: '#4a3f5c', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left' }}>
                You inspire me every day with your kindness, strength, and beautiful heart. Thank you for filling our lives with so much laughter and love. 
                I hope this year brings you all the happiness you deserve.
              </p>
            </div>
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <p style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>Always & Forever,</p>
              <p style={{ fontWeight: '500', color: '#1f162e' }}>Your Loving Family 💖</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Card3D

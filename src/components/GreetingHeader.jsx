import { Sparkles } from 'lucide-react'
import heroImage from '../assets/hero.png'

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

      {role === 'visitor' && (
        <div className="hanging-photo-container">
          <style>{`
            @keyframes swing {
              0% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
              100% { transform: rotate(-3deg); }
            }
            .hanging-photo-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin: 25px auto 10px;
              position: relative;
              z-index: 15;
            }
            .hanging-photo-string {
              width: 2px;
              height: 35px;
              background: rgba(255, 255, 255, 0.35);
              position: relative;
            }
            .hanging-photo-string::before {
              content: '';
              position: absolute;
              top: -6px;
              left: -4px;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: var(--accent-gold);
              box-shadow: 0 0 8px var(--accent-gold);
            }
            .hanging-photo-frame {
              background: #ffffff;
              padding: 10px 10px 30px 10px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3);
              transform-origin: top center;
              animation: swing 3.5s ease-in-out infinite;
              border-radius: 4px;
              display: inline-block;
              border: 1px solid rgba(0,0,0,0.1);
              transition: transform 0.3s;
            }
            .hanging-photo-frame:hover {
              animation-play-state: paused;
              transform: rotate(0deg) scale(1.05);
              box-shadow: 0 15px 35px rgba(0,0,0,0.6);
            }
            .hanging-photo-img {
              width: 240px;
              height: 180px;
              object-fit: cover;
              border-radius: 2px;
              display: block;
            }
            .hanging-photo-label {
              font-family: 'Caveat', cursive;
              color: #2b1c40;
              font-size: 1.2rem;
              font-weight: bold;
              margin-top: 8px;
              text-align: center;
            }
            @media (max-width: 480px) {
              .hanging-photo-img {
                width: 180px;
                height: 135px;
              }
              .hanging-photo-frame {
                padding: 8px 8px 22px 8px;
              }
              .hanging-photo-string {
                height: 25px;
              }
              .hanging-photo-label {
                font-size: 1rem;
                margin-top: 5px;
              }
            }
          `}</style>
          <div className="hanging-photo-string"></div>
          <div className="hanging-photo-frame">
            <img src={heroImage} alt="Hanging Memory" className="hanging-photo-img" />
            <div className="hanging-photo-label">Happy Birthday ✨</div>
          </div>
        </div>
      )}
    </header>
  )
}

export default GreetingHeader

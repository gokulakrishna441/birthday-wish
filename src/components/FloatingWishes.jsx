
function FloatingWishes({ wishes = [] }) {
  const activeWishes = wishes.slice(0, 15)
  
  if (activeWishes.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none', // Let user click items underneath
      zIndex: 1, // Behind main content but readable
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes zigZagDriftRight {
          0% {
            transform: translateX(-150px) translateY(0) rotate(-4deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          25% {
            transform: translateX(25vw) translateY(-35px) rotate(3deg);
          }
          50% {
            transform: translateX(50vw) translateY(35px) rotate(-3deg);
          }
          75% {
            transform: translateX(75vw) translateY(-35px) rotate(3deg);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(105vw) translateY(0) rotate(-4deg);
            opacity: 0;
          }
        }
        @keyframes zigZagDriftLeft {
          0% {
            transform: translateX(105vw) translateY(0) rotate(4deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          25% {
            transform: translateX(75vw) translateY(35px) rotate(-3deg);
          }
          50% {
            transform: translateX(50vw) translateY(-35px) rotate(4deg);
          }
          75% {
            transform: translateX(25vw) translateY(35px) rotate(-3deg);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(-150px) translateY(0) rotate(4deg);
            opacity: 0;
          }
        }
        .bg-card-wrapper {
          pointer-events: auto; /* Re-enable cursor events on the cards */
          transition: z-index 0s;
        }
        .bg-card-wrapper:hover {
          animation-play-state: paused !important;
          z-index: 99999 !important;
        }
        .bg-card-wrapper:hover .bg-floating-card {
          transform: scale(1.1) !important;
          opacity: 1 !important;
          background: rgba(20, 11, 45, 0.98) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.6), 0 0 25px var(--glow-color) !important;
        }
        .bg-floating-card.color-pink {
          --glow-color: var(--accent-primary);
        }
        .bg-floating-card.color-indigo {
          --glow-color: var(--accent-secondary);
        }
        .bg-floating-card.color-gold {
          --glow-color: var(--accent-gold);
        }
      `}</style>

      {activeWishes.map((w, index) => {
        // Calculate stable variations based on index
        const yPos = 8 + ((index * 23) % 78) // Spread vertically 8% - 86%
        const speed = 25 + ((index * 7) % 15) // 25s - 40s drift speed
        const delay = (index * 5) % 35 // Staggered delays
        const scale = 0.85 + ((index * 2) % 4) * 0.05 // Scale 0.85 - 1.04
        const isLeftToRight = index % 2 === 0

        return (
          <div
            key={w.id}
            style={{
              position: 'absolute',
              top: `${yPos}vh`,
              left: isLeftToRight ? 0 : 'auto',
              right: isLeftToRight ? 'auto' : 0,
              width: '260px',
              animation: `${isLeftToRight ? 'zigZagDriftRight' : 'zigZagDriftLeft'} ${speed}s linear infinite`,
              // Start drifting immediately mid-animation on mount using negative delay
              animationDelay: `-${delay}s`,
              zIndex: 2
            }}
            className="bg-card-wrapper"
          >
            <div
              className={`bg-floating-card color-${w.color}`}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                background: 'rgba(20, 11, 45, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: `4px solid ${
                  w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)'
                }`,
                backdropFilter: 'blur(6px)',
                opacity: 0.55,
                transform: `scale(${scale})`,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2), opacity 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s'
              }}
            >
              <p style={{ 
                fontSize: '0.85rem', 
                fontStyle: 'italic', 
                marginBottom: '10px', 
                color: '#ece8ff', 
                lineHeight: '1.4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                "{w.text}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>From</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)'
                }}>
                  - {w.sender}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FloatingWishes

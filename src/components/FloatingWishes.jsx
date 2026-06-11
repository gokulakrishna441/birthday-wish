
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
      zIndex: 1, // Behind main card content tabs (z-index >= 2)
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes bgDropWish {
          0% {
            transform: translateY(-120%) translateX(0) rotate(-2deg);
            opacity: 0;
          }
          10% {
            opacity: 0.25;
          }
          50% {
            transform: translateY(50vh) translateX(20px) rotate(3deg);
          }
          90% {
            opacity: 0.25;
          }
          100% {
            transform: translateY(115vh) translateX(-20px) rotate(-3deg);
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
          transform: scale(1.15) !important;
          opacity: 1 !important;
          background: rgba(27, 13, 58, 0.96) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
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
        const xPos = 3 + ((index * 23) % 85) // Spread 3% - 88%
        const speed = 30 + ((index * 11) % 25) // 30s - 55s fall speed (gentle, readable fall)
        const delay = (index * 6) % 40 // Staggered delays
        const scale = 0.8 + ((index * 3) % 4) * 0.08 // Scale 0.8 - 1.04

        return (
          <div
            key={w.id}
            style={{
              position: 'absolute',
              left: `${xPos}%`,
              top: 0,
              width: '240px',
              animation: `bgDropWish ${speed}s linear infinite`,
              // Start floating mid-air immediately on mount using negative delay
              animationDelay: `-${delay}s`,
              zIndex: 1
            }}
            className="bg-card-wrapper"
          >
            <div
              className={`bg-floating-card color-${w.color}`}
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                textAlign: 'left',
                cursor: 'help',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(3px)',
                opacity: 0.22,
                transform: `scale(${scale})`,
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s, background 0.4s, border-color 0.4s, box-shadow 0.4s'
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

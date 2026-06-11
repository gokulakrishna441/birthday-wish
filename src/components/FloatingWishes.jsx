
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1464349608316-2b47b27f3b47?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=100&auto=format&fit=crop&q=60'
]

function FloatingWishes({ wishes = [], memories = [] }) {
  const activeWishes = wishes.slice(0, 15)
  
  if (activeWishes.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1, 
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes verticalFloat {
          0% {
            transform: translateY(105vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-25vh) rotate(5deg);
            opacity: 0;
          }
        }
        .bg-card-wrapper {
          pointer-events: auto;
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
        .bg-floating-card {
          width: 195px;
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
        @media (max-width: 1024px) {
          .bg-floating-card {
            width: 140px;
          }
        }
        @media (max-width: 480px) {
          .bg-card-wrapper {
            display: none !important;
          }
        }
      `}</style>

      {activeWishes.map((w, index) => {
        // Stagger positions vertically and place strictly in side gutters
        const speed = 12 + ((index * 4) % 10) // 12s - 22s travel speed (faster!)
        const delay = (index * 5) % 20
        const scale = 0.85 + ((index * 2) % 4) * 0.05
        const isLeftGutter = index % 2 === 0
        const gutterOffset = 1.5 + ((index * 3) % 9) // 1.5% to 10.5% viewport width offsets

        // Choose picture source (user uploaded or default)
        const imgUrl = (memories && memories.length > 0)
          ? memories[index % memories.length]
          : DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]

        return (
          <div
            key={w.id}
            style={{
              position: 'absolute',
              bottom: 0,
              left: isLeftGutter ? `${gutterOffset}vw` : 'auto',
              right: isLeftGutter ? 'auto' : `${gutterOffset}vw`,
              animation: `verticalFloat ${speed}s linear infinite`,
              animationDelay: `-${delay}s`,
              zIndex: 2
            }}
            className="bg-card-wrapper"
          >
            <div
              className={`bg-floating-card color-${w.color}`}
              style={{
                padding: '12px 14px',
                borderRadius: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                background: 'rgba(20, 11, 45, 0.92)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderLeft: `4px solid ${
                  w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)'
                }`,
                backdropFilter: 'blur(8px)',
                opacity: 0.85,
                transform: `scale(${scale})`,
                transition: 'transform 0.3s, opacity 0.3s, background 0.3s, border-color 0.3s, box-shadow 0.3s',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <img 
                src={imgUrl} 
                alt="wish item" 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(255,255,255,0.2)',
                  flexShrink: 0
                }}
              />
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <p style={{ 
                  fontSize: '0.72rem', 
                  fontStyle: 'italic', 
                  marginBottom: '2px', 
                  color: '#ffffff',
                  lineHeight: '1.3',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  "{w.text}"
                </p>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: '600', 
                    color: w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    - {w.sender}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FloatingWishes

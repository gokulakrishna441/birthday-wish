import { useState, useEffect } from 'react'

function FloatingParticles({ type = 'main', count = 25 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, idx) => ({
      id: idx,
      size: Math.random() * 8 + 4,
      left: Math.random() * 100,
      delay: -Math.random() * 8,
      duration: Math.random() * 4 + 4, // 4s - 8s duration (faster!)
      particleType: Math.random() > 0.5 ? 'heart' : 'other'
    }))

    const timer = setTimeout(() => {
      setParticles(generated)
    }, 0)

    return () => clearTimeout(timer)
  }, [count])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1
    }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-element"
          style={{
            left: `${p.left}%`,
            bottom: `-20px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: type === 'entrance' ? `${p.size * 2}px` : `${p.size * 2.5}px`
          }}
        >
          {type === 'entrance'
            ? (p.particleType === 'heart' ? '💖' : '🎈')
            : (p.particleType === 'heart' ? '💗' : '✨')
          }
        </div>
      ))}
    </div>
  )
}

export default FloatingParticles

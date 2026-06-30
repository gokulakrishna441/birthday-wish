

function ConfettiOverlay({ confetti }) {
  if (!confetti || confetti.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 99999
    }}>
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: `${c.y}px`,
            fontSize: `${c.size * 2.8}px`,
            color: c.color,
            transform: `rotate(${c.rotation}deg)`,
            opacity: 0.9,
            pointerEvents: 'none',
            animation: `float-upwards ${c.duration}s linear forwards`,
            animationDelay: `${c.delay}s`,
            textShadow: '0 0 8px rgba(255, 74, 147, 0.4)'
          }}
        >
          {c.emoji || '❤️'}
        </div>
      ))}
    </div>
  )
}

export default ConfettiOverlay

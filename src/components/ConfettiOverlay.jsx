

function ConfettiOverlay({ confetti }) {
  if (!confetti || confetti.length === 0) return null

  return (
    <>
      {confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'fixed',
            left: `${c.x}%`,
            top: `${c.y}px`,
            fontSize: `${c.size * 2.8}px`,
            color: c.color,
            transform: `rotate(${c.rotation}deg)`,
            opacity: 0.9,
            pointerEvents: 'none',
            zIndex: 99999,
            animation: `float-upwards ${c.duration}s linear forwards`,
            animationDelay: `${c.delay}s`,
            textShadow: '0 0 8px rgba(255, 74, 147, 0.4)'
          }}
        >
          {c.emoji || '❤️'}
        </div>
      ))}
    </>
  )
}

export default ConfettiOverlay

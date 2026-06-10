

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
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            borderRadius: c.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${c.rotation}deg)`,
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 100,
            animation: `float-upwards ${c.duration}s linear forwards`,
            animationDelay: `${c.delay}s`
          }}
        />
      ))}
    </>
  )
}

export default ConfettiOverlay

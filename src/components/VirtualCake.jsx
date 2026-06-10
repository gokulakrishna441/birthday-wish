import { useState } from 'react'

function VirtualCake({ onCelebrate }) {
  const [candles, setCandles] = useState([true, true, true]) // true = lit

  const handleCandleClick = (index) => {
    const nextCandles = [...candles]
    nextCandles[index] = false
    setCandles(nextCandles)

    // If all candles are blown out, trigger celebrate callback
    if (nextCandles.every((c) => !c)) {
      if (onCelebrate) onCelebrate()
    }
  }

  const resetCandles = () => {
    setCandles([true, true, true])
  }

  const blowAllCandles = () => {
    setCandles([false, false, false])
    if (onCelebrate) onCelebrate()
  }

  return (
    <div className="glass-container fade-in" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Blow Out the Candles! 🎂</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Click on each flame to extinguish the candles, or click blow to extinguish them all!
      </p>

      <div className="cake-container">
        {/* Candles */}
        {candles.map((isLit, idx) => (
          <div 
            key={idx} 
            className={`candle ${idx === 0 ? 'candle-left' : idx === 2 ? 'candle-right' : ''}`}
          >
            <div 
              className={`flame ${isLit ? '' : 'extinguished'}`}
              onClick={() => handleCandleClick(idx)}
              title="Click to blow out!"
            />
          </div>
        ))}

        {/* Cake layers */}
        <div className="cake">
          <div className="cake-layer cake-layer-top">
            <div className="frosting">
              <div className="dripping dripping-1" />
              <div className="dripping dripping-2" />
              <div className="dripping dripping-3" />
            </div>
          </div>
          <div className="cake-layer cake-layer-middle" />
          <div className="cake-layer cake-layer-bottom" />
        </div>
      </div>

      {candles.every(c => !c) ? (
        <div className="fade-in" style={{ marginTop: '20px' }}>
          <h3 className="sparkle-text" style={{ fontSize: '1.6rem', marginBottom: '10px' }}>
            Make A Wish! ✨
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Your candles are blown out! May all your sweet dreams and wishes come true.
          </p>
          <button className="btn btn-primary" onClick={resetCandles}>
            Relight Candles 🕯️
          </button>
        </div>
      ) : (
        <button 
          className="btn btn-secondary"
          style={{ marginTop: '30px' }}
          onClick={blowAllCandles}
        >
          Blow Out All Candles 🌬️
        </button>
      )}
    </div>
  )
}

export default VirtualCake

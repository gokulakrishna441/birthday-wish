import { useState, useEffect } from 'react'
import { Plus, Wifi, WifiOff } from 'lucide-react'
import { db, isFirebaseEnabled } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

function WishesWall({ wishes = [], setWishes, onCelebrate, showStaticGrid = true }) {
  const [newWish, setNewWish] = useState('')
  const [newSender, setNewSender] = useState('')
  const [wishColor, setWishColor] = useState('pink')
  const [hearts, setHearts] = useState([])

  // LocalStorage update sync (only if Firebase is disabled)
  useEffect(() => {
    if (!isFirebaseEnabled && wishes.length > 0) {
      localStorage.setItem('birthday_wishes', JSON.stringify(wishes))
    }
  }, [wishes])

  const handleAddWish = async (e) => {
    e.preventDefault()
    if (!newWish.trim()) return

    const wishText = newWish.trim()
    const senderText = newSender.trim() || "Anonymous Friend"

    if (isFirebaseEnabled) {
      const wish = {
        text: wishText,
        sender: senderText,
        color: wishColor,
        timestamp: Date.now()
      }
      try {
        const wishesRef = collection(db, 'wishes')
        await addDoc(wishesRef, wish)
        setNewWish('')
        setNewSender('')
        if (onCelebrate) {
          onCelebrate()
        }
      } catch (err) {
        console.error('Failed to submit wish to Firestore:', err)
        alert('Failed to submit wish to Cloud Firestore. Please verify your Firestore Database Rules.')
      }
    } else {
      // LocalStorage Fallback
      const wish = {
        id: Date.now(),
        text: wishText,
        sender: senderText,
        color: wishColor,
        timestamp: Date.now()
      }
      setWishes(prev => [wish, ...prev])
      setNewWish('')
      setNewSender('')
      if (onCelebrate) {
        onCelebrate()
      }
    }
  }

  const handleHoverCard = (e, color) => {
    // Spawn 2 floating hearts around the cursor coordinates
    const newHearts = Array.from({ length: 2 }).map((_, i) => ({
      id: `${Date.now()}-${i}-${Math.random()}`,
      x: e.clientX + (Math.random() * 40 - 20),
      y: e.clientY + (Math.random() * 20 - 10),
      size: Math.random() * 14 + 10,
      color: color === 'pink' ? '#ff4a93' : color === 'indigo' ? '#8c52ff' : '#ffbe3b'
    }))
    
    setHearts(prev => [...prev, ...newHearts])
    
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)))
    }, 1500)
  }

  return (
    <div className="fade-in" style={{ position: 'relative', zIndex: 10 }}>
      <style>{`
        @keyframes riseAndFade {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-60px) scale(1.3) rotate(10deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-150px) scale(0.7) rotate(-15deg);
            opacity: 0;
          }
        }
        @keyframes dropDownCard {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Floating Hearts Overlay */}
      {hearts.map(h => (
        <span 
          key={h.id}
          style={{
            position: 'fixed',
            left: h.x,
            top: h.y,
            fontSize: `${h.size}px`,
            color: h.color,
            pointerEvents: 'none',
            zIndex: 999999,
            animation: 'riseAndFade 1.5s ease-out forwards'
          }}
        >
          ❤️
        </span>
      ))}

      {/* Main Wishes Wall View */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>The Wishes Wall 💌</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Leave a sweet message, customize the theme, and post it to the board!</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          {/* Connection status indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: isFirebaseEnabled ? 'rgba(56, 189, 248, 0.08)' : 'rgba(251, 113, 133, 0.08)',
            border: `1px solid ${isFirebaseEnabled ? 'rgba(56, 189, 248, 0.15)' : 'rgba(251, 113, 133, 0.15)'}`,
            fontSize: '0.8rem',
            color: isFirebaseEnabled ? '#38bdf8' : '#fb7185'
          }}>
            {isFirebaseEnabled ? (
              <>
                <Wifi size={12} />
                <span>Synced Globally via Cloud</span>
              </>
            ) : (
              <>
                <WifiOff size={12} />
                <span>Saving locally to browser</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddWish} className="glass-container" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto 40px', textAlign: 'left' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-primary)' }}>
            Your Message
          </label>
          <textarea 
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            placeholder="Type your warm birthday wish here..."
            style={{
              width: '100%',
              height: '80px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              resize: 'none',
              outline: 'none'
            }}
            maxLength={150}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-primary)' }}>
              Your Name / Signature
            </label>
            <input 
              type="text"
              value={newSender}
              onChange={(e) => setNewSender(e.target.value)}
              placeholder="e.g. Bro, Mom, Friend"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
              maxLength={30}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-primary)' }}>
              Card Theme Color
            </label>
            <div style={{ display: 'flex', gap: '8px', height: '40px', alignItems: 'center' }}>
              {['pink', 'indigo', 'gold'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setWishColor(c)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: wishColor === c ? '2px solid white' : 'none',
                    cursor: 'pointer',
                    backgroundColor: c === 'pink' ? 'var(--accent-primary)' : c === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)',
                    boxShadow: wishColor === c ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          <Plus size={18} /> Add Wish to Wall
        </button>
      </form>

      {/* Display Board (Only if showStaticGrid is true) */}
      {showStaticGrid && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {wishes.map((w, idx) => (
            <div 
              key={w.id} 
              className="glass-container"
              onMouseMove={(e) => handleHoverCard(e, w.color)}
              style={{
                padding: '24px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                borderLeft: `4px solid ${
                  w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)'
                }`,
                background: 'rgba(255,255,255,0.02)',
                animation: 'dropDownCard 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards',
                animationDelay: `${idx * 0.08}s`,
                opacity: 0,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2), box-shadow 0.3s, border-color 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.3), 0 0 15px ${
                  w.color === 'pink' ? 'rgba(255,74,147,0.2)' : w.color === 'indigo' ? 'rgba(140,82,255,0.2)' : 'rgba(255,190,59,0.2)'
                }`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '16px', color: '#eae6f8', lineHeight: '1.5' }}>
                "{w.text}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted</span>
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  color: w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : 'var(--accent-gold)'
                }}>
                  - {w.sender}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishesWall

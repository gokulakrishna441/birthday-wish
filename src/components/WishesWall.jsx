import { useState, useEffect } from 'react'
import { Plus, Wifi, WifiOff } from 'lucide-react'
import { db, isFirebaseEnabled } from '../firebase'
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'

const DEFAULT_WISHES = [
  { id: 'default1', text: "May your year be filled with laughter, endless joy, and wonderful surprises! 💖", sender: "With Love", color: "pink", timestamp: 1 },
  { id: 'default2', text: "To my partner in crime and the best sister in the world - thank you for always having my back. 🌟", sender: "Your Sibling", color: "indigo", timestamp: 2 },
  { id: 'default3', text: "Wishing you a day as beautiful, bright, and amazing as you are! Happy Birthday! 🎉", sender: "Best Wishes", color: "gold", timestamp: 3 }
]

function WishesWall({ onCelebrate }) {
  const [wishes, setWishes] = useState(() => {
    if (!isFirebaseEnabled) {
      const saved = localStorage.getItem('birthday_wishes')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load wishes from localStorage:', e)
        }
      }
      return DEFAULT_WISHES
    }
    return []
  })
  const [newWish, setNewWish] = useState('')
  const [newSender, setNewSender] = useState('')
  const [wishColor, setWishColor] = useState('pink')
  const [loading, setLoading] = useState(isFirebaseEnabled)

  // Load wishes (Firestore only)
  useEffect(() => {
    if (isFirebaseEnabled) {
      const wishesRef = collection(db, 'wishes')
      const q = query(wishesRef, orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        if (list.length > 0) {
          setWishes(list)
        } else {
          setWishes(DEFAULT_WISHES)
        }
        setLoading(false)
      }, (error) => {
        console.error('Failed to load wishes from Firestore:', error)
        setWishes(DEFAULT_WISHES)
        setLoading(false)
      })
      return () => unsubscribe()
    }
  }, [])

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

  return (
    <div className="fade-in">
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>The Wishes Wall 💌</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Leave a sweet message, customize the theme, and post it to the board!</p>
        
        {/* Connection status indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '12px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: isFirebaseEnabled ? 'rgba(56, 189, 248, 0.1)' : 'rgba(251, 113, 133, 0.1)',
          border: `1px solid ${isFirebaseEnabled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(251, 113, 133, 0.2)'}`,
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            display: 'inline-block',
            width: '30px',
            height: '30px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '10px'
          }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connecting to Cloud Database...</p>
        </div>
      ) : (
        <>
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

          {/* Display Board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {wishes.map((w) => (
              <div 
                key={w.id} 
                className="glass-container fade-in"
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
                  background: 'rgba(255,255,255,0.02)'
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
        </>
      )}
    </div>
  )
}

export default WishesWall


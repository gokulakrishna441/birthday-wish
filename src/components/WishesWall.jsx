import { useState } from 'react'
import { Plus } from 'lucide-react'

function WishesWall({ onCelebrate }) {
  const [wishes, setWishes] = useState([
    { id: 1, text: "May your year be filled with laughter, endless joy, and wonderful surprises! 💖", sender: "With Love", color: "pink" },
    { id: 2, text: "To my partner in crime and the best sister in the world - thank you for always having my back. 🌟", sender: "Your Sibling", color: "indigo" },
    { id: 3, text: "Wishing you a day as beautiful, bright, and amazing as you are! Happy Birthday! 🎉", sender: "Best Wishes", color: "gold" }
  ])
  const [newWish, setNewWish] = useState('')
  const [newSender, setNewSender] = useState('')
  const [wishColor, setWishColor] = useState('pink')

  const handleAddWish = (e) => {
    e.preventDefault()
    if (!newWish.trim()) return

    const wish = {
      id: Date.now(),
      text: newWish,
      sender: newSender.trim() || "Anonymous Friend",
      color: wishColor
    }

    setWishes([wish, ...wishes])
    setNewWish('')
    setNewSender('')
    
    if (onCelebrate) {
      onCelebrate()
    }
  }

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>The Wishes Wall 💌</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Leave a sweet message, customize the theme, and post it to the board!</p>
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
    </div>
  )
}

export default WishesWall

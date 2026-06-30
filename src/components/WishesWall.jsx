import { useState, useEffect } from 'react'
import { Plus, Wifi, WifiOff, Camera, Loader2, Trash2 } from 'lucide-react'
import { db, isFirebaseEnabled } from '../firebase'
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore'

// Canvas image compressor for wish attachments
const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        } catch (e) {
          resolve(event.target.result)
        }
      }
      img.onerror = () => resolve(event.target.result)
    }
    reader.onerror = () => resolve(null)
  })
}

function WishesWall({ wishes, setWishes, onCelebrate, showStaticGrid = true, showForm = true, role }) {
  const [newWish, setNewWish] = useState('')
  const [newSender, setNewSender] = useState('')
  const [wishColor, setWishColor] = useState('pink')
  const [hearts, setHearts] = useState([])

  // Image upload states
  const [wishImage, setWishImage] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const handleAddWish = async (e) => {
    e.preventDefault()
    if (!newWish.trim()) return

    const wishText = newWish.trim()
    const senderText = newSender.trim() || 'Anonymous'

    if (isFirebaseEnabled) {
      try {
        const wishesRef = collection(db, 'wishes')
        await addDoc(wishesRef, {
          text: wishText,
          sender: senderText,
          color: wishColor,
          image: wishImage,
          timestamp: Date.now()
        })
        setNewWish('')
        setNewSender('')
        setWishImage(null)
        if (onCelebrate) {
          onCelebrate()
        }
      } catch (error) {
        console.error('Failed to post wish to Firestore:', error)
      }
    } else {
      const wish = {
        id: Date.now().toString(),
        text: wishText,
        sender: senderText,
        color: wishColor,
        image: wishImage,
        timestamp: Date.now()
      }
      setWishes(prev => [wish, ...prev])
      setNewWish('')
      setNewSender('')
      setWishImage(null)
      if (onCelebrate) {
        onCelebrate()
      }
    }
  }

  const handleDeleteWish = async (wish) => {
    if (confirm('Are you sure you want to delete this wish?')) {
      if (isFirebaseEnabled) {
        try {
          await deleteDoc(doc(db, 'wishes', wish.id))
        } catch (error) {
          console.error('Failed to delete wish from Firestore:', error)
        }
      } else {
        const updated = wishes.filter(item => item.id !== wish.id)
        setWishes(updated)
        localStorage.setItem('birthday_wishes', JSON.stringify(updated))
      }
    }
  }

  const handleHoverCard = (e, color) => {
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
        <p style={{ color: 'var(--text-secondary)' }}>Leave a sweet message, attach a photo, and post it to the board!</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
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
      {showForm && (
        <form onSubmit={handleAddWish} className="glass-container responsive-card" style={{ maxWidth: '600px', margin: '0 auto 40px', textAlign: 'left' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
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

          {/* Photo attachment widget */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '6px', color: 'var(--text-primary)' }}>
              Attach a Photo (Optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="file" 
                accept="image/*" 
                id="wish-photo-upload"
                onChange={async (e) => {
                  const file = e.target.files[0]
                  if (!file) return
                  setIsCompressing(true)
                  try {
                    const dataUrl = await compressImage(file)
                    setWishImage(dataUrl)
                  } catch (err) {
                    console.error('Error compressing wish photo:', err)
                  }
                  setIsCompressing(false)
                }}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('wish-photo-upload').click()}
                className="btn btn-secondary"
                style={{
                  padding: '10px 18px',
                  borderRadius: '25px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                disabled={isCompressing}
              >
                {isCompressing ? (
                  <Loader2 size={14} className="spinning-loader" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Camera size={14} style={{ color: 'var(--accent-gold)' }} />
                )}
                <span>{wishImage ? 'Change Photo' : 'Attach Photo 📸'}</span>
              </button>

              {wishImage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                  <img 
                    src={wishImage} 
                    alt="Preview" 
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255, 74, 147, 0.3)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setWishImage(null)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: 'none',
                      color: '#ef4444',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={18} /> Add Wish to Wall
          </button>
        </form>
      )}

      {/* Display Board (Only if showStaticGrid is true) */}
      {showStaticGrid && (
        <div className="wishes-grid">
          {wishes.map((w, idx) => {
            const angle = (idx % 3 - 1) * 1.8
            return (
              <div 
                key={w.id} 
                className={`wish-sticky-note color-${w.color}`}
                onMouseMove={(e) => {
                  if (window.matchMedia('(hover: hover)').matches) {
                    handleHoverCard(e, w.color);
                  }
                }}
                style={{
                  animation: 'dropDownCard 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15) forwards',
                  animationDelay: `${idx * 0.08}s`,
                  opacity: 0,
                  transform: `rotate(${angle}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) rotate(0deg) scale(1.05)'
                  e.currentTarget.style.borderColor = w.color === 'pink' ? 'rgba(255, 74, 147, 0.4)' : w.color === 'indigo' ? 'rgba(140, 82, 255, 0.4)' : 'rgba(255, 190, 59, 0.4)'
                  e.currentTarget.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.5), 0 0 25px ${w.color === 'pink' ? 'rgba(255, 74, 147, 0.45)' : w.color === 'indigo' ? 'rgba(140, 82, 255, 0.45)' : 'rgba(255, 190, 59, 0.45)'}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translateY(0) rotate(${angle}deg) scale(1)`
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="washi-tape" />

                {role === 'sister' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWish(w);
                    }}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(239, 68, 68, 0.85)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)'}
                    title="Delete Wish"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                
                {w.image && (
                  <img 
                    src={w.image} 
                    alt="Memory" 
                    style={{
                      width: '100%',
                      maxHeight: '220px',
                      objectFit: 'contain',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  />
                )}

                <p style={{ fontSize: '1.4rem', fontFamily: 'Caveat, cursive', marginBottom: '12px', color: '#eae6f8', lineHeight: '1.4' }}>
                  "{w.text}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Posted</span>
                  <span style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    fontFamily: 'Caveat, cursive',
                    color: w.color === 'pink' ? 'var(--accent-primary)' : w.color === 'indigo' ? 'var(--accent-secondary)' : w.color === 'gold' ? 'var(--accent-gold)' : 'var(--accent-primary)'
                  }}>
                    - {w.sender}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WishesWall

import React, { useState, useEffect, useRef } from 'react'
import { 
  Heart, 
  Cake, 
  Gift, 
  Music, 
  Play, 
  Square, 
  Plus, 
  Sparkles, 
  Volume2, 
  VolumeX,
  BookOpen,
  Image as ImageIcon,
  Smile,
  Star
} from 'lucide-react'
import birthdayBg from './assets/birthday_bg.png'
import memoryBg from './assets/memory_bg.png'

function App() {
  // Navigation & Screen States
  const [hasEntered, setHasEntered] = useState(false)
  const [activeTab, setActiveTab] = useState('card') // 'card', 'cake', 'memories', 'wishes'
  
  // Interactive Component States
  const [cardOpen, setCardOpen] = useState(false)
  const [candles, setCandles] = useState([true, true, true]) // true = lit
  const [confetti, setConfetti] = useState([])
  const [audioPlaying, setAudioPlaying] = useState(false)
  
  // Wishes list state
  const [wishes, setWishes] = useState([
    { id: 1, text: "May your year be filled with laughter, endless joy, and wonderful surprises! 💖", sender: "With Love", color: "pink" },
    { id: 2, text: "To my partner in crime and the best sister in the world - thank you for always having my back. 🌟", sender: "Your Sibling", color: "indigo" },
    { id: 3, text: "Wishing you a day as beautiful, bright, and amazing as you are! Happy Birthday! 🎉", sender: "Best Wishes", color: "gold" }
  ])
  const [newWish, setNewWish] = useState('')
  const [newSender, setNewSender] = useState('')
  const [wishColor, setWishColor] = useState('pink')

  // Particles for ambient background
  const [particles, setParticles] = useState([])
  
  // Web Audio Context reference
  const audioCtxRef = useRef(null)
  const audioTimeoutRef = useRef(null)
  const currentNoteIndexRef = useRef(0)

  // Generate ambient floating particles
  useEffect(() => {
    const generated = Array.from({ length: 25 }).map((_, idx) => ({
      id: idx,
      size: Math.random() * 8 + 4,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 6,
      type: Math.random() > 0.5 ? 'heart' : 'bubble'
    }))
    setParticles(generated)
  }, [])

  // Trigger confetti celebration
  const triggerConfetti = () => {
    const confettiColors = ['#ff4a93', '#8c52ff', '#ffbe3b', '#fb7185', '#38bdf8', '#a855f7']
    const newConfetti = Array.from({ length: 80 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: Math.random() * 100, // percentage left
      y: Math.random() * -20 - 5, // initial top position offset
      size: Math.random() * 10 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    }))
    setConfetti(newConfetti)
    
    // Clear confetti after animation completes
    setTimeout(() => {
      setConfetti([])
    }, 6000)
  }

  // Handle candle click to blow out
  const handleCandleClick = (index) => {
    const nextCandles = [...candles]
    nextCandles[index] = false
    setCandles(nextCandles)

    // If all candles are blown out, trigger confetti and playing music
    if (nextCandles.every(c => !c)) {
      triggerConfetti()
    }
  }

  const resetCandles = () => {
    setCandles([true, true, true])
  }

  // Synthesize Happy Birthday song using Web Audio API
  const playBirthdayTune = () => {
    if (audioPlaying) {
      // Stop tune
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      clearTimeout(audioTimeoutRef.current)
      setAudioPlaying(false)
      return
    }

    setAudioPlaying(true)
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    // Happy Birthday notes and durations
    // Notes: C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, Bb4=466.16, C5=523.25
    const notes = [
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 1.0 }, // Happy Birthday to you
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 1.0 }, // Happy Birthday to you
      { f: 261.63, d: 0.35 }, { f: 261.63, d: 0.15 }, { f: 523.25, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 293.66, d: 1.0 }, // Happy Birthday dear Sister
      { f: 466.16, d: 0.35 }, { f: 466.16, d: 0.15 }, { f: 440.00, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 349.23, d: 1.0 }  // Happy Birthday to you
    ]

    currentNoteIndexRef.current = 0

    const playNextNote = () => {
      if (!audioCtxRef.current || currentNoteIndexRef.current >= notes.length) {
        setAudioPlaying(false)
        if (audioCtxRef.current) {
          audioCtxRef.current.close()
          audioCtxRef.current = null
        }
        return
      }

      const note = notes[currentNoteIndexRef.current]
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Use a premium soft triangle wave for chime sound
      osc.type = 'triangle'
      osc.frequency.value = note.f

      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05)
      gainNode.gain.setValueAtTime(0.3, now + note.d * 0.8)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + note.d)

      osc.start(now)
      osc.stop(now + note.d)

      currentNoteIndexRef.current++
      audioTimeoutRef.current = setTimeout(playNextNote, note.d * 1000 + 50)
    }

    playNextNote()
  }

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
      clearTimeout(audioTimeoutRef.current)
    }
  }, [])

  // Handle adding custom wishes
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
    triggerConfetti() // Trigger a celebrate shower on adding a wish!
  }

  // Render landing screen if hasEntered is false
  if (!hasEntered) {
    return (
      <div className="entrance-container">
        {/* Floating particles background */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="floating-element"
            style={{
              left: `${p.left}%`,
              bottom: `-20px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size * 2}px`
            }}
          >
            {p.type === 'heart' ? '💖' : '🎈'}
          </div>
        ))}

        <div className="entrance-card glass-container fade-in">
          <div style={{ marginBottom: '24px' }}>
            <Sparkles size={48} className="sparkle-text" style={{ margin: '0 auto 10px' }} />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>To A Very Special Sister</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              We created a magical space filled with surprises, music, memories, and wishes just for you.
            </p>
          </div>

          <div style={{ position: 'relative', height: '160px', margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                filter: 'blur(20px)',
                position: 'absolute',
                opacity: 0.6,
                animation: 'pulse-star 2s infinite alternate'
              }}
            />
            <Gift size={64} style={{ color: 'var(--accent-primary)', position: 'relative', filter: 'drop-shadow(0 0 10px rgba(255, 74, 147, 0.5))' }} />
          </div>

          <button className="btn btn-primary" onClick={() => { setHasEntered(true); triggerConfetti(); }}>
            Open Surprise 💖
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="layout-container fade-in" style={{ position: 'relative' }}>
      
      {/* Floating particles background in main application */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="floating-element"
          style={{
            left: `${p.left}%`,
            bottom: `-20px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size * 2.5}px`
          }}
        >
          {p.type === 'heart' ? '💗' : '✨'}
        </div>
      ))}

      {/* Confetti Rain Overlay */}
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

      {/* Elegant Greeting Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
          <span style={{ color: 'var(--accent-primary)', fontWeight: '600', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            Celebration Space
          </span>
          <Sparkles size={24} style={{ color: 'var(--accent-gold)' }} />
        </div>
        <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '12px' }}>
          Happy Birthday, <span className="sparkle-text">Sister!</span> 🎉
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Today we celebrate you! Flip through your card, blow out your cake candles, visit our memory gallery, and add a wish.
        </p>

        {/* Custom Synthesized Chimes Music Player */}
        <div className="audio-player-container glass-container" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '8px 16px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={playBirthdayTune}
            >
              {audioPlaying ? <Square size={16} fill="white" /> : <Play size={16} fill="white" />}
            </button>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>Musical Chimes Playback</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{audioPlaying ? 'Playing Happy Birthday Melody' : 'Click to play birthday chimes'}</p>
            </div>
          </div>
          {audioPlaying ? (
            <div className="sound-wave">
              <span className="sound-bar" />
              <span className="sound-bar" />
              <span className="sound-bar" />
              <span className="sound-bar" />
              <span className="sound-bar" />
            </div>
          ) : (
            <VolumeX size={20} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </header>

      {/* Tab Navigation Menu */}
      <div style={{ textAlign: 'center' }}>
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            <BookOpen size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            3D Card
          </button>
          <button 
            className={`tab-btn ${activeTab === 'cake' ? 'active' : ''}`}
            onClick={() => setActiveTab('cake')}
          >
            <Cake size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Virtual Cake
          </button>
          <button 
            className={`tab-btn ${activeTab === 'memories' ? 'active' : ''}`}
            onClick={() => setActiveTab('memories')}
          >
            <ImageIcon size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Memory Gallery
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wishes' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishes')}
          >
            <Heart size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Wishes Wall
          </button>
        </div>
      </div>

      {/* Main Tabbed Content Area */}
      <main style={{ marginTop: '20px', minHeight: '400px' }}>
        
        {/* Tab 1: 3D Folding Card */}
        {activeTab === 'card' && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Hover and click the card to open and read a heartfelt letter!
            </p>
            <div className="card-3d-wrapper">
              <div 
                className={`card-3d ${cardOpen ? 'open' : ''}`}
                onClick={() => setCardOpen(!cardOpen)}
              >
                {/* Front Side */}
                <div className="card-side card-front">
                  <div style={{ border: '2px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎁</div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'white', marginBottom: '8px' }}>For My Sister</h2>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Click to unfold</p>
                  </div>
                </div>

                {/* Back Side (visible during folding) */}
                <div className="card-side card-back">
                  <div style={{ border: '1px solid rgba(0,0,0,0.08)', padding: '20px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Heart size={36} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)' }} />
                  </div>
                </div>

                {/* Inside Right (fixed side) */}
                <div className="card-inside">
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', color: '#1f162e', fontSize: '1.6rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                      Dearest Sister,
                    </h3>
                    <p style={{ color: '#4a3f5c', fontSize: '1rem', lineHeight: '1.5', textAlign: 'left', marginBottom: '12px', fontStyle: 'italic' }}>
                      "Having a sister is like having a best friend you can’t get rid of. You know whatever you do, they’ll still be there."
                    </p>
                    <p style={{ color: '#4a3f5c', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left' }}>
                      You inspire me every day with your kindness, strength, and beautiful heart. Thank you for filling our lives with so much laughter and love. 
                      I hope this year brings you all the happiness you deserve.
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '10px' }}>
                    <p style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>Always & Forever,</p>
                    <p style={{ fontWeight: '500', color: '#1f162e' }}>Your Loving Family 💖</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Virtual Cake */}
        {activeTab === 'cake' && (
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
                onClick={() => {
                  setCandles([false, false, false]);
                  triggerConfetti();
                }}
              >
                Blow Out All Candles 🌬️
              </button>
            )}
          </div>
        )}

        {/* Tab 3: Memory Gallery */}
        {activeTab === 'memories' && (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Memory Lane 📸</h2>
              <p style={{ color: 'var(--text-secondary)' }}>A gallery of golden moments and beautiful illustrations celebrating you.</p>
            </div>
            
            <div className="gallery-grid">
              <div className="gallery-item glass-container">
                <img src={birthdayBg} alt="Celebration Art" className="gallery-image" />
                <div className="gallery-overlay">
                  <h4>A Special Day</h4>
                  <p>Dreamy lights, balloons, and sweet surprises to celebrate a sister like no other.</p>
                </div>
              </div>

              <div className="gallery-item glass-container">
                <img src={memoryBg} alt="Night Sky Wishes" className="gallery-image" />
                <div className="gallery-overlay">
                  <h4>Floating Wishes</h4>
                  <p>Sending sweet wishes and sparkling lanterns into the starry night sky for you.</p>
                </div>
              </div>

              <div className="gallery-item glass-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px', background: 'linear-gradient(135deg, rgba(140,82,255,0.05), rgba(255,74,147,0.05))' }}>
                <Smile size={48} style={{ color: 'var(--accent-gold)', marginBottom: '12px' }} />
                <h4 style={{ color: 'white', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>More to Add!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                  You can easily drop in real photos of your favorite sister memories by saving them into the assets folder!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Wishes Wall */}
        {activeTab === 'wishes' && (
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
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '80px', padding: '30px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          Made with <Heart size={12} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)' }} /> for a wonderful sister | Antigravity Design
        </p>
      </footer>
    </div>
  )
}

export default App

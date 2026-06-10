import { Smile } from 'lucide-react'
import birthdayBg from '../assets/birthday_bg.png'
import memoryBg from '../assets/memory_bg.png'

function MemoryGallery() {
  return (
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
  )
}

export default MemoryGallery

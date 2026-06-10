import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import birthdayBg from '../assets/birthday_bg.png'
import memoryBg from '../assets/memory_bg.png'

function MemoryGallery() {
  const [userImages, setUserImages] = useState(() => {
    const saved = localStorage.getItem('gallery_memories')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('gallery_memories', JSON.stringify(userImages))
  }, [userImages])

  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage = {
          id: Date.now(),
          src: reader.result,
          title: 'Special Memory',
          description: 'A beautiful moment added to the gallery.'
        }
        setUserImages(prev => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = (id) => {
    setUserImages(prev => prev.filter(img => img.id !== id))
  }

  const defaultImages = [
    {
      id: 'default1',
      src: birthdayBg,
      title: 'A Special Day',
      description: 'Dreamy lights, balloons, and sweet surprises to celebrate a sister like no other.'
    },
    {
      id: 'default2',
      src: memoryBg,
      title: 'Floating Wishes',
      description: 'Sending sweet wishes and sparkling lanterns into the starry night sky for you.'
    }
  ]

  const allImages = [...defaultImages, ...userImages]

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Memory Lane 📸</h2>
        <p style={{ color: 'var(--text-secondary)' }}>A gallery of golden moments and beautiful illustrations celebrating you.</p>
      </div>
      
      <div className="gallery-grid">
        {allImages.map((img) => (
          <div key={img.id} className="gallery-item glass-container" style={{ position: 'relative' }}>
            <img src={img.src} alt={img.title} className="gallery-image" />
            <div className="gallery-overlay">
              <h4>{img.title}</h4>
              <p>{img.description}</p>
            </div>
            {typeof img.id === 'number' && (
              <button 
                onClick={() => handleDeleteImage(img.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(255, 0, 0, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
                title="Delete Photo"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="gallery-item glass-container" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '30px', 
            background: 'linear-gradient(135deg, rgba(140,82,255,0.05), rgba(255,74,147,0.05))',
            cursor: 'pointer'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <Upload size={48} style={{ color: 'var(--accent-gold)', marginBottom: '12px' }} />
          <h4 style={{ color: 'white', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Add Photo</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
            Upload a custom photo of you and your sister!
          </p>
        </div>
      </div>
    </div>
  )
}

export default MemoryGallery

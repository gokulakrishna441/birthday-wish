import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Loader2, ImagePlus, ChevronDown, ChevronUp } from 'lucide-react'
import birthdayBg from '../assets/birthday_bg.png'
import memoryBg from '../assets/memory_bg.png'

// List of online placeholder assets
export const SISTER_IMAGES = [
  {
    id: 'sister1',
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
    title: 'Cherished Moment',
    description: 'A beautiful memory celebrating you.'
  },
  {
    id: 'sister2',
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    title: 'Happy Times',
    description: 'Laughter, joy, and wonderful smiles.'
  },
  {
    id: 'sister3',
    src: 'https://images.unsplash.com/photo-1464349608316-2b47b27f3b47?w=800&auto=format&fit=crop&q=80',
    title: 'Special Day',
    description: 'Every day is special with a sister like you.'
  }
]

// IndexedDB Helper implementation for zero-config offline storage
const DB_NAME = 'sister_memories_db'
const STORE_NAME = 'memories'

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = (e) => resolve(e.target.result)
    request.onerror = (e) => reject(e.target.error)
  })
}

export const getLocalImages = async () => {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
      request.onsuccess = (e) => resolve(e.target.result)
      request.onerror = (e) => reject(e.target.error)
    })
  } catch (err) {
    console.error('Failed to query IndexedDB:', err)
    return []
  }
}

const saveLocalImage = async (image) => {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(image)
    request.onsuccess = () => resolve()
    request.onerror = (e) => reject(e.target.error)
  })
}

const deleteLocalImage = async (id) => {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = (e) => reject(e.target.error)
  })
}

// Client-side canvas image compressor
const compressImage = (file, maxWidth = 900, maxHeight = 900, quality = 0.75) => {
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

function MemoryGallery() {
  const [localImages, setLocalImages] = useState([])
  const [showUploader, setShowUploader] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressText, setProgressText] = useState('')
  const fileInputRef = useRef(null)

  // Load IndexedDB photos on component mount
  useEffect(() => {
    const loadImages = async () => {
      const list = await getLocalImages()
      setLocalImages(list)
    }
    loadImages()
  }, [])

  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setIsProcessing(true)
    let count = 0

    for (const file of files) {
      count++
      setProgressText(`Compressing photo ${count} of ${files.length}...`)
      try {
        const dataUrl = await compressImage(file)
        if (dataUrl) {
          const newPhoto = {
            id: `local-${Date.now()}-${Math.random()}`,
            src: dataUrl,
            title: 'Special Memory',
            description: 'A beautiful moment added locally.',
            timestamp: Date.now()
          }
          await saveLocalImage(newPhoto)
        }
      } catch (err) {
        console.error('Error saving image:', err)
      }
    }

    const list = await getLocalImages()
    setLocalImages(list)
    setIsProcessing(false)
    setProgressText('')
    
    // Dispatch window event so App.jsx floating wishes can reload
    window.dispatchEvent(new Event('memories-updated'))
  }

  const handleDeleteLocal = async (id) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      await deleteLocalImage(id)
      const list = await getLocalImages()
      setLocalImages(list)
      window.dispatchEvent(new Event('memories-updated'))
    }
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

  const allImages = [...defaultImages, ...SISTER_IMAGES, ...localImages]

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Memory Lane 📸</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>A gallery of golden moments and beautiful illustrations celebrating you.</p>
      </div>

      {/* Elegant Upload center toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => setShowUploader(!showUploader)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 74, 147, 0.08)',
            border: '1px solid rgba(255, 74, 147, 0.2)',
            color: 'var(--accent-primary)',
            padding: '10px 24px',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 74, 147, 0.15)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 74, 147, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 74, 147, 0.08)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <ImagePlus size={18} />
          <span>Upload Center</span>
          {showUploader ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Animated Dropzone Card */}
      {showUploader && (
        <div 
          className="glass-container fade-in responsive-card"
          style={{
            maxWidth: '550px',
            margin: '0 auto 40px',
            textAlign: 'center',
            border: '2px dashed rgba(255, 74, 147, 0.3)',
            background: 'rgba(10, 5, 24, 0.7)',
            position: 'relative'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            accept="image/*" 
            multiple
            style={{ display: 'none' }} 
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <div style={{ padding: '20px 0' }}>
              <Loader2 size={36} className="spinning-loader" style={{ color: 'var(--accent-primary)', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
              <h4 style={{ color: 'white', marginBottom: '8px' }}>Processing images...</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{progressText}</p>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '20px 0', cursor: 'pointer' }}
            >
              <Upload size={40} style={{ color: 'var(--accent-gold)', marginBottom: '12px' }} />
              <h4 style={{ color: 'white', marginBottom: '6px', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
                Bulk Image Upload
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                Click to select multiple photos from your local device to populate the gallery.
              </p>
              <span style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                PNG, JPG, WEBP formats supported
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="gallery-grid">
        {allImages.map((img, idx) => {
          const angle = (idx % 2 === 0 ? -1.5 : 1.5) * 1.2;
          return (
            <div 
              key={img.id} 
              className="gallery-item glass-container" 
              style={{ 
                position: 'relative',
                transform: `rotate(${angle}deg)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03) rotate(0deg)'
                e.currentTarget.style.borderColor = 'rgba(255, 74, 147, 0.35)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 74, 147, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `translateY(0) scale(1) rotate(${angle}deg)`
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Show delete button if it is a local user-uploaded image */}
              {img.id.toString().startsWith('local-') && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLocal(img.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    background: 'rgba(239, 68, 68, 0.85)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)'}
                  title="Delete Photo"
                >
                  <Trash2 size={15} />
                </button>
              )}

              <img 
                src={img.src} 
                alt={img.title} 
                className="gallery-image"
                onError={(e) => {
                  // If a local image fails or is missing, show fallback illustration
                  e.target.src = birthdayBg
                }}
              />
              <div className="gallery-overlay">
                <h4>{img.title}</h4>
                <p>{img.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MemoryGallery

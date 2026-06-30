import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Loader2, ImagePlus, ChevronDown, ChevronUp } from 'lucide-react'
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db, isFirebaseEnabled } from '../firebase'
import birthdayBg from '../assets/birthday_bg.png'
import memoryBg from '../assets/memory_bg.png'
import happy_moments from '../assets/happy_moments.png'
import happiest from '../assets/happiest.jpg'

// List of online placeholder assets
export const SISTER_IMAGES = [
  {
    id: 'sister1',
    src: happiest,
    title: 'Cherished Moment',
    description: 'A beautiful memory celebrating you.'
  },
  {
    id: 'sister2',
    src: happy_moments,
    title: 'Happy Times',
    description: 'Laughter, joy, and wonderful smiles.'
  }
]

// IndexedDB Helper implementation for offline fallback storage
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

// Client-side canvas image compressor (Generates optimized light-weight base64 JPEGs)
const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
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

          // Compress to lightweight JPEG base64 string
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

function MemoryGallery({ role }) {
  const [localImages, setLocalImages] = useState([])
  const [cloudImages, setCloudImages] = useState([])
  const [showUploader, setShowUploader] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [failedImageIds, setFailedImageIds] = useState([])
  const [activeLightbox, setActiveLightbox] = useState(null)
  const fileInputRef = useRef(null)

  // Load IndexedDB photos on mount
  useEffect(() => {
    const loadImages = async () => {
      const list = await getLocalImages()
      setLocalImages(list)
    }
    loadImages()
  }, [])

  // Listen to cloud photos from Firestore
  useEffect(() => {
    if (isFirebaseEnabled && db) {
      const memoriesRef = collection(db, 'memories')
      const q = query(memoriesRef, orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCloudImages(list)
      }, (error) => {
        console.error('Failed to load cloud memories:', error)
      })
      return () => unsubscribe()
    }
  }, [])

  const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setIsProcessing(true)
    let count = 0

    for (const file of files) {
      count++
      
      try {
        if (isFirebaseEnabled && db) {
          setProgressText(`Uploading photo ${count} of ${files.length} to Cloud database...`)
          
          // 1. Compress image locally first to keep base64 string under 100KB
          const dataUrl = await compressImage(file)
          
          if (dataUrl) {
            // 2. Save directly as a document in Firestore (no storage bucket required!)
            const memoriesRef = collection(db, 'memories')
            await addDoc(memoriesRef, {
              src: dataUrl,
              title: 'Special Memory',
              description: 'A beautiful moment saved in the cloud.',
              timestamp: Date.now()
            })
          }
        } else {
          setProgressText(`Saving photo ${count} of ${files.length} to Local DB...`)
          // Offline IndexedDB backup
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
        }
      } catch (err) {
        console.error('Error uploading photo:', err)
      }
    }

    // Refresh local images list in case fallback was used
    const list = await getLocalImages()
    setLocalImages(list)
    setIsProcessing(false)
    setProgressText('')
    
    // Dispatch window event so App.jsx background floats can sync
    window.dispatchEvent(new Event('memories-updated'))
  }

  const handleDeletePhoto = async (photo) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      if (photo.id.toString().startsWith('local-')) {
        await deleteLocalImage(photo.id)
        const list = await getLocalImages()
        setLocalImages(list)
      } else {
        if (isFirebaseEnabled && db) {
          try {
            await deleteDoc(doc(db, 'memories', photo.id))
          } catch (err) {
            console.error('Failed to delete cloud memory:', err)
          }
        }
      }
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

  const allImages = [...defaultImages, ...SISTER_IMAGES, ...cloudImages, ...localImages]
    .filter(img => !failedImageIds.includes(img.id))

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Memory Lane 📸</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>A gallery of golden moments and beautiful illustrations celebrating you.</p>
      </div>

      {/* Elegant Upload center toggle (Only for Sister Mode) */}
      {role === 'sister' && (
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
      )}

      {/* Animated Dropzone Card (Only for Sister Mode) */}
      {showUploader && role === 'sister' && (
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
          const isUserUploaded = img.id.toString().startsWith('local-') || !['default1', 'default2', 'sister1', 'sister2', 'sister3'].includes(img.id.toString());
          return (
            <div 
              key={img.id} 
              className="gallery-item glass-container" 
              onClick={() => setActiveLightbox(img)}
              style={{ 
                position: 'relative',
                transform: `rotate(${angle}deg)`,
                cursor: 'zoom-in'
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
              {/* Show delete button if it is a user-uploaded image */}
              {isUserUploaded && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhoto(img);
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
                onError={() => {
                  setFailedImageIds(prev => [...prev, img.id])
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

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div 
          onClick={() => setActiveLightbox(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(10, 5, 24, 0.9)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            cursor: 'zoom-out',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative', 
              maxWidth: '90%', 
              maxHeight: '90%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <img 
              src={activeLightbox.src} 
              alt={activeLightbox.title} 
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            />
            <h3 style={{ color: 'white', marginTop: '16px', fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>{activeLightbox.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '1rem', textAlign: 'center', maxWidth: '600px' }}>{activeLightbox.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoryGallery

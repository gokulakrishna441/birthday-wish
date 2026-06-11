import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Wifi, WifiOff, Loader2 } from 'lucide-react'
import birthdayBg from '../assets/birthday_bg.png'
import memoryBg from '../assets/memory_bg.png'
import { db, storage, isFirebaseEnabled } from '../firebase'
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

function MemoryGallery() {
  const [userImages, setUserImages] = useState(() => {
    if (!isFirebaseEnabled) {
      const saved = localStorage.getItem('gallery_memories')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to load memories from localStorage:', e)
        }
      }
    }
    return []
  })
  const [loading, setLoading] = useState(isFirebaseEnabled)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Load user memories (Firestore only)
  useEffect(() => {
    if (isFirebaseEnabled) {
      const memoriesRef = collection(db, 'memories')
      const q = query(memoriesRef, orderBy('timestamp', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setUserImages(list)
        setLoading(false)
      }, (error) => {
        console.error('Failed to load memories from Firestore:', error)
        setUserImages([])
        setLoading(false)
      })
      return () => unsubscribe()
    }
  }, [])

  // Sync to localStorage (only if Firebase is disabled)
  useEffect(() => {
    if (!isFirebaseEnabled && userImages.length > 0) {
      localStorage.setItem('gallery_memories', JSON.stringify(userImages))
    }
  }, [userImages])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    if (isFirebaseEnabled) {
      try {
        const timestamp = Date.now()
        // 1. Upload file to Firebase Storage
        const filePath = `memories/${timestamp}_${file.name}`
        const fileRef = storageRef(storage, filePath)
        await uploadBytes(fileRef, file)
        const downloadUrl = await getDownloadURL(fileRef)

        // 2. Save metadata to Firestore
        const newImage = {
          src: downloadUrl,
          storagePath: filePath,
          title: 'Special Memory',
          description: 'A beautiful moment added to the gallery.',
          timestamp
        }
        const memoriesRef = collection(db, 'memories')
        await addDoc(memoriesRef, newImage)
      } catch (err) {
        console.error('Failed to upload image to Firebase:', err)
        alert('Failed to upload image to Cloud Storage. Please verify Firestore Database Rules and Storage Rules.')
      } finally {
        setUploading(false)
      }
    } else {
      // LocalStorage Fallback
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage = {
          id: Date.now(),
          src: reader.result,
          title: 'Special Memory',
          description: 'A beautiful moment added to the gallery.',
          timestamp: Date.now()
        }
        setUserImages(prev => [newImage, ...prev])
        setUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteImage = async (id, storagePath) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      if (isFirebaseEnabled) {
        try {
          // Delete from Firestore
          await deleteDoc(doc(db, 'memories', id))

          // Delete from Storage
          if (storagePath) {
            const fileRef = storageRef(storage, storagePath)
            await deleteObject(fileRef).catch(err => {
              console.warn('File deletion in Firebase Storage failed or file does not exist:', err)
            })
          }
        } catch (err) {
          console.error('Failed to delete memory from Firebase:', err)
          alert('Failed to delete image from Cloud Database.')
        }
      } else {
        // LocalStorage Fallback
        setUserImages(prev => prev.filter(img => img.id !== id))
      }
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

  const allImages = [...defaultImages, ...userImages]

  return (
    <div className="fade-in">
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinning-loader {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Memory Lane 📸</h2>
        <p style={{ color: 'var(--text-secondary)' }}>A gallery of golden moments and beautiful illustrations celebrating you.</p>
        
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
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading memory gallery...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {allImages.map((img) => (
            <div key={img.id} className="gallery-item glass-container" style={{ position: 'relative' }}>
              <img src={img.src} alt={img.title} className="gallery-image" />
              <div className="gallery-overlay">
                <h4>{img.title}</h4>
                <p>{img.description}</p>
              </div>
              
              {/* Show delete button if it's a user-uploaded image */}
              {img.id !== 'default1' && img.id !== 'default2' && (
                <button 
                  onClick={() => handleDeleteImage(img.id, img.storagePath)}
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

          {/* Add Photo Card */}
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="gallery-item glass-container" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '30px', 
              background: 'linear-gradient(135deg, rgba(140,82,255,0.05), rgba(255,74,147,0.05))',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.7 : 1
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
              disabled={uploading}
            />
            {uploading ? (
              <>
                <Loader2 size={48} className="spinning-loader" style={{ color: 'var(--accent-primary)', marginBottom: '12px' }} />
                <h4 style={{ color: 'white', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Uploading...</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                  Saving photo to cloud storage...
                </p>
              </>
            ) : (
              <>
                <Upload size={48} style={{ color: 'var(--accent-gold)', marginBottom: '12px' }} />
                <h4 style={{ color: 'white', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Add Photo</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                  Upload a custom photo to share in the gallery!
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoryGallery


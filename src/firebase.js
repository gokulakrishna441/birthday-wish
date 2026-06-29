import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Firebase is enabled if the API key is set
const isFirebaseEnabled = !!firebaseConfig.apiKey

let db = null
let storage = null

if (isFirebaseEnabled) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    db = getFirestore(app)
    storage = getStorage(app)
    if (typeof window !== 'undefined') {
      getAnalytics(app)
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error)
  }
}

const logVisit = async (role) => {
  if (!isFirebaseEnabled || !db) return
  try {
    const ua = navigator.userAgent
    
    // Parse OS
    let os = 'Unknown OS'
    if (/android/i.test(ua)) os = 'Android'
    else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) os = 'iOS'
    else if (/Macintosh/.test(ua)) os = 'macOS'
    else if (/Windows/.test(ua)) os = 'Windows'
    else if (/Linux/.test(ua)) os = 'Linux'

    // Parse Browser
    let browser = 'Unknown Browser'
    if (/chrome|crios/i.test(ua) && !/edge|opr\//i.test(ua)) browser = 'Chrome'
    else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari'
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
    else if (/opr\//i.test(ua)) browser = 'Opera'
    else if (/edge|edg/i.test(ua)) browser = 'Edge'

    // Parse Device Type
    let deviceType = 'Desktop'
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      deviceType = 'Tablet'
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      deviceType = 'Mobile'
    }

    const screenRes = `${window.screen.width}x${window.screen.height}`

    await addDoc(collection(db, 'visitor_logs'), {
      role,
      os,
      browser,
      deviceType,
      resolution: screenRes,
      userAgent: ua,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Failed to log visit in Firestore:', error)
  }
}

export { db, storage, isFirebaseEnabled, logVisit }

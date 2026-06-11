import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyBnFurKxZuCrRwZnjfSH6YvfjAt16hHZVg",
  authDomain: "birthday-wishes-441.firebaseapp.com",
  projectId: "birthday-wishes-441",
  storageBucket: "birthday-wishes-441.firebasestorage.app",
  messagingSenderId: "469742658314",
  appId: "1:469742658314:web:e356a7fc1990be4e6290f3",
  measurementId: "G-5ZQM19FNGT"
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

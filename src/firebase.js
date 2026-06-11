import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
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

export { db, storage, isFirebaseEnabled }

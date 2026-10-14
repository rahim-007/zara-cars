import { createContext, useContext, useState, useEffect } from 'react'
import { isFirebaseConfigured, auth } from '../services/firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

const AuthContext = createContext(null)

const DEMO_SESSION_KEY = 'zara_admin_demo_session'
const DEMO_ADMIN = {
  uid: 'demo-admin-zara-001',
  email: 'admin@zaracars.com',
  displayName: 'Zara Cars Dealership Owner',
  role: 'admin',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Firebase Auth is configured, synchronize with Firebase state
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Dealership Owner',
            role: 'admin',
            isDemo: false,
          })
        } else {
          // Check if local demo session is active
          const demoSession = localStorage.getItem(DEMO_SESSION_KEY)
          if (demoSession) {
            setUser(JSON.parse(demoSession))
          } else {
            setUser(null)
          }
        }
        setLoading(false)
      })
      return unsubscribe
    }

    // Demo Mode: Check local session
    const demoSession = localStorage.getItem(DEMO_SESSION_KEY)
    if (demoSession) {
      try {
        setUser(JSON.parse(demoSession))
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  // Login handler
  const login = async (email, password) => {
    // Check if Firebase Auth is active
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        const loggedUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || 'Dealership Owner',
          role: 'admin',
          isDemo: false,
        }
        setUser(loggedUser)
        return { success: true, user: loggedUser }
      } catch (firebaseErr) {
        // If Firebase fails with invalid credentials, check if it was demo intent
        if (email === 'admin@zaracars.com' && password === 'zara2023') {
          const demoUser = { ...DEMO_ADMIN, isDemo: true }
          localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
          setUser(demoUser)
          return { success: true, user: demoUser }
        }
        throw firebaseErr
      }
    }

    // Demo Mode Auth
    if ((email === 'admin@zaracars.com' && password === 'zara2023') || (email && password.length >= 6)) {
      const demoUser = {
        ...DEMO_ADMIN,
        email: email || DEMO_ADMIN.email,
        isDemo: true,
      }
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return { success: true, user: demoUser }
    }

    throw new Error('Invalid email or password. For demo mode use: admin@zaracars.com / zara2023')
  }

  // Quick 1-click demo login
  const demoLogin = async () => {
    const demoUser = { ...DEMO_ADMIN, isDemo: true }
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser))
    setUser(demoUser)
    return { success: true, user: demoUser }
  }

  // Logout handler
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth)
      } catch (err) {
        console.warn('Firebase signout error:', err)
      }
    }
    localStorage.removeItem(DEMO_SESSION_KEY)
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isDemoMode: !isFirebaseConfigured || (user && user.isDemo),
    login,
    demoLogin,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

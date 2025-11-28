import { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const register = async (email, password, fullName, schoolId, role) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
    
    // Create user document in Firestore
    const userDocData = {
      id: newUser.uid,
      email,
      fullName,
      schoolId,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        darkMode: false,
        notificationsEnabled: true
      },
      classes: []
    }
    
    await setDoc(doc(db, 'users', newUser.uid), userDocData)
    setUserData(userDocData)
    
    return newUser
  }

  const login = async (email, password) => {
    const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password)
    
    // Fetch user data
    const userDoc = await getDoc(doc(db, 'users', loggedInUser.uid))
    if (userDoc.exists()) {
      setUserData(userDoc.data())
    }
    
    return loggedInUser
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setUserData(null)
  }

  const updateUserData = async (updates) => {
    if (!user) return
    
    const updatedData = {
      ...userData,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true })
    setUserData(updatedData)
  }

  const value = {
    user,
    userData,
    loading,
    register,
    login,
    logout,
    updateUserData,
    isStudent: userData?.role === 'student',
    isTeacher: userData?.role === 'teacher'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

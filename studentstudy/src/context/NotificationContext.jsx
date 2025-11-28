import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './AuthContext'

const NotificationContext = createContext({})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Subscribe to notifications
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setNotifications(notifs)
      setUnreadCount(notifs.filter(n => !n.isRead).length)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  // Create a notification
  const createNotification = useCallback(async (data) => {
    if (!user) return

    await addDoc(collection(db, 'notifications'), {
      userId: user.uid,
      type: data.type || 'reminder',
      title: data.title,
      message: data.message,
      assignmentId: data.assignmentId || null,
      isRead: false,
      urgency: data.urgency || 'low',
      createdAt: new Date().toISOString()
    })
  }, [user])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    await updateDoc(doc(db, 'notifications', notificationId), {
      isRead: true
    })
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user || notifications.length === 0) return

    const batch = writeBatch(db)
    notifications.filter(n => !n.isRead).forEach(n => {
      batch.update(doc(db, 'notifications', n.id), { isRead: true })
    })
    await batch.commit()
  }, [user, notifications])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    await deleteDoc(doc(db, 'notifications', notificationId))
  }, [])

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!user || notifications.length === 0) return

    const batch = writeBatch(db)
    notifications.forEach(n => {
      batch.delete(doc(db, 'notifications', n.id))
    })
    await batch.commit()
  }, [user, notifications])

  const value = {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

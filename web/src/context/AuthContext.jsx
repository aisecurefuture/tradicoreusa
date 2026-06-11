import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

const TOKEN_KEY = 'tc_token'
const USER_KEY  = 'tc_user'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => storage.get(USER_KEY, null))
  const [token, setToken]             = useState(() => storage.get(TOKEN_KEY, null))
  const [loading, setLoading]         = useState(false)

  const isAuthenticated = Boolean(token && currentUser)

  const login = (newToken, user) => {
    storage.set(TOKEN_KEY, newToken)
    storage.set(USER_KEY, user)
    setToken(newToken)
    setCurrentUser(user)
  }

  const logout = () => {
    storage.remove(TOKEN_KEY)
    storage.remove(USER_KEY)
    setToken(null)
    setCurrentUser(null)
  }

  const updateUser = (data) => {
    const updated = { ...currentUser, ...data }
    storage.set(USER_KEY, updated)
    setCurrentUser(updated)
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, isAuthenticated, loading, login, logout, updateUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

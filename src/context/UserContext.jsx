import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return setIsLoading(false)
      try {
        const res = await fetch('https://blog-platform.kata.academy/api/user', {
          headers: { Authorization: `Token ${token}` }
        })
        if (!res.ok) throw new Error('Ошибка авторизации')
        const data = await res.json()
        setUser(data.user)
      } catch (e) {
        logout()
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [token])

  const login = (userData, jwt) => {
    localStorage.setItem('token', jwt)
    setToken(jwt)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  const value = { user, token, login, logout, isLoading }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
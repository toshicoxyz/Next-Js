/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  User,
} from 'firebase/auth'
import app from '@/firebase/config'

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<string>
  signUp: (email: string, password: string) => Promise<string>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    }
  })
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, x => {
      console.log(x)
      console.log(user)
      setUser(x)
    })

    return () => unsubscribe()
  }, [])

  // Función para iniciar sesión
  async function signIn(email: string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      setUser(userCredential.user)
      localStorage.setItem('user', JSON.stringify(userCredential))
      return ''
    } catch (error: any) {
      const errorCode = error.code
      // const errorMessage = error.message
      return errorCode
    }
  }

  // Función para Registrarse
  async function signUp(email: string, password: string): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      setUser(userCredential.user)
      return ''
    } catch (error: any) {
      const errorCode = error.code
      // const errorMessage = error.message
      return errorCode
    }
  }

  // Función para cerrar sesión
  async function handleSignOut() {
    try {
      await signOut(auth)
      setUser(null)
      localStorage.setItem('user', JSON.stringify(null))
    } catch (error) {
      // Manejar el error de cierre de sesión
      console.log('Error al cerrar sesión:', error)
    }
  }

  const value: AuthContextType = {
    user,
    signIn,
    signUp,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

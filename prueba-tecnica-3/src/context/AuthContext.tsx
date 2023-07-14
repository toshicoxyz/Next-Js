/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as UserApp,
} from 'firebase/auth'
import { auth, firestore } from '@/firebase/config'
import { setDoc, doc, getDoc } from 'firebase/firestore'

interface User extends UserApp {
  rol: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<string>
  signUp: (email: string, password: string, rol: string) => Promise<string>
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

async function getRol(uid: string) {
  const docRef = doc(firestore, `users/${uid}`)
  const docuCifrada = await getDoc(docRef)
  const info = docuCifrada.data()
  return info?.rol
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    }
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async x => {
      if (x) {
        const rol = await getRol(x.uid)
        setUser({ ...x, rol })
      } else {
        setUser(null)
      }
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
      const rol = await getRol(userCredential.user.uid)
      console.log(rol)
      setUser({ ...userCredential.user, rol })
      localStorage.setItem(
        'user',
        JSON.stringify({ ...userCredential.user, rol })
      )
      return ''
    } catch (error: any) {
      const errorCode = error.code
      // const errorMessage = error.message
      return errorCode
    }
  }

  // Función para Registrarse
  async function signUp(
    email: string,
    password: string,
    rol: string
  ): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const docuRef = doc(firestore, `users/${userCredential.user.uid}`)
      setDoc(docuRef, { correo: email, rol })
      setUser({ ...userCredential.user, rol })
      return ''
    } catch (error: any) {
      const errorCode = error.code
      console.log(errorCode)
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
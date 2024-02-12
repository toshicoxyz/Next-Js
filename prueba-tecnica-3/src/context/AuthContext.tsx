/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as UserApp,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { auth, firestore } from '@/firebase/config'
import { setDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Invitation } from '@/models/model'

interface User extends UserApp {
  rol: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<string>
  signUp: (email: string, password: string) => Promise<string>
  upgradeUserRol: (id: string, rol: string) => Promise<void>
  upgradeNoteTitle: (id: string | undefined, title: string) => Promise<void>
  upgradeNoteDescription: (
    id: string | undefined,
    descripcion: string
  ) => Promise<void>
  upgradeNoteInvitations: (
    id: string | undefined,
    email: string,
    invitations: Invitation[]
  ) => Promise<Boolean>
  deleteNote: (id: string | undefined) => Promise<void>
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
  async function signUp(email: string, password: string): Promise<string> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const docuRef = doc(firestore, `users/${userCredential.user.uid}`)
      setDoc(docuRef, { correo: email, rol: 'user' })
      setUser({ ...userCredential.user, rol: 'user' })
      return ''
    } catch (error: any) {
      const errorCode = error.code
      console.log(errorCode)
      // const errorMessage = error.message
      return errorCode
    }
  }

  // Función para actualizar rol del usuario
  async function upgradeUserRol(id: string, rol: string) {
    if (id) {
      const documentRef = doc(firestore, `users/${id}`)
      await updateDoc(documentRef, { rol })
    }
  }

  // Función para actualizar title del note
  async function upgradeNoteTitle(id: string | undefined, title: string) {
    if (id) {
      const documentRef = doc(firestore, `note/${id}`)
      await updateDoc(documentRef, { title })
    }
  }

  async function upgradeNoteDescription(
    id: string | undefined,
    description: string
  ) {
    if (id) {
      const documentRef = doc(firestore, `note/${id}`)
      await updateDoc(documentRef, { description })
    }
  }

  // Función para actualizar title del note
  async function deleteNote(id: string | undefined) {
    if (id) {
      const documentRef = doc(firestore, `note/${id}`)
      await deleteDoc(documentRef)
    }
  }

  async function upgradeNoteInvitations(
    id: string | undefined,
    email: string,
    invitations: Invitation[]
  ): Promise<Boolean> {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    console.log(signInMethods)

    if (signInMethods && signInMethods.length > 0) {
      // El correo electrónico ya está registrado, puedes enviar la invitación
      try {
        const noteRef = doc(firestore, `note/${id}`)
        const noteDoc = await getDoc(noteRef)
        const existingInvitations = noteDoc.data()?.invitations || []
        await updateDoc(noteRef, {
          invitations: [...existingInvitations, ...invitations],
        })
        return true
      } catch (error) {
        alert(error)

        return false
      }
    } else {
      alert('El correo electrónico no está registrado')

      return false
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
    upgradeUserRol,
    upgradeNoteTitle,
    upgradeNoteDescription,
    upgradeNoteInvitations,
    deleteNote,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

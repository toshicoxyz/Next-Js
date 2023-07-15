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
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
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
    invitations: Invitation[]
  ) => Promise<void>
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

  async function upgradeNoteInvitations(
    id: string | undefined,
    invitations: Invitation[]
  ) {
    const noteRef = doc(firestore, `note/${id}`)
    await updateDoc(noteRef, { invitations })
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

  async function sendInvitation(userEmail: string): Promise<string> {
    // Verificar si el correo electrónico ya está registrado en el sistema
    const signInMethods = await fetchSignInMethodsForEmail(auth, userEmail);
    if (signInMethods && signInMethods.length > 0) {
      // El correo electrónico ya está registrado, puedes enviar la invitación
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, 'temporaryPassword');
        return userCredential.user.uid; // Retorna el ID del usuario invitado
      } catch (error) {
        console.error('Error al enviar la invitación:', error);
        throw new Error('Error al enviar la invitación');
      }
    } else {
      // El correo electrónico no está registrado, muestra un mensaje de error o realiza alguna acción correspondiente
      console.error('El correo electrónico no está registrado');
      throw new Error('El correo electrónico no está registrado');
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

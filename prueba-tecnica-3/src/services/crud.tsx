import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { Note, User } from '@/models/model'

// CRUD DE USERS
export async function getAllUsers(db: Firestore) {
  try {
    const usersol = collection(db, 'users')
    const userSnapshot = await getDocs(usersol)
    const userList: User[] = userSnapshot.docs.map(doc => {
      const { correo, rol } = doc.data()
      return {
        id: doc.id,
        correo,
        rol,
      }
    })
    return userList
  } catch (error) {
    console.error('Error: ', error)
  }
}

export async function upgradeIdUserRol(
  firestore: Firestore,
  id: string,
  rol: string
) {
  try {
    const documentRef = doc(firestore, 'note', id)
    await updateDoc(documentRef, { rol })
  } catch (error) {
    console.error('Error: ', error)
  }
}

export function getAllUsersUpgrade(
  firestore: Firestore,
  getAllUsers: () => void
) {
  return onSnapshot(
    collection(firestore, 'users'),
    snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          getAllUsers()
        }
        if (change.type === 'modified') {
          getAllUsers()
        }
        if (change.type === 'removed') {
          getAllUsers()
        }
      })
    },
    error => {
      console.log(error)
    }
  )
}

// CRUD DE NOTE
export async function getAllNote(firestore: Firestore) {
  try {
    const noteCol = collection(firestore, 'note')
    const noteSnapshot = await getDocs(noteCol)
    const noteList: Note[] = noteSnapshot.docs.map(doc => {
      const { title, description } = doc.data()
      return {
        id: doc.id,
        title,
        description,
      }
    })
    return noteList
  } catch (error) {
    console.error('Error: ', error)
  }
}

export async function getIdNote(firestore: Firestore, id: string) {
  try {
    const documentRef = doc(firestore, 'note', id)
    const documentSnapshot = await getDoc(documentRef)

    if (documentSnapshot.exists()) {
      const documentData = documentSnapshot.data()
      return { ...documentData, id: documentSnapshot.id } as Note
    } else {
      console.log('El documento no existe')
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}

export async function addNote(firestore: Firestore, body: Object) {
  try {
    const docRef = await addDoc(collection(firestore, 'note'), body)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export function getAllNoteUp(firestore: Firestore, getAllNote: () => void) {
  return onSnapshot(
    collection(firestore, 'note'),
    snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          getAllNote()
        }
        if (change.type === 'modified') {
          getAllNote()
        }
        if (change.type === 'removed') {
          getAllNote()
        }
      })
    },
    error => {
      console.log(error)
    }
  )
}

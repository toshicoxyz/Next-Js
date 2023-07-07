import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore/lite'
import { User } from '@/models/model'

async function getCities(db: Firestore) {
  const citiesCol = collection(db, 'cities')
  const citySnapshot = await getDocs(citiesCol)
  const cityList: User[] = citySnapshot.docs.map(doc => {
    const { first, last, born, image } = doc.data()
    return {
      id: doc.id,
      first,
      last,
      born,
      image
    }
  })
  return cityList
}

async function getAllCities(db: Firestore) {
  const querySnapshot = await getDocs(collection(db, 'cities'))
  querySnapshot.forEach(doc => {
    console.log(`${doc.id} => ${doc.data()}`)
  })
}

async function getIdDate(db: Firestore, id: string) {
  try {
    const documentRef = doc(db, 'cities', id)
    const documentSnapshot = await getDoc(documentRef)

    if (documentSnapshot.exists()) {
      const documentData = documentSnapshot.data()
      return { ...documentData, id: documentSnapshot.id }
    } else {
      console.log('El documento no existe')
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}

async function addDate(db: Firestore, body: Object) {
  try {
    const docRef = await addDoc(collection(db, 'cities'), body)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

export { getCities, addDate, getAllCities, getIdDate }

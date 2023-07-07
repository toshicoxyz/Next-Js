// import db from 'firebase/app'

// const createDocument = async (
//   title: string,
//   description: string,
//   image: string
// ) => {
//   try {
//     const docRef = await db.collection('documents').add({
//       title,
//       description,
//       image,
//     })
//     console.log('Documento creado con ID:', docRef.id)
//   } catch (error) {
//     console.error('Error al crear el documento:', error)
//   }
// }

// const getDocuments = async () => {
//   try {
//     const snapshot = await db.collection('documents').get()
//     const documents = snapshot.docs.map(doc => doc.data())
//     console.log('Documentos:', documents)
//   } catch (error) {
//     console.error('Error al obtener los documentos:', error)
//   }
// }

// const updateDocument = async (docId: string, newData: Partial<Document>) => {
//   try {
//     await db.collection('documents').doc(docId).update(newData)
//     console.log('Documento actualizado con ID:', docId)
//   } catch (error) {
//     console.error('Error al actualizar el documento:', error)
//   }
// }

// const deleteDocument = async (docId: string) => {
//   try {
//     await db.collection('documents').doc(docId).delete()
//     console.log('Documento eliminado con ID:', docId)
//   } catch (error) {
//     console.error('Error al eliminar el documento:', error)
//   }
// }

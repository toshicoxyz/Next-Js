import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import app from '@/firebase/config'

const auth = getAuth(app)

export const SignUpEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    console.log(user)
    // Aquí puedes realizar otras acciones con el usuario registrado

    return user // Si deseas devolver el usuario registrado
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = error.message
    // console.log(errorCode, errorMessage)
    // Aquí puedes manejar el error de alguna manera o lanzar una excepción

    return errorCode // Si deseas lanzar el error para que sea manejado en el componente
  }
}

export const SignInEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user
    console.log(userCredential)
    // Resto del código después de iniciar sesión exitosamente

    return user // O cualquier otro valor que necesites devolver en caso de éxito
  } catch (error: any) {
    const errorCode = error.code
    const errorMessage = error.message
    // console.log(errorCode, errorMessage)
    // Manejo del error

    return errorCode // Lanzar el error para que pueda ser capturado por el código que llama a la función
  }
}

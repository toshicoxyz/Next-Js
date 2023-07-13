'use client'

import { useRouter } from 'next/navigation'
import { Button, TextField, createStyles } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormSign } from '@/models/model'
import * as yup from 'yup'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import ErrorMessage from './custom/ErrorMessage'

const schema = yup
  .object({
    email: yup
      .string()
      .required('Completa el campo Email')
      .email('Correo electrónico inválido'),
    password: yup
      .string()
      .required('Completa el campo Contraseña')
      .min(6, 'Contraseña - 6 caracteres'),
  })
  .required()

const SignIn = () => {
  const { signIn, user } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormSign>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<FormSign> = async data => {
    const result: string = await signIn(data.email, data.password)
    if (result === 'auth/user-not-found') {
      setError('email', {
        type: 'manual',
        message: `No se encontro el Usuario`,
      })
      return
    } else if (result === 'auth/wrong-password') {
      setError('password', {
        type: 'manual',
        message: `Contraseña Incorrecta`,
      })
      return
    }
    router.push('/')
    reset()
  }

  // useEffect(() => {
  //   if(user){
  //     router.push('/')
  //   }
  // }, [])

  return (
    <form
      className="bg-transparent absolute gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap flex-col items-center justify-center text-center "
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-white">Logearse </h1>

      <div className="relative">
        <input
          placeholder=" "
          type="email"
          {...register('email')}
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-white bg-transparent dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-white peer"
        />
        <label className="absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 flex justify-center">
          Email
        </label>
      </div>
      <ErrorMessage>{errors.email?.message}</ErrorMessage>

      <div className="relative">
        <input
          placeholder=" "
          type="password"
          {...register('password')}
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-white bg-transparent dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-white peer"
        />
        <label className="absolute text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-white peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 flex justify-center">
          Password
        </label>
      </div>
      <ErrorMessage>{errors.password?.message}</ErrorMessage>

      <Button
        size="small"
        sx={{
          padding: 2,
          width: '100%',
          margin: 'auto',
          '&:hover': {
       
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          },
        }}
        className="col-span-2 cursor-pointer inline-block text-sm px-4 py-2 leading-none border rounded text-gray-500 border-gray-500 hover:border-white hover:text-white  mt-4 lg:mt-0"
        type="submit"
        variant="outlined"
      >
        Iniciar Sesion
      </Button>
    </form>
  )
}

export default SignIn

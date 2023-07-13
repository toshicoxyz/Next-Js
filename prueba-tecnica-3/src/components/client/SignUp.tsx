'use client'

import { Button, TextField } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormSign } from '@/models/model'
import * as yup from 'yup'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const schema = yup
  .object({
    email: yup
      .string()
      .required('Completa el campo Email')
      .email('Ingresa un correo electrónico válido'),
    password: yup
      .string()
      .required('Completa el campo Contraseña')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  })
  .required()

const SignUp = () => {
  const { user, signUp } = useAuth()
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
    const result = await signUp(data.email, data.password)
    if (result === 'auth/email-already-in-use') {
      setError('email', {
        type: 'manual',
        message: `El correo ya esta registrado`,
      })
    }
    reset()
  }

  // useEffect(() => {
  //   if (user) {
  //     router.push('/')
  //   }
  // }, [])

  return (
    <form
      className="border rounded-2xl p-5 grid grid-cols-2 gap-4 border-black "
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1>Registrarse</h1>
      <TextField
        helperText={errors.email?.message}
        type="email"
        label="Email"
        {...register('email')}
      />

      <TextField
        helperText={errors.password?.message}
        type="password"
        label="Password"
        {...register('password')}
      />

      <Button
        size="small"
        sx={{
          padding: 2,
          width: '100%',
          margin: 'auto',
          '&:hover': {
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          },
        }}
        className="col-span-2"
        type="submit"
        variant="outlined"
      >
        Registrarse
      </Button>
    </form>
  )
}

export default SignUp

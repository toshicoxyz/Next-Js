'use client'

import { Button, TextField } from '@mui/material'
import { addNote } from '@/services/crud'
import { Note } from '@/models/model'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { firestore } from '@/firebase/config'
import ErrorMessage from './custom/ErrorMessage'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const schema = yup
  .object({
    title: yup
      .string()
      .required('Completa el campo Nombre')
      .matches(/^[A-Za-z]+$/, 'Solo se permiten letras')
      .max(10, 'El máximo de caracteres es 10'),
    description: yup
      .string()
      .required('Completa el campo Nombre')
      .matches(/^[A-Za-z]+$/, 'Solo se permiten letras')
      .max(50, 'El máximo de caracteres es 50'),
  })
  .required()

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Note>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<Note> = async data => {
    await addNote(firestore, data)
    reset()
  }

  return (
    <form className="m-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <input
          placeholder=" "
          {...register('title')}
          className="block border-b-2 border-gray-500 rounded-t-lg px-2.5 pb-2.5 p-5 w-full text-sm text-black bg-transparent dark:bg-gray-700   appearance-none   focus:outline-none focus:ring-0 peer"
        />
        <label className="absolute  text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 flex justify-center">
          Title
        </label>
      </div>
      <ErrorMessage>{errors.title?.message}</ErrorMessage>

      <div className="relative">
        <input
          placeholder=" "
          {...register('description')}
          className="block border-b-2 border-gray-500 rounded-t-lg px-2.5 pb-2.5 p-5 w-full text-sm text-black bg-transparent dark:bg-gray-700   appearance-none   focus:outline-none focus:ring-0 peer"
        />
        <label className="absolute  text-sm text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-black peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 flex justify-center">
          Description
        </label>
      </div>
      <ErrorMessage>{errors.description?.message}</ErrorMessage>

      <Button
        size="small"
        sx={{
          marginTop: '25px',
          padding: 2,
          width: '100%',

          '&:hover': {
            backgroundColor: 'green',
            color: 'white',
            transition: 'background-color 0.3s ease',
          },
        }}
        type="submit"
        variant="text"
      >
        Crear Nota
      </Button>
    </form>
  )
}

export default Form

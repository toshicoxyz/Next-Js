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
      .max(200, 'El máximo de caracteres es 200')
      .matches(/^(?!<p><br\s?\/?><\/p>).+$/, 'No se permiten campo vacios')
      .matches(
        /^(?!.*<\/?(h1|h2|h3|li)[^>]*>).*$/,
        'No se permiten titulos, ni listas'
      )
      .required('La descripción es requerida'),
  })
  .required()

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<Note>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<Note> = async data => {
    await addNote(firestore, data)
    reset()
  }

  const handleDescriptionChange = (value: string) => {
    setValue('description', value)
    trigger('description') // Validar el campo 'description' y mostrar los errores
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className="w-full h-max-2 pb-11 col-span-2"
        helperText={errors.title?.message}
        label="Titulo"
        {...register('title')}
      />

      <TextField
        className="w-full h-max-2 pb-11 col-span-2"
        placeholder="Agrega una descripcion"
        helperText={errors.description?.message}
        {...register('description')}
      />

      <p
        className="col-span-2"
        style={{
          fontSize: '0.75rem',
          textAlign: 'center',
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          lineHeight: '1.66',
          letterSpacing: '0.03333em',
          fontWeight: '400',
          color: 'rgba(0, 0, 0, 0.6)',
          marginTop: '-14px',
        }}
      >
        {errors?.description?.message}
      </p>

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
        Crear Nota
      </Button>
    </form>
  )
}

export default Form

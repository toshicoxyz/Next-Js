'use client'

import { Button, TextField } from '@mui/material'
import { addUser } from '@/services/crud'
import db from '@/firebase/config'
import { User } from '@/models/model'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { StyleSheetManager } from 'styled-components'
import rtlPlugin from 'stylis-plugin-rtl'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const schema = yup
  .object({
    first: yup
      .string()
      .required('Completa el campo Nombre')
      .matches(/^[A-Za-z]+$/, 'Solo se permiten letras')
      .max(10, 'El máximo de caracteres es 10'),
    last: yup
      .string()
      .required('Completa el campo Apellidos')
      .matches(/^[A-Za-z]+$/, 'Solo se permiten letras')
      .max(10, 'El máximo de caracteres es 10'),
    born: yup
      .number()
      .positive('El numero tiene que ser positivo')
      .typeError('Ingresa un número válido')
      .required('Completa el campo Edad')
      .min(1, 'El valor mínimo es 1')
      .max(150, 'El valor máximo es 150'),
    image: yup
      .string()
      .url('Ingresa una URL válida')
      .required('Completa el campo Url')
      .matches(/\.(jpg|png)$/, 'URL (jpg o png)'),
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
  } = useForm<User>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<User> = async data => {
    await addUser(db, data)
    reset()
  }

  const handleDescriptionChange = (value: string) => {
    setValue('description', value)
    trigger('description') // Validar el campo 'description' y mostrar los errores
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        helperText={errors.first?.message}
        label="Nombres"
        {...register('first')}
      />

      <TextField
        helperText={errors.last?.message}
        label="Apellidos"
        {...register('last')}
      />

      <TextField
        type="number"
        helperText={errors.born?.message}
        label="Edad"
        {...register('born')}
      />

      <TextField
        type="url"
        label="Url Imagen"
        helperText={errors.image?.message}
        {...register('image')}
        placeholder="https://img/image.jpg"
      />

      <ReactQuill
        className="w-full h-max-2 pb-11 col-span-2"
        theme="snow"
        placeholder="Agrega una descripcion"
        onChange={handleDescriptionChange}
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
        Agregar Usuario
      </Button>
    </form>
  )
}

export default Form

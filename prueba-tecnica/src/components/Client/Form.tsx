import { Button, TextField } from '@mui/material'
import { addUser } from '@/services/crud'
import db from '@/firebase/config'
import { User } from '@/models/model'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

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
      .min(0, 'El valor mínimo es 0')
      .max(150, 'El valor máximo es 150'),
    image: yup
      .string()
      .url('Ingresa una URL válida')
      .required('Completa el campo Url'),
  })
  .required()

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<User> = async data => {
    await addUser(db, data)
    reset()
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

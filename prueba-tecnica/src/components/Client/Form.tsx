
import { Button, TextField } from '@mui/material'
import { addUser } from '@/services/crud'
import db from '@/firebase/config'
import { User } from '@/models/model'
import { SubmitHandler, useForm } from 'react-hook-form'

interface FormProps {
  onDataCreated: () => void
}

const Form: React.FC<FormProps> = ({ onDataCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()
  const onSubmit: SubmitHandler<User> = async data => {
    await addUser(db, data)
    onDataCreated()
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <TextField
          label="Nombres"
          {...register('first', {
            required: { value: true, message: 'Completa el campo Nombres' },
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: 'Solo se permites Letras',
            },
            maxLength: { value: 10, message: 'Max length es 10' },
          })}
        />
        <p className="text-center text-red-600">{errors.first?.message}</p>
      </div>
      <div>
        <TextField
          label="Apellidos"
          {...register('last', {
            required: { value: true, message: 'Completa el campo Apellidos' },
            pattern: {
              value: /^[A-Za-z]+$/i,
              message: 'Solo se permites Letras',
            },
            maxLength: { value: 10, message: 'Max length es 10' },
          })}
        />
        <p className="text-center text-red-600">{errors.last?.message}</p>
      </div>
      <div>
        <TextField
          type="number"
          label="Edad"
          {...register('born', {
            required: { value: true, message: 'Completa el campo Edad' },
            min: { value: 0, message: 'Min value is 0' },
            max: { value: 150, message: 'Max value is 150' },
          })}
        />
        <p className="text-center text-red-600">{errors.born?.message}</p>
      </div>
      <div>
        <TextField
          type="url"
          label="Url Imagen"
          {...register('image', {
            required: { value: true, message: 'Completa el campo Url' },
            pattern: {
              value: /^(ftp|http|https):\/\/[^ "]+$/,
              message: 'Ingresa una URL válida',
            },
          })}
          placeholder="https://img/image.jpg"
        />
        <p className="text-center text-red-600">{errors.image?.message}</p>
      </div>
      <Button
        className="col-span-2"
        type="submit"
        variant="outlined"
        color="success"
      >
        Agregar Usuario
      </Button>
    </form>
  )
}

export default Form

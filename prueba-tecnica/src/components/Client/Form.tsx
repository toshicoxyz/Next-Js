'use client'

import { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { addDate } from '@/firebase/crud'
import db from '@/firebase/config'
import { User } from '@/models/model'

interface FormProps {
  onDataCreated: () => void
}

const Form: React.FC<FormProps> = ({ onDataCreated }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: User = {
      first: firstName,
      last: lastName,
      born: parseInt(birthYear, 10),
      image: image,
    }

    await addDate(db, data)
    console.log('Se Creo Satisfacoriamente ;v')
    onDataCreated()
  }

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <TextField
        label="Nombres"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        required
      />
      <TextField
        label="Apellidos"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        required
      />
      <TextField
        label="Edad"
        value={birthYear}
        onChange={e => setBirthYear(e.target.value)}
        type="tel"
        required
      />
      <TextField
        label="Url Imagen"
        placeholder="https://dominio.com/image.jpg"
        value={image}
        onChange={e => setImage(e.target.value)}
        required
      />
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

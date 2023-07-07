/* eslint-disable @next/next/no-img-element */
'use client'

import { getIdDate } from '@/firebase/crud'
import { useEffect, useState } from 'react'
import { User } from '@/models/model'
import db from '@/firebase/config'
import { CircularProgress } from '@mui/material'

const NuevaPagina = ({ params }: { params: { id: string } }) => {
  const [city, setCity] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const getId = async (id: string) => {
        try {
          const data = await getIdDate(db, id)
          setCity(data)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }

      getId(params.id)
    } else {
      setCity(null)
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen content-center">
        <CircularProgress />
      </div>
    )
  }

  if (!city) {
    return (
      <div className="flex items-center justify-center h-screen content-center">
        No se encontro el archivo
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen content-center">
      {city && (
        <div className='bg-slate-500 p-4 rounded-md text-white'>
          <img
            className="rounded-full m-3 "
            src={
              city?.image
                ? city.image
                : 'https://economia3.com/wp-content/uploads/2019/12/Natalia-Juarranz-EQUIPO-HUMANO.jpg'
            }
            alt={city.first}
            width={150}
          />
          <p>ID: {city?.id}</p>
          <p>Nombre: {city?.first}</p>
          <p>Apellido: {city?.last}</p>
          <p>Edad: {city?.born}</p>
        </div>
      )}
    </div>
  )
}

export default NuevaPagina

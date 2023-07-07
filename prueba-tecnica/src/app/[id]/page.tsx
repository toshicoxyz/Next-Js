/* eslint-disable @next/next/no-img-element */
'use client'

import { getIdUser } from '@/services/crud'
import { useEffect, useState } from 'react'
import { User } from '@/models/model'
import db from '@/firebase/config'
import { CircularProgress, Avatar } from '@mui/material'

const NuevaPagina = ({ params }: { params: { id: string } }) => {
  const [city, setCity] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const getId = async (id: string) => {
        try {
          const data = (await getIdUser(db, id)) ?? null
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
        <div className="border-4 border-gray-500/25 p-4 rounded-2xl text-black bg-transparent">
          <Avatar
            className="rounded-3xl m-auto"
            src={city?.image}
            alt={city.first}
            sx={{ width: 200, height: 200 }}
          />
          <p>
            <b>ID:</b> {city?.id}
          </p>
          <p>
            <b>Nombre:</b> {city?.first}
          </p>
          <p>
            <b>Apellido:</b> {city?.last}
          </p>
          <p>
            <b>Edad:</b> {city?.born}
          </p>
        </div>
      )}
    </div>
  )
}

export default NuevaPagina

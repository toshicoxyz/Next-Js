/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from '@mui/material'
import { Firestore } from 'firebase/firestore/lite'
import { getCities } from '@/firebase/crud'
import { User } from '@/models/model'
import Link from 'next/link'
import Image from 'next/image'

interface DataListProps {
  db: Firestore
  refreshData: boolean
}

export default function DataList({ db, refreshData }: DataListProps) {
  const [dataList, setDataList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCities(db)
        setDataList(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [db, refreshData])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <List className="w-full">
      {dataList.map(user => (
        <ListItem key={user.id}>
          <img
            className="rounded-full m-3"
            src={
              user?.image
                ? user.image
                : 'https://economia3.com/wp-content/uploads/2019/12/Natalia-Juarranz-EQUIPO-HUMANO.jpg'
            }
            alt={user.first}
            width={50}
          />
          <ListItemText primary={user.first} secondary={user.last} />
          <Typography component={Link} href={`/${user.id}`} variant="button">
            Ver
          </Typography>
        </ListItem>
      ))}
    </List>
  )
}

/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import { Firestore } from 'firebase/firestore/lite'
import { getAllUsers } from '@/services/crud'
import { User } from '@/models/model'
import Link from 'next/link'

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
        const data = await getAllUsers(db)
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
                : 'https://static.vecteezy.com/system/resources/previews/022/133/714/original/user-profile-icon-for-any-purposes-vector.jpg'
            }
            alt={user.first}
            width={50}
          />
          <ListItemText primary={user.first} secondary={user.last} />
          <Link
            className="rounded-2xl p-5 border border-slate-300 hover:border-slate-400"
            href={`/${user.id}`}
          >
            Ver
          </Link>
        </ListItem>
      ))}
    </List>
  )
}

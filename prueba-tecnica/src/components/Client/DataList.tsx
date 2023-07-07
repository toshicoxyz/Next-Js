/* eslint-disable @next/next/no-img-element */
'use client'

import { use, useEffect, useState } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
} from '@mui/material'
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
          <Avatar
            className="rounded-full m-3"
            src={user?.image}
            alt={user.first}
            sx={{ width: 50, height: 50 }}
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

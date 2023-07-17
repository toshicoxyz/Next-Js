'use client'

import { getAllUsers, getAllUsersUpgrade } from '@/services/crud'
import { Firestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { User } from '@/models/model'
import { CircularProgress } from '@mui/material'
import { useAuth } from '@/context/AuthContext'

interface ListUsersProps {
  firestore: Firestore
}

const ListUsers = ({ firestore }: ListUsersProps) => {
  const { upgradeUserRol } = useAuth()
  const [dataList, setDataList] = useState<User[]>([])
  const [loading, setLoading] = useState<Boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getAllUsers(firestore)) ?? []
        setDataList(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
    const unsubscribe = getAllUsersUpgrade(firestore, fetchData)

    return () => {
      unsubscribe()
    }
  }, [firestore])

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <ol>
        {dataList.map(user => (
          <li key={user.id} className="justify-around">
            <span > {user?.correo?.split('@')[0]}@</span>
            {user.rol === 'admin' ? (
              <span className="text-white">{user.rol}</span>
            ) : (
              <select
                className="cursor-pointer hover:text-white py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                defaultValue={user.rol}
                onChange={e => upgradeUserRol(user.id, e.target.value)}
              >
                <option className="hidden" value={user.rol}>
                  {user.rol}
                </option>
                <option className="text-black" value={'user'}>
                  user
                </option>
                <option className="text-black" value={'edit'}>
                  edit
                </option>
              </select>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}

export default ListUsers

/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Snackbar,
  Box,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Firestore } from 'firebase/firestore'
import { getAllNoteUp, getAllNote } from '@/services/crud'
import { Note } from '@/models/model'
import Link from 'next/link'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useAuth } from '@/context/AuthContext'
import Form from './Form'

interface DataListProps {
  db: Firestore
}

export default function DataList({ db }: DataListProps) {
  const {
    upgradeNoteTitle,
    upgradeNoteDescription,
    user,
    upgradeNoteInvitations,
  } = useAuth()
  const [dataList, setDataList] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getAllNote(db)) ?? []
        setDataList(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
    const unsubscribe = getAllNoteUp(db, fetchData)

    return () => {
      unsubscribe()
    }
  }, [db])

  if (loading) {
    return <CircularProgress />
  }

  async function handleInvite(id: string | undefined) {
    const userEmail = prompt(
      'Ingrese el correo electrónico del usuario a invitar'
    )

    if (userEmail) {
      // Realiza la lógica de envío de la invitación y obtén el ID del usuario invitado

      // Actualiza la lista de invitaciones en la nota
      // const updatedInvitations = [
      //   ...item.invitations,
      //   { userId: invitedUserId, userEmail },
      // ]
      console.log(userEmail)
      // await upgradeNoteInvitations(id, [{ id: id , userEmail }])
    }
  }

  return (
    <Grid
      container
      marginY={'80px'}
      gap={2}
      className="align-middle items-center justify-center  m-auto content-center text-center "
      alignItems="center"
    >
      {/* AGREGAR */}
      {(user?.rol === 'admin' || user?.rol === 'edit') && (
        <Grid item xs={12} sm={6} md={2}>
          <Form />
        </Grid>
      )}
      {dataList.map(item => (
        <Grid
          key={item.id}
          sx={{
            paddingY: '50px',
            marginX: '25px',
            width: 10,
            minHeight: 300,
          }}
          item
          xs={12}
          sm={6}
          md={2}
          className="border h-full border-black "
        >
          {item.id && (user?.rol === 'admin' || user?.rol === 'edit') && (
            <DeleteIcon className="text-red-500 cursor-pointer w-3 bg-black rounded-full" />
          )}

          <Typography
            className="hover:bg-slate-100"
            suppressContentEditableWarning
            onFocus={e => e.preventDefault()}
            onBlur={e => {
              if (item.id && e.currentTarget?.textContent) {
                const updatedTitle = e.currentTarget.innerHTML.trim()
                if (updatedTitle.length <= 10) {
                  upgradeNoteTitle(item.id, updatedTitle) // Actualiza el título
                } else {
                  alert('Max char 10')
                  // Muestra una notificación o realiza alguna acción en caso de que el título exceda el límite de caracteres
                }
              }
            }}
            contentEditable={Boolean(
              item.id && (user?.rol === 'admin' || user?.rol === 'edit')
            )}
            variant="h3"
            component="div"
          >
            {item?.title}
          </Typography>

          <Typography
            className="hover:bg-slate-100"
            suppressContentEditableWarning
            onBlur={e => {
              if (
                item.id &&
                e.currentTarget?.textContent !== e.currentTarget?.textContent
              ) {
                console.log('Enviado')
                upgradeNoteDescription(item.id, e.currentTarget.innerHTML) // Actualiza el título
              }
            }}
            contentEditable={Boolean(
              item.id && (user?.rol === 'admin' || user?.rol === 'edit')
            )}
            variant="h5"
            component="div"
          >
            {item?.description}
          </Typography>

          <CardActions>
            <Button
              sx={{
                margin: 'auto',
                '&:hover': {
                  backgroundColor: '#007bff',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                },
              }}
              onClick={e => {
                e.preventDefault()
                handleInvite(item.id)
                setSnackbarOpen(true)
              }}
            >
              Invitar
            </Button>
          </CardActions>
        </Grid>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copeado!"
      />
    </Grid>
  )
}

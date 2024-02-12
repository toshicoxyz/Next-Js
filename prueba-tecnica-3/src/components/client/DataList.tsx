/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import {
  CircularProgress,
  Typography,
  CardActions,
  Button,
  Grid,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Firestore } from 'firebase/firestore'
import { getAllNoteUp, getAllNote } from '@/services/crud'
import { Note } from '@/models/model'
import { useAuth } from '@/context/AuthContext'
import Form from './Form'
import GroupIcon from '@mui/icons-material/Group'

interface DataListProps {
  db: Firestore
}

export default function DataList({ db }: DataListProps) {
  const { upgradeNoteDescription, user, upgradeNoteInvitations, deleteNote } =
    useAuth()
  const [dataList, setDataList] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [showInvitations, setShowInvitations] = useState(false)

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

  async function handleInvite(id: string | undefined) {
    const userEmail = prompt(
      'Ingrese el correo electrónico del usuario a invitar'
    )
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (userEmail && !emailRegex.test(userEmail)) {
      alert('Correo electrónico inválido')
    }

    if (userEmail) {
      const response = await upgradeNoteInvitations(id, userEmail, [
        { userId: 'id', userEmail },
      ])
      setErrorMessage(Boolean(!response))
      // setSnackbarOpen(Boolean(response))
    }
  }

  if (loading) {
    return (
      <div
        style={{ paddingTop: '60px' }}
        className="relative flex w-full  items-center justify-center h-screen content-center"
      >
        <CircularProgress className="w-full absolute" />
      </div>
    )
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
        <Grid
          sx={{
            display: 'flex',
            padding: '25px',
            marginX: '25px',
            width: 10,
            minHeight: 300,
            background:
              'radial-gradient(at left bottom, rgb(244, 218, 50), rgb(244, 255, 110))',
          }}
          item
          xs={12}
          sm={6}
          md={2}
        >
          <Form />
        </Grid>
      )}
      {dataList.map(item => (
        <Grid
          key={item.id}
          sx={{
            display: 'flex',
            padding: '25px',
            marginX: '25px',
            width: 10,
            minHeight: 300,
            background:
              'radial-gradient(at left bottom, rgb(244, 218, 50), rgb(244, 255, 110))',
          }}
          item
          xs={12}
          sm={6}
          md={2}
          className="h-full relative"
        >
          <form className="m-auto">
            {item.id && (user?.rol === 'admin' || user?.rol === 'edit') && (
              <CloseIcon
                onClick={() => {
                  deleteNote(item.id)
                }}
                className="text-red-500 cursor-pointer w-3 absolute top-0 right-0 -mt-2 -mr-2 rounded-full"
              />
            )}
            <Typography
              suppressContentEditableWarning
              variant="h5"
              component="div"
              sx={{
                wordBreak: 'break-word',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {item?.title}
            </Typography>
            <Typography
              className="hover:bg-slate-100"
              suppressContentEditableWarning
              onBlur={e => {
                upgradeNoteDescription(item.id, e.currentTarget.innerHTML) // Actualiza la descripcion
              }}
              contentEditable={Boolean(
                item.id &&
                  (user?.rol === 'admin' ||
                    user?.rol === 'edit' ||
                    item.invitations?.some(
                      invitation => invitation.userEmail === user?.email
                    ))
              )}
              variant="body1"
              component="div"
              sx={{
                wordBreak: 'break-word',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
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
                }}
              >
                Invitar
              </Button>
            </CardActions>
            <div className="relative">
              {(item.invitations?.length || 0) > 0 && (
                <>
                  <Tooltip placement="top" title="Usuarios Invitados">
                    <IconButton
                      onClick={() => setShowInvitations(!showInvitations)}
                      // onMouseLeave={() => setShowInvitations(false)}
                    >
                      <GroupIcon className="text-black" />
                    </IconButton>
                  </Tooltip>
                  <div className="w-40 overflow-hidden max-w-2xl text-black absolute left-20  bg-transparent">
                    {(item.invitations?.length || 0) > 0 && showInvitations && (
                      <ul className="list-inside text-left list-disc p-0">
                        {item.invitations?.map(invitation => (
                          <li key={invitation.userId} >
                            {invitation?.userEmail?.split('@')[0]}@
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          </form>
        </Grid>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Invitacion asignada"
      />
      <Snackbar
        open={errorMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Error usuario no Registrado"
        sx={{
          backgroundColor: snackbarOpen ? '#ff0000' : undefined,
        }}
      />
    </Grid>
  )
}

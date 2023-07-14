/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  CircularProgress,
  Card,
  CardMedia,
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

interface DataListProps {
  db: Firestore
}

export default function DataList({ db }: DataListProps) {
  const { upgradeNoteTitle, upgradeNoteDescription, user } = useAuth()
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

  return (
    <>
      {dataList.map(item => (
        <Card
          key={item.id}
          sx={{
            margin: 2,
            minWidth: '44vw',
            maxWidth: '200px',
            overflow: 'auto',
            '&:hover': {
              transition: 'background-color 0.3s ease',
            },
          }}
        >
          <Grid>
            <Grid item xs={12} sm={12}>
              <CardContent
                sx={{
                  padding: 5,
                }}
              >
                {item.id && (user?.rol === 'admin' || user?.rol === 'edit') && (
                  <DeleteIcon className='text-red-500 cursor-pointer w-3 bg-black rounded-full p-1' />
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
                      e.currentTarget?.textContent !==
                        e.currentTarget?.textContent
                    ) {
                      console.log('Enviado')
                      upgradeNoteTitle(item.id, e.currentTarget.innerHTML) // Actualiza el título
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
                  <CopyToClipboard
                    text={`${window.location.origin}/${item.id}`}
                  >
                    <Button
                      sx={{
                        padding: 2,
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
                        setSnackbarOpen(true)
                      }}
                    >
                      Compartir
                    </Button>
                  </CopyToClipboard>
                </CardActions>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copeado!"
      />
    </>
  )
}

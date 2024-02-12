/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
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
} from '@mui/material'
import { Firestore } from 'firebase/firestore'
import { getAllUsers, getAllUsersUp } from '@/services/crud'
import { User } from '@/models/model'
import Link from 'next/link'
import CopyToClipboard from 'react-copy-to-clipboard'
interface DataListProps {
  db: Firestore
}

export default function DataList({ db }: DataListProps) {
  const [dataList, setDataList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = (await getAllUsers(db)) ?? []
        setDataList(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
    fetchData()
    const unsubscribe = getAllUsersUp(db, fetchData)

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
            minWidth: '88vw',
            maxWidth: '200px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            },
          }}
        >
          <Link href={`/${item.id}`}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid item xs={12} sm={6}>
                <CardContent
                  sx={{
                    padding: 5,
                  }}
                >
                  <Typography gutterBottom variant="h3" component="div">
                    {item.first}
                  </Typography>
                  <Typography gutterBottom variant="h4" color="text.secondary">
                    {item.last}
                  </Typography>
                  <Typography gutterBottom variant="h5" color="text.secondary">
                    {item.born}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      wordWrap: 'break-word', // Permite ajustar el texto automáticamente y salto de línea
                      whiteSpace: 'pre-line',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: item.description || '<p>Sin descripcion</p>',
                    }}
                  />
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
              <Grid item xs={12} sm={6}>
                <CardMedia
                  sx={{ width: '100%', paddingTop: '100%' }}
                  image={
                    item.image ||
                    'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
                  }
                  title={item.first}
                />
              </Grid>
            </Grid>
          </Link>
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

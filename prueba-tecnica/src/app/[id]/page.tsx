/* eslint-disable @next/next/no-img-element */
'use client'

import { getIdUser } from '@/services/crud'
import { useEffect, useState } from 'react'
import { User } from '@/models/model'
import db from '@/firebase/config'
import {
  CircularProgress,
  Card,
  Link,
  Grid,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  Snackbar,
} from '@mui/material'

const NuevaPagina = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      const getId = async (id: string) => {
        try {
          const data = (await getIdUser(db, id)) ?? null
          setUser(data)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }

      getId(params.id)
    } else {
      setUser(null)
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen content-center">
        No se encontro el archivo
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen content-center">
      {user && (
        <Card
          key={user.id}
          sx={{
            margin: 2,
          }}
        >
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid item xs={12} sm={6}>
              <CardContent
                sx={{
                  maxWidth: '1200px',
                  padding: 5,
                  height: '100%',
                }}
              >
                <Typography gutterBottom variant="h3" component="div">
                  {user.first}
                </Typography>
                <Typography gutterBottom variant="h4" color="text.secondary">
                  {user.last}
                </Typography>
                <Typography gutterBottom variant="h5" color="text.secondary">
                  {user.born}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industrys
                  standard dummy text ever since the 1500s, when an unknown
                </Typography>
                <CardActions>
                  <Button
                    size="small"
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
                      const link = `${window.location.origin}/${user.id}`
                      navigator.clipboard
                        .writeText(link)
                        .then(() => {
                          setSnackbarOpen(true)
                          // Puedes mostrar un mensaje de éxito aquí si lo deseas
                        })
                        .catch(error => {
                          console.error('Error copying link:', error)
                          // Puedes mostrar un mensaje de error aquí si lo deseas
                        })
                    }}
                  >
                    Compartir
                  </Button>
                </CardActions>
              </CardContent>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CardMedia
                sx={{ width: '100%', paddingTop: '100%' }}
                image={
                  user?.image
                    ? user.image
                    : 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
                }
                title={user.first}
              />
            </Grid>
          </Grid>
        </Card>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copeado!"
      />
    </div>
  )
}

export default NuevaPagina

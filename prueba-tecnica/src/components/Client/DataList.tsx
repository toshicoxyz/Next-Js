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
    const unsubscribe = getAllUsersUp(db, fetchData)

    fetchData()

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
                    maxWidth: '1200px',
                    padding: 5,
                    height: '100%',
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
                        const link = `${window.location.origin}/${item.id}`
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
                    item?.image
                      ? item.image
                      : 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
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

// <List className="w-full">
//   {dataList.map(user => (
//     <ListItem className="border-2 " key={user.id}>
//       <ListItemText primary={user.first} secondary={user.last} />
//       <Link
//         className="rounded-2xl p-5 border border-slate-300 hover:border-slate-400"
//         href={`/${user.id}`}
//       >
//         Ver
//       </Link>
//       <Avatar
//         className="rounded-full m-3"
//         src={user?.image}
//         alt={user.first}
//         sx={{ width: 50, height: 50 }}
//       />
//     </ListItem>
//   ))}
// </List>

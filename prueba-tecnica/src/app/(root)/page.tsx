'use client'

import { Grid } from '@mui/material'

import db from '@/firebase/config'
import Form from '@/components/Client/Form'
import DataList from '@/components/Client/DataList'
import { useState } from 'react'

export default function Home() {
  const [refreshData, setRefreshData] = useState(false)

  const handleDataCreated = () => {
    setRefreshData(prevState => !prevState)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <h1 className="pb-3">Usando Material UI con Next.js 13</h1>
        <Form onDataCreated={handleDataCreated} />
      </Grid>
      <DataList db={db} refreshData={refreshData} />
    </main>
  )
}

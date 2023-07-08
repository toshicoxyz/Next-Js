/* eslint-disable @next/next/no-img-element */
'use client'

import { Grid } from '@mui/material'
import db from '@/firebase/config'
import Form from '@/components/Client/Form'
import DataList from '@/components/Client/DataList'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <div className="flex pb-3">
          <img
            src={'https://mui.com/static/logo.png'}
            width={75}
            alt="Material UI"
          />
          <img
            src={
              'https://static-00.iconduck.com/assets.00/next-js-icon-512x512-zuauazrk.png'
            }
            width={75}
            alt="Next Icon"
          />
          <img
            src={
              'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/480px-Tailwind_CSS_Logo.svg.png'
            }
            width={75}
            alt="Tailwind_CSS_Logo"
          />
          <img
            src={
              'https://icons.veryicon.com/png/o/business/vscode-program-item-icon/typescript-def.png'
            }
            width={75}
            alt="Tailwind_CSS_Logo"
          />
          <img
            src={
              'https://cdn4.iconfinder.com/data/icons/google-i-o-2016/512/google_firebase-2-512.png'
            }
            width={75}
            alt="Tailwind_CSS_Logo"
          />
        </div>

        {/* <h1 className="">Usando Material UI con Next.js 13</h1> */}
        <Form />
      </Grid>
      <DataList db={db} />
    </main>
  )
}

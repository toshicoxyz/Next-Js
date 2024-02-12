'use client'

import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import SignIn from '@/components/client/SignIn'
import LogoutIcon from '@mui/icons-material/Logout'
import DataList from '@/components/client/DataList'
import { firestore } from '@/firebase/config'
import ListUsers from '@/components/client/ListUsers'
import { useState } from 'react'
import Logo from '@/components/client/custom/Logo'

export default function Home() {
  const { user, signOut } = useAuth()
  const [visible, setVisible] = useState(false)

  if (typeof window !== 'undefined') {
    return (
      <>
        <motion.div
          className="fixed top-0"
          initial={{
            // overflow: 'auto',
            zIndex: 9999,
            height: '100vh',
            width: '100vw',
            alignContent: 'center',
            alignItems: 'center',
            background: user
              ? 'linear-gradient(to left, rgb(17, 24, 39), rgb(9,12,20), rgb(0, 0, 0))'
              : 'linear-gradient(to left top, rgb(17, 24, 39),rgb(9,12,20), rgb(0, 0, 0))',
          }}
          animate={{
            height: user ? '60px' : '100vh',
            // borderBottom: '1px solid white',
          }}
        >
          {/* SECTION NAV LOGIN */}
          {user ? (
            <>
              <div
                className="flex justify-around items-center text-white relative"
                style={{ padding: '15px 0', fontSize: 17, overflow: 'auto' }}
              >
                <Logo />

                <div
                  onClick={() => setVisible(!visible)}
                  className={`text-center ${
                    user?.rol === 'admin' ? 'text-white cursor-pointer' : null
                  } text-gray-500 w-max`}
                >
                  {user?.rol.toUpperCase()}
                </div>

                <span className="dropdown-item z-30 text-gray-500">
                  {user?.email?.split('@')[0]}@{' '}
                  <LogoutIcon
                    onClick={() => signOut()}
                    className={`transition-colors duration-500  hover:text-white  cursor-pointer inline-block `}
                  />
                </span>
              </div>
              {user.rol == 'admin' && visible && (
                <section
                  style={{
                    maxWidth: 250,
                    minWidth: 250,
                    minHeight: '91.5vh',
                    background:
                      'linear-gradient(to left top, rgb(17, 24, 39),rgb(9,12,20), rgb(0, 0, 0))',
                  }}
                  className="text-gray-500 p-5 text-center left-0 overflow-auto"
                >
                  <h1 className="text-white">USUARIOS</h1>
                  <ListUsers firestore={firestore}></ListUsers>
                </section>
              )}
            </>
          ) : (
            <SignIn />
          )}
        </motion.div>
        {/* SECTION BODY */}
        {user && (
          // <section className="flex flex-col lg:flex-row mt-16 overflow-auto justify-between  items-center text-center ">
          <DataList db={firestore} />
          // </section>
        )}
      </>
    )
  } else {
    return null
  }
}

'use client'

import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import SignIn from '@/components/client/SignIn'

export default function Home() {
  const { user, signOut } = useAuth()

  return (
    <>
      <motion.div
        className="fixed top-0"
        initial={{
          height: '100vh',
          width: '100vw',
          alignContent: 'center',
          alignItems: 'center',
        }}
        animate={{
          background: 'black',
          height: user ? '60px' : '100vh',
          zIndex: 9999,
          borderBottom: '1px solid white',
        }}
      >
        {user ? (
          <div
            className="container flex justify-between items-center text-white relative"
            style={{ padding: '15px 0', fontSize: 17 }}
          >
            <a
              href="#"
              className="font-bold text-lg"
              style={{
                color: 'white',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Soporte Técnico
            </a>

            <div className="dropdown">
              <a
                className="dropdown-toggle flex items-center hidden-arrow"
                href="#"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <label className="px-3 text-center text-white">
                    {user?.email}
                  </label>
                  <a
                    onClick={() => signOut()}
                    className="dropdown-item z-30"
                    href="#"
                  >
                    Salir
                  </a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <SignIn />
        )}
      </motion.div>
    </>
  )
}

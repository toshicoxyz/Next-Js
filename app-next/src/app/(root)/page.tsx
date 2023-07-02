'use client'

import { UserButton, useClerk } from '@clerk/nextjs'

const SetupPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { session } = useClerk()

  // Verificar si no hay una sesión activa y redirigir al inicio de sesión
  console.log(session)
  
  return (
    <div className="p-4">
      <button className="">HOLA</button>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export default SetupPage

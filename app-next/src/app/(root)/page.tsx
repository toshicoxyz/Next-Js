import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs'

const SetupPage = () => {
  const { userId } = auth()

  return (
    <div className="p-4">
      <button className="">Pagina Protegida</button>
      <div>User Id: {userId}</div>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export default SetupPage

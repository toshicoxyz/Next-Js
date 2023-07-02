import { UserButton } from '@clerk/nextjs'

const SetupPage = () => {
  return (
    <div className="p-4">
      <button className=''>HOLA</button>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export default SetupPage

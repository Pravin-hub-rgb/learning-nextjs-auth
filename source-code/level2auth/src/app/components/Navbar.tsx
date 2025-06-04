'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const router = useRouter()
  const { signOut, user } = useAuth()

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  return (
    <div className='flex bg-blue-700 py-2 justify-between'>
      <div>
        <button className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer' onClick={() => router.push('/')}>Home</button>
      </div>
      <div>
        {
          user ? (
            <span>Hello, {user?.email}</span>
          ) : (
            ""
          )
        }
      </div>
      <div>
        {
          user ? (
            <button className='mx-5 font-bold border text-red-500 px-2 py-1 rounded cursor-pointer' onClick={handleLogout}>Logout</button>
          ) : (
            <button className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer' onClick={() => router.push('/login')}>Login</button>
          )
        }
      </div>
    </div>
  )
}

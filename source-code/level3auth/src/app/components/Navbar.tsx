'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false }) // Prevent automatic redirect
    router.push('/') // Optional: redirect manually after logout
  }

  return (
    <div className='flex bg-blue-700 py-2 justify-between'>
      <div>
        <button
          className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer'
          onClick={() => router.push('/')}
        >
          Home
        </button>
      </div>

      <div>
        {session?.user?.email ? (
          <span>Hello, {session.user.email}</span>
        ) : (
          ''
        )}
      </div>

      <div>
        {session ? (
          <button
            className='mx-5 font-bold border text-red-500 px-2 py-1 rounded cursor-pointer'
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer'
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}

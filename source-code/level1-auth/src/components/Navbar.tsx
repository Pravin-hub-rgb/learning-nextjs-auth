'use client'
import React, { useState, useEffect } from 'react'
import { isAuthenticated, logout } from '@/lib/auth-local'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const router = useRouter()
  const { loggedIn, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className='flex bg-blue-700 py-2 justify-between'>
      <div>
        <button className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer' onClick={() => router.push('/')}>Home</button>
      </div>
      <div>
        {
          loggedIn ? (
            <span>Hello, {user?.name}</span>
          ) : (
            ""
          )
        }
      </div>
      <div>
        {
          loggedIn ? (
            <button className='mx-5 font-bold border text-red-500 px-2 py-1 rounded cursor-pointer' onClick={handleLogout}>Logout</button>
          ) : (
            <button className='mx-5 font-bold border px-2 py-1 rounded cursor-pointer' onClick={() => router.push('/login')}>Login</button>
          )
        }
      </div>
    </div>
  )
}

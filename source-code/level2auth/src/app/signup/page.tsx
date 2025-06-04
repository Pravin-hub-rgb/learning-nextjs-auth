'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signUp(email, password);

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-4 ">Sign Up</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  )
}

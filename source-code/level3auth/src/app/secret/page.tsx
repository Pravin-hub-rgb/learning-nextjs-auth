// app/secret/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/authOptions'
import { redirect } from 'next/navigation'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default async function SecretPage() {
  // Server-side check for session
  const session = await getServerSession(authOptions)

  // If not logged in, redirect to /login
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-950 border border-gray-800 rounded-xl shadow-lg p-10 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <ShieldCheckIcon className="h-16 w-16 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Access Granted 🔐</h1>
        <p className="text-gray-400 mb-6">
          You&apos;ve reached the secret area of the app. This route is protected and visible only to authenticated users.
        </p>
        <div className="text-sm text-gray-600">
          You must be someone important. 🤫
        </div>
      </div>
    </div>
  )
}
